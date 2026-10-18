---
type: project
updated: 2026-10-18
tags: [project, map]
---

# Docs Tree · how to read it, how to keep it true

The docs tree is the readable map of this vault: **project → domain → feature → the feature's notes, tasks and decisions**. Every node is one Markdown file; the node shows the file's name and a status chip; clicking it opens the full note. Behind the tree, the relations between notes (mentions, dependencies, decisions, related features) are drawn as faint lines that light up when you hover a node.

| | |
|---|---|
| Live page | `https://khaled-edlbi.github.io/social-pin-docs/` (published from `main` by `.github/workflows/pages.yml`) |
| Local | `node scripts/build-tree.mjs --serve` then open `http://127.0.0.1:8787/` |
| Machine-readable index | `tree/tree.json` (every node, edge and file) and `tree/tree.md` (the same tree as a Markdown list) |
| Source of truth | the notes' **frontmatter**. The tree is generated; nothing in it is typed by hand. |

## The shape

```
Social Pin (project)
├── Identity Core (domain)                      ← one per features/<Domain>/ folder
│   ├── Rings (feature)                         ← features/Identity Core/Rings.md
│   │   ├── Docs · Rings                        ← the feature note itself: screens, endpoints, How it works, gaps
│   │   ├── Rings Story                         ← stories/…: user stories and acceptance criteria   (type: story)
│   │   ├── Rings Requirements                  ← requirements/…: what the client needs from the backend (type: requirements)
│   │   ├── Rings Frontend                      ← frontend/…: how to call the API once it exists   (type: frontend)
│   │   ├── T-059 Decide Ring settings          ← tasks/… whose `feature:` is rings
│   │   └── D-04 Ring settings                  ← decisions/… that name rings in `features:`
│   └── …
├── … seven more domains
└── Project docs                                ← project/*.md: overview, architecture, access model, conventions, workflow
```

Four notes per feature, always in that order. A slot that has no note yet is drawn as a dashed placeholder that opens the template to create it from.

## For humans

**Reading.** Start at the root, open a domain, open a feature. The feature's **Docs** note says what exists; the **Story** says what the user should be able to do; the **Requirements** say what the client needs and whether the backend provides it; **Frontend** (API Integration) says how to call it. Tasks and decisions under the feature are what is left to do or decide.

**Chips.** The colour is the status, the text says why:

| Chip | Meaning |
|---|---|
| Done / Partial / To do | the backend status of a feature (and of its Docs node) |
| Draft / Approved | a story or requirements note, before and after product sign-off |
| Blocked · backend | a story, requirements or frontend note under a feature whose backend is not done yet: the client cannot build it today, whatever the note's own status |
| To do · decision | a task that waits on an open decision |
| Needs decision | a decision that is still open, or a task that asks for one |
| In progress | a task someone is on (`status: in-progress`) |
| Not written yet | a placeholder for a missing story, requirements or frontend note |
| Frontend only | a feature with no backend part (the app shell) |
| Reference | project notes |

A domain's chip rolls up its features (done only when every feature is); the root rolls up the domains. A feature's chip is its own backend status, never averaged from its tasks.

