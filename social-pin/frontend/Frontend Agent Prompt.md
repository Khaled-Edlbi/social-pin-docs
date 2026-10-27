---
type: project
layer: frontend
created: 2026-10-18
updated: 2026-10-27
related: ["Agent Rules", "Frontend Contract", "Frontend API Guide"]
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
2. For the ticket you are on, run in the vault:
   `node scripts/build-tree.mjs --impact T-NNN` (or the feature id, or an endpoint such as
   `"GET /rings/:id"`). Read what it lists, in this order: the same feature's notes, the directly linked
   notes, the two-hop notes only if the change crosses a feature boundary. Do not read the rest.
3. Then read, in this order: the feature note (`modules/<Module>/features/<Feature>/<Feature>.md`), the story
   (`<Feature> Story.md`), the **Backend Integration** note (`<Feature> Backend Integration.md`, how to
   call the API), `frontend/Frontend Contract.md` (the cross-cutting client rules) and
   `frontend/Frontend API Guide.md` (the long form). The screens are in `design/Screen Index.md`.

### Ticket and branch
- No ticket, no branch. The ticket is `tasks/T-NNN <Title>.md` in the vault; create it from
  `templates/Task Template.md` with the next free number if none exists. A ticket whose tree chip reads
  *Needs decision* or *Blocked* is not workable.
- Branch name, in this repo and in the vault: `<module>/<ticket-no>/<what-you-do>` (for example
  `ring/T-004/member-count`). Commits: `<type>(<module>): <message>`, imperative, lowercase, ticket in
  the body. Set the ticket to `status: in-progress` when you start.

### What you write in the vault, and when
Only frontend-layer notes. Create each one with `node scripts/build-tree.mjs --scaffold <kind> T-NNN`
(task level) or `--scaffold <kind> <feature-id>` (feature level); the command fills the frontmatter.
- **Before asking the backend for anything**: `T-NNN Frontend Requirements.md` (kind
  `frontend-requirements`): per screen, what you need; the endpoints table with ✅ available or ❌ with
  the backend task; the error states you will handle. `status: approved` once the backend accepts it.
- **After shipping**: `T-NNN Frontend Delivery.md` (kind `frontend-delivery`): screens shipped, calls
  made, state kept, deviations from the story, what is left. Then update the feature-level
  `<Feature> Frontend Delivery.md`: it is the sum of its task notes and must link yours.
- **When you ran the checks**: `T-NNN QA Frontend.md` (kind `qa-frontend`): journeys, screen states,
  error copy, as tables and diagrams, never test code; `status: passing | failing` with the build.
- Never edit a story, a backend note or a QA Backend note. If your change makes one wrong, add
  `> ⚠ Affected by [[T-NNN …]] (YYYY-MM-DD): <what changed>` under its H1 and name it in your task log.

### Relations are mandatory
Every note you create or change declares, in frontmatter: `depends` (what must be done first),
`affects` (what your change alters), `related` (features, tasks, decisions, endpoints like
`"GET /rings/:id"`, error codes like `E_RING_02`, screens like `s14`), and `blockedBy` when something
blocks you (any note, any layer; `[]` to say "nothing"). An endpoint used without a relation to its owning
feature is a build warning: fix the frontmatter. Run `--impact` again after the change and flag what it
lists.

### Rules the client must respect (from the vault; do not re-derive them)
- Every error body carries `statusCode`, `message`, `error`, and will carry `ErrorCode` (T-063); branch
  on `ErrorCode`, never on `message`.
- Access tokens last 15 minutes; refresh through one serialised `POST /auth/refresh`; refresh tokens
  rotate and are single-use. Sign-in is a one-time code: there is no password anywhere.
- "Not shared with you", "blocked" and "no such pin name" return the same 404 body; never try to tell
  them apart, never show which Ring a viewer is in.
- Lists return `{ data, meta: { total } }` with `total` unpaginated; `limit` is capped at 50.
- `devCode` on a code challenge is a development convenience; the screen must work without it.

### Definition of done (docs part)
- [ ] Frontend Requirements written before backend work was requested; Frontend Delivery written after;
      QA Frontend when checks ran; feature-level notes updated (sum of tasks)
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
