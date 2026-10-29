---
id: P-19
type: project
layer: shared
related: ["Agent Rules", "Workflow", "Project Overview"]
created: 2026-10-18
updated: 2026-10-29
tags: [project, layer/shared, map]
---

# Docs Tree · how to read it, how to keep it true

The docs tree is the readable map of this vault: **project → module → feature → one note per layer (one story holding all of the feature's work), then its decisions**. Every card is one Markdown file; it shows the note's card code (`S-01`, `BD-05`, `B-01`, `ND-04`: the code every file name starts with) and kind, its layer colour, the file's name, a **priority flag** and a **deadline clock** ([[#Priority and deadline marks]]) and a status chip; double-clicking it opens the full note. Behind the cards, the relations between notes (related, affects, depends, blocks, the hand-off flow, shared endpoints, mentions) are drawn as faint lines that light up when you hover or focus a card. The page has three views of the same data: **Tree** (the hierarchy), **Graph** (features and decisions, or every note, clustered by module and pulled together by their relations) and **Outline** (the tree as a keyboard-friendly list); the filters on the left apply to all three: module (a find box narrows the list by name, id or code), **feature** (the feature card, its layer notes, its bugs and the decision cards that list it in `features:`; the list narrows to the picked modules' features, and its find box to the ones whose name or code you type), note type, status, priority and deadline, dates. Each section folds on its heading and each group inside it (Note type › Backend, Status › Waiting on, Dates › Created …) on its title, by click or Enter; the page remembers what you folded.

