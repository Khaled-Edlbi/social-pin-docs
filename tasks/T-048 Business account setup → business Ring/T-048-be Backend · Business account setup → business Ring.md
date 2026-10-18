---
type: task
id: T-048-be
status: todo
priority: P1
effort: L
feature: exhibitor
module: events
parent: T-048
labels: [backend]
screens: [s63]
depends: [T-029]
affects: []
related: []
pending: []
created: 2026-10-18
updated: 2026-10-18
tags: [task, task/todo, module/events, priority/P1, backend]
---

# ⬜ T-048-be · Backend: Business account setup → business Ring

**Parent:** [[T-048 Business account setup → business Ring]] · **Feature:** [[Exhibitor]] · **Side:** Backend · **Status:** To do · **Priority:** P1 · **Effort:** L (same as the parent until the team sizes it)

**Layer notes** (created with `node scripts/build-tree.mjs --scaffold <kind> T-048-be` when the team picks it up): [[T-048-be Backend Delivery|Backend Delivery]] · [[T-048-be Backend Integration|Backend Integration]] · [[T-048-be QA Backend|QA Backend]]

## What

The API side of [[T-048 Business account setup → business Ring]]: the endpoints, data and rules its *What* describes. Record what shipped in [[T-048-be Backend Delivery]] and how to call it in [[T-048-be Backend Integration]], and roll both up into [[Exhibitor Backend Delivery]] and [[Exhibitor Backend Integration]].

## Design

- [[Screen Index#s63|s63]]

## Impact

Same as the parent's: [[T-048 Business account setup → business Ring#Impact]].

## Definition of done

- [ ] Code per the backend's `CLAUDE.md` (every visibility decision through `RingAccessService`)
- [ ] `pnpm typecheck && pnpm test` green
- [ ] Backend Delivery and Backend Integration notes written and rolled up into the feature-level notes; QA Backend run; `pending` cleared or handed over
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-10-18 · created as the backend half of T-048
