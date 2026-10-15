# Social Pin · Docs vault — rules for anyone (or any agent) editing it

This repository is the Obsidian vault for the Social Pin backend
(`github.com/Khaled-Edlbi/social-pin`). It is plain Markdown with wikilinks and
YAML frontmatter; it also reads on GitHub. Start at `Home.md`.

## What lives where

| Folder | One note per | Template |
|---|---|---|
| `tasks/` | ticket `T-NNN <Title>.md`, plus `Task Board.md` (Kanban) and `Backlog.md` | `templates/Task Template.md` |
| `features/<Domain>/` | feature: design screens, endpoints, **how it works**, gaps, tasks | `templates/Feature Template.md` |
| `frontend/<Domain>/` | feature, for the client: `<Feature> Frontend.md` | `templates/Frontend Template.md` |
| `decisions/` | place the design and the backend disagree, `D-NN …` | `templates/Decision Template.md` |
| `project/` | the product, architecture, access model, conventions, workflow | — |
| `design/` | the design as reference: screen index, navigation map, brief | — |

`SPEC_MAP.md`, `FRONTEND_API_GUIDE.md` and `DEVELOPER_GUIDE.md` at the root are
**mirrors of `docs/` in the backend repo** and must stay byte-identical with it.

## The workflow this vault enforces

`project/Workflow.md` is the full description; the short form:

1. A ticket (`tasks/T-NNN …`) exists before code is written.
2. The branch in **both** repos is named after it: `feat/T-NNN-<kebab-slug>`.
3. When the code ships, the same change set updates: the task note (status,
   log), the Task Board and Backlog, the feature note (status, endpoints,
   *How it works*, gaps), the frontend note, the Feature Tree counts,
   `Home.md`, `project/Frontend Contract.md`, and the three mirrored files if
   the contract changed.

## Conventions

- Frontmatter per note type: `type: feature` (status `done | partial | todo |
  frontend`), `type: task` (status `todo | needs-info | blocked | in-progress |
  done`), `type: decision` (status `open | decided`), `type: frontend`. Tags
  mirror them (`status/done`, `task/blocked`, `decision/open`, `frontend`) so
  the graph view colours by state.
- Headings carry the status emoji: ✅ done · 🟡 partial · ❌ todo · ⬜ frontend
  only · 📱 frontend note · ❓ decision.
- Wikilink by note name: `[[Rings]]`, `[[Rings Frontend]]`, `[[T-004 …]]` with the
  full title. Screen ids are the prototype's (`[[Screen Index#s44|s44]]`).
- Dates are `YYYY-MM-DD`; every note touched gets today's `updated:`.
- Describe the backend as it **is**. A gap written down is better than a feature
  described as done. Say "not available yet" and link the task.
- Never edit `design/Wireframe Brief.md`: it is a verbatim copy.
