---
type: backend-delivery
code: notifications
scope: feature
feature: notifications
module: platform
status: todo
screens: [s69]
created: 2026-10-18
updated: 2026-10-18
tags: [backend-delivery, backend-delivery/todo, module/platform, layer/backend]
---

# ⬜ Notifications · Backend Delivery

**Feature:** [[Notifications]] · **Status:** To do · **Integration guide:** [[Notifications Backend Integration]] · **Requirements:** [[Notifications Frontend Requirements]] · **QA:** [[Notifications QA Backend]]

What the backend shipped for this feature and how it works. The sum of this feature's task-level Backend Delivery notes (see the *Tasks* table below).

## Endpoints, tables and code

**Endpoints:** none yet.

**Tables / models:** `Notification`, `NotificationPreference`, `UserDevice`

### What exists

- `Notification.dedupeKey` unique for idempotency; `NotificationPreference` table.

### Gaps

- List, mark read / all read.
- An internal `NotificationService.emit(type, payload)` that other modules call (connections, meetings, PinCast, events).
- Push delivery via device tokens, see [[Devices & NFC]].
- Preferences CRUD.

## Tasks delivered

| Task | Delivery note | Status |
|---|---|---|
| — | — | — |

## Log

- 2026-10-18 · split out of [[Notifications]] when the vault moved to layers ([[T-064 Restructure the docs vault]])
