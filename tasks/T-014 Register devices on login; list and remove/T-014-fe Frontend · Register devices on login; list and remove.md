---
type: task
id: T-014-fe
status: todo
priority: P1
effort: M
feature: devices
module: platform
parent: T-014
labels: [frontend]
screens: [s75]
depends: [T-014-be]
affects: []
related: []
pending: []
created: 2026-10-18
updated: 2026-10-18
tags: [task, task/todo, module/platform, priority/P1, frontend]
---

# ⬜ T-014-fe · Frontend: Register devices on login; list and remove

**Parent:** [[T-014 Register devices on login; list and remove]] · **Feature:** [[Devices & NFC]] · **Side:** Frontend · **Status:** To do · **Priority:** P1 · **Effort:** M (same as the parent until the team sizes it)

**Layer notes** (created with `node scripts/build-tree.mjs --scaffold <kind> T-014-fe` when the team picks it up): [[T-014-fe Frontend Requirements|Frontend Requirements]] · [[T-014-fe Frontend Delivery|Frontend Delivery]] · [[T-014-fe QA Frontend|QA Frontend]]

## What

The client side of [[T-014 Register devices on login; list and remove]]: the screens below show what its *What* describes, built against [[Devices & NFC Backend Integration]] once the backend half ([[T-014-be Backend · Register devices on login; list and remove]]) is current. Write the asks in [[T-014-fe Frontend Requirements]] first; it is blocked by default until [[T-014 Story]] is approved.

## Design

- [[Screen Index#s75|s75]]

## Impact

Same as the parent's: [[T-014 Register devices on login; list and remove#Impact]].

## Definition of done

- [ ] Frontend Requirements written before asking for backend work; every row ✅ against the Backend Integration note
- [ ] Screens merged; Frontend Delivery note written and rolled up into [[Devices & NFC Frontend Delivery]]
- [ ] QA Frontend run on a named build; `pending` cleared or handed over
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-10-18 · created as the frontend half of T-014
