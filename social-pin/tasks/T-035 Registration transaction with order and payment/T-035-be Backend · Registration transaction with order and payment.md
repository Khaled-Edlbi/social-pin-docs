---
type: task
id: T-035-be
status: todo
priority: critical
effort: L
feature: events-before
module: events
parent: T-035
labels: [backend]
screens: [s51, s52]
depends: ["T-034"]
affects: []
related: ["Payments & Orders Story"]
pending: []
created: 2026-10-18
updated: 2026-10-27
tags: [task, task/todo, module/events, priority/critical, backend]
---

# ⬜ T-035-be · Backend: Registration transaction with order and payment

**Parent:** [[T-035 Registration transaction with order and payment]] · **Feature:** [[Events Before]] · **Side:** Backend · **Status:** To do · **Priority:** Critical · **Effort:** L (same as the parent until the team sizes it)

**Layer notes** (created with `node scripts/build-tree.mjs --scaffold <kind> T-035-be` when the team picks it up): [[T-035-be Backend Delivery|Backend Delivery]] · [[T-035-be Backend Integration|Backend Integration]] · [[T-035-be QA Backend|QA Backend]]

## What

The API side of [[T-035 Registration transaction with order and payment]]: the endpoints, data and rules its *What* describes. Record what shipped in [[T-035-be Backend Delivery]] and how to call it in [[T-035-be Backend Integration]], and roll both up into [[Events Before Backend Delivery]] and [[Events Before Backend Integration]].

## Design

- [[Screen Index#s51|s51]], [[Screen Index#s52|s52]]

## Impact

Same as the parent's: [[T-035 Registration transaction with order and payment#Impact]].

## Definition of done

- [ ] Code per the backend's `CLAUDE.md` (every visibility decision through `RingAccessService`)
- [ ] `pnpm typecheck && pnpm test` green
- [ ] Backend Delivery and Backend Integration notes written and rolled up into the feature-level notes; QA Backend run; `pending` cleared or handed over
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-10-18 · created as the backend half of T-035
