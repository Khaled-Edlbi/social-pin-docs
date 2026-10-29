---
id: F-26
type: feature
module: meetings
feature: meetings
name: "Meetings"
priority: critical
release: mvp
screens: [s59, s61, s64, s66, s67]
related: ["F-12 View As & Pin Views"]
created: 2026-10-15
updated: 2026-10-29
tags: [feature, module/meetings, priority/critical, release/mvp]
---

# Meetings

**Backend:** TODO · **Priority:** Critical · **Release:** MVP · **Module:** [[M-06 Meetings Module|Meetings]]

**Layers:** [[S-64 Meetings Story|Story]] · [[FR-26 Meetings Frontend Requirements|Frontend Requirements]] · [[BD-26 Meetings Backend Delivery|Backend Delivery]] · [[Meetings Backend Integration|Backend Integration]] · [[Meetings Frontend Delivery|Frontend Delivery]] · [[Meetings QA Backend|QA Backend]] · [[Meetings QA Frontend|QA Frontend]]

Availability slots, request a meeting with a slot (s59), a temporary Ring created per meeting, accept by offering slots or decline with a reason (s64), my meetings and calendar (s61, s66), meeting detail with agenda, shared files, reschedule and cancel (s67).

## Design reference

| Screen | Name | Note |
|---|---|---|
| [[Screen Index#s59|s59]] | Request a meeting |  |
| [[Screen Index#s61|s61]] | My meetings |  |
| [[Screen Index#s64|s64]] | Incoming meetings |  |
| [[Screen Index#s66|s66]] | Meetings |  |
| [[Screen Index#s67|s67]] | Meeting detail |  |

Wireframe brief sections: [[Wireframe Brief#Exhibitor discovery → request a meeting|§8.2 Exhibitor discovery → request a meeting]], [[Wireframe Brief#Meetings & scheduling|§10 Meetings & scheduling]]

Prototype: `socialPin-design/.proto2.json` (screen ids above), click-through map in [[Navigation Map]], see [[Design Reference]].

## Work

One story per feature (since 2026-10-27): all of this feature's work is in [[S-64 Meetings Story]]. The tasks merged into it on 2026-10-27:

| Was | Title | Status then | Priority | Now in the story |
|---|---|---|---|---|
| T-041 | Availability slots CRUD | To do | critical | S8 |
| T-042 | Meeting request, accept with slots, decline with reason | To do | critical | S9 |
| T-043 | Temporary meeting Ring per meeting | To do | critical | S10 |
| T-044 | My meetings, calendar, detail, reschedule, cancel | To do | critical | S11 |

### Log of the merged tasks

- T-041 · 2026-10-15 · created from the backend vs design comparison ([[Status Report 2026-10-15]])
- T-041 · 2026-10-18 · created as the backend half of T-041
- T-041 · 2026-10-18 · created as the frontend half of T-041
- T-042 · 2026-10-15 · created from the backend vs design comparison ([[Status Report 2026-10-15]])
- T-042 · 2026-10-18 · created as the backend half of T-042
- T-042 · 2026-10-18 · created as the frontend half of T-042
- T-043 · 2026-10-15 · created from the backend vs design comparison ([[Status Report 2026-10-15]])
- T-043 · 2026-10-18 · created as the backend half of T-043
- T-044 · 2026-10-15 · created from the backend vs design comparison ([[Status Report 2026-10-15]])
- T-044 · 2026-10-18 · created as the backend half of T-044
- T-044 · 2026-10-18 · created as the frontend half of T-044

## Related

- [[F-11 Rings]]
- [[F-21 Event Ring Auto-creation]]
- [[F-23 Events During]]
- [[F-24 Exhibitor]]
- [[F-39 Notifications]]
- [[F-36 Gemma AI]]

Project context: [[Ring Access Model]] · [[Architecture]] · [[API Conventions]] · [[Spec Map]]
