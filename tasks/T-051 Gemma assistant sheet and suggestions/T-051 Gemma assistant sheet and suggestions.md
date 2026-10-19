---
type: task
id: T-051
status: needs-info
priority: medium
effort: L
feature: gemma
module: platform
screens: [s13]
depends: [T-016, T-049]
created: 2026-10-15
updated: 2026-10-19
tags: [task, task/needs-info, module/platform, priority/medium]
---

# ❓ T-051 · Gemma assistant sheet and suggestions

**Feature:** [[Gemma AI]] · **Status:** Needs a decision / info · **Priority:** Medium · **Effort:** L (S < 1 day, M 1–3 days, L > 3 days)

**Sub-tasks:** [[T-051-fe Frontend · Gemma assistant sheet and suggestions|Frontend]] · [[T-051-be Backend · Gemma assistant sheet and suggestions|Backend]] · **Story:** [[T-051 Story]]

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
