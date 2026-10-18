---
type: task
id: T-017-fe
status: todo
priority: P1
effort: S
feature: widgets
module: identity
parent: T-017
labels: [frontend]
screens: [s37]
depends: [T-017-be]
affects: []
related: []
pending: []
created: 2026-10-18
updated: 2026-10-18
tags: [task, task/todo, module/identity, priority/P1, frontend]
---

# ⬜ T-017-fe · Frontend: Extend WIDGET_TYPE to the design's list

**Parent:** [[T-017 Extend WIDGET_TYPE to the design's list]] · **Feature:** [[Widgets]] · **Side:** Frontend · **Status:** To do · **Priority:** P1 · **Effort:** S (same as the parent until the team sizes it)

**Layer notes** (created with `node scripts/build-tree.mjs --scaffold <kind> T-017-fe` when the team picks it up): [[T-017-fe Frontend Requirements|Frontend Requirements]] · [[T-017-fe Frontend Delivery|Frontend Delivery]] · [[T-017-fe QA Frontend|QA Frontend]]

## What

The client side of [[T-017 Extend WIDGET_TYPE to the design's list]]: the screens below show what its *What* describes, built against [[Widgets Backend Integration]] once the backend half ([[T-017-be Backend · Extend WIDGET_TYPE to the design's list]]) is current. Write the asks in [[T-017-fe Frontend Requirements]] first; it is blocked by default until [[T-017 Story]] is approved.

## Design

- [[Screen Index#s37|s37]]

## Impact

Same as the parent's: [[T-017 Extend WIDGET_TYPE to the design's list#Impact]].

## Definition of done

- [ ] Frontend Requirements written before asking for backend work; every row ✅ against the Backend Integration note
- [ ] Screens merged; Frontend Delivery note written and rolled up into [[Widgets Frontend Delivery]]
- [ ] QA Frontend run on a named build; `pending` cleared or handed over
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-10-18 · created as the frontend half of T-017
