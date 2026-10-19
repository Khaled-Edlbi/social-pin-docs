---
type: task
id: T-006-fe
status: todo
priority: high
effort: M
feature: delegated-admins
module: shared-rings
parent: T-006
labels: [frontend]
screens: [s26, s27]
depends: [T-006-be]
affects: []
related: []
pending: []
created: 2026-10-18
updated: 2026-10-19
tags: [task, task/todo, module/shared-rings, priority/high, frontend]
---

# ⬜ T-006-fe · Frontend: Delegated admin endpoints

**Parent:** [[T-006 Delegated admin endpoints]] · **Feature:** [[Delegated Admins]] · **Side:** Frontend · **Status:** To do · **Priority:** High · **Effort:** M (same as the parent until the team sizes it)

**Layer notes** (created with `node scripts/build-tree.mjs --scaffold <kind> T-006-fe` when the team picks it up): [[T-006-fe Frontend Requirements|Frontend Requirements]] · [[T-006-fe Frontend Delivery|Frontend Delivery]] · [[T-006-fe QA Frontend|QA Frontend]]

## What

The client side of [[T-006 Delegated admin endpoints]]: the screens below show what its *What* describes, built against [[Delegated Admins Backend Integration]] once the backend half ([[T-006-be Backend · Delegated admin endpoints]]) is current. Write the asks in [[T-006-fe Frontend Requirements]] first; it is blocked by default until [[T-006 Story]] is approved.

## Design

- [[Screen Index#s26|s26]], [[Screen Index#s27|s27]]

## Impact

Same as the parent's: [[T-006 Delegated admin endpoints#Impact]].

## Definition of done

- [ ] Frontend Requirements written before asking for backend work; every row ✅ against the Backend Integration note
- [ ] Screens merged; Frontend Delivery note written and rolled up into [[Delegated Admins Frontend Delivery]]
- [ ] QA Frontend run on a named build; `pending` cleared or handed over
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-10-18 · created as the frontend half of T-006
