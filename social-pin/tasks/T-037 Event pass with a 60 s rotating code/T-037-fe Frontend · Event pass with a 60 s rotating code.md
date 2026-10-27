---
type: task
id: T-037-fe
status: todo
priority: high
effort: M
feature: events-during
module: events
parent: T-037
labels: [frontend]
screens: [s56]
depends: ["T-037-be"]
affects: []
related: ["Event Ring Auto-creation Story", "Badge & QR Story"]
pending: []
created: 2026-10-18
updated: 2026-10-27
tags: [task, task/todo, module/events, priority/high, frontend]
---

# ⬜ T-037-fe · Frontend: Event pass with a 60 s rotating code

**Parent:** [[T-037 Event pass with a 60 s rotating code]] · **Feature:** [[Events During]] · **Side:** Frontend · **Status:** To do · **Priority:** High · **Effort:** M (same as the parent until the team sizes it)

**Layer notes** (created with `node scripts/build-tree.mjs --scaffold <kind> T-037-fe` when the team picks it up): [[T-037-fe Frontend Requirements|Frontend Requirements]] · [[T-037-fe Frontend Delivery|Frontend Delivery]] · [[T-037-fe QA Frontend|QA Frontend]]

## What

The client side of [[T-037 Event pass with a 60 s rotating code]]: the screens below show what its *What* describes, built against [[Events During Backend Integration]] once the backend half ([[T-037-be Backend · Event pass with a 60 s rotating code]]) is current. Write the asks in [[T-037-fe Frontend Requirements]] first; it is blocked by default until [[T-037 Story]] is approved.

## Design

- [[Screen Index#s56|s56]]

## Impact

Same as the parent's: [[T-037 Event pass with a 60 s rotating code#Impact]].

## Definition of done

- [ ] Frontend Requirements written before asking for backend work; every row ✅ against the Backend Integration note
- [ ] Screens merged; Frontend Delivery note written and rolled up into [[Events During Frontend Delivery]]
- [ ] QA Frontend run on a named build; `pending` cleared or handed over
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-10-18 · created as the frontend half of T-037
