# Social Pin · Docs

Obsidian vault for the Social Pin backend. Open this folder as a vault and start at [Home.md](Home.md), or browse it as a tree at **https://khaled-edlbi.github.io/social-pin-docs/** (project → domain → feature → docs, user story, frontend requirements, API integration, tasks, decisions; relations light up on hover).

```bash
node scripts/build-tree.mjs --serve     # the same page locally, http://127.0.0.1:8787/
node scripts/build-tree.mjs --check     # validate the notes; what CI runs on every pull request
node scripts/build-tree.mjs             # regenerate tree/tree.json and tree/tree.md after editing notes
```

- `project/` — what the product is, architecture, the Ring access model, conventions
- `features/` — one note per feature with done / partial / TODO status, plus the Feature Tree, Graph and Canvas
- `stories/` — one user story per feature (draft until product signs off)
- `requirements/` — one note per feature: what the client needs from the backend, ✅ / ❌ per row
- `frontend/` — one note per done feature on how the client handles it (screens → calls, flow, shapes, errors, what is not available yet)
- `tasks/` — one note per task, the Kanban Task Board and the Backlog
- `decisions/` — where the design and the backend disagree
- `design/` — the design as reference: screen index, navigation map, wireframe brief
- `tree/` — the docs tree page and its generated index (`tree.json`, `tree.md`); `scripts/build-tree.mjs` builds it

How work flows between the two repositories (ticket → branch → code → docs): `project/Workflow.md`. How to read the tree and what to update after a task: `project/Docs Tree.md`. Rules for editing the vault: `CLAUDE.md`.

Source code and the design files are in the `social-pin` repository; this vault mirrors its `docs/` folder.
