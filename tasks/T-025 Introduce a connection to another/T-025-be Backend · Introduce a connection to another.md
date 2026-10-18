---
type: task
id: T-025-be
status: todo
priority: P2
effort: M
feature: connections
module: connections
parent: T-025
labels: [backend]
screens: [s47]
depends: [T-023]
affects: []
related: []
pending: []
created: 2026-10-18
updated: 2026-10-18
tags: [task, task/todo, module/connections, priority/P2, backend]
---

# ⬜ T-025-be · Backend: Introduce a connection to another

**Parent:** [[T-025 Introduce a connection to another]] · **Feature:** [[Connections]] · **Side:** Backend · **Status:** To do · **Priority:** P2 · **Effort:** M (same as the parent until the team sizes it)

**Layer notes** (created with `node scripts/build-tree.mjs --scaffold <kind> T-025-be` when the team picks it up): [[T-025-be Backend Delivery|Backend Delivery]] · [[T-025-be Backend Integration|Backend Integration]] · [[T-025-be QA Backend|QA Backend]]

## What

The API side of [[T-025 Introduce a connection to another]]: the endpoints, data and rules its *What* describes. Record what shipped in [[T-025-be Backend Delivery]] and how to call it in [[T-025-be Backend Integration]], and roll both up into [[Connections Backend Delivery]] and [[Connections Backend Integration]].

## Design

- [[Screen Index#s47|s47]]

## Impact

Same as the parent's: [[T-025 Introduce a connection to another#Impact]].

## Definition of done

- [ ] Code per the backend's `CLAUDE.md` (every visibility decision through `RingAccessService`)
- [ ] `pnpm typecheck && pnpm test` green
- [ ] Backend Delivery and Backend Integration notes written and rolled up into the feature-level notes; QA Backend run; `pending` cleared or handed over
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-10-18 · created as the backend half of T-025