**Lines.** Bold lines are the tree. Thin lines behind it are relations, drawn only between nodes that are both visible: blue *related feature*, red *depends on* (task → task or decision), purple *decision affects*, grey *mentions* (a wikilink in the note's body). Hover a node: its relations light up with a label, their far ends get a blue outline, everything else dims. A relation to a collapsed node appears dashed and routed to the nearest visible ancestor. The legend's checkboxes hide line kinds.

**Layout.** The map reads top-to-bottom: the project at the top, the domains on the next row, the features below, and each feature's notes, tasks and decisions listed in a column under it. The **⇅ / ⇄** button switches to a left-to-right layout; the choice is remembered.

**Controls.** Drag to pan, wheel or pinch to zoom, **Fit** to see everything. The caret on a node collapses or expands its subtree (the number is how many nodes are inside). Search matches names, ids, screen ids (`s44`) and summaries; status chips in the header filter (several can be on); the domain and kind selects narrow further. Filtered-out nodes fade rather than vanish, so lines keep their meaning. **Outline** is the same tree as a list with full keyboard support (↑ ↓ move, → ← expand / collapse, Enter opens, `/` focuses search, Esc closes the pane); it is the default on phones.

**The pane.** Frontmatter as a card, then "In the tree under", "Depends on", the relations by kind (clickable), "Contains" counts for features and domains, then the note itself. Wikilinks inside a note navigate in the page; "Open on GitHub" is the edit button. `#n/<node id>` in the URL is a shareable deep link (for example `#n/story:rings`); `#f/<path>` opens any vault note that is not a node, such as the Screen Index.

**Useful views.** "What can the client build today?" → status chip *Done* + kind *API integration*. "What is waiting on product?" → status *Needs decision*. "What is in flight?" → *In progress*. "Which stories are unapproved?" → kind *User stories* + status *Draft*.

## For agents

Read `tree/tree.json` **first**: it is the whole vault as one object, and cheaper than walking the folders.

- `nodes[id]`: `kind`, `title`, `path` (the file to read, repo-relative; `null` for a placeholder, whose `template` says what to create), `status` (the note's own), `effectiveStatus` (what the chip shows), `blockedBy` (`backend` | `decision` | `null`), `priority`, `domain`, `feature`, `screens`, `depends` (resolved ids), `children`, `parents`, `summary`, `rollup`.
- Ids are `<kind>:<key>`: `feature:rings`, `story:rings`, `requirements:rings`, `frontend:rings`, `task:T-004`, `decision:D-04`, `domain:identity`, `project:workflow`, `root`.
- `byName` resolves a wikilink name to a node id; `files` lists every `.md` in the vault with its `type`; `edges` are the relations (`tree`, `related`, `depends`, `decision`, `wikilink`); `diagnostics` holds the build's warnings.
- `tree/tree.md` is the same tree as an indented list, for a quick scan.

**Before touching a feature**, read its four notes in this order: Docs (the feature note), Story, Requirements, Frontend. Then the tasks under it and the decisions it waits on. Do not start a task whose chip reads *Needs decision* or *Blocked*.

**Changing a status** means editing the note's frontmatter (`status:`), its tag (`status/<x>`, `task/<x>`, `story/<x>`, `requirements/<x>`), the emoji in its H1, and `updated:`; then rebuilding. Never edit `tree/tree.json` or `tree/tree.md` by hand: the next build overwrites them and CI fails on drift.

**Commands**

```bash
node scripts/build-tree.mjs            # rebuild tree/tree.json, tree/tree.md and site/
node scripts/build-tree.mjs --check    # validate; exit 1 on errors, 2 when tree.json is stale (CI runs this on every PR)
node scripts/build-tree.mjs --serve    # build and serve http://127.0.0.1:8787/
```

The build fails on: unparsable or missing frontmatter keys, an unknown `status` for the note type, a `feature:` / `depends:` / `features:` id that does not exist, two notes with the same id, a domain that does not match its folder, a file name containing `# ? % \`. It warns on wikilinks that resolve to nothing and on features missing one of their four notes.

## After finishing a task — the checklist

1. **Task note** `tasks/T-NNN …`: `status: done`, tag `task/done`, H1 emoji ✅, tick the definition of done, add a `## Log` line (date · branch · what shipped).
2. **Feature note**: status (frontmatter, tag, emoji), the Endpoints list, *How it works*, *What exists*, *Gaps*, the Tasks table, `updated:`.
3. **Requirements note**: flip the rows the task delivered to ✅ with the endpoint; move anything still missing to the task that remains; `status: approved` only when product signed the requirements off.
4. **Story note**: `status: approved` when product signed off; otherwise leave `draft` and update acceptance criteria that changed.
5. **Frontend note**: create it from `templates/Frontend Template.md` the first time a feature becomes usable by the client; update it when the contract changes.
6. **Task Board and Backlog**: move the card, update the row. **Feature Tree** counts and **Home** "Where things stand".
7. **The mirrored files** (`SPEC_MAP.md`, `FRONTEND_API_GUIDE.md`, `DEVELOPER_GUIDE.md`) in both repos, when the contract moved.
8. `node scripts/build-tree.mjs`, read its warnings, commit `tree/tree.json` and `tree/tree.md` with the notes.

The same list is in the backend's `CLAUDE.md` ("Feature workflow") and in [[Workflow]].

## Creating a new feature

Create the feature note from `templates/Feature Template.md` in the right `features/<Domain>/` folder, then its story and requirements from `templates/Story Template.md` and `templates/Requirements Template.md` (same file name with ` Story` / ` Requirements` appended, same `id`), then its tasks. Add it to [[Feature Tree]], [[Feature Graph]] and the screens it serves in [[Screen Index]]. Rebuild. The tree picks it up from the frontmatter; the Feature Map canvas is optional and only adds *related* lines.

Related: [[Workflow]] · [[Frontend Index]] · [[Feature Tree]] · [[Home]]
