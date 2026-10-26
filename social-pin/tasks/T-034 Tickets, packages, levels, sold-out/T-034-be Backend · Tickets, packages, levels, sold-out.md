---
type: task
id: T-034-be
status: todo
priority: critical
effort: M
feature: events-before
module: events
parent: T-034
labels: [backend]
screens: [s50]
depends: [T-033]
affects: []
related: []
pending: []
created: 2026-10-18
updated: 2026-10-26
tags: [task, task/todo, module/events, priority/critical, backend]
---

# ⬜ T-034-be · Backend: Tickets, packages, levels, sold-out

**Parent:** [[T-034 Tickets, packages, levels, sold-out]] · **Feature:** [[Events Before]] · **Side:** Backend · **Status:** To do · **Priority:** Critical · **Effort:** M (same as the parent until the team sizes it)

**Layer notes** (created with `node scripts/build-tree.mjs --scaffold <kind> T-034-be` when the team picks it up): [[T-034-be Backend Delivery|Backend Delivery]] · [[T-034-be Backend Integration|Backend Integration]] · [[T-034-be QA Backend|QA Backend]]

## What

The API side of [[T-034 Tickets, packages, levels, sold-out]]: the endpoints, data and rules its *What* describes. Record what shipped in [[T-034-be Backend Delivery]] and how to call it in [[T-034-be Backend Integration]], and roll both up into [[Events Before Backend Delivery]] and [[Events Before Backend Integration]].

## Design

- [[Screen Index#s50|s50]]

## Impact

Same as the parent's: [[T-034 Tickets, packages, levels, sold-out#Impact]].

## Definition of done

- [ ] Code per the backend's `CLAUDE.md` (every visibility decision through `RingAccessService`)
- [ ] `pnpm typecheck && pnpm test` green
- [ ] Backend Delivery and Backend Integration notes written and rolled up into the feature-level notes; QA Backend run; `pending` cleared or handed over
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-10-18 · created as the backend half of T-034
