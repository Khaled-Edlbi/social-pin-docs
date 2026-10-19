---
type: task
id: T-033-be
status: todo
priority: critical
effort: L
feature: events-before
module: events
parent: T-033
labels: [backend]
screens: [s48, s49]
depends: []
affects: []
related: []
pending: []
created: 2026-10-18
updated: 2026-10-19
tags: [task, task/todo, module/events, priority/critical, backend]
---

# ⬜ T-033-be · Backend: Events list, detail, schedule

**Parent:** [[T-033 Events list, detail, schedule]] · **Feature:** [[Events Before]] · **Side:** Backend · **Status:** To do · **Priority:** Critical · **Effort:** L (same as the parent until the team sizes it)

**Layer notes** (created with `node scripts/build-tree.mjs --scaffold <kind> T-033-be` when the team picks it up): [[T-033-be Backend Delivery|Backend Delivery]] · [[T-033-be Backend Integration|Backend Integration]] · [[T-033-be QA Backend|QA Backend]]

## What

The API side of [[T-033 Events list, detail, schedule]]: the endpoints, data and rules its *What* describes. Record what shipped in [[T-033-be Backend Delivery]] and how to call it in [[T-033-be Backend Integration]], and roll both up into [[Events Before Backend Delivery]] and [[Events Before Backend Integration]].

## Design

- [[Screen Index#s48|s48]], [[Screen Index#s49|s49]]

## Impact

Same as the parent's: [[T-033 Events list, detail, schedule#Impact]].

## Definition of done

- [ ] Code per the backend's `CLAUDE.md` (every visibility decision through `RingAccessService`)
- [ ] `pnpm typecheck && pnpm test` green
- [ ] Backend Delivery and Backend Integration notes written and rolled up into the feature-level notes; QA Backend run; `pending` cleared or handed over
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-10-18 · created as the backend half of T-033
