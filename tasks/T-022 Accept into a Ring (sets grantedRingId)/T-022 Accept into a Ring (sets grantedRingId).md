---
type: task
id: T-022
status: todo
priority: critical
effort: M
feature: connections
module: connections
screens: [s46]
depends: [T-021]
created: 2026-10-15
updated: 2026-10-19
tags: [task, task/todo, module/connections, priority/critical]
---

# ⬜ T-022 · Accept into a Ring (sets grantedRingId)

> ⚠ Affected by [[DR-13 The requester sees a declined request]] (2026-10-25): D-13 decided, option 3: the requester sees a declined request as declined.

> ⚠ Affected by [[DR-14 Shared with me lists people, never the Ring]] (2026-10-25): D-14 decided, option 2: Shared with me lists the people who share with me and never shows a Ring's name, colour or type to a member.

> ⚠ Affected by [[DR-17 Requests expire after 30 days, optional note, ask again at once]] (2026-10-25): a connection request expires after 30 days, may carry an optional note of up to 200 characters, and can be asked again straight away after a decline.

**Feature:** [[Connections]] · **Status:** To do · **Priority:** Critical · **Effort:** M (S < 1 day, M 1–3 days, L > 3 days)

**Sub-tasks:** [[T-022-fe Frontend · Accept into a Ring (sets grantedRingId)|Frontend]] · [[T-022-be Backend · Accept into a Ring (sets grantedRingId)|Backend]] · **Story:** [[T-022 Story]]

## What

One `@Transactional`: create `Connection`, add `RingMember`, set `grantedRingId`. Never expose `grantedRingId` to the requester. Decline path too.

## Design

- [[Screen Index#s46|s46]] Accept · pick a Ring

## Dependencies

- Waits on [[T-021 Connect request send, inbox, cancel]]
- Unblocks [[T-023 Connection detail and contacts list]]

## Definition of done

- [ ] DTOs + entity + service + controller per [[Architecture#Build order for a new feature]]
- [ ] Every visibility decision goes through `RingAccessService` ([[Ring Access Model]])
- [ ] Spec covers each thrown domain error, each filter, and asserts secret fields are absent
- [ ] `pnpm typecheck && pnpm test` green
- [ ] Feature note updated (status, endpoints)

## Log

- 2026-10-15 · created from the backend vs design comparison ([[Status Report 2026-10-15]])
