---
type: feature
id: pincast
name: "PinCast & Nearby"
priority: high
release: v1
module: discovery
screens: [s11, s39, s40, s41, s42]
related: ["Rings", "View As & Pin Views"]
created: 2026-10-15
updated: 2026-10-26
tags: [feature, module/discovery, priority/high, release/v1]
---

# PinCast & Nearby

**Backend:** TODO · **Priority:** High · **Release:** v1 · **Module:** [[Discovery Module|Discovery]]

**Layers:** [[PinCast & Nearby Story|Story]] · [[PinCast & Nearby Frontend Requirements|Frontend Requirements]] · [[PinCast & Nearby Backend Delivery|Backend Delivery]] · [[PinCast & Nearby Backend Integration|Backend Integration]] · [[PinCast & Nearby Frontend Delivery|Frontend Delivery]] · [[PinCast & Nearby QA Backend|QA Backend]] · [[PinCast & Nearby QA Frontend|QA Frontend]]

Proximity broadcast limited by distance and time (s39 – s42) and nearby-by-Ring. The PostGIS column, trigger and GiST index are in place.

## Design reference

| Screen | Name | Note |
|---|---|---|
| [[Screen Index#s11|s11]] | Home · Broadcasting |  |
| [[Screen Index#s39|s39]] | PinCast · hidden |  |
| [[Screen Index#s40|s40]] | PinCast · live |  |
| [[Screen Index#s41|s41]] | PinCast setup |  |
| [[Screen Index#s42|s42]] | PinCast results |  |

Wireframe brief sections: [[Wireframe Brief#Nearby discovery|§6.2 Nearby discovery]], [[Wireframe Brief#PinCast|§6.3 PinCast]]

Prototype: `socialPin-design/.proto2.json` (screen ids above), click-through map in [[Navigation Map]], see [[Design Reference]].

## Tasks

| Task | Status | Priority | Effort |
|---|---|---|---|
| [[T-032 PinCast setup, start, stop, results]] | ⬜ To do | High | L |

```dataview
TABLE status, priority, effort FROM #task WHERE feature = "pincast" SORT priority ASC
```

## Related

- [[Discover Hub & Search]]
- [[Ring Access Engine]]
- [[Notifications]]
- [[Cleanup Jobs]]
- [[Connections]]

Project context: [[Ring Access Model]] · [[Architecture]] · [[API Conventions]] · [[Spec Map]]
