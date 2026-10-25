---
type: task
id: T-061
status: needs-info
priority: high
effort: S
feature: profiles
module: identity
screens: [s06]
depends: []
created: 2026-10-15
tags: [task, task/needs-info, module/identity, priority/high]
decision: D-06
---

# ❓ T-061 · Decide: Pin name rules

> ⚠ Affected by [[DR-06 Yearly rename, old name freed, case-insensitive]] (2026-10-25): D-06 is decided; this task's decision is taken and the PM can close it.

**Feature:** [[Profiles & Pin Name]] · **Status:** Needs a decision / info · **Priority:** High · **Effort:** S (S < 1 day, M 1–3 days, L > 3 days)

## What

See [[D-06 Pin name rules]].

## Design

- [[Screen Index#s06|s06]] Claim your Pin

## Definition of done

- [ ] DTOs + entity + service + controller per [[Architecture#Build order for a new feature]]
- [ ] Every visibility decision goes through `RingAccessService` ([[Ring Access Model]])
- [ ] Spec covers each thrown domain error, each filter, and asserts secret fields are absent
- [ ] `pnpm typecheck && pnpm test` green
- [ ] Feature note updated (status, endpoints)

## Log

- 2026-10-15 · created from the backend vs design comparison ([[Status Report 2026-10-15]])
