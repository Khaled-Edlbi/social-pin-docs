---
type: task
id: T-018-fe
status: todo
priority: P1
effort: M
feature: widgets
module: identity
parent: T-018
labels: [frontend]
screens: [s36, s37]
depends: [T-017, D-03, T-018-be]
affects: []
related: []
pending: []
created: 2026-10-18
updated: 2026-10-18
tags: [task, task/todo, module/identity, priority/P1, frontend]
---

# ⬜ T-018-fe · Frontend: Widget CRUD on the projection

**Parent:** [[T-018 Widget CRUD on the projection]] · **Feature:** [[Widgets]] · **Side:** Frontend · **Status:** To do · **Priority:** P1 · **Effort:** M (same as the parent until the team sizes it)

**Layer notes** (created with `node scripts/build-tree.mjs --scaffold <kind> T-018-fe` when the team picks it up): [[T-018-fe Frontend Requirements|Frontend Requirements]] · [[T-018-fe Frontend Delivery|Frontend Delivery]] · [[T-018-fe QA Frontend|QA Frontend]]

## What

The client side of [[T-018 Widget CRUD on the projection]]: the screens below show what its *What* describes, built against [[Widgets Backend Integration]] once the backend half ([[T-018-be Backend · Widget CRUD on the projection]]) is current. Write the asks in [[T-018-fe Frontend Requirements]] first; it is blocked by default until [[T-018 Story]] is approved.

## Design

- [[Screen Index#s36|s36]], [[Screen Index#s37|s37]]

## Impact

Same as the parent's: [[T-018 Widget CRUD on the projection#Impact]].

## Definition of done

- [ ] Frontend Requirements written before asking for backend work; every row ✅ against the Backend Integration note
- [ ] Screens merged; Frontend Delivery note written and rolled up into [[Widgets Frontend Delivery]]
- [ ] QA Frontend run on a named build; `pending` cleared or handed over
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-10-18 · created as the frontend half of T-018
