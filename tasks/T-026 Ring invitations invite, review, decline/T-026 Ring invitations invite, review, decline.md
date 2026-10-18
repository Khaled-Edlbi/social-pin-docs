---
type: task
id: T-026
status: needs-info
priority: P1
effort: M
feature: ring-invitations
module: shared-rings
screens: [s17]
depends: [D-04]
created: 2026-10-15
updated: 2026-10-18
tags: [task, task/needs-info, module/shared-rings, priority/P1]
---

# ❓ T-026 · Ring invitations: invite, review, decline

**Feature:** [[Ring Invitations & Join]] · **Status:** Needs a decision / info · **Priority:** P1 · **Effort:** M (S < 1 day, M 1–3 days, L > 3 days)

**Sub-tasks:** [[T-026-fe Frontend · Ring invitations invite, review, decline|Frontend]] · [[T-026-be Backend · Ring invitations invite, review, decline|Backend]] · **Story:** [[T-026 Story]]

## What

Likely a `RingMember` in an INVITED state with accept / decline endpoints. Notification on invite.

## Design

- [[Screen Index#s17|s17]] Shared with me

## Dependencies

- Waits on decision [[D-04 Ring settings]]
- Unblocks [[T-027 Join a Ring with a code or verified work email]]

## Definition of done

- [ ] DTOs + entity + service + controller per [[Architecture#Build order for a new feature]]
- [ ] Every visibility decision goes through `RingAccessService` ([[Ring Access Model]])
- [ ] Spec covers each thrown domain error, each filter, and asserts secret fields are absent
- [ ] `pnpm typecheck && pnpm test` green
- [ ] Feature note updated (status, endpoints)

## Log

- 2026-10-15 · created from the backend vs design comparison ([[Status Report 2026-10-15]])
