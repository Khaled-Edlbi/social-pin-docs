---
type: task
id: T-041-fe
status: todo
priority: critical
effort: M
feature: meetings
module: meetings
parent: T-041
labels: [frontend]
screens: [s59, s64]
depends: [T-041-be]
affects: []
related: []
pending: []
created: 2026-10-18
updated: 2026-10-26
tags: [task, task/todo, module/meetings, priority/critical, frontend]
---

# ⬜ T-041-fe · Frontend: Availability slots CRUD

**Parent:** [[T-041 Availability slots CRUD]] · **Feature:** [[Meetings]] · **Side:** Frontend · **Status:** To do · **Priority:** Critical · **Effort:** M (same as the parent until the team sizes it)

**Layer notes** (created with `node scripts/build-tree.mjs --scaffold <kind> T-041-fe` when the team picks it up): [[T-041-fe Frontend Requirements|Frontend Requirements]] · [[T-041-fe Frontend Delivery|Frontend Delivery]] · [[T-041-fe QA Frontend|QA Frontend]]

## What

The client side of [[T-041 Availability slots CRUD]]: the screens below show what its *What* describes, built against [[Meetings Backend Integration]] once the backend half ([[T-041-be Backend · Availability slots CRUD]]) is current. Write the asks in [[T-041-fe Frontend Requirements]] first; it is blocked by default until [[T-041 Story]] is approved.

## Design

- [[Screen Index#s59|s59]], [[Screen Index#s64|s64]]

## Impact

Same as the parent's: [[T-041 Availability slots CRUD#Impact]].

## Definition of done

- [ ] Frontend Requirements written before asking for backend work; every row ✅ against the Backend Integration note
- [ ] Screens merged; Frontend Delivery note written and rolled up into [[Meetings Frontend Delivery]]
- [ ] QA Frontend run on a named build; `pending` cleared or handed over
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-10-18 · created as the frontend half of T-041
