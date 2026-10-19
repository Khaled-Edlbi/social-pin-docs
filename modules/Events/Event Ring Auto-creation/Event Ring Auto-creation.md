---
type: feature
id: event-ring-auto
name: "Event Ring Auto-creation"
priority: critical
module: events
screens: [s52]
related: ["View As & Pin Views"]
updated: 2026-10-19
tags: [feature, module/events, priority/critical]
---

# Event Ring Auto-creation

**Backend:** Partial (needs more) · **Priority:** Critical · **Module:** [[Events Module|Events]]

**Layers:** [[Event Ring Auto-creation Story|Story]] · [[Event Ring Auto-creation Frontend Requirements|Frontend Requirements]] · [[Event Ring Auto-creation Backend Delivery|Backend Delivery]] · [[Event Ring Auto-creation Backend Integration|Backend Integration]] · [[Event Ring Auto-creation Frontend Delivery|Frontend Delivery]] · [[Event Ring Auto-creation QA Backend|QA Backend]] · [[Event Ring Auto-creation QA Frontend|QA Frontend]]

The `EVENT` Ring type exists and is rejected on manual create; nothing creates one when a registration succeeds (s52 "Event Ring granted").

## Design reference

| Screen | Name | Note |
|---|---|---|
| [[Screen Index#s52|s52]] | Event Ring granted |  |

Wireframe brief sections: [[Wireframe Brief#Tickets, access levels, RSVP, payment|§7.3 Tickets, access levels, RSVP, payment]], [[Wireframe Brief#In-event hub|§8.1 In-event hub]]

Prototype: `socialPin-design/.proto2.json` (screen ids above), click-through map in [[Navigation Map]], see [[Design Reference]].

## Tasks

| Task | Status | Priority | Effort |
|---|---|---|---|
| [[T-011 Create the Event Ring on registration]] | ⛔ Blocked | Critical | M |

```dataview
TABLE status, priority, effort FROM #task WHERE feature = "event-ring-auto" SORT priority ASC
```

## Related

- [[Rings]]
- [[Events Before]]
- [[Events During]]
- [[Post-Event]]

Project context: [[Ring Access Model]] · [[Architecture]] · [[API Conventions]] · [[Spec Map]]
