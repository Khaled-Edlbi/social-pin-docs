---
type: task
id: T-027-fe
status: todo
priority: high
effort: M
feature: ring-invitations
module: shared-rings
parent: T-027
labels: [frontend]
screens: [s74]
depends: [ND-04, T-026, T-027-be]
affects: []
related: []
pending: []
created: 2026-10-18
updated: 2026-10-26
tags: [task, task/todo, module/shared-rings, priority/high, frontend]
---

# ⬜ T-027-fe · Frontend: Join a Ring with a code or verified work email

**Parent:** [[T-027 Join a Ring with a code or verified work email]] · **Feature:** [[Ring Invitations & Join]] · **Side:** Frontend · **Status:** To do · **Priority:** High · **Effort:** M (same as the parent until the team sizes it)

**Layer notes** (created with `node scripts/build-tree.mjs --scaffold <kind> T-027-fe` when the team picks it up): [[T-027-fe Frontend Requirements|Frontend Requirements]] · [[T-027-fe Frontend Delivery|Frontend Delivery]] · [[T-027-fe QA Frontend|QA Frontend]]

## What

The client side of [[T-027 Join a Ring with a code or verified work email]]: the screens below show what its *What* describes, built against [[Ring Invitations & Join Backend Integration]] once the backend half ([[T-027-be Backend · Join a Ring with a code or verified work email]]) is current. Write the asks in [[T-027-fe Frontend Requirements]] first; it is blocked by default until [[T-027 Story]] is approved.

## Design

- [[Screen Index#s74|s74]]

## Impact

Same as the parent's: [[T-027 Join a Ring with a code or verified work email#Impact]].

## Definition of done

- [ ] Frontend Requirements written before asking for backend work; every row ✅ against the Backend Integration note
- [ ] Screens merged; Frontend Delivery note written and rolled up into [[Ring Invitations & Join Frontend Delivery]]
- [ ] QA Frontend run on a named build; `pending` cleared or handed over
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-10-18 · created as the frontend half of T-027
