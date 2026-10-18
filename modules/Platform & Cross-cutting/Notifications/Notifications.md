---
type: feature
id: notifications
name: "Notifications"
status: todo
priority: P1
module: platform
screens: [s69]
updated: 2026-10-18
tags: [feature, status/todo, module/platform, priority/P1]
---

# ❌ Notifications

**Status:** TODO · **Priority:** P1 · **Module:** [[Platform & Cross-cutting Module|Platform & Cross-cutting]]

**Layers:** [[Notifications Story|Story]] · [[Notifications Frontend Requirements|Frontend Requirements]] · [[Notifications Backend Delivery|Backend Delivery]] · [[Notifications Backend Integration|Backend Integration]] · [[Notifications Frontend Delivery|Frontend Delivery]] · [[Notifications QA Backend|QA Backend]] · [[Notifications QA Frontend|QA Frontend]]

Grouped notifications (Today / Yesterday / Last 7 days), mark all read (s69), push delivery, preferences.

## Design reference

| Screen | Name | Note |
|---|---|---|
| [[Screen Index#s69|s69]] | Notifications |  |

Wireframe brief sections: [[Wireframe Brief#Notifications|§11 Notifications]]

Prototype: `socialPin-design/.proto2.json` (screen ids above), click-through map in [[Navigation Map]], see [[Design Reference]].

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

Project context: [[Ring Access Model]] · [[Architecture]] · [[API Conventions]] · [[Spec Map]]
