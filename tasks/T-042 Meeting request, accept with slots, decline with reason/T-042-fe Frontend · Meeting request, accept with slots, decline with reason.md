---
type: task
id: T-042-fe
status: todo
priority: critical
effort: L
feature: meetings
module: meetings
parent: T-042
labels: [frontend]
screens: [s59, s64]
depends: [T-041, T-042-be]
affects: []
related: []
pending: []
created: 2026-10-18
updated: 2026-10-19
tags: [task, task/todo, module/meetings, priority/critical, frontend]
---

# ⬜ T-042-fe · Frontend: Meeting request, accept with slots, decline with reason

**Parent:** [[T-042 Meeting request, accept with slots, decline with reason]] · **Feature:** [[Meetings]] · **Side:** Frontend · **Status:** To do · **Priority:** Critical · **Effort:** L (same as the parent until the team sizes it)

**Layer notes** (created with `node scripts/build-tree.mjs --scaffold <kind> T-042-fe` when the team picks it up): [[T-042-fe Frontend Requirements|Frontend Requirements]] · [[T-042-fe Frontend Delivery|Frontend Delivery]] · [[T-042-fe QA Frontend|QA Frontend]]

## What

The client side of [[T-042 Meeting request, accept with slots, decline with reason]]: the screens below show what its *What* describes, built against [[Meetings Backend Integration]] once the backend half ([[T-042-be Backend · Meeting request, accept with slots, decline with reason]]) is current. Write the asks in [[T-042-fe Frontend Requirements]] first; it is blocked by default until [[T-042 Story]] is approved.

## Design

- [[Screen Index#s59|s59]], [[Screen Index#s64|s64]]

## Impact

Same as the parent's: [[T-042 Meeting request, accept with slots, decline with reason#Impact]].

## Definition of done

- [ ] Frontend Requirements written before asking for backend work; every row ✅ against the Backend Integration note
- [ ] Screens merged; Frontend Delivery note written and rolled up into [[Meetings Frontend Delivery]]
- [ ] QA Frontend run on a named build; `pending` cleared or handed over
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-10-18 · created as the frontend half of T-042
