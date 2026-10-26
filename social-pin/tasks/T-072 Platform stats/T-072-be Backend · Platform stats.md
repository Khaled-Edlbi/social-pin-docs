---
type: task
id: T-072-be
status: in-progress
priority: medium
effort: S
feature: operator-panel
module: platform
parent: T-072
labels: [backend]
screens: []
depends: [T-068]
affects: ["Spec Map", "Frontend API Guide"]
related: []
pending: []
created: 2026-10-26
updated: 2026-10-26
tags: [task, task/in-progress, module/platform, priority/medium, backend]
---

# 🟡 T-072-be · Backend: Platform stats

**Parent:** [[T-072 Platform stats]] · **Feature:** [[Operator Panel]] · **Side:** Backend · **Status:** In progress · **Priority:** medium · **Effort:** S (same as the parent until the team sizes it)

**Layer notes** (created with `node scripts/build-tree.mjs --scaffold <kind> T-072-be` when the team picks it up): [[T-072-be Backend Delivery|Backend Delivery]] · [[T-072-be Backend Integration|Backend Integration]] · [[T-072-be QA Backend|QA Backend]]

## What

The API side of [[T-072 Platform stats]]: the endpoints, data and rules its *What* describes. Record what shipped in [[T-072-be Backend Delivery]] and how to call it in [[T-072-be Backend Integration]], and roll both up into [[Operator Panel Backend Delivery]] and [[Operator Panel Backend Integration]].

## Design

- —

## Impact

Same as the parent's: [[T-072 Platform stats#Impact]].

## Definition of done

- [ ] Code per the backend's `CLAUDE.md` (every visibility decision through `RingAccessService`)
- [ ] `pnpm typecheck && pnpm test` green
- [ ] Backend Delivery and Backend Integration notes written and rolled up into the feature-level notes; QA Backend run; `pending` cleared or handed over
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-10-26 · created as the backend half of T-072; the code sits on
  `T-072-be/admin/platform-stats`, typecheck and tests green, not merged. The endpoints
  and how to call them go in the Backend Delivery and Backend Integration notes
  when it merges.
