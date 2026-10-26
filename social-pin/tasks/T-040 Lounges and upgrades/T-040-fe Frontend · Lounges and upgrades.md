---
type: task
id: T-040-fe
status: todo
priority: high
effort: M
feature: events-during
module: events
parent: T-040
labels: [frontend]
screens: [s53]
depends: [T-034, T-049, T-040-be]
affects: []
related: []
pending: []
created: 2026-10-18
updated: 2026-10-26
tags: [task, task/todo, module/events, priority/high, frontend]
---

# ⬜ T-040-fe · Frontend: Lounges and upgrades

**Parent:** [[T-040 Lounges and upgrades]] · **Feature:** [[Events During]] · **Side:** Frontend · **Status:** To do · **Priority:** High · **Effort:** M (same as the parent until the team sizes it)

**Layer notes** (created with `node scripts/build-tree.mjs --scaffold <kind> T-040-fe` when the team picks it up): [[T-040-fe Frontend Requirements|Frontend Requirements]] · [[T-040-fe Frontend Delivery|Frontend Delivery]] · [[T-040-fe QA Frontend|QA Frontend]]

## What

The client side of [[T-040 Lounges and upgrades]]: the screens below show what its *What* describes, built against [[Events During Backend Integration]] once the backend half ([[T-040-be Backend · Lounges and upgrades]]) is current. Write the asks in [[T-040-fe Frontend Requirements]] first; it is blocked by default until [[T-040 Story]] is approved.

## Design

- [[Screen Index#s53|s53]]

## Impact

Same as the parent's: [[T-040 Lounges and upgrades#Impact]].

## Definition of done

- [ ] Frontend Requirements written before asking for backend work; every row ✅ against the Backend Integration note
- [ ] Screens merged; Frontend Delivery note written and rolled up into [[Events During Frontend Delivery]]
- [ ] QA Frontend run on a named build; `pending` cleared or handed over
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-10-18 · created as the frontend half of T-040
