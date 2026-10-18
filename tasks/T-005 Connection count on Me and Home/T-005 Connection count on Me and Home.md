---
type: task
id: T-005
status: blocked
priority: P1
effort: S
feature: counts
module: identity
screens: [s11, s68]
depends: [T-021]
created: 2026-10-15
updated: 2026-10-18
tags: [task, task/blocked, module/identity, priority/P1]
---

# ⛔ T-005 · Connection count on Me and Home

**Feature:** [[Counts]] · **Status:** Blocked · **Priority:** P1 · **Effort:** S (S < 1 day, M 1–3 days, L > 3 days)

**Sub-tasks:** [[T-005-fe Frontend · Connection count on Me and Home|Frontend]] · [[T-005-be Backend · Connection count on Me and Home|Backend]] · **Story:** [[T-005 Story]]

## What

Needs connections to exist.

## Design

- [[Screen Index#s11|s11]] Home · Broadcasting
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
