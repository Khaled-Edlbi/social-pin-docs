---
type: task
id: T-026-fe
status: todo
priority: high
effort: M
feature: ring-invitations
module: shared-rings
parent: T-026
labels: [frontend]
screens: [s17]
depends: [ND-04, T-026-be]
affects: []
related: []
pending: []
created: 2026-10-18
updated: 2026-10-26
tags: [task, task/todo, module/shared-rings, priority/high, frontend]
---

# ⬜ T-026-fe · Frontend: Ring invitations invite, review, decline

**Parent:** [[T-026 Ring invitations invite, review, decline]] · **Feature:** [[Ring Invitations & Join]] · **Side:** Frontend · **Status:** To do · **Priority:** High · **Effort:** M (same as the parent until the team sizes it)

**Layer notes** (created with `node scripts/build-tree.mjs --scaffold <kind> T-026-fe` when the team picks it up): [[T-026-fe Frontend Requirements|Frontend Requirements]] · [[T-026-fe Frontend Delivery|Frontend Delivery]] · [[T-026-fe QA Frontend|QA Frontend]]

## What

The client side of [[T-026 Ring invitations invite, review, decline]]: the screens below show what its *What* describes, built against [[Ring Invitations & Join Backend Integration]] once the backend half ([[T-026-be Backend · Ring invitations invite, review, decline]]) is current. Write the asks in [[T-026-fe Frontend Requirements]] first; it is blocked by default until [[T-026 Story]] is approved.

## Design

- [[Screen Index#s17|s17]]

## Impact

Same as the parent's: [[T-026 Ring invitations invite, review, decline#Impact]].

## Definition of done

- [ ] Frontend Requirements written before asking for backend work; every row ✅ against the Backend Integration note
- [ ] Screens merged; Frontend Delivery note written and rolled up into [[Ring Invitations & Join Frontend Delivery]]
- [ ] QA Frontend run on a named build; `pending` cleared or handed over
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-10-18 · created as the frontend half of T-026
