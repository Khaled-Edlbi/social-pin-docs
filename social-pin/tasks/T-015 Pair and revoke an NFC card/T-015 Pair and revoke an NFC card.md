---
type: task
id: T-015
status: todo
priority: medium
effort: M
feature: devices
module: platform
screens: [s75]
depends: [T-007]
created: 2026-10-15
updated: 2026-10-26
tags: [task, task/todo, module/platform, priority/medium]
---

# ⬜ T-015 · Pair and revoke an NFC card

**Feature:** [[Devices & NFC]] · **Status:** To do · **Priority:** Medium · **Effort:** M (S < 1 day, M 1–3 days, L > 3 days)

**Sub-tasks:** [[T-015-fe Frontend · Pair and revoke an NFC card|Frontend]] · [[T-015-be Backend · Pair and revoke an NFC card|Backend]] · **Story:** [[T-015 Story]]

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
