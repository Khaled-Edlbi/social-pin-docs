---
type: task
id: T-022
status: todo
priority: P0
effort: M
feature: connections
domain: connections
screens: [s46]
depends: [T-021]
created: 2026-10-15
tags: [task, task/todo, domain/connections, priority/P0]
---

# ⬜ T-022 · Accept into a Ring (sets grantedRingId)

**Feature:** [[Connections]] · **Status:** To do · **Priority:** P0 · **Effort:** M (S < 1 day, M 1–3 days, L > 3 days)

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
