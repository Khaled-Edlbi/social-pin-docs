---
type: task
id: T-010
status: needs-info
priority: P1
effort: M
feature: badge-qr
module: discovery
screens: [s34]
depends: [T-008]
created: 2026-10-15
updated: 2026-10-18
tags: [task, task/needs-info, module/discovery, priority/P1]
---

# ❓ T-010 · Public browser page for viewers without the app

**Feature:** [[Badge & QR]] · **Status:** Needs a decision / info · **Priority:** P1 · **Effort:** M (S < 1 day, M 1–3 days, L > 3 days)

**Sub-tasks:** [[T-010-fe Frontend · Public browser page for viewers without the app|Frontend]] · [[T-010-be Backend · Public browser page for viewers without the app|Backend]] · **Story:** [[T-010 Story]]

## What

Needs a decision: which Ring content is shown to an anonymous browser viewer, and whether that is a 'PUBLIC' Ring type or the default Ring.

## Design

- [[Screen Index#s34|s34]] Badge (flip)

## Dependencies

- Waits on [[T-008 Resolve a scanned QR token]]

## Definition of done

- [ ] DTOs + entity + service + controller per [[Architecture#Build order for a new feature]]
- [ ] Every visibility decision goes through `RingAccessService` ([[Ring Access Model]])
- [ ] Spec covers each thrown domain error, each filter, and asserts secret fields are absent
- [ ] `pnpm typecheck && pnpm test` green
- [ ] Feature note updated (status, endpoints)

## Log

- 2026-10-15 · created from the backend vs design comparison ([[Status Report 2026-10-15]])
