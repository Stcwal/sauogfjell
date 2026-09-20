import * as crypto from "node:crypto";
import { execFileSync } from "node:child_process";
import * as fs from "node:fs";
import * as path from "node:path";
import { load } from "js-yaml";

// `npx wrangler` cannot be spawned here on Windows: npm installs a `npx.cmd` batch
// shim, and execFileSync launches executables directly, so it neither finds a bare
// `npx` (ENOENT) nor is allowed to run the `.cmd` (EINVAL). Passing `shell: true`
// would fix the lookup but hand our SQL to cmd.exe to re-parse, mangling quotes.
// Instead run wrangler's own JS entrypoint with the Node binary we're already in:
// no shell, no platform-specific shim, and no npx install prompt.
const WRANGLER_BIN = path.join(
  path.dirname(require.resolve("wrangler/package.json")),
  "bin",
  "wrangler.js",
);

function runWrangler(args: string[], options: { stdio?: "pipe" } = {}): string {
  return execFileSync(process.execPath, [WRANGLER_BIN, ...args], {
    encoding: "utf-8",
    ...options,
  });
}

interface Post {
  title: string;
  author: string;
  publishDate: string | Date;
  draft?: boolean;
  editDate?: string | Date;
  tags?: string[];
  [key: string]: any;
}

interface PostRow {
  postId: number;
  title: string;
  author: string | null;
  publishDate: string | null;
}

interface HashedPost {
  hash: string;
  title: string;
  author: string;
  publishDate: string;
  source: string;
}

const CONTENT_DIRECTORIES = ["dev", "stian", "anders"];
const LOCAL_D1_PERSIST_TO = ".wrangler/state";

// `--remote` targets the production D1 database instead of the local dev one.
// Without it every wrangler call hits the local SQLite state under .wrangler/,
// which is why deploys ended up with an empty Posts table.
const REMOTE = process.argv.includes("--remote");

function normalizeDate(value: string | Date | null | undefined): string {
  if (!value) return "";

  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }

  return String(value).trim().slice(0, 10);
}

function normalizeText(value: string | null | undefined): string {
  return value ? String(value).trim() : "";
}

function generateHash(title: string, author: string, publishDate: string): string {
  const content = `${title}${author}${publishDate}`;
  return crypto.createHash("sha256").update(content).digest("hex");
}

function parseFrontmatter(fileContent: string): Post | null {
  const parts = fileContent.split("---");

  if (parts.length < 3) {
    return null;
  }

  return load(parts[1]) as Post;
}

function collectMarkdownFiles(directory: string): string[] {
  if (!fs.existsSync(directory)) {
    return [];
  }

  const entries = fs.readdirSync(directory, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...collectMarkdownFiles(entryPath));
      continue;
    }

    if (entry.isFile() && entry.name.endsWith(".md")) {
      files.push(entryPath);
    }
  }

  return files;
}

function collectContentPosts(): HashedPost[] {
  const contentRoot = path.join(process.cwd(), "src", "content");
  const posts: HashedPost[] = [];

  for (const directoryName of CONTENT_DIRECTORIES) {
    const directory = path.join(contentRoot, directoryName);

    for (const filePath of collectMarkdownFiles(directory)) {
      try {
        const fileContent = fs.readFileSync(filePath, "utf-8");
        const frontmatter = parseFrontmatter(fileContent);

        if (!frontmatter || frontmatter.draft !== false) {
          continue;
        }

        const title = normalizeText(frontmatter.title);
        const author = normalizeText(frontmatter.author);
        const publishDate = normalizeDate(frontmatter.publishDate);

        if (!title || !author || !publishDate) {
          console.warn(`Skipping ${filePath} because title, author, or publishDate is missing.`);
          continue;
        }

        posts.push({
          hash: generateHash(title, author, publishDate),
          title,
          author,
          publishDate,
          source: path.relative(process.cwd(), filePath),
        });
      } catch (error) {
        console.error(`Error processing file ${filePath}:`, error);
      }
    }
  }

  return posts;
}

function sqlString(value: string | null | undefined): string {
  if (value === null || value === undefined || value === "") {
    return "NULL";
  }

  return `'${String(value).replaceAll("'", "''")}'`;
}

