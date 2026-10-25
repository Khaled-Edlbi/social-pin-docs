---
type: task
id: T-027
status: blocked
priority: high
effort: M
feature: ring-invitations
module: shared-rings
screens: [s74]
depends: [D-04, T-026]
created: 2026-10-15
updated: 2026-10-19
tags: [task, task/blocked, module/shared-rings, priority/high]
---

# ⛔ T-027 · Join a Ring with a code or verified work email

> ⚠ Affected by [[DR-04 Ring settings at launch and their defaults]] (2026-10-25): D-04 decided, joining with a code is in the launch set (default: code or invite, approve each one); the required work email domain comes later, with Companies, so the verified-work-email half waits for it.

**Feature:** [[Ring Invitations & Join]] · **Status:** Blocked · **Priority:** High · **Effort:** M (S < 1 day, M 1–3 days, L > 3 days)

**Sub-tasks:** [[T-027-fe Frontend · Join a Ring with a code or verified work email|Frontend]] · [[T-027-be Backend · Join a Ring with a code or verified work email|Backend]] · **Story:** [[T-027 Story]]

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
