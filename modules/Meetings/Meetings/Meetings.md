---
type: feature
id: meetings
name: "Meetings"
priority: critical
release: mvp
module: meetings
screens: [s59, s61, s64, s66, s67]
related: ["View As & Pin Views"]
updated: 2026-10-25
tags: [feature, module/meetings, priority/critical, release/mvp]
---

# Meetings

**Backend:** TODO · **Priority:** Critical · **Release:** MVP · **Module:** [[Meetings Module|Meetings]]

**Layers:** [[Meetings Story|Story]] · [[Meetings Frontend Requirements|Frontend Requirements]] · [[Meetings Backend Delivery|Backend Delivery]] · [[Meetings Backend Integration|Backend Integration]] · [[Meetings Frontend Delivery|Frontend Delivery]] · [[Meetings QA Backend|QA Backend]] · [[Meetings QA Frontend|QA Frontend]]

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

## Tasks

| Task | Status | Priority | Effort |
|---|---|---|---|
| [[T-041 Availability slots CRUD]] | ⬜ To do | Critical | M |
| [[T-042 Meeting request, accept with slots, decline with reason]] | ⬜ To do | Critical | L |
| [[T-043 Temporary meeting Ring per meeting]] | ⬜ To do | Critical | M |
| [[T-044 My meetings, calendar, detail, reschedule, cancel]] | ⬜ To do | Critical | M |

```dataview
TABLE status, priority, effort FROM #task WHERE feature = "meetings" SORT priority ASC
```

## Related

- [[Rings]]
- [[Event Ring Auto-creation]]
- [[Events During]]
- [[Exhibitor]]
- [[Notifications]]
- [[Gemma AI]]

Project context: [[Ring Access Model]] · [[Architecture]] · [[API Conventions]] · [[Spec Map]]
