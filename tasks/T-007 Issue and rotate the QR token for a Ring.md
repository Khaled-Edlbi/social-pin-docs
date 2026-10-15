---
type: task
id: T-007
status: todo
priority: P0
effort: M
feature: badge-qr
domain: discovery
screens: [s34]
depends: []
created: 2026-10-15
tags: [task, task/todo, domain/discovery, priority/P0]
---

# ⬜ T-007 · Issue and rotate the QR token for a Ring

**Feature:** [[Badge & QR]] · **Status:** To do · **Priority:** P0 · **Effort:** M (S < 1 day, M 1–3 days, L > 3 days)

## What

`POST /rings/:ringId/qr` returns an opaque token; previous token revoked; 24 h rotation. Permanent token behind the Pro gate (T-049).

## Design

- [[Screen Index#s34|s34]] Badge (flip)

## Dependencies

- Unblocks [[T-008 Resolve a scanned QR token]]
- Unblocks [[T-015 Pair and revoke an NFC card]]
- Unblocks [[T-037 Event pass with a 60 s rotating code]]

## Definition of done

- [ ] DTOs + entity + service + controller per [[Architecture#Build order for a new feature]]
- [ ] Every visibility decision goes through `RingAccessService` ([[Ring Access Model]])
- [ ] Spec covers each thrown domain error, each filter, and asserts secret fields are absent
- [ ] `pnpm typecheck && pnpm test` green
- [ ] Feature note updated (status, endpoints)

## Log

- 2026-10-15 · created from the backend vs design comparison ([[Status Report 2026-10-15]])
