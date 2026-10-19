---
type: task
id: T-034-fe
status: todo
priority: critical
effort: M
feature: events-before
module: events
parent: T-034
labels: [frontend]
screens: [s50]
depends: [T-033, T-034-be]
affects: []
related: []
pending: []
created: 2026-10-18
updated: 2026-10-19
tags: [task, task/todo, module/events, priority/critical, frontend]
---

# ⬜ T-034-fe · Frontend: Tickets, packages, levels, sold-out

**Parent:** [[T-034 Tickets, packages, levels, sold-out]] · **Feature:** [[Events Before]] · **Side:** Frontend · **Status:** To do · **Priority:** Critical · **Effort:** M (same as the parent until the team sizes it)

**Layer notes** (created with `node scripts/build-tree.mjs --scaffold <kind> T-034-fe` when the team picks it up): [[T-034-fe Frontend Requirements|Frontend Requirements]] · [[T-034-fe Frontend Delivery|Frontend Delivery]] · [[T-034-fe QA Frontend|QA Frontend]]

## What

The client side of [[T-034 Tickets, packages, levels, sold-out]]: the screens below show what its *What* describes, built against [[Events Before Backend Integration]] once the backend half ([[T-034-be Backend · Tickets, packages, levels, sold-out]]) is current. Write the asks in [[T-034-fe Frontend Requirements]] first; it is blocked by default until [[T-034 Story]] is approved.

## Design

- [[Screen Index#s50|s50]]

## Impact

Same as the parent's: [[T-034 Tickets, packages, levels, sold-out#Impact]].

## Definition of done

- [ ] Frontend Requirements written before asking for backend work; every row ✅ against the Backend Integration note
- [ ] Screens merged; Frontend Delivery note written and rolled up into [[Events Before Frontend Delivery]]
- [ ] QA Frontend run on a named build; `pending` cleared or handed over
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-10-18 · created as the frontend half of T-034
