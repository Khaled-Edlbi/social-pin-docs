---
type: task
id: T-038-fe
status: todo
priority: high
effort: M
feature: events-during
module: events
parent: T-038
labels: [frontend]
screens: [s57]
depends: [T-036, T-038-be]
affects: []
related: []
pending: []
created: 2026-10-18
updated: 2026-10-26
tags: [task, task/todo, module/events, priority/high, frontend]
---

# ⬜ T-038-fe · Frontend: Floor map and booths

**Parent:** [[T-038 Floor map and booths]] · **Feature:** [[Events During]] · **Side:** Frontend · **Status:** To do · **Priority:** High · **Effort:** M (same as the parent until the team sizes it)

**Layer notes** (created with `node scripts/build-tree.mjs --scaffold <kind> T-038-fe` when the team picks it up): [[T-038-fe Frontend Requirements|Frontend Requirements]] · [[T-038-fe Frontend Delivery|Frontend Delivery]] · [[T-038-fe QA Frontend|QA Frontend]]

## What

The client side of [[T-038 Floor map and booths]]: the screens below show what its *What* describes, built against [[Events During Backend Integration]] once the backend half ([[T-038-be Backend · Floor map and booths]]) is current. Write the asks in [[T-038-fe Frontend Requirements]] first; it is blocked by default until [[T-038 Story]] is approved.

## Design

- [[Screen Index#s57|s57]]

## Impact

Same as the parent's: [[T-038 Floor map and booths#Impact]].

## Definition of done

- [ ] Frontend Requirements written before asking for backend work; every row ✅ against the Backend Integration note
- [ ] Screens merged; Frontend Delivery note written and rolled up into [[Events During Frontend Delivery]]
- [ ] QA Frontend run on a named build; `pending` cleared or handed over
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-10-18 · created as the frontend half of T-038
