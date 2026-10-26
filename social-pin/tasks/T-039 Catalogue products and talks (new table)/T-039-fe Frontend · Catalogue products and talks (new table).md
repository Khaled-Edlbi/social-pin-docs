---
type: task
id: T-039-fe
status: todo
priority: high
effort: L
feature: events-during
module: events
parent: T-039
labels: [frontend]
screens: [s58]
depends: [T-036, T-039-be]
affects: []
related: []
pending: []
created: 2026-10-18
updated: 2026-10-26
tags: [task, task/todo, module/events, priority/high, frontend]
---

# ⬜ T-039-fe · Frontend: Catalogue products and talks (new table)

**Parent:** [[T-039 Catalogue products and talks (new table)]] · **Feature:** [[Events During]] · **Side:** Frontend · **Status:** To do · **Priority:** High · **Effort:** L (same as the parent until the team sizes it)

**Layer notes** (created with `node scripts/build-tree.mjs --scaffold <kind> T-039-fe` when the team picks it up): [[T-039-fe Frontend Requirements|Frontend Requirements]] · [[T-039-fe Frontend Delivery|Frontend Delivery]] · [[T-039-fe QA Frontend|QA Frontend]]

## What

The client side of [[T-039 Catalogue products and talks (new table)]]: the screens below show what its *What* describes, built against [[Events During Backend Integration]] once the backend half ([[T-039-be Backend · Catalogue products and talks (new table)]]) is current. Write the asks in [[T-039-fe Frontend Requirements]] first; it is blocked by default until [[T-039 Story]] is approved.

## Design

- [[Screen Index#s58|s58]]

## Impact

Same as the parent's: [[T-039 Catalogue products and talks (new table)#Impact]].

## Definition of done

- [ ] Frontend Requirements written before asking for backend work; every row ✅ against the Backend Integration note
- [ ] Screens merged; Frontend Delivery note written and rolled up into [[Events During Frontend Delivery]]
- [ ] QA Frontend run on a named build; `pending` cleared or handed over
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-10-18 · created as the frontend half of T-039
