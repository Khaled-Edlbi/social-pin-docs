---
type: task
id: T-NNN-fe
status: todo
priority: P1
effort: M
feature: <feature id>
module: <module id>
parent: T-NNN
labels: [frontend]
screens: []
depends: [T-NNN-be]
affects: []
related: []
pending: []
created: <date>
updated: <date>
tags: [task, task/todo, module/<module id>, priority/P1, frontend]
---

# ⬜ T-NNN-fe · Frontend: <Title>

**Parent:** [[T-NNN <Title>]] · **Feature:** [[<Feature name>]] · **Side:** Frontend · **Status:** To do · **Priority:** <priority> · **Effort:** <effort> (same as the parent until the team sizes it)

**Layer notes** (created with `node scripts/build-tree.mjs --scaffold <kind> T-NNN-fe` when the team picks it up): [[T-NNN-fe Frontend Requirements|Frontend Requirements]] · [[T-NNN-fe Frontend Delivery|Frontend Delivery]] · [[T-NNN-fe QA Frontend|QA Frontend]]

## What

The client side of [[T-NNN <Title>]]: the screens below show what its *What* describes, built against [[<Feature name> Backend Integration]] once the backend half ([[T-NNN-be Backend · <Title>]]) is current. Write the asks in [[T-NNN-fe Frontend Requirements]] first; it is blocked by default until [[T-NNN Story]] is approved.

## Design

- <screens>

## Impact

Same as the parent's: [[T-NNN <Title>#Impact]].

## Definition of done

- [ ] Frontend Requirements written before asking for backend work; every row ✅ against the Backend Integration note
- [ ] Screens merged; Frontend Delivery note written and rolled up into [[<Feature name> Frontend Delivery]]
- [ ] QA Frontend run on a named build; `pending` cleared or handed over
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- <date> · created as the frontend half of T-NNN
