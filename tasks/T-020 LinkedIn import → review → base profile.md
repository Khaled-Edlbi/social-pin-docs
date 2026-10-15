---
type: task
id: T-020
status: blocked
priority: P1
effort: L
feature: onboarding-imports
domain: identity
screens: [s04, s05]
depends: [T-019, D-02]
created: 2026-10-15
tags: [task, task/blocked, domain/identity, priority/P1]
---

# ⛔ T-020 · LinkedIn import → review → base profile

**Feature:** [[Onboarding Imports]] · **Status:** Blocked · **Priority:** P1 · **Effort:** L (S < 1 day, M 1–3 days, L > 3 days)

## What

Import endpoint returns candidate fields; confirm endpoint writes the chosen ones to the base profile and the first Ring.

## Design

- [[Screen Index#s04|s04]] Importing
- [[Screen Index#s05|s05]] Review import

## Dependencies

- Waits on [[T-019 LinkedIn OAuth link, unlink, login]]
- Waits on decision [[D-02 Base profile work fields]]

## Definition of done

- [ ] DTOs + entity + service + controller per [[Architecture#Build order for a new feature]]
- [ ] Every visibility decision goes through `RingAccessService` ([[Ring Access Model]])
- [ ] Spec covers each thrown domain error, each filter, and asserts secret fields are absent
- [ ] `pnpm typecheck && pnpm test` green
- [ ] Feature note updated (status, endpoints)

## Log

- 2026-10-15 · created from the backend vs design comparison ([[Status Report 2026-10-15]])
