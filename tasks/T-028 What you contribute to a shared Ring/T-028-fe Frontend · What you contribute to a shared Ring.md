---
type: task
id: T-028-fe
status: todo
priority: medium
effort: L
feature: ring-invitations
module: shared-rings
parent: T-028
labels: [frontend]
screens: [s74]
depends: [T-027, T-028-be]
affects: []
related: []
pending: []
created: 2026-10-18
updated: 2026-10-19
tags: [task, task/todo, module/shared-rings, priority/medium, frontend]
---

# ⬜ T-028-fe · Frontend: What you contribute to a shared Ring

**Parent:** [[T-028 What you contribute to a shared Ring]] · **Feature:** [[Ring Invitations & Join]] · **Side:** Frontend · **Status:** To do · **Priority:** Medium · **Effort:** L (same as the parent until the team sizes it)

**Layer notes** (created with `node scripts/build-tree.mjs --scaffold <kind> T-028-fe` when the team picks it up): [[T-028-fe Frontend Requirements|Frontend Requirements]] · [[T-028-fe Frontend Delivery|Frontend Delivery]] · [[T-028-fe QA Frontend|QA Frontend]]

## What

The client side of [[T-028 What you contribute to a shared Ring]]: the screens below show what its *What* describes, built against [[Ring Invitations & Join Backend Integration]] once the backend half ([[T-028-be Backend · What you contribute to a shared Ring]]) is current. Write the asks in [[T-028-fe Frontend Requirements]] first; it is blocked by default until [[T-028 Story]] is approved.

## Design

- [[Screen Index#s74|s74]]

## Impact

Same as the parent's: [[T-028 What you contribute to a shared Ring#Impact]].

## Definition of done

- [ ] Frontend Requirements written before asking for backend work; every row ✅ against the Backend Integration note
- [ ] Screens merged; Frontend Delivery note written and rolled up into [[Ring Invitations & Join Frontend Delivery]]
- [ ] QA Frontend run on a named build; `pending` cleared or handed over
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-10-18 · created as the frontend half of T-028
