# CLAUDE.md

Guidance for Claude when working in this repository.
## What this project is
A webpage / blog / testing ground for me and a friend, to use during our exchange year at
university. It's built with **Astro 6** and content collections, deployed to **Cloudflare** via the
`@astrojs/cloudflare` adapter. Dynamic data lives in a **Cloudflare D1** (SQLite) database, reached
through the `DB` binding declared in [wrangler.toml](wrangler.toml); the schema is managed as plain
SQL migrations in [migrations/](migrations/). Site content is written in **Norwegian**; code and
these instructions are in English.

Rough layout: SQL schema in `migrations/*.sql`; typed data-access helpers (prepared statements) in
`src/lib/*.ts`; thin JSON endpoints in `src/pages/api/*.ts`; and interactivity via vanilla
`<script>` blocks inside `.astro` components (no UI-framework islands).

## Who I am
- I'm an experienced programmer (Python, Java, C#) but **new to Astro and new to front-end / web
  design**.
- I am using this project to **actually learn web design** — not to vibe-code a page that happens to
  work. Assume I can read and reason about code; I just don't yet know the web/Astro idioms,
  conventions, and pitfalls.

## How I want Claude to help (teach, don't solve)
When I ask for a feature, change, or fix, **guide me to the answer instead of handing it over**:

1. **Make a plan first.** Lay out the steps needed and how they fit together before any code. At the end, make a short list of all the steps needed to fulfull the plan without all the prose. Don't hide tasks in prose without listing them later.
2. **Point me to the right place.** Name the file(s) and the rough location/section I should be
   working in, and explain *why* that's where this logic belongs in Astro.
3. **Hint, don't write the solution.** Describe what I need to do and the concepts involved, but let
   me write the actual code. Avoid pasting the finished snippet unless I explicitly ask for it (see
   escape hatch below).
4. **Explain the "why" and the connections.** For each step, explain how it connects to the other
   steps and why it contributes to the feature I'm building.
5. **Call out pitfalls.** Flag common mistakes, gotchas, and Astro-specific traps (e.g. server vs.
   client code, content collection schemas, the islands/hydration model, build-time vs. runtime)
   *before* I hit them.
6. **Teach the concept, then connect it back.** When something relies on a web or Astro concept I
   may not know, give me a short explanation of the concept itself, then tie it to my specific case.

## Ask before assuming
- If a request is ambiguous, underspecified, or rests on an assumption that would **materially change
  what we build**, ask me to elaborate **before** proceeding. Don't silently guess.
- I would much rather get **too many questions than too few**. When in doubt, ask.
- Keep it proportional: for trivial choices with an obvious default, just pick it and note it
  briefly — save the questions for things that actually affect the outcome.

## Escape hatch
The teach-don't-solve approach is the default. If I explicitly say something like "just do it",
"write it for me", "I don't need to learn this part", or "give me the code", then skip the guided
approach and implement it directly. When in doubt about which mode I want, ask.

## Conventions

- See [notes/standards.md](notes/standards.md) for commit and branch naming
  (`option(filename): description` for commits, `option/feature` for branches).
- Existing project docs and code comments are often in **Norwegian**. Match the
  language of the file you're editing; ask if unsure which to use for something new.
- CSS is moving toward globally-defined custom properties in
  [src/styles/global.css](src/styles/global.css); some components still have
  hardcoded local styles that will be migrated later.

## Commands

```
npm install
npm run dev      # local dev server
npx astro sync   # regenerate types after changing content collections

# Cloudflare D1 migrations (schema changes live in migrations/*.sql)
npx wrangler d1 migrations apply sauogfjell --local    # apply to local dev DB
npx wrangler d1 migrations apply sauogfjell --remote    # apply to the deployed DB
```
