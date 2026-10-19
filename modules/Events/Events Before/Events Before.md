---
type: feature
id: events-before
name: "Events Before"
priority: critical
module: events
screens: [s48, s49, s50, s51, s52]
related: ["Rings"]
updated: 2026-10-19
tags: [feature, module/events, priority/critical]
---

# Events Before

**Backend:** TODO · **Priority:** Critical · **Module:** [[Events Module|Events]]

**Layers:** [[Events Before Story|Story]] · [[Events Before Frontend Requirements|Frontend Requirements]] · [[Events Before Backend Delivery|Backend Delivery]] · [[Events Before Backend Integration|Backend Integration]] · [[Events Before Frontend Delivery|Frontend Delivery]] · [[Events Before QA Backend|QA Backend]] · [[Events Before QA Frontend|QA Frontend]]

Events list with filters and "your contacts are going" (s48), event landing page and schedule (s49), tickets, access levels, sub-events, sold out (s50), payment (s51), Event Ring granted on registration (s52).

## Design reference

| Screen | Name | Note |
|---|---|---|
| [[Screen Index#s48|s48]] | Events tab |  |
| [[Screen Index#s49|s49]] | Event landing |  |
| [[Screen Index#s50|s50]] | Tickets & levels |  |
| [[Screen Index#s51|s51]] | Payment |  |
| [[Screen Index#s52|s52]] | Event Ring granted |  |

Wireframe brief sections: [[Wireframe Brief#Before-event journeys|§7 Before-event journeys]]

Prototype: `socialPin-design/.proto2.json` (screen ids above), click-through map in [[Navigation Map]], see [[Design Reference]].

## Tasks

| Task | Status | Priority | Effort |
|---|---|---|---|
| [[T-033 Events list, detail, schedule]] | ⬜ To do | Critical | L |
| [[T-034 Tickets, packages, levels, sold-out]] | ⬜ To do | Critical | M |
| [[T-035 Registration transaction with order and payment]] | ⛔ Blocked | Critical | L |

```dataview
TABLE status, priority, effort FROM #task WHERE feature = "events-before" SORT priority ASC
```

## Related

- [[Event Ring Auto-creation]]
- [[Payments & Orders]]
- [[Events During]]
- [[Connections]]
- [[Notifications]]

Project context: [[Ring Access Model]] · [[Architecture]] · [[API Conventions]] · [[Spec Map]]
