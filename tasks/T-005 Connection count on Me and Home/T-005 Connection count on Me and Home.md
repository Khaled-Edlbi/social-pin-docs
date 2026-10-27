---
type: task
id: T-005
status: todo
priority: high
effort: S
feature: counts
module: identity
screens: [s68]
depends: [T-021]
created: 2026-10-15
updated: 2026-10-27
owner: "Omar Fostok"
tags: [task, task/todo, module/identity, priority/high]
---

# ⬜ T-005 · Connection count on Me and Home

**Feature:** [[Counts]] · **Status:** To do · **Priority:** High · **Effort:** S (S < 1 day, M 1–3 days, L > 3 days)

**Sub-tasks:** [[T-005-fe Frontend · Connection count on Me and Home|Frontend]] · [[T-005-be Backend · Connection count on Me and Home|Backend]] · **Story:** [[T-005 Story]]

## What

Show on Me how many connections the person has ("2 Rings · 218 connections"): the number of people with an accepted connection, once each however many Rings they are in ([[DR-15 Several Rings per connection, remove or disconnect]]); disconnected people and unanswered, declined or expired requests don't count. Backend: one owner-only number the client can read without fetching the connections list. Frontend: the Me profile card shows it, hidden until it exists. **Me only**: Home shows no connections count (decided 2026-10-27 by omar, [[Counts Story]] S4); the title still says "and Home". Waits on connections themselves ([[T-021 Connect request send, inbox, cancel]]).

## Design

- [[Screen Index#s68|s68]] Me / Account

## Dependencies

- Waits on [[T-021 Connect request send, inbox, cancel]]

## Definition of done

- [ ] DTOs + entity + service + controller per [[Architecture#Build order for a new feature]]
- [ ] Every visibility decision goes through `RingAccessService` ([[Ring Access Model]])
- [ ] Spec covers each thrown domain error, each filter, and asserts secret fields are absent
- [ ] `pnpm typecheck && pnpm test` green
- [ ] Feature note updated (status, endpoints)

## Log

- 2026-10-15 · created from the backend vs design comparison ([[Status Report 2026-10-15]])
- 2026-10-27 · `tickets/pm/…/S-05-written` · story written; What filled in; Me only (Home dropped by decision); the hand-typed `blocked` removed: the build shows it blocked by T-021.
