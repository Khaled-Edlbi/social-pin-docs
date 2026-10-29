---
type: feature
id: events-before
name: "Events Before"
priority: critical
release: mvp
module: events
screens: [s48, s49, s50, s51, s52]
related: ["F-11 Rings"]
created: 2026-10-15
updated: 2026-10-28
tags: [feature, module/events, priority/critical, release/mvp]
---

# Events Before

**Backend:** TODO · **Priority:** Critical · **Release:** MVP · **Module:** [[M-05 Events Module|Events]]

**Layers:** [[S-49 Events Before Story|Story]] · [[FR-22 Events Before Frontend Requirements|Frontend Requirements]] · [[BD-22 Events Before Backend Delivery|Backend Delivery]] · [[Events Before Backend Integration|Backend Integration]] · [[Events Before Frontend Delivery|Frontend Delivery]] · [[Events Before QA Backend|QA Backend]] · [[Events Before QA Frontend|QA Frontend]]

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

## Work

One story per feature (since 2026-10-27): all of this feature's work is in [[S-49 Events Before Story]]. The tasks merged into it on 2026-10-27:

| Was | Title | Status then | Priority | Now in the story |
|---|---|---|---|---|
| T-033 | Events list, detail, schedule | To do | critical | S7 |
| T-034 | Tickets, packages, levels, sold-out | To do | critical | S8 |
| T-035 | Registration transaction with order and payment | Blocked | critical | S9 |

### Log of the merged tasks

- T-033 · 2026-10-15 · created from the backend vs design comparison ([[Status Report 2026-10-15]])
- T-033 · 2026-10-18 · created as the backend half of T-033
- T-033 · 2026-10-18 · created as the frontend half of T-033
- T-034 · 2026-10-15 · created from the backend vs design comparison ([[Status Report 2026-10-15]])
- T-034 · 2026-10-18 · created as the backend half of T-034
- T-034 · 2026-10-18 · created as the frontend half of T-034
- T-035 · 2026-10-15 · created from the backend vs design comparison ([[Status Report 2026-10-15]])
- T-035 · 2026-10-18 · created as the backend half of T-035
- T-035 · 2026-10-18 · created as the frontend half of T-035

## Related

- [[F-21 Event Ring Auto-creation]]
- [[F-27 Payments & Orders]]
- [[F-23 Events During]]
- [[F-14 Connections]]
- [[F-39 Notifications]]

Project context: [[Ring Access Model]] · [[Architecture]] · [[API Conventions]] · [[Spec Map]]
