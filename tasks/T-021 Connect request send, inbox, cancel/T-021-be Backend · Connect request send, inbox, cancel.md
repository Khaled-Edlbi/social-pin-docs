---
type: task
id: T-021-be
status: todo
priority: P0
effort: M
feature: connections
module: connections
parent: T-021
labels: [backend]
screens: [s44, s45]
depends: []
affects: []
related: []
pending: []
created: 2026-10-18
updated: 2026-10-18
tags: [task, task/todo, module/connections, priority/P0, backend]
---

# ⬜ T-021-be · Backend: Connect request send, inbox, cancel

**Parent:** [[T-021 Connect request send, inbox, cancel]] · **Feature:** [[Connections]] · **Side:** Backend · **Status:** To do · **Priority:** P0 · **Effort:** M (same as the parent until the team sizes it)

**Layer notes** (created with `node scripts/build-tree.mjs --scaffold <kind> T-021-be` when the team picks it up): [[T-021-be Backend Delivery|Backend Delivery]] · [[T-021-be Backend Integration|Backend Integration]] · [[T-021-be QA Backend|QA Backend]]

## What

The API side of [[T-021 Connect request send, inbox, cancel]]: the endpoints, data and rules its *What* describes. Record what shipped in [[T-021-be Backend Delivery]] and how to call it in [[T-021-be Backend Integration]], and roll both up into [[Connections Backend Delivery]] and [[Connections Backend Integration]].

## Design

- [[Screen Index#s44|s44]], [[Screen Index#s45|s45]]

## Impact

Same as the parent's: [[T-021 Connect request send, inbox, cancel#Impact]].

## Definition of done

- [ ] Code per the backend's `CLAUDE.md` (every visibility decision through `RingAccessService`)
- [ ] `pnpm typecheck && pnpm test` green
- [ ] Backend Delivery and Backend Integration notes written and rolled up into the feature-level notes; QA Backend run; `pending` cleared or handed over
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-10-18 · created as the backend half of T-021
