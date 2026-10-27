---
type: feature
id: discover-hub
name: "Discover Hub & Search"
priority: high
release: v1
module: discovery
screens: [s38]
created: 2026-10-15
updated: 2026-10-27
tags: [feature, module/discovery, priority/high, release/v1]
---

# Discover Hub & Search

**Backend:** TODO · **Priority:** High · **Release:** v1 · **Module:** [[Discovery Module|Discovery]]

**Layers:** [[Discover Hub & Search Story|Story]] · [[Discover Hub & Search Frontend Requirements|Frontend Requirements]] · [[Discover Hub & Search Backend Delivery|Backend Delivery]] · [[Discover Hub & Search Backend Integration|Backend Integration]] · [[Discover Hub & Search Frontend Delivery|Frontend Delivery]] · [[Discover Hub & Search QA Backend|QA Backend]] · [[Discover Hub & Search QA Frontend|QA Frontend]]

Discover tab (s38): search by `!pinname`, recent searches, entry points to People, Events, Companies, Exhibitors, PinCast, import contacts.

## Design reference

| Screen | Name | Note |
|---|---|---|
| [[Screen Index#s38|s38]] | Discover hub |  |

Wireframe brief sections: [[Wireframe Brief#Discover hub|§6.1 Discover hub]], [[Wireframe Brief#Contacts & Devices|§6.4 Contacts & Devices]]

Prototype: `socialPin-design/.proto2.json` (screen ids above), click-through map in [[Navigation Map]], see [[Design Reference]].

## Work

One story per feature (since 2026-10-27): all of this feature's work is in [[Discover Hub & Search Story]]. The tasks merged into it on 2026-10-27:

| Was | Title | Status then | Priority | Now in the story |
|---|---|---|---|---|
| T-030 | Discover search by !pinname and recent searches | To do | high | S6 |
| T-031 | Import contacts | Needs a decision | medium | S7 |

### Log of the merged tasks

- T-030 · 2026-10-15 · created from the backend vs design comparison ([[Status Report 2026-10-15]])
- T-030 · 2026-10-18 · created as the backend half of T-030
- T-030 · 2026-10-18 · created as the frontend half of T-030
- T-031 · 2026-10-15 · created from the backend vs design comparison ([[Status Report 2026-10-15]])
- T-031 · 2026-10-18 · created as the backend half of T-031
- T-031 · 2026-10-18 · created as the frontend half of T-031

## Related

- [[View As & Pin Views]]
- [[PinCast & Nearby]]
- [[Connections]]
- [[Gemma AI]]

Project context: [[Ring Access Model]] · [[Architecture]] · [[API Conventions]] · [[Spec Map]]
