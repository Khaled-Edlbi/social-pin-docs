---
type: task
id: T-027
status: blocked
priority: P1
effort: M
feature: ring-invitations
module: shared-rings
screens: [s74]
depends: [D-04, T-026]
created: 2026-10-15
tags: [task, task/blocked, module/shared-rings, priority/P1]
---

# ⛔ T-027 · Join a Ring with a code or verified work email

**Feature:** [[Ring Invitations & Join]] · **Status:** Blocked · **Priority:** P1 · **Effort:** M (S < 1 day, M 1–3 days, L > 3 days)

## What

Needs `joinPolicy`, join code and `requiredEmailDomain` on the Ring.

## Design

- [[Screen Index#s74|s74]] Join a company Ring

## Dependencies

- Waits on decision [[D-04 Ring settings]]
- Waits on [[T-026 Ring invitations invite, review, decline]]
- Unblocks [[T-028 What you contribute to a shared Ring]]

## Definition of done

- [ ] DTOs + entity + service + controller per [[Architecture#Build order for a new feature]]
- [ ] Every visibility decision goes through `RingAccessService` ([[Ring Access Model]])
- [ ] Spec covers each thrown domain error, each filter, and asserts secret fields are absent
- [ ] `pnpm typecheck && pnpm test` green
- [ ] Feature note updated (status, endpoints)

## Log

- 2026-10-15 · created from the backend vs design comparison ([[Status Report 2026-10-15]])
