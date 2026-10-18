---
type: task
id: T-023-be
status: todo
priority: P0
effort: M
feature: connections
module: connections
parent: T-023
labels: [backend]
screens: [s47]
depends: [T-022]
affects: []
related: []
pending: []
created: 2026-10-18
updated: 2026-10-18
tags: [task, task/todo, module/connections, priority/P0, backend]
---

# ⬜ T-023-be · Backend: Connection detail and contacts list

**Parent:** [[T-023 Connection detail and contacts list]] · **Feature:** [[Connections]] · **Side:** Backend · **Status:** To do · **Priority:** P0 · **Effort:** M (same as the parent until the team sizes it)

**Layer notes** (created with `node scripts/build-tree.mjs --scaffold <kind> T-023-be` when the team picks it up): [[T-023-be Backend Delivery|Backend Delivery]] · [[T-023-be Backend Integration|Backend Integration]] · [[T-023-be QA Backend|QA Backend]]

## What

The API side of [[T-023 Connection detail and contacts list]]: the endpoints, data and rules its *What* describes. Record what shipped in [[T-023-be Backend Delivery]] and how to call it in [[T-023-be Backend Integration]], and roll both up into [[Connections Backend Delivery]] and [[Connections Backend Integration]].

## Design

- [[Screen Index#s47|s47]]

## Impact

Same as the parent's: [[T-023 Connection detail and contacts list#Impact]].

## Definition of done

- [ ] Code per the backend's `CLAUDE.md` (every visibility decision through `RingAccessService`)
- [ ] `pnpm typecheck && pnpm test` green
- [ ] Backend Delivery and Backend Integration notes written and rolled up into the feature-level notes; QA Backend run; `pending` cleared or handed over
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-10-18 · created as the backend half of T-023
