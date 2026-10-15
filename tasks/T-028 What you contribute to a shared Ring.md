---
type: task
id: T-028
status: needs-info
priority: P2
effort: L
feature: ring-invitations
domain: shared-rings
screens: [s74]
depends: [T-027]
created: 2026-10-15
tags: [task, task/needs-info, domain/shared-rings, priority/P2]
---

# ❓ T-028 · "What you contribute" to a shared Ring

**Feature:** [[Ring Invitations & Join]] · **Status:** Needs a decision / info · **Priority:** P2 · **Effort:** L (S < 1 day, M 1–3 days, L > 3 days)

## What

A member-side projection inside someone else's Ring. Not in the schema; needs a product definition.

## Design

- [[Screen Index#s74|s74]] Join a company Ring

## Dependencies

- Waits on [[T-027 Join a Ring with a code or verified work email]]

## Definition of done

- [ ] DTOs + entity + service + controller per [[Architecture#Build order for a new feature]]
- [ ] Every visibility decision goes through `RingAccessService` ([[Ring Access Model]])
- [ ] Spec covers each thrown domain error, each filter, and asserts secret fields are absent
- [ ] `pnpm typecheck && pnpm test` green
- [ ] Feature note updated (status, endpoints)

## Log

- 2026-10-15 · created from the backend vs design comparison ([[Status Report 2026-10-15]])
