---
type: task
id: T-015-fe
status: todo
priority: medium
effort: M
feature: devices
module: platform
parent: T-015
labels: [frontend]
screens: [s75]
depends: [T-007, T-015-be]
affects: []
related: []
pending: []
created: 2026-10-18
updated: 2026-10-19
tags: [task, task/todo, module/platform, priority/medium, frontend]
---

# ⬜ T-015-fe · Frontend: Pair and revoke an NFC card

**Parent:** [[T-015 Pair and revoke an NFC card]] · **Feature:** [[Devices & NFC]] · **Side:** Frontend · **Status:** To do · **Priority:** Medium · **Effort:** M (same as the parent until the team sizes it)

**Layer notes** (created with `node scripts/build-tree.mjs --scaffold <kind> T-015-fe` when the team picks it up): [[T-015-fe Frontend Requirements|Frontend Requirements]] · [[T-015-fe Frontend Delivery|Frontend Delivery]] · [[T-015-fe QA Frontend|QA Frontend]]

## What

The client side of [[T-015 Pair and revoke an NFC card]]: the screens below show what its *What* describes, built against [[Devices & NFC Backend Integration]] once the backend half ([[T-015-be Backend · Pair and revoke an NFC card]]) is current. Write the asks in [[T-015-fe Frontend Requirements]] first; it is blocked by default until [[T-015 Story]] is approved.

## Design

- [[Screen Index#s75|s75]]

## Impact

Same as the parent's: [[T-015 Pair and revoke an NFC card#Impact]].

## Definition of done

- [ ] Frontend Requirements written before asking for backend work; every row ✅ against the Backend Integration note
- [ ] Screens merged; Frontend Delivery note written and rolled up into [[Devices & NFC Frontend Delivery]]
- [ ] QA Frontend run on a named build; `pending` cleared or handed over
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-10-18 · created as the frontend half of T-015
