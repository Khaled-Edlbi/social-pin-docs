---
id: F-21
type: feature
module: events
feature: event-ring-auto
name: "Event Ring Auto-creation"
priority: critical
release: mvp
screens: [s52]
related: ["F-12 View As & Pin Views"]
created: 2026-10-15
updated: 2026-10-29
tags: [feature, module/events, priority/critical, release/mvp]
---

# Event Ring Auto-creation

> ⚠ Affected by [[S-69 Payments & Orders Story]] (2026-10-25): when the registration carries a payment, the Ring on s52 is granted only after the payment is succeeded, never on pending or failed (S3, S4).

**Backend:** Partial (needs more) · **Priority:** Critical · **Release:** MVP · **Module:** [[M-05 Events Module|Events]]

**Layers:** [[S-47 Event Ring Auto-creation Story|Story]] · [[FR-21 Event Ring Auto-creation Frontend Requirements|Frontend Requirements]] · [[BD-21 Event Ring Auto-creation Backend Delivery|Backend Delivery]] · [[Event Ring Auto-creation Backend Integration|Backend Integration]] · [[Event Ring Auto-creation Frontend Delivery|Frontend Delivery]] · [[Event Ring Auto-creation QA Backend|QA Backend]] · [[Event Ring Auto-creation QA Frontend|QA Frontend]]

The `EVENT` Ring type exists and is rejected on manual create; nothing creates one when a registration succeeds (s52 "Event Ring granted").

## Design reference

| Screen | Name | Note |
|---|---|---|
| [[Screen Index#s52|s52]] | Event Ring granted |  |

Wireframe brief sections: [[Wireframe Brief#Tickets, access levels, RSVP, payment|§7.3 Tickets, access levels, RSVP, payment]], [[Wireframe Brief#In-event hub|§8.1 In-event hub]]

Prototype: `socialPin-design/.proto2.json` (screen ids above), click-through map in [[Navigation Map]], see [[Design Reference]].

## Work

One story per feature (since 2026-10-27): all of this feature's work is in [[S-47 Event Ring Auto-creation Story]]. The tasks merged into it on 2026-10-27:

| Was | Title | Status then | Priority | Now in the story |
|---|---|---|---|---|
| T-011 | Create the Event Ring on registration | Blocked | critical | S6 |

### Log of the merged tasks

- T-011 · 2026-10-15 · created from the backend vs design comparison ([[Status Report 2026-10-15]])
- T-011 · 2026-10-18 · created as the backend half of T-011

## Related

- [[F-11 Rings]]
- [[F-22 Events Before]]
- [[F-23 Events During]]
- [[F-25 Post-Event]]

Project context: [[Ring Access Model]] · [[Architecture]] · [[API Conventions]] · [[Spec Map]]
