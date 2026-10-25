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
updated: 2026-10-25
owner: "omar"
tags: [task, task/blocked, module/shared-rings, priority/high]
---

# ⛔ T-027 · Join a Ring with a code or verified work email

**Feature:** [[Ring Invitations & Join]] · **Status:** Blocked · **Priority:** High · **Effort:** M (S < 1 day, M 1–3 days, L > 3 days)

**Sub-tasks:** [[T-027-fe Frontend · Join a Ring with a code or verified work email|Frontend]] · [[T-027-be Backend · Join a Ring with a code or verified work email|Backend]] · **Story:** [[T-027 Story]]

## What

Needs `joinPolicy`, join code and `requiredEmailDomain` on the Ring. Joining with a code is in the launch set ("who can request to join", default: with a code or by invitation; "approve each one" on by default); the required work email domain comes later, with [[Companies]], so the verified-work-email part waits for it ([[DR-04 Ring settings at launch and their defaults]]).

## Design

- [[Screen Index#s74|s74]] Join a company Ring

## Dependencies

- Waited on decision [[D-04 Ring settings]], decided by [[DR-04 Ring settings at launch and their defaults]]
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
- 2026-10-25 · D-04 decided ([[DR-04 Ring settings at launch and their defaults]]); What and Dependencies updated, flag cleared. Still waits on T-026.