function buildInsertSql(post: HashedPost): string {
  return [
    "INSERT INTO Posts (title, author, publishDate)",
    "VALUES (",
    [
      sqlString(post.title),
      sqlString(post.author),
      sqlString(post.publishDate),
    ].join(", "),
    ")",
  ].join(" ");
}

function readPostsTable(): { rows: PostRow[]; tableExists: boolean } {
  const command = [
    "d1",
    "execute",
    "sauogfjell",
    ...(REMOTE ? ["--remote"] : ["--local", "--persist-to", LOCAL_D1_PERSIST_TO]),
    "--command",
    "SELECT postId, title, author, publishDate FROM Posts",
    "--json",
    "--yes",
  ];

  try {
    const output = runWrangler(command).trim();

    if (!output) {
      return { rows: [], tableExists: true };
    }

    const parsed = JSON.parse(output) as
      | { results?: PostRow[]; result?: PostRow[] }
      | Array<{ results?: PostRow[]; result?: PostRow[] }>;

    const result = Array.isArray(parsed) ? parsed[0] : parsed;

    return {
      rows: result?.results ?? result?.result ?? [],
      tableExists: true,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const stdout = typeof error === "object" && error && "stdout" in error ? String((error as { stdout?: unknown }).stdout ?? "") : "";

    if (message.includes("no such table: Posts") || stdout.includes("no such table: Posts")) {
      return { rows: [], tableExists: false };
    }

    throw error;
  }
}

function getPostHash(title: string, author: string | null, publishDate: string | null): string {
  return generateHash(
    normalizeText(title),
    normalizeText(author),
    normalizeDate(publishDate)
  );
}

function syncMissingPosts(contentPosts: HashedPost[], dbPosts: PostRow[]): void {
  const trackedHashes = new Set<string>();

  for (const row of dbPosts) {
    trackedHashes.add(getPostHash(row.title, row.author, row.publishDate));
  }

  const missingPosts = contentPosts.filter((post) => !trackedHashes.has(post.hash));
  const staleInDb = dbPosts.filter((row) => !contentPosts.some((post) => post.hash === getPostHash(row.title, row.author, row.publishDate)));

  console.log(`Checked ${contentPosts.length} published content posts against ${dbPosts.length} rows in Posts.`);

  if (missingPosts.length === 0 && staleInDb.length === 0) {
    console.log("Posts table matches the generated hashes.");
    return;
  }

  if (missingPosts.length > 0) {
    console.log(`Inserting ${missingPosts.length} missing posts into Posts...`);

    for (const post of missingPosts) {
      const insertCommand = [
        "d1",
        "execute",
        "sauogfjell",
        ...(REMOTE ? ["--remote"] : ["--local", "--persist-to", LOCAL_D1_PERSIST_TO]),
        "--command",
        buildInsertSql(post),
        "--json",
        "--yes",
      ];

      try {
        runWrangler(insertCommand, { stdio: "pipe" });
        trackedHashes.add(post.hash);
        console.log(`- inserted ${post.source}`);
      } catch (error) {
        console.error(`Failed to insert ${post.source}:`, error);
        process.exitCode = 1;
      }
    }

    console.log(`Inserted ${missingPosts.length} missing posts into Posts.`);
  }

  if (staleInDb.length > 0) {
    console.warn("Rows in Posts with no matching content hash:");
    for (const row of staleInDb) {
      const hash = getPostHash(row.title, row.author, row.publishDate);
      console.warn(`- postId ${row.postId} (${hash})`);
    }
  }
}

async function populatePostDb(): Promise<void> {
  console.log(REMOTE ? "Targeting the remote (production) D1 database." : "Targeting the local D1 database.");
  const contentPosts = collectContentPosts();

  if (contentPosts.length === 0) {
    console.warn("No published blog posts found under src/content/dev, src/content/stian, or src/content/anders.");
    return;
  }

  let dbPosts: PostRow[] = [];
  let tableExists = true;

  try {
    const result = readPostsTable();
    dbPosts = result.rows;
    tableExists = result.tableExists;
  } catch (error) {
    console.error("Failed to read the Posts table. Make sure Wrangler can access the local D1 database.", error);
    process.exitCode = 1;
    return;
  }

  if (!tableExists) {
    console.warn("Posts table does not exist yet in the local D1 database, so the hash check was skipped.");
    return;
  }

  syncMissingPosts(contentPosts, dbPosts);
}

void populatePostDb();
