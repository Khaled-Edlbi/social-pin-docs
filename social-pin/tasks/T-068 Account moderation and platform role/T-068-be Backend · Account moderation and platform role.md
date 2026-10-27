---
type: task
id: T-068-be
status: in-progress
priority: high
effort: M
feature: operator-panel
module: platform
parent: T-068
labels: [backend]
screens: []
depends: []
affects: ["Spec Map", "Frontend API Guide", "Account", "Auth & Sign-up"]
related: ["Audit Log Story"]
pending: []
created: 2026-10-26
updated: 2026-10-27
tags: [task, task/in-progress, module/platform, priority/high, backend]
---

# 🟡 T-068-be · Backend: Account moderation and platform role

**Parent:** [[T-068 Account moderation and platform role]] · **Feature:** [[Operator Panel]] · **Side:** Backend · **Status:** In progress · **Priority:** high · **Effort:** M (same as the parent until the team sizes it)

**Layer notes** (created with `node scripts/build-tree.mjs --scaffold <kind> T-068-be` when the team picks it up): [[T-068-be Backend Delivery|Backend Delivery]] · [[T-068-be Backend Integration|Backend Integration]] · [[T-068-be QA Backend|QA Backend]]

## What

The API side of [[T-068 Account moderation and platform role]]: the endpoints, data and rules its *What* describes. Record what shipped in [[T-068-be Backend Delivery]] and how to call it in [[T-068-be Backend Integration]], and roll both up into [[Operator Panel Backend Delivery]] and [[Operator Panel Backend Integration]].

## Design

- —

## Impact

Same as the parent's: [[T-068 Account moderation and platform role#Impact]].

## Definition of done

- [ ] Code per the backend's `CLAUDE.md` (every visibility decision through `RingAccessService`)
- [ ] `pnpm typecheck && pnpm test` green
- [ ] Backend Delivery and Backend Integration notes written and rolled up into the feature-level notes; QA Backend run; `pending` cleared or handed over
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-10-26 · created as the backend half of T-068; the code sits on
  `T-068-be/admin/account-moderation`, typecheck and tests green, not merged. The endpoints
  and how to call them go in the Backend Delivery and Backend Integration notes
  when it merges.
