---
type: task
id: T-067-fe
status: todo
priority: critical
effort: M
feature: error-contract
module: platform
parent: T-067
labels: [frontend]
screens: []
depends: [T-067-be]
affects: []
related: []
pending: []
created: 2026-10-26
updated: 2026-10-26
tags: [task, task/todo, module/platform, priority/critical, frontend]
---

# ⬜ T-067-fe · Frontend: Split E_RING_01 and E_RING_PROFILE_03

**Parent:** [[T-067 Split E_RING_01 and E_RING_PROFILE_03]] · **Feature:** [[Error Contract]] · **Side:** Frontend · **Status:** To do · **Priority:** critical · **Effort:** M (same as the parent until the team sizes it)

**Layer notes** (created with `node scripts/build-tree.mjs --scaffold <kind> T-067-fe` when the team picks it up): [[T-067-fe Frontend Requirements|Frontend Requirements]] · [[T-067-fe Frontend Delivery|Frontend Delivery]] · [[T-067-fe QA Frontend|QA Frontend]]

## What

The client side of [[T-067 Split E_RING_01 and E_RING_PROFILE_03]]: the screens below show what its *What* describes, built against [[Error Contract Backend Integration]] once the backend half ([[T-067-be Backend · Split E_RING_01 and E_RING_PROFILE_03]]) is current. Write the asks in [[T-067-fe Frontend Requirements]] first; it is blocked by default until [[T-067 Story]] is approved.

## Design

- [[Screen Index#sNN|sNN]] …

## Impact

Same as the parent's: [[T-067 Split E_RING_01 and E_RING_PROFILE_03#Impact]].

## Definition of done

- [ ] Frontend Requirements written before asking for backend work; every row ✅ against the Backend Integration note
- [ ] Screens merged; Frontend Delivery note written and rolled up into [[Error Contract Frontend Delivery]]
- [ ] QA Frontend run on a named build; `pending` cleared or handed over
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-10-26 · created as the frontend half of T-067
