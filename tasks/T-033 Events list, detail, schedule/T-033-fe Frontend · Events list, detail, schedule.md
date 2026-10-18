---
type: task
id: T-033-fe
status: todo
priority: P0
effort: L
feature: events-before
module: events
parent: T-033
labels: [frontend]
screens: [s48, s49]
depends: [T-033-be]
affects: []
related: []
pending: []
created: 2026-10-18
updated: 2026-10-18
tags: [task, task/todo, module/events, priority/P0, frontend]
---

# ⬜ T-033-fe · Frontend: Events list, detail, schedule

**Parent:** [[T-033 Events list, detail, schedule]] · **Feature:** [[Events Before]] · **Side:** Frontend · **Status:** To do · **Priority:** P0 · **Effort:** L (same as the parent until the team sizes it)

**Layer notes** (created with `node scripts/build-tree.mjs --scaffold <kind> T-033-fe` when the team picks it up): [[T-033-fe Frontend Requirements|Frontend Requirements]] · [[T-033-fe Frontend Delivery|Frontend Delivery]] · [[T-033-fe QA Frontend|QA Frontend]]

## What

The client side of [[T-033 Events list, detail, schedule]]: the screens below show what its *What* describes, built against [[Events Before Backend Integration]] once the backend half ([[T-033-be Backend · Events list, detail, schedule]]) is current. Write the asks in [[T-033-fe Frontend Requirements]] first; it is blocked by default until [[T-033 Story]] is approved.

## Design

- [[Screen Index#s48|s48]], [[Screen Index#s49|s49]]

## Impact

Same as the parent's: [[T-033 Events list, detail, schedule#Impact]].

## Definition of done

- [ ] Frontend Requirements written before asking for backend work; every row ✅ against the Backend Integration note
- [ ] Screens merged; Frontend Delivery note written and rolled up into [[Events Before Frontend Delivery]]
- [ ] QA Frontend run on a named build; `pending` cleared or handed over
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-10-18 · created as the frontend half of T-033
