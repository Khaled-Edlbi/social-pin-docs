# Social Pin · Docs vault — rules for anyone (or any agent) editing it

This repository is the Obsidian vault for the Social Pin backend
(`github.com/Khaled-Edlbi/social-pin`). It is plain Markdown with wikilinks and
YAML frontmatter; it also reads on GitHub. Start at `Home.md`.

## What lives where

| Folder | One note per | Template |
|---|---|---|
| `tasks/` | ticket `T-NNN <Title>.md`, plus `Task Board.md` (Kanban) and `Backlog.md` | `templates/Task Template.md` |
| `features/<Domain>/` | feature: design screens, endpoints, **how it works**, gaps, tasks | `templates/Feature Template.md` |
| `stories/<Domain>/` | feature, the user story: `<Feature> Story.md` (`type: story`, status `draft` → `approved`) | `templates/Story Template.md` |
| `requirements/<Domain>/` | feature, what the client needs from the backend: `<Feature> Requirements.md` (`type: requirements`) | `templates/Requirements Template.md` |
| `frontend/<Domain>/` | feature, how the client calls the API once it exists: `<Feature> Frontend.md` (`type: frontend`) | `templates/Frontend Template.md` |
| `decisions/` | place the design and the backend disagree, `D-NN …` | `templates/Decision Template.md` |
| `project/` | the product, architecture, access model, conventions, workflow | — |
| `design/` | the design as reference: screen index, navigation map, brief | — |
| `tree/` | the generated docs tree: `index.html` (the page), `tree.json` and `tree.md` (generated, never hand-edited) | — |
| `scripts/` | `build-tree.mjs`, the generator and validator (`--check`, `--serve`) | — |

`SPEC_MAP.md`, `FRONTEND_API_GUIDE.md` and `DEVELOPER_GUIDE.md` at the root are
**mirrors of `docs/` in the backend repo** and must stay byte-identical with it.

## Read the tree first

`tree/tree.json` is the whole vault as one object (every note as a node with `path`, `status`, `effectiveStatus`, `children`, `depends`; every relation as an edge). Read it before walking folders; `tree/tree.md` is the same tree as a list. The page is published at `https://khaled-edlbi.github.io/social-pin-docs/` and runs locally with `node scripts/build-tree.mjs --serve`. How to read and maintain it: `project/Docs Tree.md`.

## The workflow this vault enforces

`project/Workflow.md` is the full description; the short form:

1. A ticket (`tasks/T-NNN …`) exists before code is written.
2. The branch in **both** repos is named after it: `feat/T-NNN-<kebab-slug>`.
3. When the code ships, the same change set updates: the task note (status,
   log), the Task Board and Backlog, the feature note (status, endpoints,
   *How it works*, gaps), the requirements note (rows flipped to ✅), the story
   (`approved` once product signed off), the frontend note, the Feature Tree
   counts, `Home.md`, `project/Frontend Contract.md`, and the three mirrored
   files if the contract changed.
4. `node scripts/build-tree.mjs` is run and `tree/tree.json` + `tree/tree.md`
   are committed with the notes. CI runs `--check` on every pull request and
   fails on validation errors or a stale tree.

## Conventions

- Frontmatter per note type: `type: feature` (status `done | partial | todo |
  frontend`), `type: task` (status `todo | needs-info | blocked | in-progress |
  done`), `type: decision` (status `open | decided`), `type: story` and
  `type: requirements` (status `draft | approved`, `id` and `feature` = the
  feature id), `type: frontend` (`id` = the feature id). Tags mirror them
  (`status/done`, `task/blocked`, `decision/open`, `story/draft`,
  `requirements/draft`, `frontend`) so the graph view colours by state. Keep
  frontmatter flat: scalars, quoted strings and inline `[a, b]` lists only; the
  build script parses nothing else.
- Headings carry the status emoji: ✅ done · 🟡 partial · ❌ todo · ⬜ frontend
  only · 📱 frontend note · ❓ decision. Story and requirements notes carry no
  emoji; their status is the chip in the tree.
- Wikilink by note name: `[[Rings]]`, `[[Rings Frontend]]`, `[[T-004 …]]` with the
  full title. Screen ids are the prototype's (`[[Screen Index#s44|s44]]`).
- Dates are `YYYY-MM-DD`; every note touched gets today's `updated:`.
- Describe the backend as it **is**. A gap written down is better than a feature
  described as done. Say "not available yet" and link the task.
- Never edit `design/Wireframe Brief.md`: it is a verbatim copy.
