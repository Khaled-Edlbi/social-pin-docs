---
type: task
id: T-015-be
status: todo
priority: P2
effort: M
feature: devices
module: platform
parent: T-015
labels: [backend]
screens: [s75]
depends: [T-007]
affects: []
related: []
pending: []
created: 2026-10-18
updated: 2026-10-18
tags: [task, task/todo, module/platform, priority/P2, backend]
---

# ⬜ T-015-be · Backend: Pair and revoke an NFC card

**Parent:** [[T-015 Pair and revoke an NFC card]] · **Feature:** [[Devices & NFC]] · **Side:** Backend · **Status:** To do · **Priority:** P2 · **Effort:** M (same as the parent until the team sizes it)

**Layer notes** (created with `node scripts/build-tree.mjs --scaffold <kind> T-015-be` when the team picks it up): [[T-015-be Backend Delivery|Backend Delivery]] · [[T-015-be Backend Integration|Backend Integration]] · [[T-015-be QA Backend|QA Backend]]

## What

The API side of [[T-015 Pair and revoke an NFC card]]: the endpoints, data and rules its *What* describes. Record what shipped in [[T-015-be Backend Delivery]] and how to call it in [[T-015-be Backend Integration]], and roll both up into [[Devices & NFC Backend Delivery]] and [[Devices & NFC Backend Integration]].

## Design

- [[Screen Index#s75|s75]]

## Impact

Same as the parent's: [[T-015 Pair and revoke an NFC card#Impact]].

## Definition of done

- [ ] Code per the backend's `CLAUDE.md` (every visibility decision through `RingAccessService`)
- [ ] `pnpm typecheck && pnpm test` green
- [ ] Backend Delivery and Backend Integration notes written and rolled up into the feature-level notes; QA Backend run; `pending` cleared or handed over
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-10-18 · created as the backend half of T-015
