---
type: feature
id: post-event
name: "Post-Event"
priority: high
module: events
screens: [s62]
related: ["View As & Pin Views"]
updated: 2026-10-19
tags: [feature, module/events, priority/high]
---

# Post-Event

**Backend:** TODO · **Priority:** High · **Module:** [[Events Module|Events]]

**Layers:** [[Post-Event Story|Story]] · [[Post-Event Frontend Requirements|Frontend Requirements]] · [[Post-Event Backend Delivery|Backend Delivery]] · [[Post-Event Backend Integration|Backend Integration]] · [[Post-Event Frontend Delivery|Frontend Delivery]] · [[Post-Event QA Backend|QA Backend]] · [[Post-Event QA Frontend|QA Frontend]]

Summary stats (connections, meetings, scans) and follow-up suggestions (s62). The keep / merge / expire choice for the Event Ring already exists.

## Design reference

| Screen | Name | Note |
|---|---|---|
| [[Screen Index#s62|s62]] | Post-event summary | Keep / merge / expire done |

Wireframe brief sections: [[Wireframe Brief#Post-event|§8.5 Post-event]]

Prototype: `socialPin-design/.proto2.json` (screen ids above), click-through map in [[Navigation Map]], see [[Design Reference]].

## Tasks

| Task | Status | Priority | Effort |
|---|---|---|---|
| [[T-050 Post-event summary and follow-ups]] | ⛔ Blocked | High | M |

```dataview
TABLE status, priority, effort FROM #task WHERE feature = "post-event" SORT priority ASC
```

## Related

- [[Rings]]
- [[Events During]]
- [[Connections]]
- [[Badge & QR]]
- [[Gemma AI]]

Project context: [[Ring Access Model]] · [[Architecture]] · [[API Conventions]] · [[Spec Map]]
