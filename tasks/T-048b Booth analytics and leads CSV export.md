---
type: task
id: T-048b
status: blocked
priority: P1
effort: M
feature: exhibitor
module: events
screens: [s65]
depends: [T-009, T-036]
created: 2026-10-15
tags: [task, task/blocked, module/events, priority/P1]
---

# ⛔ T-048b · Booth analytics and leads CSV export

**Feature:** [[Exhibitor]] · **Status:** Blocked · **Priority:** P1 · **Effort:** M (S < 1 day, M 1–3 days, L > 3 days)

## What

Scans, video clicks, Rings opened from `AnalyticsEvent`; CSV export of leads.

## Design

- [[Screen Index#s65|s65]] Booth analytics

## Dependencies

- Waits on [[T-009 Scan counter and share link]]
- Waits on [[T-036 Event mode exhibitors list and detail]]

## Definition of done

- [ ] DTOs + entity + service + controller per [[Architecture#Build order for a new feature]]
- [ ] Every visibility decision goes through `RingAccessService` ([[Ring Access Model]])
- [ ] Spec covers each thrown domain error, each filter, and asserts secret fields are absent
- [ ] `pnpm typecheck && pnpm test` green
- [ ] Feature note updated (status, endpoints)

## Log

- 2026-10-15 · created from the backend vs design comparison ([[Status Report 2026-10-15]])
