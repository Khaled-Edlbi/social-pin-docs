---
type: task
id: T-021-fe
status: todo
priority: critical
effort: M
feature: connections
module: connections
parent: T-021
labels: [frontend]
screens: [s44, s45]
depends: [T-021-be]
affects: []
related: []
pending: []
created: 2026-10-18
updated: 2026-10-26
tags: [task, task/todo, module/connections, priority/critical, frontend]
---

# ⬜ T-021-fe · Frontend: Connect request send, inbox, cancel

**Parent:** [[T-021 Connect request send, inbox, cancel]] · **Feature:** [[Connections]] · **Side:** Frontend · **Status:** To do · **Priority:** Critical · **Effort:** M (same as the parent until the team sizes it)

**Layer notes** (created with `node scripts/build-tree.mjs --scaffold <kind> T-021-fe` when the team picks it up): [[T-021-fe Frontend Requirements|Frontend Requirements]] · [[T-021-fe Frontend Delivery|Frontend Delivery]] · [[T-021-fe QA Frontend|QA Frontend]]

## What

The client side of [[T-021 Connect request send, inbox, cancel]]: the screens below show what its *What* describes, built against [[Connections Backend Integration]] once the backend half ([[T-021-be Backend · Connect request send, inbox, cancel]]) is current. Write the asks in [[T-021-fe Frontend Requirements]] first; it is blocked by default until [[T-021 Story]] is approved.

## Design

- [[Screen Index#s44|s44]], [[Screen Index#s45|s45]]

## Impact

Same as the parent's: [[T-021 Connect request send, inbox, cancel#Impact]].

## Definition of done

- [ ] Frontend Requirements written before asking for backend work; every row ✅ against the Backend Integration note
- [ ] Screens merged; Frontend Delivery note written and rolled up into [[Connections Frontend Delivery]]
- [ ] QA Frontend run on a named build; `pending` cleared or handed over
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-10-18 · created as the frontend half of T-021
