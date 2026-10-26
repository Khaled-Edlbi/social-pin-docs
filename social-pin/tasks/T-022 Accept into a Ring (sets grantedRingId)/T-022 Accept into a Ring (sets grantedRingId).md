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
updated: 2026-10-26
owner: "omar"
related: ["D-13 The requester sees a declined request", "D-14 Shared with me lists people, never the Ring", "D-17 Requests expire after 30 days, optional note, ask again at once"]
tags: [task, task/todo, module/connections, priority/critical]
---

# ⬜ T-022 · Accept into a Ring (sets grantedRingId)

**Feature:** [[Connections]] · **Status:** To do · **Priority:** Critical · **Effort:** M (S < 1 day, M 1–3 days, L > 3 days)

**Sub-tasks:** [[T-022-fe Frontend · Accept into a Ring (sets grantedRingId)|Frontend]] · [[T-022-be Backend · Accept into a Ring (sets grantedRingId)|Backend]] · **Story:** [[T-022 Story]]

## What

One `@Transactional`: create `Connection`, add `RingMember`, set `grantedRingId`. Never expose `grantedRingId` to the requester, nor the Ring's name on their Shared with me ([[D-14 Shared with me lists people, never the Ring]]). Decline path too: the request closes as declined, the requester sees it and may ask again straight away ([[D-13 The requester sees a declined request]], [[D-17 Requests expire after 30 days, optional note, ask again at once]]).

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
- 2026-10-25 · `tickets/pm/M-02-connections/F-14-connections/S-25-decisions` · story S3, S4 and What updated for D-13, D-14 and D-17; flags cleared.