| | |
|---|---|
| Live page | `https://khaled-edlbi.github.io/social-pin-docs/` (published from `main` by `.github/workflows/pages.yml`) |
| Local | `node scripts/build-tree.mjs --serve` then open `http://127.0.0.1:8787/` |
| Card codes | [[Card Index]] (generated: one row per card with its unique code, status, and the cards it is connected to as `B-01 \| S-01`) and `tree/cards.json` (the registry: every code ever given, current and retired). The rule: [[Agent Rules#2 · Codes, scopes and the "sum of" rule]] |
| Machine-readable index | `tree/tree.json` (every node, edge, concept and file) and `tree/tree.md` (the same tree as a Markdown list) |
| Source of truth | the notes' **frontmatter** and `docs.config.json` (the layers). The tree and the [[Card Index]] are generated; nothing in them is typed by hand. |

## The shape

> **One story per feature, one flow** ([[Agent Rules#2 · Codes, scopes and the "sum of" rule]]): new work is a part of the feature's story; there are no tasks. Under a feature hang its layer notes, the bugs found against them and its decisions.

```
Social Pin (project)
├── M-01 Identity Core Module                    ← social-pin/modules/Identity Core/M-01 Identity Core Module.md (sum of its features)
│   ├── F-11 Rings (feature, business)           ← social-pin/modules/Identity Core/features/Rings/F-11 Rings.md — the main node
│   │   ├── S-18 Rings Story                     ← business   · type: story
│   │   ├── FR-11 Rings Frontend Requirements    ← frontend   · type: frontend-requirements
│   │   ├── BD-11 Rings Backend Delivery         ← backend    · type: backend-delivery
│   │   │   └── B-NN <Title>                     ← social-pin/bugs/… whose `foundOn:` names this card: a bug hangs where it was found
│   │   ├── BI-08 Rings Backend Integration      ← backend    · type: backend-integration
│   │   ├── Rings Frontend Delivery              ← frontend   · type: frontend-delivery (not written yet: a placeholder, no code until scaffolded)
│   │   ├── Rings QA Backend                     ← qa         · type: qa-backend
│   │   ├── Rings QA Frontend                    ← qa         · type: qa-frontend
│   │   ├── ND-04 Ring settings                  ← social-pin/needs-decisions/… that name rings in `features:`
│   │   │   └── D-04 Ring settings at launch …   ← its decision card, the answer (D-NN for ND-NN)
│   │   └── (a card that needs a decision)
│   │       └── ND-NN <Title>                     ← social-pin/needs-decisions/… whose `blocks:` names that card: hangs under it, blocks it while open
│   └── …
├── … seven more modules
├── Business docs   ← social-pin/business/   overview, glossary, feature tree and graph, status reports
├── Frontend docs   ← social-pin/frontend/   contract, API guide, migrations, the frontend agent prompt
├── Backend docs    ← social-pin/backend/    architecture, conventions, auth and access models, database, setup, spec map, developer guide
└── Project rules   ← rules/      workflow, agent rules, this note (the docs system, at the root)
```

On disk the story sits beside the feature card and the six other layer notes in the feature's `flow/` folder (`flowFolder` in `docs.config.json`); the tree draws them the same either way. The seven layer notes come from `docs.config.json`, listed in the **hand-off order** the config's `flow` gives (story → frontend requirements → backend delivery → backend integration → frontend delivery, QA after each delivery, QA back to the story); a slot with no note yet is drawn as a dashed placeholder whose summary gives the `--scaffold` command that creates it. Adding a layer to the config adds its slots everywhere.

## For humans

**Reading.** Start at the root, open a module, open a feature. The feature note says what the thing is for; the **Story** what the user should be able to do; **Frontend Requirements** what the client asks of the backend and whether it exists; **Backend Delivery** what shipped and how it works; **Backend Integration** how to call it; **Frontend Delivery** what the client built; the two **QA** notes the expected behaviour and the last verdict. The bugs hang under the card they were found against, and the decisions under the feature.

**Chips.** The colour is the status, the text says why:

| Chip | Meaning |
|---|---|
| Done / Partial / In progress / To do | a card: a delivery note's state, a bug. **Partial** is done with `pending` notes left for a card or a person (the chip counts them). A feature or module shows the roll-up of its cards (the project card shows its stage and release progress instead, [[#Stage, release and environments]]): Done only when every card is done, Partial when every card is done or partial, In progress while the cards are a mix |
| Draft ✏️ / Approved 👍 / Fulfilled ✅ | a story: before product sign-off, after it (handed off, not done), and once the PM fulfils it after both QA notes pass with nothing pending or unmet (`status: verified`); on the page a fulfilled story folds its flow until you expand it |
| Draft ✏️ / Ready 📨 / Approved 👍 / Delivered ✅ | frontend requirements: being written, finished by the frontend and waiting for the backend, accepted by the backend, and delivered on its own once the backend cards of its scope are done with nothing pending (set by hand only on a `frontendOnly` feature) |
| Draft ✏️ / Current 🔵 / Delivered ✅ | a Backend Integration note: being written (or out of date); matching `main`, in use by the frontend and QA but not done; and, computed by the build, done once the QA Backend of its scope is passing and its Frontend Delivery done, both with nothing pending |
| Draft / Passing / Failing | a QA note before and after a run |
| Blocked | the card before it in the hand-off flow is not handed off yet (the default), or something in `depends` or `blockedBy` is not done; the pane names it. A blocked card, and every card below it in the ladder that waits in turn, is drawn dim until the blocker is done |
| Needs decision | a card that asks for a decision (a needs-decision card itself reads **Draft**, **Open**, then **Fulfilled**) |
| `S-18 · STORY · Business layer` | how a card is named on the page: every card's file name starts with its code, so the code and the kind go in the kicker and the title drops the code (`S-18 Rings Story.md` reads **Rings Story** under `S-18 · STORY`), and the layer after it in the pane. The file name keeps the code: only the card's title drops it |
| `B-01 · BUG · Business layer` | a **bug**, a note of its own type, `type: bug`: its own `B` prefix and number sequence, its own name and icon on the page, and it hangs under the card it was found against rather than under the feature's story — the card named in `foundOn:` ([[Agent Rules#2 · Codes, scopes and the "sum of" rule]]). The Card Index *Under* column shows that card, `BI-01` for a bug found testing a Backend Integration note |
| `ND-NN · NEEDS DECISION` / `D-NN · DECISION` | how the two decision cards are named on the page and in the index: the ND-NN card (the needs-decision card) holds the question and always reads NEEDS DECISION, its kind, with a chip saying **Draft**, **Open** or **Fulfilled** (computed once its answer is decided); its D-NN card (the decision card) holds the answer (DECISION), with a chip saying **Draft** or **Decided**; the types (`decision`, `decision`) and the codes do not change |
| Blocked · ND-NN | the card needs a decision: the needs-decision card (`draft` or `open`) hangs under it (`blocks:` on the D card) and everything after it waits; the card returns to its own status on the build after its decision card is `decided` (the D card then shows Fulfilled) ([[Agent Rules#4 · Statuses, blocking and sign-off]]) |
| Not written yet | a placeholder for a missing layer note: under every feature |
| *Frontend only* (kicker) | a feature with `frontendOnly: true`: no backend part, so the backend and QA-backend cards are neither required nor counted |
| Reference | project docs and module notes |

Nothing on a feature, a module or the project is typed by hand: the chip is the sum of the cards below it, and a feature is not Done while a single card under it is open or not written yet.

### Priority and deadline marks

Two badges on the card's corners: the **priority flag** on the top-left, the **deadline clock** on the bottom-right (the story verdict keeps the top-right). Hover either for the words; the outline row and the pane repeat them as small chips. The **story verdict** answers *does the delivery fulfil the story*: ✕ *Not as the story says* while a QA note of the feature lists a part in `unmet`, ◷ *Pending* otherwise, open bugs included, ✓ *Fulfilled* once the PM sets it. A **🐞** on the bottom-left corner marks a card with open bugs found against it (not `done`); hover for their codes, the pane lists them under *Open bugs* and a QA note's unfulfilled parts under *Story parts unmet* ([[Agent Rules#4 · Statuses, blocking and sign-off]]).

| Mark | Meaning |
|---|---|
| ⚑ flag, red / orange / yellow / grey | the card's **priority**: `critical`, `high`, `medium`, `low` (`priorities` in `docs.config.json`). A layer note or a bug without its own shows its feature's; the tooltip says "from …" when it is inherited |
| ◷ clock, green | **deadline** more than two days away (`on-track`): the first zone of the window |
| ◷ clock, yellow | the day before the deadline (`due-soon`) |
| ◷ clock, red | the deadline day itself (`last-day`) |
| 💀 | the deadline is **missed**: the day is over and the card is not done |
| no mark | the card has no priority or no deadline, own or inherited |

The rule behind the colours: the last `deadlines.windowDays` (3) before the deadline are split evenly over `deadlines.zones`, farthest zone first; before the window the card is in the first zone. The zone is computed from today's date when the page is opened, so the generated files never change on their own; `node scripts/build-tree.mjs --impact S-18` prints the same words. The **Priority & deadline** section of the filters narrows the tree to a level or a zone (counts included); *Missed*, the window's zones and the top priority are one chip each, and a set you use often can be kept as a saved view.

### Stage, release and environments

Three tags that say where the product stands rather than how much work is done; they sit beside the status chip and never change it.

| Tag | Where | Meaning |
|---|---|---|
| **Stage · MVP** (coloured chip) | the project card | the product's stage, typed as `stage:` in [[Project Overview]]: `concept` → `prototype` → `mvp` → `beta` → `live` → `sunset` (`stages` in `docs.config.json`, each with the test that moves it on). The pane shows the stage, its next-stage test and **Release progress**: per release target, the features Done out of the total, as a bar |
| **MVP 0/18** (progress chip) | the project card, **in place of its status chip** | the features Done out of the total for the release the stage is measured by: the target with the stage's id (`mvp`), else its `requiresRelease` (`beta`, `live` → `mvp`), else the first target; it turns green when every one is Done. The project's computed status stays in `tree/tree.json`, `tree/tree.md` and the pane's *Contains*; the card only stops drawing it, because at that level it reads In progress for the whole build |
| **MVP** / **v1** / **Later** / **No release** | every feature card | the release the feature is scoped to (`release:` on the feature, `releases` in the config). Its layer notes and bugs inherit it; the pane says "Inherited from …" |
| **Deployed to** Dev / Staging / Prod | the pane of a Backend or Frontend Delivery note | the environments that delivery runs on (`deployedTo:`, `environments` in the config); "Not deployed yet" while the list is empty. An environment is not a stage |

The rule: [[Agent Rules#4 · Statuses, blocking and sign-off]]. `tree/tree.md` repeats the stage and the release progress on its first line and the release on every feature.

**Lines.** Bold lines are the tree. Thin lines behind it are relations, drawn only between cards that are both visible, each with a checkbox under **Relations** in the left column: *related* (declared or shared concept), *affects* (arrow, from the changed note to what relies on it), *depends on* (arrow), *blocks* (red arrow from the blocker: by default every card in the flow is blocked by the card before it), *flow* (dashed arrow along the hand-off order, between sibling layer notes), *pending* (a done card's note left for another card), *decision affects*, *mentions* (a wikilink). Hover a node: its relations light up with a label (shared endpoints and codes are named), their far ends get an outline, everything else dims. A relation to a collapsed node appears dashed and routed to the nearest visible ancestor.

**Filters.** The left column is a drawer: the **Filters** button in the masthead (or `[`) shows and hides it, its edge drags to any width (double-click the edge to reset), and each of its sections folds on its heading; the details pane on the right resizes the same way. All of that is remembered in the browser. The drawer narrows every view: **Find** (names, codes, card codes such as `S-01`, screen ids such as `s44`, summaries; press `/`), **Saved views** (your own: set some filters, *Save current filters*, name the view, and it lists under the button with what it filters, e.g. *Identity Core · In progress*; a click applies it, a second click turns it off, × removes it, a name used again replaces that view; none come with the page, and they are kept in your browser only, never in the vault, so another reader or another browser starts with none), **Module**, **Note type** grouped by layer (one chip per kind in the config, so a whole team's notes are one or two chips), **Status** grouped by what the status means, **Created**, **Updated** and **Deadline** (a date range each on `created:`, `updated:` and `deadline:`, with quick chips such as *Last 7 days*), and **Relations** (which lines to draw). Chips carry counts; switching a filter on opens the path to every match once, then the carets fold and unfold as usual; clearing the filters restores the folds from before. Cards that do not match fade instead of disappearing, so the tree keeps its shape. Combine them: "what is the frontend waiting on?" → type *Frontend Delivery* + status *Blocked*. "Which stories are unapproved?" → type *Stories* + status *Draft*. "What can the client build today?" → type *Integration* + status *Current* (save it as a view to keep it one click away).

**Layout.** Top-to-bottom by default: project, modules, features, each feature's notes in a **ladder** under it: one step down and one step right per hand-off, in the config's flow order, each card chained to the one before it. The badge on the top-right corner of a story card is its **verdict**, from the QA cards the flow returns from (QA Backend and QA Frontend; only QA Frontend for a frontend-only feature): a green check when the story is fulfilled (every QA card passing, or the story `verified`), an ochre clock while it is pending (a QA card draft or not written yet), a red cross when a QA card is failing; hover it for the QA cards and their statuses. A bug hangs under the card it was found against, folding with it; the feature's decisions follow in a plain column under the feature. **Direction** switches to left-to-right. Drag a card to move it with its branch (in the Graph view, on its own); positions are kept per view in your browser only; **Layout ▾** resets, exports or imports an arrangement. **Graph** shows features and decisions by default, every note with **Every note**; cards settle near the module they belong to and close to what they relate to, so a feature far from its module is one with many cross-module relations. The **Dark / Light** button switches the theme.

**Focus.** Hovering lights up relations for as long as the pointer stays; **one click** opens the details pane; **double-click** keeps the relations lit while you pan, zoom, collapse or drag (double-click again, click the background, press Esc or use the chip's ✕ to end it). A deep link `#n/<id>` focuses and opens a node.

**Controls.** Drag to pan, wheel or pinch to zoom, **Fit** to see everything. The caret on a node collapses or expands its subtree. Search matches names, codes, screen ids (`s44`) and summaries. **Outline** is the same tree as a list with keyboard support (arrows to move and fold, Enter to open); it is the default on phones, where the filters open from the **Filters** link under the title.

**The pane.** The note's kind, title, status and path, then **Edit on GitHub** and **Show on canvas** (focus the card in the Tree or Graph). Below, the important content first: the summary, then what stops the card now ("Blocked by" with the reason, "Pending" notes), then the note itself, its frontmatter, and at the bottom a **Relations** section: "In the tree under", "Depends on", the relations by kind (clickable, with the shared endpoints named), "Impact" (the same two-hop list `--impact` prints, grouped by layer) and "Contains" counts. Wikilinks inside a note navigate in the page.

## For agents

**Never read `tree/tree.json` whole**: it is the whole vault as one object, some 60,000 lines, and the build answers every question an agent has of it in a few lines. Ask the build, never the folders:

- **an overview**: `--list [filter …]`, one line per card, `code · name · kind · status · feature · module · path` (the status is the chip's, with the note's own in brackets when they differ); filters are `kind=`, `status=` (the note's own or the chip's), `feature=`, `module=`, `layer=`, `priority=`, or words in the line, all of them applied: `--list kind=bug status=todo`, `--list feature=auth`, `--list module=identity blocked`;
- **what the user named**: `--find "<words>"`, the matching cards and concepts, best first;
- **what a change touches**: `--impact <card>`, then read only what it lists ([[Agent Rules#3 · Relations]]).

Each of these ends with one line, `⚠ the tree is not clean: …`, when the build has errors or a generated file is stale, and prints nothing more when the tree is clean: that line is the load check ([[Agent Protocol#1 · Load]]); `--check` gives the list.

The shape below is what the page and the scripts read; an agent needs it only to read one field of one node.

- `nodes[id]`: `kind` (`root`, `module`, `feature`, `task` (a bug, `type: bug`: a node of kind `task` with `label: "Bug"` and `bug` in its `labels`; there are no other tasks), `needs-decision` (the question, ND-NN), `decision` (the answer, D-NN), `group`, `project`, or a kind id from the config such as `backend-delivery`), `layer`, `title`, `path` (the file to read; `null` for a placeholder, whose `template` and `summary` say how to create it), `code` (`B-NN`, `ND-NN`, `D-NN` or the feature id), `scope` (`feature` on a layer note), `feature`, `labels` (`bug` on a bug), `module`, `status` (the note's own; `null` on a feature, whose status is computed), `effectiveStatus` (what the chip shows), `blockedBy` (a list of `{ id, title, why }`), `pending` (a list of `{ text, to, person }`: the notes that make a done card Partial), `frontendOnly`, `depends` / `affects` / `related` (resolved ids), `screens`, `priority` (a level id from `priorities`, own or inherited), `deadline` (`YYYY-MM-DD`, own or inherited; the zone is not stored), `inherits` (`{ priority?: <source id>, deadline?: <source id> }` for the inherited ones), `children`, `parents`, `summary`, `rollup`.
- `card` on every node with a file is its unique card code (`M-01`, `F-05`, `S-01`, `FR-05`, `BD-05`, `B-01`, `ND-04`, `P-10`; `null` on the root, the groups and placeholders); `cards` maps every code to its node id and `cardPrefixes` every prefix to its kind. The code is stable: `tree/cards.json` remembers it across builds.
- A decision node carries `blocks` (the ids of the cards that need it, from its `blocks:` frontmatter), `features` (declared or derived from those cards) and `decider`; while it is `draft` or `open` (not yet Fulfilled) every card in `blocks` lists it in `blockedBy` with the reason *needs decision ND-NN*.
- Ids: `feature:rings`, `story:rings`, `backend-delivery:rings`, `task:B-01` (a bug), `needs-decision:ND-04`, `decision:D-04`, `module:identity`, `group:backend`, `project:workflow`, `root`.
- `layers` and `flow` echo `docs.config.json`; `flowOrder` is the hand-off order derived from `flow` (the order children are listed in), `flowBack` the pairs that return to an earlier step, and `defaultBlocks` the blocks in force: one per forward hand-off, plus the config's own extras; `legend` and `emoji` map every status to its label; `modules` lists the module ids and names; `priorities` is the enum (`id`, `label`, `color`, `aliases`) and `deadlines` the window and zones the page colours the clock with.
- `edges`: `{ from, to, kind, via? }` with kind `tree`, `related`, `affects`, `depends`, `blocks`, `flow`, `shares` (derived; `via` names the endpoints or codes), `pending`, `decision`, `wikilink`.
- `concepts`: every endpoint, error code and screen mentioned anywhere → `{ kind, owner, notes, containers }`; `owner` is the feature whose Backend Delivery lists the endpoint.
- `byName` resolves a wikilink name to a node id; `files` lists every `.md` with its `type`; `generated` names the files the build writes; `diagnostics` holds the warnings.

**Commands**

```bash
node scripts/build-tree.mjs                          # rebuild tree/, Card Index.md and site/
node scripts/build-tree.mjs --check                  # validate; exit 1 on errors, 2 when a generated file is stale (CI runs this)
node scripts/build-tree.mjs --serve                  # build and serve http://127.0.0.1:8787/
node scripts/build-tree.mjs --impact S-01                  # the same, by card code (see Card Index.md)
node scripts/build-tree.mjs --impact "Ring Access Engine"   # what a change touches: same feature, direct links, two hops, dependents
node scripts/build-tree.mjs --impact B-01            # … for a bug; also a feature id, "GET /rings/:id", E_RING_02, s14
node scripts/build-tree.mjs --find "speed search"    # the cards and concepts that match some words, best first: how an agent turns what you said into ids
node scripts/build-tree.mjs --list kind=bug status=todo   # one line per card: code · name · kind · status · feature · module · path (filters: kind= status= feature= module= layer= priority=, or words)
node scripts/build-tree.mjs --set-status B-06 in-progress   # status:, the <kind>/<status> tag, the H1 emoji, the first line's Status segment and updated:, in one write
node scripts/build-tree.mjs --set-status B-06 done --resolution fixed   # … a bug closed with how it ended; --by <name> on a sign-off (approvedBy / approvedAt, decidedBy / decidedAt)
node scripts/build-tree.mjs --set F-11 priority high      # the field, its priority/<id> tag, its first-line segment and updated:; also deadline 2026-11-15; none drops it (inherited again)
node scripts/build-tree.mjs --flag S-23 BD-02 "the count moved to the ring"   # the ⚠ flag line under BD-02's H1, and the entry in S-23's ## Log
node scripts/build-tree.mjs --finish qa B-06 closed      # the build and --check in one pass, the notes to update (yours) or flag (not yours), the branch and the commit message
node scripts/build-tree.mjs --normalize B-06             # the card's frontmatter in the vault's order: id (its code) · type · module · feature · status, then docs.config.json frontmatter.order (all: every card)
node scripts/build-tree.mjs --branch owner F-41 create   # any agent's vault branch for a card: <tickets|docs>/<agent>/<M-NN>-<module-id>/<F-NN>-<feature-id>/<last>, as deep as the card sits; tickets/ for a story, Frontend Requirements, needs-decision card or bug, docs/ for the rest (docs.config.json branches, Workflow §2)
node scripts/agent-guard.mjs status                  # this session's agent and what it may write (outside a session: every session's); `selftest` runs the allow / deny matrix
node scripts/build-tree.mjs --scaffold qa-frontend rings        # create a feature's layer note from its template: QF-NN Rings QA Frontend.md, the next free QF number, and every [[Rings QA Frontend]] link repointed at it
node scripts/build-tree.mjs --scaffold bug counts "Count shows 0 on the default Ring" --found-on "BD-03 Counts Backend Delivery"   # a bug (type: bug) with the next free B-NN, written to bugs/, hung under the card it was found against
node scripts/build-tree.mjs --scaffold feature discovery "Nearby by interest"        # a feature note in its module folder, features/Nearby by interest/F-NN Nearby by interest.md (--id <slug>, --frontend-only)
node scripts/build-tree.mjs --scaffold needs-decision "FR-03 Counts Frontend Requirements" "Where the count comes from"   # the decision card a card needs: ND-NN, blocks that card while open
node scripts/build-tree.mjs --scaffold decision ND-04 "Hidden by default"   # the decision card that takes ND-04: D-04, the answer, why and what it changes (the PM or the owner, on the user's word)
```

The build **fails** on: unparsable frontmatter or a missing key, a `type` that is neither structural nor a kind in the config, an unknown `status` for the kind, a `priority` outside the enum or a `deadline` or `created` that is not a date, a `feature` / `module` / `foundOn` / `depends` / `affects` / `related` / `blockedBy` target that does not resolve, two notes with the same code and kind, a card code in `tree/cards.json` given to two cards, reused after it was retired or carrying another kind's prefix, a feature whose `module` does not match its folder, a needs-decision card typed `decided` or `fulfilled` or carrying `decidedBy` / `decidedAt`, two decision cards for one question, a decided answer to a question still in `draft`, a decision card with an unknown status or set `decided` without `decidedBy` / `decidedAt`, a config that names a missing template, a file name containing `# ? % \`. It also **fails** on a card whose `id` is not its card code, that misses a head key its type takes (`id` · `type` · `module` · `feature` · `status`, `frontmatter.headByType`) or carries one it does not (a `feature:` on a module card). It **warns** on a card whose frontmatter is out of the vault's order (`--normalize` fixes it), a note outside its expected path, a wikilink to nothing, a missing `updated:`, a card without `created:`, an old priority code (`P1` for `high`), and a note that uses an endpoint owned by another feature without declaring a relation to it.

**Changing a status** means editing `status:`, the tag (`<kind>/<status>`), the emoji in the H1 and `updated:`, then rebuilding; `--set-status` does the four in one write. Never edit a generated file by hand: the next build overwrites it and CI fails on drift.

**The one-call edits** (`--set-status`, `--set`, `--flag`) write the notes themselves, so they are guarded by the script: it reads the session's active agent (`agents.marker`, by `CLAUDE_CODE_SESSION_ID`) and asks `scripts/agent-guard.mjs` the question its hook asks of an Edit, for exactly the lines it is about to change. Out of scope is refused with the guard's message and nothing is written; with no agent active everything is refused; from a person's own terminal (no Claude Code session) it writes as that person. `--set-status` also refuses a status the kind does not have, a computed one (a feature's, a module's, the project's, a requirements list's `delivered` unless the feature is `frontendOnly`), and any status but the first on a ⛔ Blocked card. After writing it rebuilds in memory; a change that would add a build error is put back and the error printed. A first-line segment (`**Status:** To do`) is rewritten only when it reads exactly the old value; a sentence there is left as written, and the command says so. They do not write the generated files: `--finish` does, in the same pass as `--check`.

## After finishing a part of the story

The checklist, by layer, is [[Agent Rules#6 · After a change — the checklist, by layer]]; the sequence is [[Workflow]]. In one line: `--impact` before, relations declared, the feature's notes written, `updated:` everywhere, then `--finish` (the build, `--check`, the notes to update or flag, the branch and the commit message), flags placed, the generated files committed with the notes.

## Creating a new feature or module

Feature: `node scripts/build-tree.mjs --scaffold feature <module-id> "<Name>"` creates `modules/<Module>/features/<Feature>/F-NN <Feature>.md` from `templates/Feature Template.md`, then `--scaffold story <id>` and the other kinds as each layer gets to them; add the feature to the module note's table and the screens it serves in [[Screen Index]]. Module: add it to `modules` in `docs.config.json`, create `modules/<Module>/M-NN <Module> Module.md` from `templates/Module Template.md`, M-NN the next free module code (the build prints it in its warning when the file has none). Rebuild; the tree picks everything up from the frontmatter. The Feature Map canvas in `business/` is optional and only adds *related* lines.

The agents run these on request, each inside its own files: [[Owner Agent]] (`/owner`), [[PM Agent]] (`/pm`), [[Backend Agent]] (`/backend`), [[Frontend Agent]] (`/frontend`), [[QA Agent]] (`/qa`), and [[Admin Agent]] (`/admin`), which owns the docs system (the rules, the agents, the config, the templates, the scripts, this page) and may write every file, for that and for repairs; with no agent active nothing is written and the first answer is which agent to use. The shared steps and the guard are in [[Agent Protocol]].

Related: [[Agent Rules]] · [[Workflow]] · [[Agent Protocol]] · [[Frontend Contract]] · [[Home]]
