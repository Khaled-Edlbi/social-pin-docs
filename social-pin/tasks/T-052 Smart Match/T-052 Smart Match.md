---
type: task
id: T-052
status: blocked
priority: medium
effort: L
feature: gemma
module: platform
screens: [s60]
depends: [T-051, T-036]
created: 2026-10-15
updated: 2026-10-26
tags: [task, task/blocked, module/platform, priority/medium]
---

# ⛔ T-052 · Smart Match

**Feature:** [[Gemma AI]] · **Status:** Blocked · **Priority:** Medium · **Effort:** L (S < 1 day, M 1–3 days, L > 3 days)

**Sub-tasks:** [[T-052-fe Frontend · Smart Match|Frontend]] · [[T-052-be Backend · Smart Match|Backend]] · **Story:** [[T-052 Story]]

## What

Over interests and event participants; strength Strong / Good / Weak; Pro only; auto-request meetings via T-042.

## Design

- [[Screen Index#s60|s60]] Smart Match

## Dependencies

- Waits on [[T-051 Gemma assistant sheet and suggestions]]
- Waits on [[T-036 Event mode exhibitors list and detail]]

## Definition of done

- [ ] DTOs + entity + service + controller per [[Architecture#Build order for a new feature]]
- [ ] Every visibility decision goes through `RingAccessService` ([[Ring Access Model]])
- [ ] Spec covers each thrown domain error, each filter, and asserts secret fields are absent
- [ ] `pnpm typecheck && pnpm test` green
- [ ] Feature note updated (status, endpoints)

## Log

- 2026-10-15 · created from the backend vs design comparison ([[Status Report 2026-10-15]])
