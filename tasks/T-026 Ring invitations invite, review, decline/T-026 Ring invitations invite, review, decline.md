---
type: task
id: T-026
status: needs-info
priority: high
effort: M
feature: ring-invitations
module: shared-rings
screens: [s17]
depends: [ND-04]
created: 2026-10-15
updated: 2026-10-26
owner: "omar"
tags: [task, task/needs-info, module/shared-rings, priority/high]
---

# ❓ T-026 · Ring invitations: invite, review, decline

**Feature:** [[Ring Invitations & Join]] · **Status:** Needs a decision / info · **Priority:** High · **Effort:** M (S < 1 day, M 1–3 days, L > 3 days)

**Sub-tasks:** [[T-026-fe Frontend · Ring invitations invite, review, decline|Frontend]] · [[T-026-be Backend · Ring invitations invite, review, decline|Backend]] · **Story:** [[T-026 Story]]

## What

Likely a `RingMember` in an INVITED state with accept / decline endpoints. Notification on invite. Joining by invitation is one of the launch values of "who can request to join" (default: with a code or by invitation), and "members can invite others" is a launch setting, off by default ([[D-04 Ring settings at launch and their defaults]]).

## Design

- [[Screen Index#s17|s17]] Shared with me

## Dependencies

- Waited on decision [[Ring settings]], decided by [[D-04 Ring settings at launch and their defaults]]
- Unblocks [[T-027 Join a Ring with a code or verified work email]]

## Definition of done

- [ ] DTOs + entity + service + controller per [[Architecture#Build order for a new feature]]
- [ ] Every visibility decision goes through `RingAccessService` ([[Ring Access Model]])
- [ ] Spec covers each thrown domain error, each filter, and asserts secret fields are absent
- [ ] `pnpm typecheck && pnpm test` green
- [ ] Feature note updated (status, endpoints)

## Log

- 2026-10-15 · created from the backend vs design comparison ([[Status Report 2026-10-15]])
- 2026-10-25 · ND-04 decided ([[D-04 Ring settings at launch and their defaults]]); What and Dependencies updated, flag cleared. Status left as typed (needs-info) until product says it can move to todo.
