# Social Pin · Docs

The documentation vault for Social Pin: business, frontend, backend and QA notes for every feature, the project reference for each side, the tickets, the decisions and the design index. Open this folder as an Obsidian vault and start at [Home.md](Home.md), or browse it as a tree at **https://khaled-edlbi.github.io/social-pin-docs/** (project → module → feature → one note per layer, the bugs where they were found, decisions, as a tree, a relation graph or an outline; relations light up on hover; filter by module, layer, kind and status).

```bash
node scripts/build-tree.mjs --serve                     # the same page locally, http://127.0.0.1:8787/
node scripts/build-tree.mjs --check                     # validate the notes and the generated files; what CI runs on every pull request
node scripts/build-tree.mjs                             # regenerate tree/ and social-pin/Card Index.md after editing notes
node scripts/build-tree.mjs --impact "Ring Access Engine"   # what a change to a note, card code, feature or endpoint touches
node scripts/build-tree.mjs --find "speed search"           # the cards and concepts that match some words: how an agent resolves what you named
node scripts/agent-guard.mjs selftest                       # the agents' allow / deny matrix (what each of /owner /pm /backend /frontend /qa may write; /admin may write anything)
node scripts/build-tree.mjs --scaffold backend-delivery counts   # create a feature's layer note from its template, named with its next free code
node scripts/build-tree.mjs --scaffold bug counts "<Title>" --found-on "<note name>"   # a bug with the next free B-NN; also `feature <module-id> "<Name>"`, `needs-decision "<card>" "<Title>"` and `decision ND-NN "<the answer>"`
```

- `docs.config.json` — the layers (business, frontend, backend, QA), their note kinds and statuses, the hand-off flow, the default blocks, the modules. A new layer is a config entry.
- `rules/` — the workflow, the agent rules, the docs tree guide, the agents (the docs system, at the root with `templates/`, `scripts/` and `tree/`)
- `social-pin/` — the product's docs, every card; the folders below are inside it (`projectDir` in `docs.config.json`):
- `business/`, `frontend/`, `backend/` — the project reference for each side
- `modules/<Module>/features/<Feature>/` — the feature's business note and its story; its other layer notes (frontend requirements, backend delivery, backend integration, frontend delivery, QA backend, QA frontend) in its `flow/` folder
- `bugs/` — one note per bug (`B-NN`, `type: bug`); in the tree it hangs under the card it was found against
- `needs-decisions/` — the open and answered questions (ND-NN), where the design and the backend disagree
- `decisions/` — the answers (D-NN) and the Decisions table
- `design/` — the design as reference: screen index, navigation map, wireframe brief
- `Card Index.md` — generated: every card with its unique, never-reused code (`M-01`, `F-05`, `S-01`, `FR-05`, `BD-05`, `B-01`, `ND-04`, `P-10`) and the cards it links to as `B-01 | S-01`; the registry is `tree/cards.json`
- `templates/` — one template per note kind; `tree/` and `scripts/` — the docs tree page, its generated index, the card-code registry and the build script

Rules for anyone (or any agent) editing the vault: `CLAUDE.md` and `rules/Agent Rules.md`. The sequence from ticket to merged docs: `rules/Workflow.md`. The agents, one per role, each a note in `rules/` that is its prompt and a `/skill` in `.claude/skills/` that loads it: `/owner` (rules, config, modules and features, sign-offs, priorities), `/pm` (stories, bugs, decisions), `/backend` and `/frontend` (their requirements, delivery and integration notes), `/qa` (QA notes, bugs, verified stories), and `/admin` (no role: the guard off, for a repair or a migration no role may do); the shared steps are `rules/Agent Protocol.md`, and a hook (`scripts/agent-guard.mjs`) keeps each agent inside the files its layer owns and refuses every write while no agent is active. The rules to paste into the frontend repository: `social-pin/frontend/Frontend Agent Prompt.md`. Source code is in the `social-pin` repository, whose `docs/README.md` points here.
