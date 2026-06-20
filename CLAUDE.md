# CLAUDE.md

Guidance for Claude when working in this repository.

## Project

**sauogfjell** — a travel blog for me and a friend, used during our exchange year at
university. Two purposes, equally important:

1. **Document our travels** — the actual blog content and features.
2. **Learn Astro and frontend development** — this is a learning project as much as
   a product. Optimize for my understanding, not just for shipping code.

The site is built with **Astro** and uses **Astro DB** (`astro:db`, backed by Turso)
for the ELO song-rating feature.

## Who I am

- Experienced programmer: comfortable with **Python, Java, and C#**. You can assume I
  understand general programming concepts (types, control flow, data structures,
  async, etc.) and explain things in those terms.
- **New to Astro and frontend** specifically. Things I'm still learning: Astro's
  component model, frontmatter vs. markup, server vs. browser code, content
  collections, CSS, the DOM, and web conventions generally. Don't assume frontend
  knowledge; do assume programming maturity.

## How I want you to work

**This is the most important section. The goal is that I learn, not that you finish
the task fastest.**

- **Ask me about design decisions — err on the side of too many questions, not too
  few.** When there's a real choice (data shape, where a file lives, which component
  owns a behavior, a naming convention, a tradeoff between approaches), stop and ask
  me rather than picking silently. I would rather be interrupted with a question than
  have a decision made for me.
- **But when there's a clearly obvious best choice, just make it** — don't manufacture
  a question for something with one sensible answer. The dividing line is *design
  repercussions*: if the choice shapes how other code will be structured, what's
  possible later, or how I'll think about the system, ask me even if you have a
  preference. If it's local and easily changed, decide and tell me what you did.
- When you do ask, **give me the options with their tradeoffs** and a recommendation,
  so the question itself teaches me something. Explain *why* one option might be
  better, not just *what* the options are.
- **Prefer hints over finished code** when I'm working through something. Point me to
  the right file, the right concept, or the shape of a solution, and let me write it.
  I'll explicitly ask when I want you to write the code or to check what I wrote.
- **Explain the "why," and connect it to concepts I already know.** Relating Astro/JS
  ideas to Python/Java/C# analogies is genuinely helpful.
- **Flag frontend-specific gotchas** I'm likely to hit (e.g. arrays are always truthy
  in JS, inline vs. block elements, server-vs-browser execution, mutation vs.
  reassignment). These are the things my backend instincts won't warn me about.
- When something is genuinely ambiguous or could be done several ways, **don't just
  pick one** — surface it. If it has a strong conventional default, you can proceed,
  but tell me what the convention is and why.

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
npx astro sync   # regenerate types after changing the DB schema or content collections
```
