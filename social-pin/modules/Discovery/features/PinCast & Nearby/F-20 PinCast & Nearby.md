---
id: F-20
type: feature
module: discovery
feature: pincast
name: "PinCast & Nearby"
priority: high
release: v1
screens: [s11, s39, s40, s41, s42]
related: ["F-11 Rings", "F-12 View As & Pin Views"]
created: 2026-10-15
updated: 2026-10-29
tags: [feature, module/discovery, priority/high, release/v1]
---

# PinCast & Nearby

**Backend:** TODO · **Priority:** High · **Release:** v1 · **Module:** [[M-04 Discovery Module|Discovery]]

**Layers:** [[S-45 PinCast & Nearby Story|Story]] · [[FR-20 PinCast & Nearby Frontend Requirements|Frontend Requirements]] · [[BD-20 PinCast & Nearby Backend Delivery|Backend Delivery]] · [[PinCast & Nearby Backend Integration|Backend Integration]] · [[PinCast & Nearby Frontend Delivery|Frontend Delivery]] · [[PinCast & Nearby QA Backend|QA Backend]] · [[PinCast & Nearby QA Frontend|QA Frontend]]

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

## Work

One story per feature (since 2026-10-27): all of this feature's work is in [[S-45 PinCast & Nearby Story]]. The tasks merged into it on 2026-10-27:

| Was | Title | Status then | Priority | Now in the story |
|---|---|---|---|---|
| T-032 | PinCast setup, start, stop, results | To do | high | S7 |

### Log of the merged tasks

- T-032 · 2026-10-15 · created from the backend vs design comparison ([[Status Report 2026-10-15]])
- T-032 · 2026-10-18 · created as the backend half of T-032
- T-032 · 2026-10-18 · created as the frontend half of T-032

## Related

- [[F-19 Discover Hub & Search]]
- [[F-08 Ring Access Engine]]
- [[F-39 Notifications]]
- [[F-31 Cleanup Jobs]]
- [[F-14 Connections]]

Project context: [[Ring Access Model]] · [[Architecture]] · [[API Conventions]] · [[Spec Map]]
