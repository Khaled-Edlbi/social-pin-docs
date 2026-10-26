---
type: task
id: T-025-fe
status: todo
priority: medium
effort: M
feature: connections
module: connections
parent: T-025
labels: [frontend]
screens: [s47]
depends: [T-023, T-025-be]
affects: []
related: []
pending: []
created: 2026-10-18
updated: 2026-10-26
tags: [task, task/todo, module/connections, priority/medium, frontend]
---

# ⬜ T-025-fe · Frontend: Introduce a connection to another

**Parent:** [[T-025 Introduce a connection to another]] · **Feature:** [[Connections]] · **Side:** Frontend · **Status:** To do · **Priority:** Medium · **Effort:** M (same as the parent until the team sizes it)

**Layer notes** (created with `node scripts/build-tree.mjs --scaffold <kind> T-025-fe` when the team picks it up): [[T-025-fe Frontend Requirements|Frontend Requirements]] · [[T-025-fe Frontend Delivery|Frontend Delivery]] · [[T-025-fe QA Frontend|QA Frontend]]

## What

The client side of [[T-025 Introduce a connection to another]]: the screens below show what its *What* describes, built against [[Connections Backend Integration]] once the backend half ([[T-025-be Backend · Introduce a connection to another]]) is current. Write the asks in [[T-025-fe Frontend Requirements]] first; it is blocked by default until [[T-025 Story]] is approved.

## Design

- [[Screen Index#s47|s47]]

## Impact

Same as the parent's: [[T-025 Introduce a connection to another#Impact]].

## Definition of done

- [ ] Frontend Requirements written before asking for backend work; every row ✅ against the Backend Integration note
- [ ] Screens merged; Frontend Delivery note written and rolled up into [[Connections Frontend Delivery]]
- [ ] QA Frontend run on a named build; `pending` cleared or handed over
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-10-18 · created as the frontend half of T-025
