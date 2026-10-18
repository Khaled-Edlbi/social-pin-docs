---
type: task
id: T-022-be
status: todo
priority: P0
effort: M
feature: connections
module: connections
parent: T-022
labels: [backend]
screens: [s46]
depends: [T-021]
affects: []
related: []
pending: []
created: 2026-10-18
updated: 2026-10-18
tags: [task, task/todo, module/connections, priority/P0, backend]
---

# ⬜ T-022-be · Backend: Accept into a Ring (sets grantedRingId)

**Parent:** [[T-022 Accept into a Ring (sets grantedRingId)]] · **Feature:** [[Connections]] · **Side:** Backend · **Status:** To do · **Priority:** P0 · **Effort:** M (same as the parent until the team sizes it)

**Layer notes** (created with `node scripts/build-tree.mjs --scaffold <kind> T-022-be` when the team picks it up): [[T-022-be Backend Delivery|Backend Delivery]] · [[T-022-be Backend Integration|Backend Integration]] · [[T-022-be QA Backend|QA Backend]]

## What

The API side of [[T-022 Accept into a Ring (sets grantedRingId)]]: the endpoints, data and rules its *What* describes. Record what shipped in [[T-022-be Backend Delivery]] and how to call it in [[T-022-be Backend Integration]], and roll both up into [[Connections Backend Delivery]] and [[Connections Backend Integration]].

## Design

- [[Screen Index#s46|s46]]

## Impact

Same as the parent's: [[T-022 Accept into a Ring (sets grantedRingId)#Impact]].

## Definition of done

- [ ] Code per the backend's `CLAUDE.md` (every visibility decision through `RingAccessService`)
- [ ] `pnpm typecheck && pnpm test` green
- [ ] Backend Delivery and Backend Integration notes written and rolled up into the feature-level notes; QA Backend run; `pending` cleared or handed over
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-10-18 · created as the backend half of T-022
