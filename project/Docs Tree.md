---
type: project
layer: shared
updated: 2026-10-18
related: ["Agent Rules", "Workflow"]
tags: [project, layer/shared, map]
---

# Docs Tree · how to read it, how to keep it true

The docs tree is the readable map of this vault: **project → module → feature → one note per layer, then the feature's tasks and decisions**. Every card is one Markdown file; it shows the note's kind and priority, its layer colour, the file's name and a status chip; double-clicking it opens the full note. Behind the cards, the relations between notes (related, affects, depends, blocks, the hand-off flow, shared endpoints, mentions) are drawn as faint lines that light up when you hover or focus a card. The page has three views of the same data: **Tree** (the hierarchy), **Graph** (features and decisions, or every note, clustered by module and pulled together by their relations) and **Outline** (the tree as a keyboard-friendly list); the filters on the left apply to all three.

| | |
|---|---|
| Live page | `https://khaled-edlbi.github.io/social-pin-docs/` (published from `main` by `.github/workflows/pages.yml`) |
| Local | `node scripts/build-tree.mjs --serve` then open `http://127.0.0.1:8787/` |
| Machine-readable index | `tree/tree.json` (every node, edge, concept and file) and `tree/tree.md` (the same tree as a Markdown list) |
| Source of truth | the notes' **frontmatter** and `docs.config.json` (the layers). The tree, the [[Task Board]] and the [[Backlog]] are generated; nothing in them is typed by hand. |

## The shape

```
Social Pin (project)
├── Identity Core Module                         ← modules/Identity Core/Identity Core Module.md (sum of its features)
│   ├── Rings (feature, business)                ← modules/Identity Core/Rings/Rings.md — the main node
│   │   ├── Rings Story                          ← business   · type: story
│   │   ├── Rings Frontend Requirements          ← frontend   · type: frontend-requirements
│   │   ├── Rings Backend Delivery               ← backend    · type: backend-delivery
│   │   ├── Rings Backend Integration            ← backend    · type: backend-integration
│   │   ├── Rings Frontend Delivery              ← frontend   · type: frontend-delivery
│   │   ├── Rings QA Backend                     ← qa         · type: qa-backend
│   │   ├── Rings QA Frontend                    ← qa         · type: qa-frontend
│   │   ├── T-059 Decide Ring settings           ← tasks/… whose `feature:` is rings
│   │   │   ├── T-059 Backend Delivery …         ← the task's own layer notes, same kinds, code T-059
│   │   │   └── T-071 …                          ← a sub-task: a task note with `parent: T-059`, with its own layer notes
│   │   └── D-04 Ring settings                   ← decisions/… that name rings in `features:`
│   └── …
├── … seven more modules
├── Business docs   ← business/   overview, glossary, feature tree and graph, status reports
├── Frontend docs   ← frontend/   contract, API guide, migrations, the frontend agent prompt
├── Backend docs    ← backend/    architecture, conventions, auth and access models, database, setup, spec map, developer guide
└── Project rules   ← project/    workflow, agent rules, this note
```

The seven layer notes come from `docs.config.json`, listed in the **hand-off order** the config's `flow` gives (story → frontend requirements → backend delivery → backend integration → frontend delivery, QA after each delivery, QA back to the story); a slot with no note yet is drawn as a dashed placeholder whose summary gives the `--scaffold` command that creates it. Adding a layer to the config adds its slots everywhere.

## For humans

**Reading.** Start at the root, open a module, open a feature. The feature note says what the thing is for; the **Story** what the user should be able to do; **Frontend Requirements** what the client asks of the backend and whether it exists; **Backend Delivery** what shipped and how it works; **Backend Integration** how to call it; **Frontend Delivery** what the client built; the two **QA** notes the expected behaviour and the last verdict. Tasks and decisions under the feature are what is left to do or decide; a task opens to its own layer notes.

**Chips.** The colour is the status, the text says why:

| Chip | Meaning |
|---|---|
| Done / Partial / To do | a feature's backend status, a delivery note's state, a task |
| Draft / Approved / Verified | a story: before product sign-off, after, and after both QA notes pass |
| Draft / Approved / Delivered | frontend requirements: written, accepted by the backend, every row ✅ |
| Draft / Current | a Backend Integration note: being written, or matching `main` |
| Draft / Passing / Failing | a QA note before and after a run |
| Blocked | something in `depends` or `blockedBy` is not done; the pane names it |
| Needs decision | a decision that is still open, or a task that asks for one |
| In progress | a task or delivery someone is on |
| Not written yet | a placeholder for a missing layer note (feature level only) |
| Frontend only | a feature with no backend part (the app shell) |
| Reference | project docs and module notes |

