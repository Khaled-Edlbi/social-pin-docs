---
type: task
id: T-058
status: needs-info
priority: P0
effort: S
feature: ring-projection
domain: identity
screens: [s24]
depends: []
created: 2026-10-15
tags: [task, task/needs-info, domain/identity, priority/P0]
decision: D-03
---

# ❓ T-058 · Decide: field library vs per-Ring copies

**Feature:** [[Ring Projection]] · **Status:** Needs a decision / info · **Priority:** P0 · **Effort:** S (S < 1 day, M 1–3 days, L > 3 days)

## What

See [[D-03 Field library vs per-Ring copies]].

## Design

- [[Screen Index#s24|s24]] Edit · what it shows

## Definition of done

- [ ] DTOs + entity + service + controller per [[Architecture#Build order for a new feature]]
- [ ] Every visibility decision goes through `RingAccessService` ([[Ring Access Model]])
- [ ] Spec covers each thrown domain error, each filter, and asserts secret fields are absent
- [ ] `pnpm typecheck && pnpm test` green
- [ ] Feature note updated (status, endpoints)

## Log

- 2026-10-15 · created from the backend vs design comparison ([[Status Report 2026-10-15]])
