---
type: task
id: T-027-be
status: todo
priority: high
effort: M
feature: ring-invitations
module: shared-rings
parent: T-027
labels: [backend]
screens: [s74]
depends: [D-04, T-026]
affects: []
related: []
pending: []
created: 2026-10-18
updated: 2026-10-19
tags: [task, task/todo, module/shared-rings, priority/high, backend]
---

# ⬜ T-027-be · Backend: Join a Ring with a code or verified work email

**Parent:** [[T-027 Join a Ring with a code or verified work email]] · **Feature:** [[Ring Invitations & Join]] · **Side:** Backend · **Status:** To do · **Priority:** High · **Effort:** M (same as the parent until the team sizes it)

**Layer notes** (created with `node scripts/build-tree.mjs --scaffold <kind> T-027-be` when the team picks it up): [[T-027-be Backend Delivery|Backend Delivery]] · [[T-027-be Backend Integration|Backend Integration]] · [[T-027-be QA Backend|QA Backend]]

## What

The API side of [[T-027 Join a Ring with a code or verified work email]]: the endpoints, data and rules its *What* describes. Record what shipped in [[T-027-be Backend Delivery]] and how to call it in [[T-027-be Backend Integration]], and roll both up into [[Ring Invitations & Join Backend Delivery]] and [[Ring Invitations & Join Backend Integration]].

## Design

- [[Screen Index#s74|s74]]

## Impact

Same as the parent's: [[T-027 Join a Ring with a code or verified work email#Impact]].

## Definition of done

- [ ] Code per the backend's `CLAUDE.md` (every visibility decision through `RingAccessService`)
- [ ] `pnpm typecheck && pnpm test` green
- [ ] Backend Delivery and Backend Integration notes written and rolled up into the feature-level notes; QA Backend run; `pending` cleared or handed over
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-10-18 · created as the backend half of T-027
