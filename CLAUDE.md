# Social Pin · Docs vault — rules for anyone (or any agent) editing it

This repository is the documentation vault for Social Pin: the backend
(`github.com/Khaled-Edlbi/social-pin`), the frontend and the product share it.
It is plain Markdown with wikilinks and YAML frontmatter; it also reads on
GitHub. Start at `Home.md`. **The full rules are `project/Agent Rules.md`**;
this file is the short form and defers to it.

## What lives where

| Folder | One note per | Template |
|---|---|---|
| `business/` `frontend/` `backend/` | project reference for that layer: overview, glossary, contract, API guide, architecture, conventions, migrations, setup (`type: project`, `layer:`) | `templates/Project Note Template.md` |
| `project/` | the rules every layer follows: `Workflow`, `Agent Rules`, `Docs Tree` | — |
| `modules/<Module>/<Module> Module.md` | module: the sum of its features (`type: module`) | `templates/Module Template.md` |
| `modules/<Module>/<Feature>/<Feature>.md` | feature: the business main node (`type: feature`) | `templates/Feature Template.md` |
| `modules/<Module>/<Feature>/<Feature> <Kind>.md` | one note per layer kind: `Story`, `Frontend Requirements`, `Backend Delivery`, `Backend Integration`, `Frontend Delivery`, `QA Backend`, `QA Frontend` (`scope: feature`, `code: <feature id>`) | `templates/<Kind> Template.md` |
| `tasks/T-NNN <Title>.md` → `tasks/T-NNN <Title>/` | task (`type: task`; `parent: T-NNN` makes it a sub-task of that task, same feature); the same kinds of notes under its folder, `T-NNN <Kind>.md` (`scope: task`, `code: T-NNN`) | `templates/Task Template.md` + the kind templates |
| `decisions/` | where the design and the backend disagree, `D-NN …` | `templates/Decision Template.md` |
| `design/` | the design as reference: screen index, navigation map, brief | — |
| `tree/` `scripts/` | the generated docs tree (`index.html`, `tree.json`, `tree.md`) and `build-tree.mjs` | — |

`docs.config.json` declares the layers, their kinds, statuses, the hand-off
flow, the default blocks and the modules. `tasks/Task Board.md`,
`tasks/Backlog.md`, `tree/tree.json` and `tree/tree.md` are **generated**:
never edit them by hand.

## Read the tree first, then only what `--impact` lists

`tree/tree.json` is the whole vault as one object (nodes, edges, concepts). Read
it before walking folders. Before creating or changing any task or note, run
`node scripts/build-tree.mjs --impact "<note | T-NNN | feature id | endpoint | E_CODE>"`
and read what it returns: the same feature's notes, the directly linked notes,
the two-hop notes only when the change crosses a feature boundary. How to read
the page and the JSON: `project/Docs Tree.md`.

## The workflow this vault enforces

`project/Workflow.md` is the sequence, `project/Agent Rules.md` the rules; the short form:

1. A ticket (`tasks/T-NNN …`) exists before code is written; its `## Impact` holds the `--impact` output.
2. The branch in **every** repo is named after it: `<module>/<ticket-no>/<what-you-do>` (e.g. `ring/T-004/member-count`).
3. Each layer writes **its own notes only**, created with `node scripts/build-tree.mjs --scaffold <kind> T-NNN`: frontend requirements before backend work; backend delivery + integration when the API ships; frontend delivery when the screens ship; QA notes (artefacts, never test code) when checks run. A feature-level note is the sum of its task-level notes and links them; the module note is the sum of its features.
4. Every note declares `depends` / `affects` / `related` (and `blockedBy` when blocked, by any layer) in frontmatter; after the change, `--impact` again and update or flag (`> ⚠ Affected by [[T-NNN …]] (date): …`) every note it lists that you do not own.
5. `node scripts/build-tree.mjs` is run and the generated files are committed with the notes. CI runs `--check` on every pull request and fails on errors or drift.

## Conventions

- Frontmatter per note type: structural `type: module | feature | task | decision | project` and the kind ids from `docs.config.json` (`story`, `frontend-requirements`, `backend-delivery`, `backend-integration`, `frontend-delivery`, `qa-backend`, `qa-frontend`). Statuses: feature `done | partial | todo | frontend`, task `todo | needs-info | blocked | in-progress | done`, decision `open | decided`; each kind's statuses and *done* set are in the config. Tags mirror them (`status/done`, `task/blocked`, `story/approved`, `qa-backend/passing`, `module/<id>`, `layer/<id>`). Keep frontmatter flat: scalars, quoted strings and inline `[a, b]` lists only; the build script parses nothing else.
- Headings carry the status emoji: ✅ done · 🟡 partial / in progress · ⬜ todo · 🖼️ frontend only · 🔌 backend integration · 🧪 QA · ❓ decision. Story and requirements notes carry no emoji; their status is the chip in the tree.
- Wikilink by note name: `[[Rings]]`, `[[Rings Backend Integration]]`, `[[T-004 …]]` with the full title. Screen ids are the prototype's (`[[Screen Index#s44|s44]]`).
- Dates are `YYYY-MM-DD`; every note touched gets today's `updated:`.
- Describe things as they **are**. A gap written down is better than a feature described as done. Say "not available yet" and link the task.
- Project reference (stack, migrations, contracts) stays in `backend/`, `frontend/`, `business/`; feature and task behaviour stays in the feature's and task's notes. Never both.
- Never edit `design/Wireframe Brief.md`: it is a verbatim copy.
