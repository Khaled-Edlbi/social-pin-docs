# Social Pin · Docs

The documentation vault for Social Pin: business, frontend, backend and QA notes for every feature and task, the project reference for each side, the tickets, the decisions and the design index. Open this folder as an Obsidian vault and start at [Home.md](Home.md), or browse it as a tree at **https://khaled-edlbi.github.io/social-pin-docs/** (project → module → feature → one note per layer, tasks, decisions, as a tree, a relation graph or an outline; relations light up on hover; filter by module, layer, kind and status).

```bash
node scripts/build-tree.mjs --serve                     # the same page locally, http://127.0.0.1:8787/
node scripts/build-tree.mjs --check                     # validate the notes and the generated files; what CI runs on every pull request
node scripts/build-tree.mjs                             # regenerate tree/, tasks/Task Board.md, tasks/Backlog.md after editing notes
node scripts/build-tree.mjs --impact "Ring Access Engine"   # what a change to a note, task, feature or endpoint touches
node scripts/build-tree.mjs --scaffold backend-delivery T-004   # create a layer note for a task (or a feature id) from its template
```

- `docs.config.json` — the layers (business, frontend, backend, QA), their note kinds and statuses, the hand-off flow, the default blocks, the modules. A new layer is a config entry.
- `business/`, `frontend/`, `backend/` — the project reference for each side; `project/` — the workflow, the agent rules, the docs tree guide
- `modules/<Module>/<Feature>/` — the feature's business note and one note per layer (story, frontend requirements, backend delivery, backend integration, frontend delivery, QA backend, QA frontend)
- `tasks/` — one note per task (`T-NNN`), with the same kinds of notes under the task's folder once teams pick it up; the generated Task Board and Backlog
- `decisions/` — where the design and the backend disagree
- `design/` — the design as reference: screen index, navigation map, wireframe brief
- `templates/` — one template per note kind; `tree/` and `scripts/` — the docs tree page, its generated index and the build script

Rules for anyone (or any agent) editing the vault: `CLAUDE.md` and `project/Agent Rules.md`. The sequence from ticket to merged docs: `project/Workflow.md`. The rules to paste into the frontend repository: `frontend/Frontend Agent Prompt.md`. Source code is in the `social-pin` repository, whose `docs/README.md` points here.
