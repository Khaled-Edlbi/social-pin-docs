---
type: task
id: T-004-fe
status: todo
priority: high
effort: S
feature: counts
module: identity
parent: T-004
labels: [frontend]
screens: [s14, s16]
depends: [T-004-be]
affects: []
related: []
pending: []
created: 2026-10-18
updated: 2026-10-19
tags: [task, task/todo, module/identity, priority/high, frontend]
---

# ⬜ T-004-fe · Frontend: Member count per Ring on list and detail

**Parent:** [[T-004 Member count per Ring on list and detail]] · **Feature:** [[Counts]] · **Side:** Frontend · **Status:** To do · **Priority:** High · **Effort:** S (same as the parent until the team sizes it)

**Layer notes** (created with `node scripts/build-tree.mjs --scaffold <kind> T-004-fe` when the team picks it up): [[T-004-fe Frontend Requirements|Frontend Requirements]] · [[T-004-fe Frontend Delivery|Frontend Delivery]] · [[T-004-fe QA Frontend|QA Frontend]]

## What

The client side of [[T-004 Member count per Ring on list and detail]]: the screens below show what its *What* describes, built against [[Counts Backend Integration]] once the backend half ([[T-004-be Backend · Member count per Ring on list and detail]]) is current. Write the asks in [[T-004-fe Frontend Requirements]] first; it is blocked by default until [[T-004 Story]] is approved.

## Design

- [[Screen Index#s14|s14]], [[Screen Index#s16|s16]]

## Impact

Same as the parent's: [[T-004 Member count per Ring on list and detail#Impact]].

## Definition of done

- [ ] Frontend Requirements written before asking for backend work; every row ✅ against the Backend Integration note
- [ ] Screens merged; Frontend Delivery note written and rolled up into [[Counts Frontend Delivery]]
- [ ] QA Frontend run on a named build; `pending` cleared or handed over
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-10-18 · created as the frontend half of T-004
