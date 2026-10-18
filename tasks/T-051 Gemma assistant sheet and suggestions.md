---
type: task
id: T-051
status: needs-info
priority: P2
effort: L
feature: gemma
module: platform
screens: [s13]
depends: [T-016, T-049]
created: 2026-10-15
tags: [task, task/needs-info, module/platform, priority/P2]
---

# ❓ T-051 · Gemma assistant sheet and suggestions

**Feature:** [[Gemma AI]] · **Status:** Needs a decision / info · **Priority:** P2 · **Effort:** L (S < 1 day, M 1–3 days, L > 3 days)

## What

Model and provider undecided. Every suggestion scoped by what the asking user can see.

## Design

- [[Screen Index#s13|s13]] Gemma sheet

## Dependencies

- Waits on [[T-016 Interests vocabulary and my interests]]
- Waits on [[T-049 Subscription endpoints and a single Pro gate]]
- Unblocks [[T-052 Smart Match]]

## Definition of done

- [ ] DTOs + entity + service + controller per [[Architecture#Build order for a new feature]]
- [ ] Every visibility decision goes through `RingAccessService` ([[Ring Access Model]])
- [ ] Spec covers each thrown domain error, each filter, and asserts secret fields are absent
- [ ] `pnpm typecheck && pnpm test` green
- [ ] Feature note updated (status, endpoints)

## Log

- 2026-10-15 · created from the backend vs design comparison ([[Status Report 2026-10-15]])
