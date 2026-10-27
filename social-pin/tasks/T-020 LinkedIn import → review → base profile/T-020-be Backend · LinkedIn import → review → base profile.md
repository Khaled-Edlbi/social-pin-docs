---
type: task
id: T-020-be
status: todo
priority: high
effort: L
feature: onboarding-imports
module: identity
parent: T-020
labels: [backend]
screens: [s04, s05]
depends: ["ND-02"]
affects: []
related: ["Linked Accounts (OAuth) Story"]
pending: []
created: 2026-10-18
updated: 2026-10-27
tags: [task, task/todo, module/identity, priority/high, backend]
---

# ⬜ T-020-be · Backend: LinkedIn import → review → base profile

**Parent:** [[T-020 LinkedIn import → review → base profile]] · **Feature:** [[Onboarding Imports]] · **Side:** Backend · **Status:** To do · **Priority:** High · **Effort:** L (same as the parent until the team sizes it)

**Layer notes** (created with `node scripts/build-tree.mjs --scaffold <kind> T-020-be` when the team picks it up): [[T-020-be Backend Delivery|Backend Delivery]] · [[T-020-be Backend Integration|Backend Integration]] · [[T-020-be QA Backend|QA Backend]]

## What

The API side of [[T-020 LinkedIn import → review → base profile]]: the endpoints, data and rules its *What* describes. Record what shipped in [[T-020-be Backend Delivery]] and how to call it in [[T-020-be Backend Integration]], and roll both up into [[Onboarding Imports Backend Delivery]] and [[Onboarding Imports Backend Integration]].

## Design

- [[Screen Index#s04|s04]], [[Screen Index#s05|s05]]

## Impact

Same as the parent's: [[T-020 LinkedIn import → review → base profile#Impact]].

## Definition of done

- [ ] Code per the backend's `CLAUDE.md` (every visibility decision through `RingAccessService`)
- [ ] `pnpm typecheck && pnpm test` green
- [ ] Backend Delivery and Backend Integration notes written and rolled up into the feature-level notes; QA Backend run; `pending` cleared or handed over
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-10-18 · created as the backend half of T-020
