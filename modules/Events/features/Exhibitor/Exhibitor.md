---
type: feature
id: exhibitor
name: "Exhibitor"
priority: high
release: v1
module: events
screens: [s63, s64, s65]
related: ["View As & Pin Views"]
created: 2026-10-15
updated: 2026-10-26
tags: [feature, module/events, priority/high, release/v1]
---

# Exhibitor

**Backend:** TODO · **Priority:** High · **Release:** v1 · **Module:** [[Events Module|Events]]

**Layers:** [[Exhibitor Story|Story]] · [[Exhibitor Frontend Requirements|Frontend Requirements]] · [[Exhibitor Backend Delivery|Backend Delivery]] · [[Exhibitor Backend Integration|Backend Integration]] · [[Exhibitor Frontend Delivery|Frontend Delivery]] · [[Exhibitor QA Backend|QA Backend]] · [[Exhibitor QA Frontend|QA Frontend]]

Business account setup and business Ring (s63), team on the stand, "Discoverable via Gemma" toggle, booth analytics and leads CSV export (s65), organizer touchpoints (invitation, requested files, booth and payment status).

## Design reference

| Screen | Name | Note |
|---|---|---|
| [[Screen Index#s63|s63]] | Business account |  |
| [[Screen Index#s64|s64]] | Incoming meetings |  |
| [[Screen Index#s65|s65]] | Booth analytics |  |

Wireframe brief sections: [[Wireframe Brief#Exhibitor journeys|§9 Exhibitor journeys]]

Prototype: `socialPin-design/.proto2.json` (screen ids above), click-through map in [[Navigation Map]], see [[Design Reference]].

## Tasks

| Task | Status | Priority | Effort |
|---|---|---|---|
| [[T-048 Business account setup → business Ring]] | ⬜ To do | High | L |
| [[T-048b Booth analytics and leads CSV export]] | ⛔ Blocked | High | M |

```dataview
TABLE status, priority, effort FROM #task WHERE feature = "exhibitor" SORT priority ASC
```

## Related

- [[Companies]]
- [[Events During]]
- [[Meetings]]
- [[Badge & QR]]
- [[Gemma AI]]

Project context: [[Ring Access Model]] · [[Architecture]] · [[API Conventions]] · [[Spec Map]]
