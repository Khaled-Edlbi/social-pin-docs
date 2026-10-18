---
type: task
id: T-048b-fe
status: todo
priority: P1
effort: M
feature: exhibitor
module: events
parent: T-048b
labels: [frontend]
screens: [s65]
depends: [T-009, T-036, T-048b-be]
affects: []
related: []
pending: []
created: 2026-10-18
updated: 2026-10-18
tags: [task, task/todo, module/events, priority/P1, frontend]
---

# ⬜ T-048b-fe · Frontend: Booth analytics and leads CSV export

**Parent:** [[T-048b Booth analytics and leads CSV export]] · **Feature:** [[Exhibitor]] · **Side:** Frontend · **Status:** To do · **Priority:** P1 · **Effort:** M (same as the parent until the team sizes it)

**Layer notes** (created with `node scripts/build-tree.mjs --scaffold <kind> T-048b-fe` when the team picks it up): [[T-048b-fe Frontend Requirements|Frontend Requirements]] · [[T-048b-fe Frontend Delivery|Frontend Delivery]] · [[T-048b-fe QA Frontend|QA Frontend]]

## What

The client side of [[T-048b Booth analytics and leads CSV export]]: the screens below show what its *What* describes, built against [[Exhibitor Backend Integration]] once the backend half ([[T-048b-be Backend · Booth analytics and leads CSV export]]) is current. Write the asks in [[T-048b-fe Frontend Requirements]] first; it is blocked by default until [[T-048b Story]] is approved.

## Design

- [[Screen Index#s65|s65]]

## Impact

Same as the parent's: [[T-048b Booth analytics and leads CSV export#Impact]].

## Definition of done

- [ ] Frontend Requirements written before asking for backend work; every row ✅ against the Backend Integration note
- [ ] Screens merged; Frontend Delivery note written and rolled up into [[Exhibitor Frontend Delivery]]
- [ ] QA Frontend run on a named build; `pending` cleared or handed over
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-10-18 · created as the frontend half of T-048b
