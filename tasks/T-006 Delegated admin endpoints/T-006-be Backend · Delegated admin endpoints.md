---
type: task
id: T-006-be
status: todo
priority: high
effort: M
feature: delegated-admins
module: shared-rings
parent: T-006
labels: [backend]
screens: [s26, s27]
depends: []
affects: []
related: []
pending: []
created: 2026-10-18
updated: 2026-10-19
tags: [task, task/todo, module/shared-rings, priority/high, backend]
---

# ⬜ T-006-be · Backend: Delegated admin endpoints

**Parent:** [[T-006 Delegated admin endpoints]] · **Feature:** [[Delegated Admins]] · **Side:** Backend · **Status:** To do · **Priority:** High · **Effort:** M (same as the parent until the team sizes it)

**Layer notes** (created with `node scripts/build-tree.mjs --scaffold <kind> T-006-be` when the team picks it up): [[T-006-be Backend Delivery|Backend Delivery]] · [[T-006-be Backend Integration|Backend Integration]] · [[T-006-be QA Backend|QA Backend]]

## What

The API side of [[T-006 Delegated admin endpoints]]: the endpoints, data and rules its *What* describes. Record what shipped in [[T-006-be Backend Delivery]] and how to call it in [[T-006-be Backend Integration]], and roll both up into [[Delegated Admins Backend Delivery]] and [[Delegated Admins Backend Integration]].

## Design

- [[Screen Index#s26|s26]], [[Screen Index#s27|s27]]

## Impact

Same as the parent's: [[T-006 Delegated admin endpoints#Impact]].

## Definition of done

- [ ] Code per the backend's `CLAUDE.md` (every visibility decision through `RingAccessService`)
- [ ] `pnpm typecheck && pnpm test` green
- [ ] Backend Delivery and Backend Integration notes written and rolled up into the feature-level notes; QA Backend run; `pending` cleared or handed over
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-10-18 · created as the backend half of T-006
