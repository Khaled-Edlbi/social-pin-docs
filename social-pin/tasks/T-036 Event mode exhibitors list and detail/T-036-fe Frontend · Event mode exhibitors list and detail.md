---
type: task
id: T-036-fe
status: todo
priority: critical
effort: M
feature: events-during
module: events
parent: T-036
labels: [frontend]
screens: [s53, s54, s55]
depends: [T-033, T-036-be]
affects: []
related: []
pending: []
created: 2026-10-18
updated: 2026-10-26
tags: [task, task/todo, module/events, priority/critical, frontend]
---

# ⬜ T-036-fe · Frontend: Event mode exhibitors list and detail

**Parent:** [[T-036 Event mode exhibitors list and detail]] · **Feature:** [[Events During]] · **Side:** Frontend · **Status:** To do · **Priority:** Critical · **Effort:** M (same as the parent until the team sizes it)

**Layer notes** (created with `node scripts/build-tree.mjs --scaffold <kind> T-036-fe` when the team picks it up): [[T-036-fe Frontend Requirements|Frontend Requirements]] · [[T-036-fe Frontend Delivery|Frontend Delivery]] · [[T-036-fe QA Frontend|QA Frontend]]

## What

The client side of [[T-036 Event mode exhibitors list and detail]]: the screens below show what its *What* describes, built against [[Events During Backend Integration]] once the backend half ([[T-036-be Backend · Event mode exhibitors list and detail]]) is current. Write the asks in [[T-036-fe Frontend Requirements]] first; it is blocked by default until [[T-036 Story]] is approved.

## Design

- [[Screen Index#s53|s53]], [[Screen Index#s54|s54]], [[Screen Index#s55|s55]]

## Impact

Same as the parent's: [[T-036 Event mode exhibitors list and detail#Impact]].

## Definition of done

- [ ] Frontend Requirements written before asking for backend work; every row ✅ against the Backend Integration note
- [ ] Screens merged; Frontend Delivery note written and rolled up into [[Events During Frontend Delivery]]
- [ ] QA Frontend run on a named build; `pending` cleared or handed over
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-10-18 · created as the frontend half of T-036
