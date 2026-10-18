---
type: task
id: T-009
status: todo
priority: P1
effort: S
feature: badge-qr
module: discovery
screens: [s34]
depends: [T-008]
created: 2026-10-15
tags: [task, task/todo, module/discovery, priority/P1]
---

# ⬜ T-009 · Scan counter and share link

**Feature:** [[Badge & QR]] · **Status:** To do · **Priority:** P1 · **Effort:** S (S < 1 day, M 1–3 days, L > 3 days)

## What

Count per token and per Ring; share link is the public URL of T-010.

## Design

- [[Screen Index#s34|s34]] Badge (flip)

## Dependencies

- Waits on [[T-008 Resolve a scanned QR token]]
- Unblocks [[T-048b Booth analytics and leads CSV export]]
- Unblocks [[T-050 Post-event summary and follow-ups]]

## Definition of done

- [ ] DTOs + entity + service + controller per [[Architecture#Build order for a new feature]]
- [ ] Every visibility decision goes through `RingAccessService` ([[Ring Access Model]])
- [ ] Spec covers each thrown domain error, each filter, and asserts secret fields are absent
- [ ] `pnpm typecheck && pnpm test` green
- [ ] Feature note updated (status, endpoints)

## Log

- 2026-10-15 · created from the backend vs design comparison ([[Status Report 2026-10-15]])
