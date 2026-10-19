---
type: task
id: T-044-fe
status: todo
priority: critical
effort: M
feature: meetings
module: meetings
parent: T-044
labels: [frontend]
screens: [s61, s66, s67]
depends: [T-042, T-044-be]
affects: []
related: []
pending: []
created: 2026-10-18
updated: 2026-10-19
tags: [task, task/todo, module/meetings, priority/critical, frontend]
---

# ⬜ T-044-fe · Frontend: My meetings, calendar, detail, reschedule, cancel

**Parent:** [[T-044 My meetings, calendar, detail, reschedule, cancel]] · **Feature:** [[Meetings]] · **Side:** Frontend · **Status:** To do · **Priority:** Critical · **Effort:** M (same as the parent until the team sizes it)

**Layer notes** (created with `node scripts/build-tree.mjs --scaffold <kind> T-044-fe` when the team picks it up): [[T-044-fe Frontend Requirements|Frontend Requirements]] · [[T-044-fe Frontend Delivery|Frontend Delivery]] · [[T-044-fe QA Frontend|QA Frontend]]

## What

The client side of [[T-044 My meetings, calendar, detail, reschedule, cancel]]: the screens below show what its *What* describes, built against [[Meetings Backend Integration]] once the backend half ([[T-044-be Backend · My meetings, calendar, detail, reschedule, cancel]]) is current. Write the asks in [[T-044-fe Frontend Requirements]] first; it is blocked by default until [[T-044 Story]] is approved.

## Design

- [[Screen Index#s61|s61]], [[Screen Index#s66|s66]], [[Screen Index#s67|s67]]

## Impact

Same as the parent's: [[T-044 My meetings, calendar, detail, reschedule, cancel#Impact]].

## Definition of done

- [ ] Frontend Requirements written before asking for backend work; every row ✅ against the Backend Integration note
- [ ] Screens merged; Frontend Delivery note written and rolled up into [[Meetings Frontend Delivery]]
- [ ] QA Frontend run on a named build; `pending` cleared or handed over
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-10-18 · created as the frontend half of T-044
