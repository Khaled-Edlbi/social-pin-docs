---
type: task
id: T-015
status: todo
priority: P2
effort: M
feature: devices
module: platform
screens: [s75]
depends: [T-007]
created: 2026-10-15
tags: [task, task/todo, module/platform, priority/P2]
---

# ⬜ T-015 · Pair and revoke an NFC card

**Feature:** [[Devices & NFC]] · **Status:** To do · **Priority:** P2 · **Effort:** M (S < 1 day, M 1–3 days, L > 3 days)

## What

`NfcToken` mirrors `RingQrToken`; resolve path shared with T-008.

## Design

- [[Screen Index#s75|s75]] My devices

## Dependencies

- Waits on [[T-007 Issue and rotate the QR token for a Ring]]

## Definition of done

- [ ] DTOs + entity + service + controller per [[Architecture#Build order for a new feature]]
- [ ] Every visibility decision goes through `RingAccessService` ([[Ring Access Model]])
- [ ] Spec covers each thrown domain error, each filter, and asserts secret fields are absent
- [ ] `pnpm typecheck && pnpm test` green
- [ ] Feature note updated (status, endpoints)

## Log

- 2026-10-15 · created from the backend vs design comparison ([[Status Report 2026-10-15]])
