---
type: task
id: T-024-be
status: todo
priority: critical
effort: S
feature: connections
module: connections
parent: T-024
labels: [backend]
screens: [s47]
depends: []
affects: []
related: []
pending: []
created: 2026-10-18
updated: 2026-10-19
tags: [task, task/todo, module/connections, priority/critical, backend]
---

# ⬜ T-024-be · Backend: Block and unblock

**Parent:** [[T-024 Block and unblock]] · **Feature:** [[Connections]] · **Side:** Backend · **Status:** To do · **Priority:** Critical · **Effort:** S (same as the parent until the team sizes it)

**Layer notes** (created with `node scripts/build-tree.mjs --scaffold <kind> T-024-be` when the team picks it up): [[T-024-be Backend Delivery|Backend Delivery]] · [[T-024-be Backend Integration|Backend Integration]] · [[T-024-be QA Backend|QA Backend]]

## What

The API side of [[T-024 Block and unblock]]: the endpoints, data and rules its *What* describes. Record what shipped in [[T-024-be Backend Delivery]] and how to call it in [[T-024-be Backend Integration]], and roll both up into [[Connections Backend Delivery]] and [[Connections Backend Integration]].

## Design

- [[Screen Index#s47|s47]]

## Impact

Same as the parent's: [[T-024 Block and unblock#Impact]].

## Definition of done

- [ ] Code per the backend's `CLAUDE.md` (every visibility decision through `RingAccessService`)
- [ ] `pnpm typecheck && pnpm test` green
- [ ] Backend Delivery and Backend Integration notes written and rolled up into the feature-level notes; QA Backend run; `pending` cleared or handed over
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-10-18 · created as the backend half of T-024
