---
type: feature
id: notifications
name: "Notifications"
status: todo
priority: P1
domain: platform
screens: [s69]
updated: 2026-10-15
tags: [feature, status/todo, domain/platform, priority/P1]
---

# ❌ Notifications

**Status:** TODO · **Priority:** P1 · **Domain:** [[Feature Tree#Platform & Cross-cutting|Platform & Cross-cutting]]

Grouped notifications (Today / Yesterday / Last 7 days), mark all read (s69), push delivery, preferences.

## Design reference

| Screen | Name | Note |
|---|---|---|
| [[Screen Index#s69|s69]] | Notifications |  |

Wireframe brief sections: [[Wireframe Brief#Notifications|§11 Notifications]]

Prototype: `socialPin-design/.proto2.json` (screen ids above), click-through map in [[Navigation Map]], see [[Design Reference]].

## Backend state

**Endpoints:** none yet.

**Tables / models:** `Notification`, `NotificationPreference`, `UserDevice`

### What exists

- `Notification.dedupeKey` unique for idempotency; `NotificationPreference` table.

### Gaps

- List, mark read / all read.
- An internal `NotificationService.emit(type, payload)` that other modules call (connections, meetings, PinCast, events).
- Push delivery via device tokens, see [[Devices & NFC]].
- Preferences CRUD.

## Tasks

| Task | Status | Priority | Effort |
|---|---|---|---|
| [[T-045 NotificationService.emit and the inbox]] | ⬜ To do | P1 | M |
| [[T-046 Push delivery and preferences]] | ⛔ Blocked | P1 | M |

```dataview
TABLE status, priority, effort FROM #task WHERE feature = "notifications" SORT priority ASC
```

## Related

- [[Connections]]
- [[Meetings]]
- [[PinCast & Nearby]]
- [[Events Before]]
- [[Devices & NFC]]

Project context: [[Ring Access Model]] · [[Architecture]] · [[API Conventions]] · [[SPEC_MAP]]
