---
type: task
id: T-005-be
status: todo
priority: high
effort: S
feature: counts
module: identity
parent: T-005
labels: [backend]
screens: [s11, s68]
depends: [T-021]
affects: []
related: []
pending: []
created: 2026-10-18
updated: 2026-10-26
tags: [task, task/todo, module/identity, priority/high, backend]
---

# ⬜ T-005-be · Backend: Connection count on Me and Home

**Parent:** [[T-005 Connection count on Me and Home]] · **Feature:** [[Counts]] · **Side:** Backend · **Status:** To do · **Priority:** High · **Effort:** S (same as the parent until the team sizes it)

**Layer notes** (created with `node scripts/build-tree.mjs --scaffold <kind> T-005-be` when the team picks it up): [[T-005-be Backend Delivery|Backend Delivery]] · [[T-005-be Backend Integration|Backend Integration]] · [[T-005-be QA Backend|QA Backend]]

## What

The API side of [[T-005 Connection count on Me and Home]]: the endpoints, data and rules its *What* describes. Record what shipped in [[T-005-be Backend Delivery]] and how to call it in [[T-005-be Backend Integration]], and roll both up into [[Counts Backend Delivery]] and [[Counts Backend Integration]].

## Design

- [[Screen Index#s11|s11]], [[Screen Index#s68|s68]]

## Impact

Same as the parent's: [[T-005 Connection count on Me and Home#Impact]].

## Definition of done

- [ ] Code per the backend's `CLAUDE.md` (every visibility decision through `RingAccessService`)
- [ ] `pnpm typecheck && pnpm test` green
- [ ] Backend Delivery and Backend Integration notes written and rolled up into the feature-level notes; QA Backend run; `pending` cleared or handed over
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-10-18 · created as the backend half of T-005
