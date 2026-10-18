---
type: task
id: T-035-fe
status: todo
priority: P0
effort: L
feature: events-before
module: events
parent: T-035
labels: [frontend]
screens: [s51, s52]
depends: [T-034, T-047, T-035-be]
affects: []
related: []
pending: []
created: 2026-10-18
updated: 2026-10-18
tags: [task, task/todo, module/events, priority/P0, frontend]
---

# ⬜ T-035-fe · Frontend: Registration transaction with order and payment

**Parent:** [[T-035 Registration transaction with order and payment]] · **Feature:** [[Events Before]] · **Side:** Frontend · **Status:** To do · **Priority:** P0 · **Effort:** L (same as the parent until the team sizes it)

**Layer notes** (created with `node scripts/build-tree.mjs --scaffold <kind> T-035-fe` when the team picks it up): [[T-035-fe Frontend Requirements|Frontend Requirements]] · [[T-035-fe Frontend Delivery|Frontend Delivery]] · [[T-035-fe QA Frontend|QA Frontend]]

## What

The client side of [[T-035 Registration transaction with order and payment]]: the screens below show what its *What* describes, built against [[Events Before Backend Integration]] once the backend half ([[T-035-be Backend · Registration transaction with order and payment]]) is current. Write the asks in [[T-035-fe Frontend Requirements]] first; it is blocked by default until [[T-035 Story]] is approved.

## Design

- [[Screen Index#s51|s51]], [[Screen Index#s52|s52]]

## Impact

Same as the parent's: [[T-035 Registration transaction with order and payment#Impact]].

## Definition of done

- [ ] Frontend Requirements written before asking for backend work; every row ✅ against the Backend Integration note
- [ ] Screens merged; Frontend Delivery note written and rolled up into [[Events Before Frontend Delivery]]
- [ ] QA Frontend run on a named build; `pending` cleared or handed over
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-10-18 · created as the frontend half of T-035
