---
type: task
id: T-040-be
status: todo
priority: high
effort: M
feature: events-during
module: events
parent: T-040
labels: [backend]
screens: [s53]
depends: [T-034, T-049]
affects: []
related: []
pending: []
created: 2026-10-18
updated: 2026-10-26
tags: [task, task/todo, module/events, priority/high, backend]
---

# ⬜ T-040-be · Backend: Lounges and upgrades

**Parent:** [[T-040 Lounges and upgrades]] · **Feature:** [[Events During]] · **Side:** Backend · **Status:** To do · **Priority:** High · **Effort:** M (same as the parent until the team sizes it)

**Layer notes** (created with `node scripts/build-tree.mjs --scaffold <kind> T-040-be` when the team picks it up): [[T-040-be Backend Delivery|Backend Delivery]] · [[T-040-be Backend Integration|Backend Integration]] · [[T-040-be QA Backend|QA Backend]]

## What

The API side of [[T-040 Lounges and upgrades]]: the endpoints, data and rules its *What* describes. Record what shipped in [[T-040-be Backend Delivery]] and how to call it in [[T-040-be Backend Integration]], and roll both up into [[Events During Backend Delivery]] and [[Events During Backend Integration]].

## Design

- [[Screen Index#s53|s53]]

## Impact

Same as the parent's: [[T-040 Lounges and upgrades#Impact]].

## Definition of done

- [ ] Code per the backend's `CLAUDE.md` (every visibility decision through `RingAccessService`)
- [ ] `pnpm typecheck && pnpm test` green
- [ ] Backend Delivery and Backend Integration notes written and rolled up into the feature-level notes; QA Backend run; `pending` cleared or handed over
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-10-18 · created as the backend half of T-040
