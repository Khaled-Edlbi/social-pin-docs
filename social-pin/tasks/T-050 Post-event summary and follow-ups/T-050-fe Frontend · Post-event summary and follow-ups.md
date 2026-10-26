---
type: task
id: T-050-fe
status: todo
priority: high
effort: M
feature: post-event
module: events
parent: T-050
labels: [frontend]
screens: [s62]
depends: [T-009, T-023, T-044, T-050-be]
affects: []
related: []
pending: []
created: 2026-10-18
updated: 2026-10-26
tags: [task, task/todo, module/events, priority/high, frontend]
---

# ⬜ T-050-fe · Frontend: Post-event summary and follow-ups

**Parent:** [[T-050 Post-event summary and follow-ups]] · **Feature:** [[Post-Event]] · **Side:** Frontend · **Status:** To do · **Priority:** High · **Effort:** M (same as the parent until the team sizes it)

**Layer notes** (created with `node scripts/build-tree.mjs --scaffold <kind> T-050-fe` when the team picks it up): [[T-050-fe Frontend Requirements|Frontend Requirements]] · [[T-050-fe Frontend Delivery|Frontend Delivery]] · [[T-050-fe QA Frontend|QA Frontend]]

## What

The client side of [[T-050 Post-event summary and follow-ups]]: the screens below show what its *What* describes, built against [[Post-Event Backend Integration]] once the backend half ([[T-050-be Backend · Post-event summary and follow-ups]]) is current. Write the asks in [[T-050-fe Frontend Requirements]] first; it is blocked by default until [[T-050 Story]] is approved.

## Design

- [[Screen Index#s62|s62]]

## Impact

Same as the parent's: [[T-050 Post-event summary and follow-ups#Impact]].

## Definition of done

- [ ] Frontend Requirements written before asking for backend work; every row ✅ against the Backend Integration note
- [ ] Screens merged; Frontend Delivery note written and rolled up into [[Post-Event Frontend Delivery]]
- [ ] QA Frontend run on a named build; `pending` cleared or handed over
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-10-18 · created as the frontend half of T-050
