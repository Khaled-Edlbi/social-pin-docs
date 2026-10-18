---
type: task
id: T-019-be
status: todo
priority: P1
effort: L
feature: linked-accounts
module: platform
parent: T-019
labels: [backend]
screens: [s01, s04, s68]
depends: []
affects: []
related: []
pending: []
created: 2026-10-18
updated: 2026-10-18
tags: [task, task/todo, module/platform, priority/P1, backend]
---

# ⬜ T-019-be · Backend: LinkedIn OAuth link, unlink, login

**Parent:** [[T-019 LinkedIn OAuth link, unlink, login]] · **Feature:** [[Linked Accounts (OAuth)]] · **Side:** Backend · **Status:** To do · **Priority:** P1 · **Effort:** L (same as the parent until the team sizes it)

**Layer notes** (created with `node scripts/build-tree.mjs --scaffold <kind> T-019-be` when the team picks it up): [[T-019-be Backend Delivery|Backend Delivery]] · [[T-019-be Backend Integration|Backend Integration]] · [[T-019-be QA Backend|QA Backend]]

## What

The API side of [[T-019 LinkedIn OAuth link, unlink, login]]: the endpoints, data and rules its *What* describes. Record what shipped in [[T-019-be Backend Delivery]] and how to call it in [[T-019-be Backend Integration]], and roll both up into [[Linked Accounts (OAuth) Backend Delivery]] and [[Linked Accounts (OAuth) Backend Integration]].

## Design

- [[Screen Index#s01|s01]], [[Screen Index#s04|s04]], [[Screen Index#s68|s68]]

## Impact

Same as the parent's: [[T-019 LinkedIn OAuth link, unlink, login#Impact]].

## Definition of done

- [ ] Code per the backend's `CLAUDE.md` (every visibility decision through `RingAccessService`)
- [ ] `pnpm typecheck && pnpm test` green
- [ ] Backend Delivery and Backend Integration notes written and rolled up into the feature-level notes; QA Backend run; `pending` cleared or handed over
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-10-18 · created as the backend half of T-019
