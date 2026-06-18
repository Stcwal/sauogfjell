# Plan: tags on blog posts

Goal: be able to tag a post with e.g. `x`, `y`, `z`, display the tags at the top of
the post (cosmetic for now), and lay the groundwork for filtering later.

This document gives **hints and direction**, not finished code. Each step explains
*what* to do, *where*, and *why* it ties in with the other steps.

---

## How the pieces fit together (overview)

```
  content.config.ts        markdown file           BlogpostRenderer.astro
  (defines the shape) ──►   (provides data)  ──►   (displays the data)
   schema: tags             tags: [x, y, z]         post.data.tags.map(...)
```

1. **Schema** says which fields a post *can/must* have, and what type they are.
2. **Frontmatter** in each markdown file is the actual data that the schema
   validates.
3. **Renderer** reads `post.data.tags` and draws them on the page.

The order matters: the schema must know about `tags` before `post.data.tags` exists
and is typed in the renderer.

---

## Step 1 — Add `tags` to the schema

**File:** [src/content.config.ts](src/content.config.ts), in the `dev` collection's
`schema` object (lines 8–14).

**Hint:**
- You already use `z.string()`, `z.boolean()`, etc. A list of strings is
  `z.array(z.string())`.
- Consider `.default([])` instead of `.optional()`. The difference:
  - `.optional()` → `tags` can be `undefined`, so you must check before you `.map()`.
  - `.default([])` → if `tags` is missing from frontmatter, it becomes an empty list.
    Then you can always `.map()` safely. This is convenient because your existing
    posts don't have `tags` yet.

**Why:** This is what makes `post.data.tags` available *and* type-safe downstream.
Without this step Astro will either ignore the field or complain.

**Check:** After the change you may need to run `npx astro sync` so the types are
regenerated (same pattern you saw with `astro:db`).

---

## Step 2 — Add `tags` to frontmatter

**Files:** an existing post in [src/content/dev/](src/content/dev/) (e.g.
`test.md`) for testing, and [src/content/template.md](src/content/template.md) so
future posts have the field documented.

**Hint:**
- YAML lists can be written two ways. Inline: `tags: [x, y, z]`. Or block:
  ```
  tags:
    - x
    - y
  ```
  Both produce the same result against `z.array(z.string())`.
- If you chose `.default([])` in step 1, you can simply omit `tags` in posts that
  shouldn't have any — they'll just be an empty list.

**Why:** This is the actual data. The schema (step 1) is the contract; here you fill
in values that follow the contract.

---

## Step 3 — Display the tags in the renderer

**File:** [src/pages/blog/components/BlogpostRenderer.astro](src/pages/blog/components/BlogpostRenderer.astro),
inside the `posts.map(...)` block (lines 16–23).

**Hint:**
- You already use `post.data.author` and `post.data.publishDate` here.
  `post.data.tags` follows exactly the same pattern.
- To draw one thing per tag, use the same `.map()` technique the file already uses
  on `posts`. Think: `post.data.tags.map(tag => <span ...>{tag}</span>)`.
- **Placement:** put the tags right *before* `<Content />`. That puts them at the
  top, above the heading. See the note below on why "below the heading" is hard.
- When you render a list in JSX/Astro, the framework will ask for a `key` on each
  element — that's a separate detail you can ask about when you get there.

**Why:** This is where the data from steps 1–2 actually becomes visible. Everything
ties together here: the schema gave the type, the frontmatter gave the values, and
this loop displays them.

---

## Note on placement (read before step 3)

You wanted the tags *below the first heading*. The problem: the heading (`#`) lives
inside `<Content />`, which is fully-compiled markdown — a single "box" that Astro
can't easily insert anything into the middle of.

- **Easy (recommended):** tags *above* `<Content />` → shown above the heading.
- **Hard:** tags *below the heading* but above the body → requires either CSS tricks
  (e.g. moving things with `order` in flexbox) or splitting/post-processing the
  compiled content. We can tackle this later if you really want it.

Start with the easy variant. You can always move it later.

---

## Step 4 (optional) — Styling

**Hint:** You can style directly in `BlogpostRenderer.astro` with a `<style>` block
(scoped to the component), the same way `EloVoting.astro` does. Or, if you want to
reuse the tags elsewhere, make a small `Tag.astro` component of your own. For now a
simple `<style>` block is enough.

---

## Step 5 (later) — Filtering

Nothing to do now, but worth knowing how today's choices set you up for it:

- Because `tags` is a `z.array(z.string())` in the schema, you can later fetch all
  posts with `getCollection('dev')` and filter with plain JS:
  `posts.filter(p => p.data.tags.includes(selectedTag))`.
- That means filtering becomes its own step in the renderer/page, not a change to
  how the tags are stored. The data model from step 1 is already ready for it.

---

## Order to work in

1. Step 1 (schema) → run `npx astro sync`.
2. Step 2 (frontmatter on one test post).
3. Step 3 (display them) → confirm they show up in the browser.
4. Step 4 (make them look nice).
5. Step 2 on the rest of the posts + template, once you're happy.

Ask about specific things when you get stuck — e.g. `key` on lists, `.map()` syntax
in Astro, or CSS for the tags.
