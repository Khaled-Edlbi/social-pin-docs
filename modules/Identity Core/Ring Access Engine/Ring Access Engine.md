---
type: feature
id: ring-access
name: "Ring Access Engine"
priority: critical
module: identity
screens: []
updated: 2026-10-19
tags: [feature, module/identity, priority/critical]
---

# Ring Access Engine

**Backend:** Done · **Priority:** Critical · **Module:** [[Identity Core Module|Identity Core]]

**Layers:** [[Ring Access Engine Story|Story]] · [[Ring Access Engine Frontend Requirements|Frontend Requirements]] · [[Ring Access Engine Backend Delivery|Backend Delivery]] · [[Ring Access Engine Backend Integration|Backend Integration]] · [[Ring Access Engine Frontend Delivery|Frontend Delivery]] · [[Ring Access Engine QA Backend|QA Backend]] · [[Ring Access Engine QA Frontend|QA Frontend]]

`RingAccessService`: the one place that decides whether a viewer may see something. Every read path, and every future feature (events, meetings, chat, posts, Gemma), routes through it.

## Design reference

_No prototype screen. This is a backend-only concern._

Wireframe brief sections: [[Wireframe Brief#Core product concept|§1 Core product concept]], [[Wireframe Brief#Connections & networking|§5 Connections & networking]]

Prototype: `socialPin-design/.proto2.json` (screen ids above), click-through map in [[Navigation Map]], see [[Design Reference]].

## Tasks

_No open tasks._

```dataview
TABLE status, priority, effort FROM #task WHERE feature = "ring-access" SORT priority ASC
```

## Open decisions

- [[D-04 Ring settings]]

## Related

- [[Rings]]
- [[Ring Members]]
- [[View As & Pin Views]]
- [[Connections]]
- [[Events During]]
- [[Meetings]]
- [[PinCast & Nearby]]

Project context: [[Ring Access Model]] · [[Architecture]] · [[API Conventions]] · [[Spec Map]]
