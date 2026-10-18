---
type: project
layer: shared
updated: 2026-10-18
affects: ["Workflow", "Docs Tree"]
related: ["Frontend Agent Prompt"]
tags: [project, layer/shared, rules]
---

# Agent Rules · who writes what, and how a change stays true

Binding for every person and every agent that edits this vault, from any repository. The backend's `CLAUDE.md` and the frontend's (see [[Frontend Agent Prompt]]) both point here; when they differ from this note, this note wins for anything about documentation.

## 1 · The layers

The vault is organised by **feature**, and inside a feature by **layer**. A layer is a team or a concern that produces notes: today business, frontend, backend and QA. The layers, their note kinds, their statuses, the hand-off order and the default blocks are declared in **`docs.config.json`**, not in code: adding a layer (DevOps, AI, Security, Design) is a config change plus a template ([[#5 · Adding a layer]]).

| Layer | Writes | Reads first |
|---|---|---|
| **Business** (product, PM) | the feature note (`<Feature>.md`, the main node), `<Feature> Story`, decisions `D-NN`, tasks `T-NNN`; signs stories and requirements off | the module note, the screens in [[Screen Index]], open decisions |
| **Frontend** | `<Feature> Frontend Requirements` (what the client asks of the backend, **before** backend work), `<Feature> Frontend Delivery` (what the client shipped, **after**), `<Feature> QA Frontend` when it runs the checks | the story, the Backend Integration note, [[Frontend Contract]], [[Frontend API Guide]] |
| **Backend** | `<Feature> Backend Delivery` (what shipped, how it works, gaps), `<Feature> Backend Integration` (how the client calls it), `<Feature> QA Backend` when it runs the checks | the story, the Frontend Requirements, [[Ring Access Model]], [[Architecture]] |
| **QA** | `<Feature> QA Backend`, `<Feature> QA Frontend`: expected behaviour as tables and diagrams, **never test code** | the story, both delivery notes |

The default flow, drawn as dashed arrows on the tree page: Story → Frontend Requirements → Backend Delivery → Backend Integration → Frontend Delivery → QA Frontend, and Backend Delivery → QA Backend; both QA notes feed back into the Story, whose `verified` status means the implementation matches it.

A layer writes **only its own notes**. It reads the others. If a backend change makes a frontend note wrong, the backend does not edit it: it flags it ([[#3 · Relations]]) and the frontend updates it.

## 2 · Codes, scopes and the "sum of" rule

- A **task** has a code `T-NNN` and every note written for that task carries it: `tasks/T-NNN <Title>/T-NNN Story.md`, `T-NNN Frontend Requirements.md`, `T-NNN Backend Delivery.md`, … (`scope: task`, `code: T-NNN`, `task: T-NNN`). A task starts as a single file `tasks/T-NNN <Title>.md`; it moves into a folder the first time a layer note is created for it (`--scaffold` does the move).
- A **feature** has an id (`rings`) and one note per layer next to it: `modules/<Module>/<Feature>/<Feature> Story.md`, … (`scope: feature`, `code: <id>`).
- **A feature note is the sum of its task notes** of the same kind: when a task-level Backend Delivery reaches `done`, the feature-level Backend Delivery is updated (endpoints, *How it works*, *What exists*, *Gaps*) and links the task note in its *Tasks delivered* table. The build warns when a done task-level note is not linked from the feature-level one. **A module note is the sum of its features**: its table is kept current.
- **Project docs are not feature docs.** Stack, migrations, conventions, contracts, glossary live in `backend/`, `frontend/`, `business/`, `project/` and never inside a feature or task note. A feature note links to them.

## 3 · Relations — the context an agent reads instead of the whole repo

Every note declares what it is connected to, in frontmatter, and the build turns that into a graph you query **before** touching anything.

| Key | Meaning | Direction |
|---|---|---|
| `depends: [...]` | cannot be done until those are done; feeds blocking | one-way |
| `affects: [...]` | changing this changes what those rely on | one-way |
| `related: [...]` | shares a concept, endpoint, table, screen or rule | symmetric (the build mirrors it) |
| `blockedBy: [...]` | what blocks this note right now; `[]` means "nothing, whatever the defaults say" | one-way |

A target is a note name (`"Ring Access Engine"`), a task or decision id (`T-022`, `D-04`), a feature or module id (`rings`, `identity`), a **kind id** meaning the sibling note of that kind in the same feature or task (`backend-integration`), or a **concept**: an endpoint (`"GET /rings/:id"`), an error code (`E_RING_02`) or a screen (`s14`). A concept expands to every note that mentions it. The build also derives `shares` links between features that mention the same endpoint or error code, and knows which feature **owns** an endpoint (the Backend Delivery that lists it).

**The rules:**

1. **Before** creating or changing a task or a note, run `node scripts/build-tree.mjs --impact "<note name | T-NNN | feature id | concept>"` (or read the node's edges in `tree/tree.json`). Read what it returns, in this order: the same feature's notes, the directly linked notes, the two-hop notes only when the change crosses a feature boundary. Do not read the rest of the vault.
2. **Every note you create or change declares** `depends`, `affects` and `related` to what it touches: the features, tasks and decisions, the endpoints it calls, the error codes it handles, the screens it serves. An endpoint owned by another feature without a declared relation is a build warning; fix the frontmatter, do not ignore it.
3. **After** a change that alters an endpoint, an error code, an access rule or a screen, run `--impact` again and **update or flag every note it lists** that you do not own: add a line `> ⚠ Affected by [[T-NNN …]] (YYYY-MM-DD): <what changed>` under the note's H1. The owning layer removes the flag when it has updated the note. Name the flagged notes in the task's `## Log`.
4. A relation lives in the frontmatter key. A sentence in the body or a wikilink is not a relation the graph can act on (wikilinks are drawn as *mentions* only).
5. An unresolved target is a build **error**; a `depends` on something already done is harmless.

## 4 · Statuses, blocking and sign-off

- Each kind's statuses and its *done* set are in `docs.config.json`: story `draft → approved → verified`; frontend-requirements `draft → approved → delivered`; backend-delivery and frontend-delivery `todo → in-progress → done`; backend-integration `draft → current`; qa-backend and qa-frontend `draft → passing | failing`. Structural: feature `todo | partial | done | frontend`, task `todo | needs-info | blocked | in-progress | done`, decision `open | decided`.
- **Sign-off** is a status change plus `approvedBy` / `approvedAt` on the note: product approves a story and a requirements list; a Backend Integration note is `current` when it matches `main`; QA sets `passing` or `failing`; a story is `verified` when both QA notes pass.
- **Blocking is explicit and symmetric across layers.** `defaultBlocks` in the config say what blocks what by default (today: Frontend Delivery by Backend Integration, each QA note by its delivery note). A note overrides that with its own `blockedBy` list, in either direction: a frontend note may be blocked by a DevOps note, a backend note by a design decision, or nothing at all (`blockedBy: []`). A task is blocked by anything in `depends` or `blockedBy` that is not done. The tree shows *Blocked* with the reason; the generated [[Backlog]] shows the blocker in its own column.
- Changing a status means: `status:` in the frontmatter, the tag (`<kind>/<status>`), the emoji in the H1, `updated:`, then a rebuild.

## 5 · Adding a layer

1. In `docs.config.json`, add a `layers[]` entry: `id`, `label`, `color`, and its `kinds[]`, each with `id`, `label`, `file` (the note-name suffix, e.g. `DevOps Delivery`), `statuses`, `done`, `template`, `description`.
2. Add the template under `templates/` (copy the closest existing one; the frontmatter keys are the same for every kind).
3. Insert the kind into `flow` where it hands off (for example `["backend-integration","devops-delivery"]`, `["devops-delivery","frontend-delivery"]`) and add `defaultBlocks` if other kinds should wait for it by default.
4. Add it to `requiredAtFeatureLevel` only if every feature must have one; otherwise it appears where it is scaffolded.
5. `node scripts/build-tree.mjs --scaffold <kind> <feature-id | T-NNN>` creates the notes; `node scripts/build-tree.mjs` rebuilds. The page's filter, legend, colours and flow arrows follow the config with no code change.

## 6 · After a task — the checklist, by layer

**Everyone**: `--impact` before and after; relations declared; flags placed; every touched note gets today's `updated:`; `node scripts/build-tree.mjs` run and `tree/`, `tasks/Task Board.md`, `tasks/Backlog.md` committed with the notes (they are generated; `--check` fails on drift). The branch in every repo is `<module>/<ticket-no>/<what-you-do>`; pull requests link each other and the ticket.

**Business**: task note `status`, DoD boxes, `## Log` line; the feature note's *Tasks* table; a decision's `status: decided` plus `affects` listing what it unblocks; the module note when a feature is added.

**Frontend**: `T-NNN Frontend Requirements` before asking for backend work (rows ✅ / ❌ with the endpoint or the task); after shipping, `T-NNN Frontend Delivery` and the feature-level Frontend Delivery (sum of tasks); `T-NNN QA Frontend` when the checks ran; [[Frontend Contract]] when the client's cross-cutting rules changed.

**Backend**: `T-NNN Backend Delivery` (what shipped, how it works) and `T-NNN Backend Integration` (how to call it); roll both up into the feature-level notes; `T-NNN QA Backend` when the checks ran; the feature note's `status` and the module table when the feature's state changed; `backend/` reference notes ([[Spec Map]], [[Developer Guide]], [[API Conventions]], [[Database & Migrations]]) when the stack, a migration or a convention changed; [[Frontend API Guide]] and the Frontend Requirements rows (✅ with the endpoint) when the contract moved.

**QA**: the QA note's table rows checked, the diagram current, `status: passing | failing` with the run date and build; the story's `verified` when both sides pass.

## 7 · What never happens

- A relation added only in prose. A status changed only in the H1. A hand-edited `tree/tree.json`, `tree/tree.md`, `Task Board.md` or `Backlog.md`.
- A layer editing another layer's note instead of flagging it.
- Feature or task behaviour written into a project reference note, or stack / migration detail written into a feature note.
- A feature described as done because its tasks are: the feature note's `status` is the backend's own call, the layer notes carry their own.
- A second copy of a rule: the vault has one place for each (this note for rules, [[Workflow]] for the sequence, [[Docs Tree]] for the page and the JSON).

Related: [[Workflow]] · [[Docs Tree]] · [[Frontend Agent Prompt]] · [[Frontend Contract]] · [[Architecture]]
