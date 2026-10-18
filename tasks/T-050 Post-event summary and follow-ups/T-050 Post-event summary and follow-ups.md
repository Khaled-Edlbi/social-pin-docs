---
type: task
id: T-050
status: blocked
priority: P1
effort: M
feature: post-event
module: events
screens: [s62]
depends: [T-009, T-023, T-044]
created: 2026-10-15
updated: 2026-10-18
tags: [task, task/blocked, module/events, priority/P1]
---

# ⛔ T-050 · Post-event summary and follow-ups

**Feature:** [[Post-Event]] · **Status:** Blocked · **Priority:** P1 · **Effort:** M (S < 1 day, M 1–3 days, L > 3 days)

**Sub-tasks:** [[T-050-fe Frontend · Post-event summary and follow-ups|Frontend]] · [[T-050-be Backend · Post-event summary and follow-ups|Backend]] · **Story:** [[T-050 Story]]

## What

Compute `EventSummary` (connections, meetings, scans); follow-up suggestions.

## Design

- [[Screen Index#s62|s62]] Post-event summary

## Dependencies

- Waits on [[T-009 Scan counter and share link]]
- Waits on [[T-023 Connection detail and contacts list]]
- Waits on [[T-044 My meetings, calendar, detail, reschedule, cancel]]

## Definition of done

- [ ] DTOs + entity + service + controller per [[Architecture#Build order for a new feature]]
- [ ] Every visibility decision goes through `RingAccessService` ([[Ring Access Model]])
- [ ] Spec covers each thrown domain error, each filter, and asserts secret fields are absent
- [ ] `pnpm typecheck && pnpm test` green
- [ ] Feature note updated (status, endpoints)

## Log

- 2026-10-15 · created from the backend vs design comparison ([[Status Report 2026-10-15]])
