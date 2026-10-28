---
type: feature
id: exhibitor
name: "Exhibitor"
priority: high
release: v1
module: events
screens: [s63, s64, s65]
related: ["F-12 View As & Pin Views"]
created: 2026-10-15
updated: 2026-10-28
tags: [feature, module/events, priority/high, release/v1]
---

# Exhibitor

**Backend:** TODO · **Priority:** High · **Release:** v1 · **Module:** [[M-05 Events Module|Events]]

**Layers:** [[S-59 Exhibitor Story|Story]] · [[FR-24 Exhibitor Frontend Requirements|Frontend Requirements]] · [[BD-24 Exhibitor Backend Delivery|Backend Delivery]] · [[Exhibitor Backend Integration|Backend Integration]] · [[Exhibitor Frontend Delivery|Frontend Delivery]] · [[Exhibitor QA Backend|QA Backend]] · [[Exhibitor QA Frontend|QA Frontend]]

Business account setup and business Ring (s63), team on the stand, "Discoverable via Gemma" toggle, booth analytics and leads CSV export (s65), organizer touchpoints (invitation, requested files, booth and payment status).

## Design reference

| Screen | Name | Note |
|---|---|---|
| [[Screen Index#s63|s63]] | Business account |  |
| [[Screen Index#s64|s64]] | Incoming meetings |  |
| [[Screen Index#s65|s65]] | Booth analytics |  |

Wireframe brief sections: [[Wireframe Brief#Exhibitor journeys|§9 Exhibitor journeys]]

Prototype: `socialPin-design/.proto2.json` (screen ids above), click-through map in [[Navigation Map]], see [[Design Reference]].

## Work

One story per feature (since 2026-10-27): all of this feature's work is in [[S-59 Exhibitor Story]]. The tasks merged into it on 2026-10-27:

| Was | Title | Status then | Priority | Now in the story |
|---|---|---|---|---|
| T-048 | Business account setup → business Ring | To do | high | S7 |
| T-048b | Booth analytics and leads CSV export | Blocked | high | S8 |

### Log of the merged tasks

- T-048 · 2026-10-15 · created from the backend vs design comparison ([[Status Report 2026-10-15]])
- T-048 · 2026-10-18 · created as the backend half of T-048
- T-048 · 2026-10-18 · created as the frontend half of T-048
- T-048b · 2026-10-15 · created from the backend vs design comparison ([[Status Report 2026-10-15]])
- T-048b · 2026-10-18 · created as the backend half of T-048b
- T-048b · 2026-10-18 · created as the frontend half of T-048b

## Related

- [[F-15 Companies]]
- [[F-23 Events During]]
- [[F-26 Meetings]]
- [[F-18 Badge & QR]]
- [[F-36 Gemma AI]]

Project context: [[Ring Access Model]] · [[Architecture]] · [[API Conventions]] · [[Spec Map]]
