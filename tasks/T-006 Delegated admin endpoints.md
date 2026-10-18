---
type: task
id: T-006
status: todo
priority: P1
effort: M
feature: delegated-admins
module: shared-rings
screens: [s26, s27]
depends: []
created: 2026-10-15
tags: [task, task/todo, module/shared-rings, priority/P1]
---

# ⬜ T-006 · Delegated admin endpoints

**Feature:** [[Delegated Admins]] · **Status:** To do · **Priority:** P1 · **Effort:** M (S < 1 day, M 1–3 days, L > 3 days)

## What

`GET/POST /rings/:ringId/admins`, `PATCH/DELETE …/admins/:userId`. Owner only. Reuse `assertCanAdminister` levels.

## Design

- [[Screen Index#s26|s26]] Edit · access
- [[Screen Index#s27|s27]] Edit · permissions

## Definition of done

- [ ] DTOs + entity + service + controller per [[Architecture#Build order for a new feature]]
- [ ] Every visibility decision goes through `RingAccessService` ([[Ring Access Model]])
- [ ] Spec covers each thrown domain error, each filter, and asserts secret fields are absent
- [ ] `pnpm typecheck && pnpm test` green
- [ ] Feature note updated (status, endpoints)

## Log

- 2026-10-15 · created from the backend vs design comparison ([[Status Report 2026-10-15]])
