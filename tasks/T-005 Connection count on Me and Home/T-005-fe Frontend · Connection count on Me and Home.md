---
type: task
id: T-005-fe
status: todo
priority: P1
effort: S
feature: counts
module: identity
parent: T-005
labels: [frontend]
screens: [s11, s68]
depends: [T-021, T-005-be]
affects: []
related: []
pending: []
created: 2026-10-18
updated: 2026-10-18
tags: [task, task/todo, module/identity, priority/P1, frontend]
---

# ⬜ T-005-fe · Frontend: Connection count on Me and Home

**Parent:** [[T-005 Connection count on Me and Home]] · **Feature:** [[Counts]] · **Side:** Frontend · **Status:** To do · **Priority:** P1 · **Effort:** S (same as the parent until the team sizes it)

**Layer notes** (created with `node scripts/build-tree.mjs --scaffold <kind> T-005-fe` when the team picks it up): [[T-005-fe Frontend Requirements|Frontend Requirements]] · [[T-005-fe Frontend Delivery|Frontend Delivery]] · [[T-005-fe QA Frontend|QA Frontend]]

## What

The client side of [[T-005 Connection count on Me and Home]]: the screens below show what its *What* describes, built against [[Counts Backend Integration]] once the backend half ([[T-005-be Backend · Connection count on Me and Home]]) is current. Write the asks in [[T-005-fe Frontend Requirements]] first; it is blocked by default until [[T-005 Story]] is approved.

## Design

- [[Screen Index#s11|s11]], [[Screen Index#s68|s68]]

## Impact

Same as the parent's: [[T-005 Connection count on Me and Home#Impact]].

## Definition of done

- [ ] Frontend Requirements written before asking for backend work; every row ✅ against the Backend Integration note
- [ ] Screens merged; Frontend Delivery note written and rolled up into [[Counts Frontend Delivery]]
- [ ] QA Frontend run on a named build; `pending` cleared or handed over
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-10-18 · created as the frontend half of T-005
