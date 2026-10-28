---
type: feature
id: notifications
name: "Notifications"
priority: high
release: v1
module: platform
screens: [s69]
created: 2026-10-15
updated: 2026-10-28
tags: [feature, module/platform, priority/high, release/v1]
---

# Notifications

**Backend:** TODO · **Priority:** High · **Release:** v1 · **Module:** [[M-08 Platform & Cross-cutting Module|Platform & Cross-cutting]]

**Layers:** [[S-96 Notifications Story|Story]] · [[FR-39 Notifications Frontend Requirements|Frontend Requirements]] · [[BD-39 Notifications Backend Delivery|Backend Delivery]] · [[Notifications Backend Integration|Backend Integration]] · [[Notifications Frontend Delivery|Frontend Delivery]] · [[Notifications QA Backend|QA Backend]] · [[Notifications QA Frontend|QA Frontend]]

Grouped notifications (Today / Yesterday / Last 7 days), mark all read (s69), push delivery, preferences.

## Design reference

| Screen | Name | Note |
|---|---|---|
| [[Screen Index#s69|s69]] | Notifications |  |

Wireframe brief sections: [[Wireframe Brief#Notifications|§11 Notifications]]

Prototype: `socialPin-design/.proto2.json` (screen ids above), click-through map in [[Navigation Map]], see [[Design Reference]].

## Work

One story per feature (since 2026-10-27): all of this feature's work is in [[S-96 Notifications Story]]. The tasks merged into it on 2026-10-27:

| Was | Title | Status then | Priority | Now in the story |
|---|---|---|---|---|
| T-045 | NotificationService.emit and the inbox | To do | high | S7 |
| T-046 | Push delivery and preferences | Blocked | high | S8 |

### Log of the merged tasks

- T-045 · 2026-10-15 · created from the backend vs design comparison ([[Status Report 2026-10-15]])
- T-045 · 2026-10-18 · created as the backend half of T-045
- T-045 · 2026-10-18 · created as the frontend half of T-045
- T-046 · 2026-10-15 · created from the backend vs design comparison ([[Status Report 2026-10-15]])
- T-046 · 2026-10-18 · created as the backend half of T-046
- T-046 · 2026-10-18 · created as the frontend half of T-046

## Related

- [[F-14 Connections]]
- [[F-26 Meetings]]
- [[F-20 PinCast & Nearby]]
- [[F-22 Events Before]]
- [[F-33 Devices & NFC]]

Project context: [[Ring Access Model]] · [[Architecture]] · [[API Conventions]] · [[Spec Map]]