A module's chip rolls up its features (done only when every feature is); the root rolls up the modules. A feature's chip is its own backend status, never averaged from its tasks.

**Lines.** Bold lines are the tree. Thin lines behind it are relations, drawn only between cards that are both visible, each with a checkbox under **Relations** in the left column: *related* (declared or shared concept), *affects* (arrow, from the changed note to what relies on it), *depends on* (arrow), *blocks* (red arrow from the blocker), *flow* (dashed arrow along the hand-off order, between sibling layer notes), *decision affects*, *mentions* (a wikilink). Hover a node: its relations light up with a label (shared endpoints and codes are named), their far ends get an outline, everything else dims. A relation to a collapsed node appears dashed and routed to the nearest visible ancestor.

**Filters.** The left column is a drawer: the **Filters** button in the masthead (or `[`) shows and hides it, its edge drags to any width (double-click the edge to reset), and each of its sections folds on its heading; the details pane on the right resizes the same way. All of that is remembered in the browser. The drawer narrows every view: **Find** (names, codes, screen ids such as `s44`, summaries; press `/`), **Saved views** (one-click questions: buildable today, waiting on product, in flight, blocked, unapproved stories, not written yet), **Module**, **Note type** grouped by layer (one chip per kind in the config, so a whole team's notes are one or two chips), **Status** grouped by what the status means, and **Relations** (which lines to draw). Chips carry counts; switching a filter on opens the path to every match once, then the carets fold and unfold as usual; clearing the filters restores the folds from before. Cards that do not match fade instead of disappearing, so the tree keeps its shape. Combine them: "what is the frontend waiting on?" → type *Frontend Delivery* + status *Blocked*. "Which stories are unapproved?" → type *Stories* + status *Draft*. "What can the client build today?" → the *Buildable today* saved view (Backend Integration + Current).

**Layout.** Top-to-bottom by default: project, modules, features, each feature's notes in a **ladder** under it: one step down and one step right per hand-off, in the config's flow order, each card chained to the one before it. The small arrow above a card says how it is reached: a forward arrow for the next step of the hand-off, a mirrored arrow on the card the flow returns to (the story, after QA). The feature's tasks and decisions follow in a plain column; a task opens to the same ladder of its own notes, and a sub-task (`parent: T-NNN`) hangs under its parent task, folding with it. **Direction** switches to left-to-right. Drag a card to move it with its branch (in the Graph view, on its own); positions are kept per view in your browser only; **Layout ▾** resets, exports or imports an arrangement. **Graph** shows features and decisions by default, every note with **Every note**; cards settle near the module they belong to and close to what they relate to, so a feature far from its module is one with many cross-module relations. The **Dark / Light** button switches the theme.

**Focus.** Hovering lights up relations for as long as the pointer stays; **one click** keeps them lit while you pan, zoom, collapse or drag (click again, click the background, press Esc or use the chip's ✕ to end it); **double-click** opens the details pane. A deep link `#n/<id>` focuses and opens a node.

**Controls.** Drag to pan, wheel or pinch to zoom, **Fit** to see everything. The caret on a node collapses or expands its subtree. Search matches names, codes, screen ids (`s44`) and summaries. **Outline** is the same tree as a list with keyboard support (arrows to move and fold, Enter to open); it is the default on phones, where the filters open from the **Filters** link under the title.

**The pane.** The note's kind, title, status and path, then **Edit on GitHub** and **Show on canvas** (focus the card in the Tree or Graph). Below: the summary, "In the tree under", "Blocked by" (with the reason), "Depends on", the relations by kind (clickable, with the shared endpoints named), "Impact" (the same two-hop list `--impact` prints, grouped by layer), "Contains" counts, the frontmatter, then the note. Wikilinks inside a note navigate in the page.

## For agents

Read `tree/tree.json` **first**: it is the whole vault as one object, and cheaper than walking the folders. Then run `--impact` for the thing you are about to change and read only what it lists ([[Agent Rules#3 · Relations]]).

- `nodes[id]`: `kind` (`root`, `module`, `feature`, `task`, `decision`, `group`, `project`, or a kind id from the config such as `backend-delivery`), `layer`, `title`, `path` (the file to read; `null` for a placeholder, whose `template` and `summary` say how to create it), `code` (`T-NNN` or the feature id), `scope` (`feature` | `task`), `feature`, `task`, `parentTask` (the parent's code on a sub-task), `module`, `status` (the note's own), `effectiveStatus` (what the chip shows), `blockedBy` (a list of `{ id, title, why }`), `depends` / `affects` / `related` (resolved ids), `screens`, `priority`, `children`, `parents`, `summary`, `rollup`.
- Ids: `feature:rings`, `story:rings`, `backend-delivery:rings`, `backend-delivery:T-004` (task level), `task:T-004`, `decision:D-04`, `module:identity`, `group:backend`, `project:workflow`, `root`.
- `layers` and `flow` echo `docs.config.json`; `flowOrder` is the hand-off order derived from `flow` (the order children are listed in) and `flowBack` the pairs that return to an earlier step; `legend` and `emoji` map every status to its label; `modules` lists the module ids and names.
- `edges`: `{ from, to, kind, via? }` with kind `tree`, `related`, `affects`, `depends`, `blocks`, `flow`, `shares` (derived; `via` names the endpoints or codes), `decision`, `wikilink`.
- `concepts`: every endpoint, error code and screen mentioned anywhere → `{ kind, owner, notes, containers }`; `owner` is the feature whose Backend Delivery lists the endpoint.
- `byName` resolves a wikilink name to a node id; `files` lists every `.md` with its `type`; `generated` names the files the build writes; `diagnostics` holds the warnings.

**Commands**

```bash
node scripts/build-tree.mjs                          # rebuild tree/, tasks/Task Board.md, tasks/Backlog.md and site/
node scripts/build-tree.mjs --check                  # validate; exit 1 on errors, 2 when a generated file is stale (CI runs this)
node scripts/build-tree.mjs --serve                  # build and serve http://127.0.0.1:8787/
node scripts/build-tree.mjs --impact "Ring Access Engine"   # what a change touches: same feature, direct links, two hops, dependents
node scripts/build-tree.mjs --impact T-004           # … for a task; also a feature id, "GET /rings/:id", E_RING_02, s14
node scripts/build-tree.mjs --scaffold backend-delivery T-004   # create a layer note from its template (moves the task into its folder)
node scripts/build-tree.mjs --scaffold qa-frontend rings        # … at feature level
```

The build **fails** on: unparsable frontmatter or a missing key, a `type` that is neither structural nor a kind in the config, an unknown `status` for the kind, a `feature` / `task` / `module` / `depends` / `affects` / `related` / `blockedBy` target that does not resolve, two notes with the same code and kind, a feature whose `module` does not match its folder, a config that names a missing template, a file name containing `# ? % \`. It **warns** on a note outside its expected path, a wikilink to nothing, a missing `updated:`, a feature-level note that does not link a done task-level note, and a note that uses an endpoint owned by another feature without declaring a relation to it.

**Changing a status** means editing `status:`, the tag (`<kind>/<status>`), the emoji in the H1 and `updated:`, then rebuilding. Never edit a generated file by hand: the next build overwrites it and CI fails on drift.

## After finishing a task

The checklist, by layer, is [[Agent Rules#6 · After a task — the checklist, by layer]]; the sequence is [[Workflow]]. In one line: `--impact` before and after, relations declared, flags placed, the task-level notes written and rolled up into the feature-level ones, `updated:` everywhere, rebuild, commit the generated files with the notes.

## Creating a new feature or module

Feature: create `modules/<Module>/<Feature>/<Feature>.md` from `templates/Feature Template.md`, then `--scaffold story <id>` and the other kinds as each layer gets to them; add the feature to the module note's table and the screens it serves in [[Screen Index]]. Module: add it to `modules` in `docs.config.json`, create `modules/<Module>/<Module> Module.md` from `templates/Module Template.md`. Rebuild; the tree picks everything up from the frontmatter. The Feature Map canvas in `business/` is optional and only adds *related* lines.

Related: [[Agent Rules]] · [[Workflow]] · [[Frontend Contract]] · [[Home]]
