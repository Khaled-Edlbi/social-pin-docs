---
type: task
id: T-069-be
status: in-progress
priority: high
effort: M
feature: operator-panel
module: platform
parent: T-069
labels: [backend]
screens: []
depends: [T-068]
affects: ["Spec Map", "Frontend API Guide", "Auth & Sign-up"]
related: []
pending: []
created: 2026-10-26
updated: 2026-10-26
tags: [task, task/in-progress, module/platform, priority/high, backend]
---

# 🟡 T-069-be · Backend: Scoped role grants

**Parent:** [[T-069 Scoped role grants]] · **Feature:** [[Operator Panel]] · **Side:** Backend · **Status:** In progress · **Priority:** high · **Effort:** M (same as the parent until the team sizes it)

**Layer notes** (created with `node scripts/build-tree.mjs --scaffold <kind> T-069-be` when the team picks it up): [[T-069-be Backend Delivery|Backend Delivery]] · [[T-069-be Backend Integration|Backend Integration]] · [[T-069-be QA Backend|QA Backend]]

## What

The API side of [[T-069 Scoped role grants]]: the endpoints, data and rules its *What* describes. Record what shipped in [[T-069-be Backend Delivery]] and how to call it in [[T-069-be Backend Integration]], and roll both up into [[Operator Panel Backend Delivery]] and [[Operator Panel Backend Integration]].

## Design

- —

## Impact

Same as the parent's: [[T-069 Scoped role grants#Impact]].

## Definition of done

- [ ] Code per the backend's `CLAUDE.md` (every visibility decision through `RingAccessService`)
- [ ] `pnpm typecheck && pnpm test` green
- [ ] Backend Delivery and Backend Integration notes written and rolled up into the feature-level notes; QA Backend run; `pending` cleared or handed over
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-10-26 · created as the backend half of T-069; the code sits on
  `T-069-be/admin/scoped-role-grants`, typecheck and tests green, not merged. The endpoints
  and how to call them go in the Backend Delivery and Backend Integration notes
  when it merges.
