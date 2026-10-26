---
type: task
id: T-070
status: in-progress
priority: medium
effort: S
feature: operator-panel
module: platform
labels: []
screens: []
depends: [T-069]
affects: ["Spec Map", "Frontend API Guide"]
related: []
pending: []
created: 2026-10-26
updated: 2026-10-26
tags: [task, task/in-progress, module/platform, priority/medium]
---

# 🟡 T-070 · Roles and permissions catalogue

**Feature:** [[Operator Panel]] · **Status:** In progress · **Priority:** Medium · **Deadline:** — · **Effort:** S (S < 1 day, M 1–3 days, L > 3 days)

**Sub-tasks:** [[T-070-be Backend · Roles and permissions catalogue|Backend]] · **Story:** [[T-070 Story]]

## What

Read-only views of the seeded RBAC reference data, so the panel can show
what a grant would mean: `GET /admin/roles` for roles with their permission
keys and holder counts, and `GET /admin/roles/permissions` for the whole
catalogue. Roles are seeded, so there is deliberately no write route.

The permission catalogue is unpaged on purpose: it is reference data the
role editor needs in full to render its checkboxes, and paging it would only
make the client stitch the pages back together. The permission join rows are
flattened once, in `toView`, so the entity needs no second shape.

## Design

- —

## Impact

Output of `node scripts/build-tree.mjs --impact T-070` when the task was written: the notes this change touches and that must be updated or flagged when it ships.

- [[T-070 Story]] · S-111 — same task
- [[T-070-be Backend · Roles and permissions catalogue]] · T-070-be — same task
- [[Operator Panel]] · F-42 — wikilink ←, wikilink →

## Definition of done

- [ ] Code per the backend's `CLAUDE.md` (every visibility decision through `RingAccessService`)
- [ ] `pnpm typecheck && pnpm test` green
- [ ] Task-level layer notes written by each team that touched it; feature-level notes updated (the feature is the sum of its tasks)
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-10-26 · filed under [[Operator Panel]], after the code: the backend
  was written before any ticket named it and now sits on `T-070-be/admin/roles-catalogue`
  in `social-pin`, `pnpm typecheck && pnpm test` green, not merged. Priority,
  effort and the feature's `release:` are first guesses for the owner.
