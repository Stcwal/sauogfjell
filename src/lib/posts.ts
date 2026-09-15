import { getDb } from './db';

interface PostRow {
    postId: number;
    title: string | null;
    author: string | null;
    publishDate: string | null;
}

// The identity tuple populate-post-db.ts syncs on and migration 0007's unique
// index guards: (title, author, publishDate). The DB stores dates as YYYY-MM-DD
// strings, so a Date from the content collection must be normalized the same
// way (toISOString().slice(0, 10)) before it can match a row.
export function postIdentityKey(
    title: string,
    author: string,
    publishDate: Date | string,
): string {
    const date = publishDate instanceof Date
        ? publishDate.toISOString().slice(0, 10)
        : String(publishDate).trim().slice(0, 10);

    return `${title.trim()}|${author.trim()}|${date}`;
}

// One query for every synced post instead of one per rendered post (N+1).
// Returns a Map: postIdentityKey(...) -> postId.
export async function getPostIdMap(): Promise<Map<string, number>> {
    const db = getDb();

    const posts = await db
        .prepare('SELECT postId, title, author, publishDate FROM Posts')
        .all<PostRow>();

    const map = new Map<string, number>();
    for (const row of posts.results) {
        if (!row.title || !row.author || !row.publishDate) continue;
        map.set(postIdentityKey(row.title, row.author, row.publishDate), row.postId);
    }

    return map;
}
