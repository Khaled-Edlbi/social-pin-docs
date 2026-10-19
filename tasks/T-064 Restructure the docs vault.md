---
type: task
id: T-064
status: done
priority: high
effort: L
feature: error-contract
module: platform
screens: []
depends: []
affects: ["Docs Tree", "Workflow", "Agent Rules"]
related: []
created: 2026-10-18
tags: [task, task/done, module/platform, priority/high]
---

# ✅ T-064 · Restructure the docs vault

**Feature:** [[Error Contract]] (platform, docs-only: no layer notes) · **Status:** Done · **Priority:** High · **Effort:** L

## What

Move the vault from folders-by-layer (`features/`, `stories/`, `requirements/`, `frontend/`, `project/`) to layers-by-feature: one folder per module, one per feature, one note per layer (story, frontend requirements, backend delivery, backend integration, frontend delivery, QA backend, QA frontend), the same set per task under the task's code; project docs split into business, frontend and backend; the layers, their statuses, the hand-off flow and the default blocks declared in `docs.config.json` so a new layer (DevOps, AI, Security) is a config change; explicit `depends` / `affects` / `related` relations on every note and a `--impact` command so an agent reads only what a change touches; a generated Task Board and Backlog; rules for every agent in [[Agent Rules]] and a paste-in prompt for the frontend repo in [[Frontend Agent Prompt]].

## Impact

- Every note in the vault moved or changed frontmatter; the three files mirrored from the backend repo now live only here ([[Spec Map]], [[Developer Guide]], [[Frontend API Guide]]).
- Backend repo: `CLAUDE.md` feature workflow rewritten; `docs/` reduced to a pointer.

## Definition of done

- [x] `docs.config.json` with the four default layers, flow and default blocks
- [x] 39 features migrated: business note + story + frontend requirements + backend delivery (+ backend integration for 9)
- [x] 8 module notes; project docs split into `business/`, `frontend/`, `backend/`, `project/`
- [x] Generator: config-driven kinds, task-level notes, blocking, relations, `--impact`, `--scaffold`, generated board and backlog
- [x] Page: layer filter, flow and block lines, task sub-notes
- [x] Rules: vault `CLAUDE.md`, [[Agent Rules]], [[Workflow]], [[Docs Tree]], [[Frontend Agent Prompt]]; backend `CLAUDE.md`
- [x] `node scripts/build-tree.mjs --check` clean; tree committed

## Log

- 2026-10-18 · `docs/T-064/restructure-docs` · started
- 2026-10-18 · `docs/T-064/restructure-docs` · shipped: `docs.config.json`; `modules/<Module>/<Feature>/` with 39 features × (feature, story, frontend requirements, backend delivery) + 9 backend integration notes; 8 module notes; `business/`, `frontend/`, `backend/`, `project/`; 12 templates; generator with `--impact`, `--scaffold`, blocking, relations, generated board and backlog; page with layer filter, flow / blocks / affects / shares lines, Impact pane; [[Agent Rules]], [[Workflow]], [[Docs Tree]], [[Frontend Agent Prompt]]; backend `CLAUDE.md` feature workflow rewritten, `docs/` reduced to a pointer. Flagged nothing: every note was migrated in the same change.
