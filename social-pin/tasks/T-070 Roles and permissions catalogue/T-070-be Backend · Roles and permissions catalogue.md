---
type: task
id: T-070-be
status: in-progress
priority: medium
effort: S
feature: operator-panel
module: platform
parent: T-070
labels: [backend]
screens: []
depends: [T-069]
affects: ["Spec Map", "Frontend API Guide"]
related: []
pending: []
created: 2026-10-26
updated: 2026-10-26
tags: [task, task/in-progress, module/platform, priority/medium, backend]
---

# 🟡 T-070-be · Backend: Roles and permissions catalogue

**Parent:** [[T-070 Roles and permissions catalogue]] · **Feature:** [[Operator Panel]] · **Side:** Backend · **Status:** In progress · **Priority:** medium · **Effort:** S (same as the parent until the team sizes it)

**Layer notes** (created with `node scripts/build-tree.mjs --scaffold <kind> T-070-be` when the team picks it up): [[T-070-be Backend Delivery|Backend Delivery]] · [[T-070-be Backend Integration|Backend Integration]] · [[T-070-be QA Backend|QA Backend]]

## What

The API side of [[T-070 Roles and permissions catalogue]]: the endpoints, data and rules its *What* describes. Record what shipped in [[T-070-be Backend Delivery]] and how to call it in [[T-070-be Backend Integration]], and roll both up into [[Operator Panel Backend Delivery]] and [[Operator Panel Backend Integration]].

## Design

- —

## Impact

Same as the parent's: [[T-070 Roles and permissions catalogue#Impact]].

## Definition of done

- [ ] Code per the backend's `CLAUDE.md` (every visibility decision through `RingAccessService`)
- [ ] `pnpm typecheck && pnpm test` green
- [ ] Backend Delivery and Backend Integration notes written and rolled up into the feature-level notes; QA Backend run; `pending` cleared or handed over
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-10-26 · created as the backend half of T-070; the code sits on
  `T-070-be/admin/roles-catalogue`, typecheck and tests green, not merged. The endpoints
  and how to call them go in the Backend Delivery and Backend Integration notes
  when it merges.
