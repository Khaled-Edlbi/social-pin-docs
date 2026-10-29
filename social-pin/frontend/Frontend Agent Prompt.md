---
id: P-06
type: project
layer: frontend
related: ["Agent Rules", "Frontend Contract", "Frontend API Guide"]
created: 2026-10-18
updated: 2026-10-29
tags: [project, layer/frontend, rules]
---

# Frontend Agent Prompt · rules to add to the frontend repository

The frontend repository is not in this vault's reach, so its agent needs these rules in its own `CLAUDE.md`. Paste the block below into that file as is (it is written for the agent, in the second person). The three links it relies on are this vault's [[Agent Rules]], [[Frontend Contract]] and [[Frontend API Guide]].

````markdown
## Documentation and tickets — the `social-pin-docs` vault (binding)

Every piece of work in this repo is tracked in **`github.com/Khaled-Edlbi/social-pin-docs`**, an
Obsidian vault shared with the backend. Clone it next to this repo. The vault's own rules are in its
`CLAUDE.md` and `rules/Agent Rules.md`; they win over this section for anything about documentation.

### Read the tree, not the repo
1. Open `tree/tree.json` in the vault first: the whole vault as one object (`nodes`, `edges`,
   `concepts`, `byName`). Same tree as a page: https://khaled-edlbi.github.io/social-pin-docs/
2. For the story part you are on, run in the vault:
   `node scripts/build-tree.mjs --impact S-NN` (the story's card code, or the feature id, or an endpoint
   such as `"GET /rings/:id"`). Read what it lists, in this order: the same feature's notes, the directly
   linked notes, the two-hop notes only if the change crosses a feature boundary. Do not read the rest.
3. Then read, in this order, in the feature's folder `modules/<Module>/features/<Feature>/`: the feature
   note (`F-NN <Feature>.md`), the story (`S-NN <Feature> Story.md`), and in its `flow/` folder the
   **Backend Integration** note (`flow/BI-NN <Feature> Backend Integration.md`, how to call the API);
   then `frontend/Frontend Contract.md` (the cross-cutting client rules) and
   `frontend/Frontend API Guide.md` (the long form). The screens are in `design/Screen Index.md`.

### Story part and branch
- No story part, no branch. Every piece of work is a part of the feature's one story
  (`### S7 · …` in `S-NN <Feature> Story.md`), written by the vault's PM and approved by product; there
  are no tasks. A story or a card whose tree chip reads *Needs decision* or *Blocked* is not workable.
- Branch name in this repo: `<module>/<F-NN>/<what-you-do>` (for example `ring/F-11/member-count`).
  Commits: `<type>(<module>): <message>`, imperative, lowercase, with `Feature: F-NN` and
  `Story: S-NN S7` in the body. In the vault, `node scripts/build-tree.mjs --branch frontend <card> <what>`
  prints the branch for the note you change.

### What you write in the vault, and when
Only frontend-layer notes, one of each kind per feature, all in the feature's `flow/` folder. Create
each one the first time with `node scripts/build-tree.mjs --scaffold <kind> <feature-id>`: it names the
file with its card code and fills the frontmatter. A later story part adds its rows to the same note.
- **Before asking the backend for anything**: `flow/FR-NN <Feature> Frontend Requirements.md` (kind
  `frontend-requirements`): per screen, what you need; the endpoints table with ✅ available or ❌ with
  the story part that asks for it; the error states you will handle. `status: ready` when the list is
  complete; the backend sets `approved`.
- **After shipping**: `flow/FD-NN <Feature> Frontend Delivery.md` (kind `frontend-delivery`): screens
  shipped, calls made, state kept, deviations from the story, what is left. When the note is already
  `done`, the new part goes in its `pending` list until it ships.
- **When you ran the checks**: `flow/QF-NN <Feature> QA Frontend.md` (kind `qa-frontend`): journeys,
  screen states, error copy, as tables and diagrams, never test code; `status: passing | failing` with
  the build.
- Never edit a story, a backend note or a QA Backend note. If your change makes one wrong, add
  `> ⚠ Affected by [[<the note you changed>]] (YYYY-MM-DD): <what changed>` under its H1 and name it in
  the `## Log` of the note you changed.

### Relations are mandatory
Every note you create or change declares, in frontmatter: `depends` (what must be done first),
`affects` (what your change alters), `related` (features, cards, decisions, endpoints like
`"GET /rings/:id"`, error codes like `E_RING_02`, screens like `s14`), and `blockedBy` when something
blocks you (any note, any layer; `[]` to say "nothing"). An endpoint used without a relation to its owning
feature is a build warning: fix the frontmatter. Run `--impact` again after the change and flag what it
lists.

### Rules the client must respect (from the vault; do not re-derive them)
- Every error body carries `statusCode`, `message`, `error`, and will carry `ErrorCode` (F-35 Error Contract); branch
  on `ErrorCode`, never on `message`.
- Access tokens last 15 minutes; refresh through one serialised `POST /auth/refresh`; refresh tokens
  rotate and are single-use. Sign-in is a one-time code: there is no password anywhere.
- "Not shared with you", "blocked" and "no such pin name" return the same 404 body; never try to tell
  them apart, never show which Ring a viewer is in.
- Lists return `{ data, meta: { total } }` with `total` unpaginated; `limit` is capped at 50.
- `devCode` on a code challenge is a development convenience; the screen must work without it.

### Definition of done (docs part)
- [ ] Frontend Requirements written before backend work was requested; Frontend Delivery written after;
      QA Frontend when checks ran
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] The feature's Frontend Delivery: `status: done` (or the story part's `pending` entry cleared), `## Log` line (date · branch · story part · what shipped)
- [ ] `node scripts/build-tree.mjs` run in the vault; `tree/` and `Card Index.md`
      committed with the notes (`--check` is what CI runs)
- [ ] Both branches pushed; the two pull requests link each other and the feature's story
````

## Why these rules and not others

- The frontend repo gets one short reading list (impact → feature → story → integration → contract) instead of "read the vault": that is what keeps context small and the right notes read.
- The frontend writes requirements **before** backend work so the backend builds against an explicit ask, and delivery **after** so product and QA see what exists; both are the frontend's notes, nobody else edits them.
- The client rules quoted above are the ones that break silently when forgotten; they are copied from [[Frontend Contract]] so the agent sees them even before it opens the vault. When the contract changes, change both.

Related: [[Agent Rules]] · [[Workflow]] · [[Frontend Contract]] · [[Frontend API Guide]] · [[Docs Tree]]
