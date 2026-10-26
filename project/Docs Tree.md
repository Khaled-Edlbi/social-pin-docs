---
type: project
layer: shared
created: 2026-10-18
updated: 2026-10-26
related: ["Agent Rules", "Workflow", "Project Overview"]
tags: [project, layer/shared, map]
---

# Docs Tree · how to read it, how to keep it true

The docs tree is the readable map of this vault: **project → module → feature → one note per layer, the feature's tasks under its story, then its decisions**. Every card is one Markdown file; it shows the note's card code (`S-01`, `BD-05`; a task's and a decision's is in its title) and kind, its layer colour, the file's name, a **priority flag** and a **deadline clock** ([[#Priority and deadline marks]]) and a status chip; double-clicking it opens the full note. Behind the cards, the relations between notes (related, affects, depends, blocks, the hand-off flow, shared endpoints, mentions) are drawn as faint lines that light up when you hover or focus a card. The page has three views of the same data: **Tree** (the hierarchy), **Graph** (features and decisions, or every note, clustered by module and pulled together by their relations) and **Outline** (the tree as a keyboard-friendly list); the filters on the left apply to all three.

| | |
|---|---|
| Live page | `https://khaled-edlbi.github.io/social-pin-docs/` (published from `main` by `.github/workflows/pages.yml`) |
| Local | `node scripts/build-tree.mjs --serve` then open `http://127.0.0.1:8787/` |
| Card codes | [[Card Index]] (generated: one row per card with its unique code, status, and the cards it is connected to as `T-004 \| S-01`) and `tree/cards.json` (the registry: every code ever given, current and retired). The rule: [[Agent Rules#2 · Codes, scopes and the "sum of" rule]] |
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
│   │   ├── T-004 Member count per Ring …        ← tasks/… whose `feature:` is rings
│   │   │   ├── T-004 Story                      ← the task's own story (draft until product approves it)
│   │   │   ├── T-004 Backend Delivery …         ← the task's own layer notes, same kinds, code T-004
│   │   │   ├── T-004-fe Frontend · Member count ← the frontend half: a sub-task (`parent: T-004`, `labels: [frontend]`) with its own layer notes
│   │   │   └── T-004-be Backend · Member count  ← the backend half (`labels: [backend]`); a bug found later is another sub-task, `bugs/<Title>.md` with `type: bug` (code in `id:` and `aliases:`)
│   │   ├── D-04 Ring settings                   ← decisions/… that name rings in `features:`
│   │   │   └── T-059 Decide Ring settings …     ← a task that depends on it
│   │   └── (a card that needs a decision)
│   │       └── <Title> (D-NN)                   ← decisions/<Title>.md whose `blocks:` names that card: hangs under it, blocks it while open
│   └── …
├── … seven more modules
├── Business docs   ← business/   overview, glossary, feature tree and graph, status reports
├── Frontend docs   ← frontend/   contract, API guide, migrations, the frontend agent prompt
├── Backend docs    ← backend/    architecture, conventions, auth and access models, database, setup, spec map, developer guide
└── Project rules   ← project/    workflow, agent rules, this note
```

The seven layer notes come from `docs.config.json`, listed in the **hand-off order** the config's `flow` gives (story → frontend requirements → backend delivery → backend integration → frontend delivery, QA after each delivery, QA back to the story); a slot with no note yet is drawn as a dashed placeholder whose summary gives the `--scaffold` command that creates it. Adding a layer to the config adds its slots everywhere.

A **task draws the same chain under itself**, at task scope and tied to its own story (`T-NNN Story` → `T-NNN Frontend Requirements` → … → `T-NNN QA Frontend`), blocked card by card by the same `flow`. `taskFlow` in `docs.config.json` says which slots (`kinds`) and which tasks (`tasks`): a list of task ids draws it for those only, which is how a change to the chain is tried on one ticket before the vault takes it, and `"all"` draws it for every task. A task whose feature is `frontendOnly` skips the same kinds a feature does. The sub-tasks (`T-NNN-fe`, `T-NNN-be`) hang under the task after its chain, and each may have layer notes of its own.

## For humans

**Reading.** Start at the root, open a module, open a feature. The feature note says what the thing is for; the **Story** what the user should be able to do; **Frontend Requirements** what the client asks of the backend and whether it exists; **Backend Delivery** what shipped and how it works; **Backend Integration** how to call it; **Frontend Delivery** what the client built; the two **QA** notes the expected behaviour and the last verdict. The tasks hang under the Story, as what is left to do to fulfil it, and the decisions under the feature; a task opens to its own layer notes.

**Chips.** The colour is the status, the text says why:

| Chip | Meaning |
|---|---|
| Done / Partial / In progress / To do | a card: a delivery note's state, a task. **Partial** is done with `pending` notes left for a card or a person (the chip counts them). A feature or module shows the roll-up of its cards (the project card shows its stage and release progress instead, [[#Stage, release and environments]]): Done only when every card is done, Partial when every card is done or partial, In progress while the cards are a mix |
| Draft ✏️ / Approved 👍 / Fulfilled ✅ | a story: before product sign-off, after it (handed off, not done), and once the PM fulfils it after both QA notes pass with nothing pending (`status: verified`); on the page a fulfilled story folds its flow until you expand it |
| Draft ✏️ / Ready 📨 / Approved 👍 / Delivered ✅ | frontend requirements: being written, finished by the frontend and waiting for the backend, accepted by the backend, and delivered on its own once the backend cards of its scope are done with nothing pending (set by hand only on a `frontendOnly` feature) |
| Draft ✏️ / Current 🔵 / Delivered ✅ | a Backend Integration note: being written (or out of date); matching `main`, in use by the frontend and QA but not done; and, computed by the build, done once the QA Backend of its scope is passing and its Frontend Delivery done, both with nothing pending |
| Draft / Passing / Failing | a QA note before and after a run |
| Blocked | the card before it in the hand-off flow is not handed off yet (the default), or something in `depends` or `blockedBy` is not done; the pane names it. A blocked card, and every card below it in the ladder that waits in turn, is drawn dim until the blocker is done |
| Needs decision | a task that asks for a decision (a needs-decision card itself reads **Draft**, **Open**, then **Fulfilled**) |
| `T-004 · TASK · Business layer` | how a card whose file name starts with its code is named on the page: the code and the kind in the kicker, the title without the code (`T-004 Member count per Ring on list and detail.md` reads **Member count per Ring on list and detail** under `T-004 · TASK`), and the layer after it in the pane. A task is a business-layer card like a story, so it carries the layer mark too; a sub-task adds `· SUB-TASK OF T-NNN`. The file name keeps the code: only the card's title drops it |
| `B-01 · BUG · Business layer` | a **bug**, a note of its own type, `type: bug`: its own `B` prefix and number sequence, its own name and icon on the page, and it hangs under the card it was found against rather than under the feature's story — its sub-task's parent, or the card named in `foundOn:` ([[Agent Rules#2 · Codes, scopes and the "sum of" rule]]). The Card Index *Under* column shows that card, `BI-01` for a bug found testing a Backend Integration note |
| `D-NN · NEEDS DECISION` / `DR-NN · DECISION` | how the two decision cards are named on the page and in the index: the D-NN card (the needs-decision card) holds the question and always reads NEEDS DECISION, its kind, with a chip saying **Draft**, **Open** or **Fulfilled** (computed once its answer is decided); its DR-NN card (the decision card) holds the answer (DECISION), with a chip saying **Draft** or **Decided**; the types (`decision`, `decision-record`) and the codes do not change |
| Blocked · D-NN | the card needs a decision: the needs-decision card (`draft` or `open`) hangs under it (`blocks:` on the D card) and everything after it waits; the card returns to its own status on the build after its decision card is `decided` (the D card then shows Fulfilled) ([[Agent Rules#4 · Statuses, blocking and sign-off]]) |
| Not written yet | a placeholder for a missing layer note: under every feature, and under the tasks `taskFlow` names in `docs.config.json` |
| *Frontend only* (kicker) | a feature with `frontendOnly: true`: no backend part, so the backend and QA-backend cards are neither required nor counted |
| Reference | project docs and module notes |

Nothing on a feature, a module or the project is typed by hand: the chip is the sum of the cards below it, and a feature is not Done while a single card under it is open or not written yet.

### Priority and deadline marks

Two badges on the card's corners: the **priority flag** on the top-left, the **deadline clock** on the bottom-right (the story verdict keeps the top-right). Hover either for the words; the outline row and the pane repeat them as small chips.

| Mark | Meaning |
|---|---|
| ⚑ flag, red / orange / yellow / grey | the card's **priority**: `critical`, `high`, `medium`, `low` (`priorities` in `docs.config.json`). A layer note without its own shows its task's or feature's, a sub-task its parent's; the tooltip says "from …" when it is inherited |
| ◷ clock, green | **deadline** more than two days away (`on-track`): the first zone of the window |
| ◷ clock, yellow | the day before the deadline (`due-soon`) |
| ◷ clock, red | the deadline day itself (`last-day`) |
| 💀 | the deadline is **missed**: the day is over and the card is not done |
| no mark | the card has no priority or no deadline, own or inherited |

The rule behind the colours: the last `deadlines.windowDays` (3) before the deadline are split evenly over `deadlines.zones`, farthest zone first; before the window the card is in the first zone. The zone is computed from today's date when the page is opened, so the generated files never change on their own; `node scripts/build-tree.mjs --impact T-004` prints the same words. The **Priority & deadline** section of the filters narrows the tree to a level or a zone (counts included), and three saved views ask the usual questions: *Overdue*, *Due now* (inside the window), *Critical cards*.

### Stage, release and environments

Three tags that say where the product stands rather than how much work is done; they sit beside the status chip and never change it.

| Tag | Where | Meaning |
|---|---|---|
| **Stage · MVP** (coloured chip) | the project card | the product's stage, typed as `stage:` in [[Project Overview]]: `concept` → `prototype` → `mvp` → `beta` → `live` → `sunset` (`stages` in `docs.config.json`, each with the test that moves it on). The pane shows the stage, its next-stage test and **Release progress**: per release target, the features Done out of the total, as a bar |
| **MVP 0/18** (progress chip) | the project card, **in place of its status chip** | the features Done out of the total for the release the stage is measured by: the target with the stage's id (`mvp`), else its `requiresRelease` (`beta`, `live` → `mvp`), else the first target; it turns green when every one is Done. The project's computed status stays in `tree/tree.json`, `tree/tree.md` and the pane's *Contains*; the card only stops drawing it, because at that level it reads In progress for the whole build |
| **MVP** / **v1** / **Later** / **No release** | every feature card | the release the feature is scoped to (`release:` on the feature, `releases` in the config). Its layer notes and tasks inherit it; the pane says "Inherited from …" |
| **Deployed to** Dev / Staging / Prod | the pane of a Backend or Frontend Delivery note | the environments that delivery runs on (`deployedTo:`, `environments` in the config); "Not deployed yet" while the list is empty. An environment is not a stage |

The rule: [[Agent Rules#4 · Statuses, blocking and sign-off]]. `tree/tree.md` repeats the stage and the release progress on its first line and the release on every feature.

**Lines.** Bold lines are the tree. Thin lines behind it are relations, drawn only between cards that are both visible, each with a checkbox under **Relations** in the left column: *related* (declared or shared concept), *affects* (arrow, from the changed note to what relies on it), *depends on* (arrow), *blocks* (red arrow from the blocker: by default every card in the flow is blocked by the card before it), *flow* (dashed arrow along the hand-off order, between sibling layer notes), *pending* (a done card's note left for another card), *decision affects*, *mentions* (a wikilink). Hover a node: its relations light up with a label (shared endpoints and codes are named), their far ends get an outline, everything else dims. A relation to a collapsed node appears dashed and routed to the nearest visible ancestor.

**Filters.** The left column is a drawer: the **Filters** button in the masthead (or `[`) shows and hides it, its edge drags to any width (double-click the edge to reset), and each of its sections folds on its heading; the details pane on the right resizes the same way. All of that is remembered in the browser. The drawer narrows every view: **Find** (names, codes, card codes such as `S-01`, screen ids such as `s44`, summaries; press `/`), **Saved views** (one-click questions: buildable today, waiting on product, in flight, blocked, bugs, done with notes, unapproved stories, not written yet), **Module**, **Note type** grouped by layer (one chip per kind in the config, so a whole team's notes are one or two chips), **Status** grouped by what the status means, **Created**, **Updated** and **Deadline** (a date range each on `created:`, `updated:` and `deadline:`, with quick chips such as *Last 7 days*), and **Relations** (which lines to draw). Chips carry counts; switching a filter on opens the path to every match once, then the carets fold and unfold as usual; clearing the filters restores the folds from before. Cards that do not match fade instead of disappearing, so the tree keeps its shape. Combine them: "what is the frontend waiting on?" → type *Frontend Delivery* + status *Blocked*. "Which stories are unapproved?" → type *Stories* + status *Draft*. "What can the client build today?" → the *Buildable today* saved view (Backend Integration + Current).

**Layout.** Top-to-bottom by default: project, modules, features, each feature's notes in a **ladder** under it: one step down and one step right per hand-off, in the config's flow order, each card chained to the one before it. The badge on the top-right corner of a story card is its **verdict**, from the QA cards the flow returns from (QA Backend and QA Frontend; only QA Frontend for a frontend-only feature): a green check when the story is fulfilled (every QA card passing, or the story `verified`), an ochre clock while it is pending (a QA card draft or not written yet), a red cross when a QA card is failing; hover it for the QA cards and their statuses. The feature's tasks hang under its story card, as a column beside the ladder that folds with the story; its decisions follow in a plain column under the feature; a task opens to the same ladder of its own notes, and a sub-task (`parent: T-NNN`) hangs under its parent task, folding with it. **Direction** switches to left-to-right. Drag a card to move it with its branch (in the Graph view, on its own); positions are kept per view in your browser only; **Layout ▾** resets, exports or imports an arrangement. **Graph** shows features and decisions by default, every note with **Every note**; cards settle near the module they belong to and close to what they relate to, so a feature far from its module is one with many cross-module relations. The **Dark / Light** button switches the theme.

**Focus.** Hovering lights up relations for as long as the pointer stays; **one click** opens the details pane; **double-click** keeps the relations lit while you pan, zoom, collapse or drag (double-click again, click the background, press Esc or use the chip's ✕ to end it). A deep link `#n/<id>` focuses and opens a node.

**Controls.** Drag to pan, wheel or pinch to zoom, **Fit** to see everything. The caret on a node collapses or expands its subtree. Search matches names, codes, screen ids (`s44`) and summaries. **Outline** is the same tree as a list with keyboard support (arrows to move and fold, Enter to open); it is the default on phones, where the filters open from the **Filters** link under the title.

**The pane.** The note's kind, title, status and path, then **Edit on GitHub** and **Show on canvas** (focus the card in the Tree or Graph). Below, the important content first: the summary, then what stops the card now ("Blocked by" with the reason, "Pending" notes), then the note itself, its frontmatter, and at the bottom a **Relations** section: "In the tree under", "Depends on", the relations by kind (clickable, with the shared endpoints named), "Impact" (the same two-hop list `--impact` prints, grouped by layer) and "Contains" counts. Wikilinks inside a note navigate in the page.

## For agents

Read `tree/tree.json` **first**: it is the whole vault as one object, and cheaper than walking the folders. Then run `--impact` for the thing you are about to change and read only what it lists ([[Agent Rules#3 · Relations]]).

- `nodes[id]`: `kind` (`root`, `module`, `feature`, `task` (a bug, `type: bug`, is a `task` node with `label: "Bug"` and `bug` first in its `labels`), `decision`, `group`, `project`, or a kind id from the config such as `backend-delivery`), `layer`, `title`, `path` (the file to read; `null` for a placeholder, whose `template` and `summary` say how to create it), `code` (`T-NNN` or the feature id), `scope` (`feature` | `task`), `feature`, `task`, `parentTask` (the parent's code on a sub-task), `labels` (`bug`, `chore`, `spike`, `docs`), `module`, `status` (the note's own; `null` on a feature, whose status is computed), `effectiveStatus` (what the chip shows), `blockedBy` (a list of `{ id, title, why }`), `pending` (a list of `{ text, to, person }`: the notes that make a done card Partial), `frontendOnly`, `depends` / `affects` / `related` (resolved ids), `screens`, `priority` (a level id from `priorities`, own or inherited), `deadline` (`YYYY-MM-DD`, own or inherited; the zone is not stored), `inherits` (`{ priority?: <source id>, deadline?: <source id> }` for the inherited ones), `children`, `parents`, `summary`, `rollup`.
- `card` on every node with a file is its unique card code (`M-01`, `F-05`, `S-01`, `FR-05`, `BD-05`, `T-004`, `D-04`, `P-10`; `null` on the root, the groups and placeholders); `cards` maps every code to its node id and `cardPrefixes` every prefix to its kind. The code is stable: `tree/cards.json` remembers it across builds.
- A decision node carries `blocks` (the ids of the cards that need it, from its `blocks:` frontmatter), `features` (declared or derived from those cards) and `decider`; while it is `draft` or `open` (not yet Fulfilled) every card in `blocks` lists it in `blockedBy` with the reason *needs decision D-NN*.
- Ids: `feature:rings`, `story:rings`, `backend-delivery:rings`, `backend-delivery:T-004` (task level), `task:T-004`, `decision:D-04`, `module:identity`, `group:backend`, `project:workflow`, `root`.
- `layers` and `flow` echo `docs.config.json`; `flowOrder` is the hand-off order derived from `flow` (the order children are listed in), `flowBack` the pairs that return to an earlier step, and `defaultBlocks` the blocks in force: one per forward hand-off, plus the config's own extras; `legend` and `emoji` map every status to its label; `modules` lists the module ids and names; `priorities` is the enum (`id`, `label`, `color`, `aliases`) and `deadlines` the window and zones the page colours the clock with.
- `edges`: `{ from, to, kind, via? }` with kind `tree`, `related`, `affects`, `depends`, `blocks`, `flow`, `shares` (derived; `via` names the endpoints or codes), `pending`, `decision`, `wikilink`.
- `concepts`: every endpoint, error code and screen mentioned anywhere → `{ kind, owner, notes, containers }`; `owner` is the feature whose Backend Delivery lists the endpoint.
- `byName` resolves a wikilink name to a node id; `files` lists every `.md` with its `type`; `generated` names the files the build writes; `diagnostics` holds the warnings.

**Commands**

```bash
node scripts/build-tree.mjs                          # rebuild tree/, Card Index.md, tasks/Task Board.md, tasks/Backlog.md and site/
node scripts/build-tree.mjs --check                  # validate; exit 1 on errors, 2 when a generated file is stale (CI runs this)
node scripts/build-tree.mjs --serve                  # build and serve http://127.0.0.1:8787/
node scripts/build-tree.mjs --impact S-01                  # the same, by card code (see Card Index.md)
node scripts/build-tree.mjs --impact "Ring Access Engine"   # what a change touches: same feature, direct links, two hops, dependents
node scripts/build-tree.mjs --impact T-004           # … for a task; also a feature id, "GET /rings/:id", E_RING_02, s14
node scripts/build-tree.mjs --find "speed search"    # the cards and concepts that match some words, best first: how an agent turns what you said into ids
node scripts/build-tree.mjs --branch owner F-41 create   # any agent's vault branch for a card: <tickets|docs>/<agent>/<M-NN>-<module-id>/<F-NN>-<feature-id>/<last>, as deep as the card sits; tickets/ for a task, story, Frontend Requirements or decision card, docs/ for the rest (docs.config.json branches, Workflow §2)
node scripts/agent-guard.mjs status                  # which agent is active and what it may write; `selftest` runs the allow / deny matrix
node scripts/build-tree.mjs --scaffold backend-delivery T-004   # create a layer note from its template (moves the task into its folder)
node scripts/build-tree.mjs --scaffold qa-frontend rings        # … at feature level
node scripts/build-tree.mjs --scaffold task counts "Member count on the Ring card"   # a task with the next free number, its story and its fe / be halves (--backend-only, --docs-only, --parent T-NNN)
node scripts/build-tree.mjs --scaffold bug counts "Count shows 0 on the default Ring" --parent T-004   # a bug (type: bug) with the next free B-NN, written to bugs/, hung under the task it was found against (--found-on "<note name>" for any other card)
node scripts/build-tree.mjs --scaffold feature discovery "Nearby by interest"        # a feature note in its module folder (--id <slug>, --frontend-only)
node scripts/build-tree.mjs --scaffold decision "Counts Frontend Requirements" "Where the count comes from"   # the decision card a card needs: D-NN, blocks that card while open
node scripts/build-tree.mjs --scaffold record D-04 "Hidden by default"   # the decision record that takes D-04: DR-04, the answer, why and what it changes (the PM or the owner, on the user's word)
```

The build **fails** on: unparsable frontmatter or a missing key, a `type` that is neither structural nor a kind in the config, an unknown `status` for the kind, a `priority` outside the enum or a `deadline` or `created` that is not a date, a `feature` / `task` / `module` / `depends` / `affects` / `related` / `blockedBy` target that does not resolve, two notes with the same code and kind, a card code in `tree/cards.json` given to two cards, reused after it was retired or carrying another kind's prefix, a feature whose `module` does not match its folder, a needs-decision card typed `decided` or `fulfilled` or carrying `decidedBy` / `decidedAt`, two decision cards for one question, a decided answer to a question still in `draft`, a decision card with an unknown status or set `decided` without `decidedBy` / `decidedAt`, a config that names a missing template, a file name containing `# ? % \`. It **warns** on a note outside its expected path, a wikilink to nothing, a missing `updated:`, a card without `created:`, an old priority code (`P1` for `high`), a feature-level note that does not link a done task-level note, and a note that uses an endpoint owned by another feature without declaring a relation to it.

**Changing a status** means editing `status:`, the tag (`<kind>/<status>`), the emoji in the H1 and `updated:`, then rebuilding. Never edit a generated file by hand: the next build overwrites it and CI fails on drift.

## After finishing a task

The checklist, by layer, is [[Agent Rules#6 · After a task — the checklist, by layer]]; the sequence is [[Workflow]]. In one line: `--impact` before and after, relations declared, flags placed, the task-level notes written and rolled up into the feature-level ones, `updated:` everywhere, rebuild, commit the generated files with the notes.

## Creating a new feature or module

Feature: `node scripts/build-tree.mjs --scaffold feature <module-id> "<Name>"` creates `modules/<Module>/<Feature>/<Feature>.md` from `templates/Feature Template.md`, then `--scaffold story <id>` and the other kinds as each layer gets to them; add the feature to the module note's table and the screens it serves in [[Screen Index]]. Module: add it to `modules` in `docs.config.json`, create `modules/<Module>/<Module> Module.md` from `templates/Module Template.md`. Rebuild; the tree picks everything up from the frontmatter. The Feature Map canvas in `business/` is optional and only adds *related* lines.

The agents run these on request, each inside its own files: [[Owner Agent]] (`/owner`), [[PM Agent]] (`/pm`), [[Backend Agent]] (`/backend`), [[Frontend Agent]] (`/frontend`), [[QA Agent]] (`/qa`), and [[Admin Agent]] (`/admin`) inside every file, for repairs only; with no agent active nothing is written and the first answer is which agent to use. The shared steps and the guard are in [[Agent Protocol]].

Related: [[Agent Rules]] · [[Workflow]] · [[Agent Protocol]] · [[Frontend Contract]] · [[Home]]
