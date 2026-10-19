---
type: task
id: T-063-fe
status: todo
priority: critical
effort: S
feature: error-contract
module: platform
parent: T-063
labels: [frontend]
screens: []
depends: [T-063-be]
affects: []
related: []
pending: []
created: 2026-10-18
updated: 2026-10-19
tags: [task, task/todo, module/platform, priority/critical, frontend]
---

# ⬜ T-063-fe · Frontend: Put the ErrorCode on the error body

**Parent:** [[T-063 Put the ErrorCode on the error body]] · **Feature:** [[Error Contract]] · **Side:** Frontend · **Status:** To do · **Priority:** Critical · **Effort:** S (same as the parent until the team sizes it)

**Layer notes** (created with `node scripts/build-tree.mjs --scaffold <kind> T-063-fe` when the team picks it up): [[T-063-fe Frontend Requirements|Frontend Requirements]] · [[T-063-fe Frontend Delivery|Frontend Delivery]] · [[T-063-fe QA Frontend|QA Frontend]]

## What

The client side of [[T-063 Put the ErrorCode on the error body]]: the screens below show what its *What* describes, built against [[Error Contract Backend Integration]] once the backend half ([[T-063-be Backend · Put the ErrorCode on the error body]]) is current. Write the asks in [[T-063-fe Frontend Requirements]] first; it is blocked by default until [[T-063 Story]] is approved.

## Design

- —

## Impact

Same as the parent's: [[T-063 Put the ErrorCode on the error body#Impact]].

## Definition of done

- [ ] Frontend Requirements written before asking for backend work; every row ✅ against the Backend Integration note
- [ ] Screens merged; Frontend Delivery note written and rolled up into [[Error Contract Frontend Delivery]]
- [ ] QA Frontend run on a named build; `pending` cleared or handed over
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-10-18 · created as the frontend half of T-063
