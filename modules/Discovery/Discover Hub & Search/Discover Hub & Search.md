---
type: feature
id: discover-hub
name: "Discover Hub & Search"
status: todo
priority: P1
module: discovery
screens: [s38]
updated: 2026-10-18
tags: [feature, status/todo, module/discovery, priority/P1]
---

# ❌ Discover Hub & Search

**Status:** TODO · **Priority:** P1 · **Module:** [[Discovery Module|Discovery]]

**Layers:** [[Discover Hub & Search Story|Story]] · [[Discover Hub & Search Frontend Requirements|Frontend Requirements]] · [[Discover Hub & Search Backend Delivery|Backend Delivery]] · [[Discover Hub & Search Backend Integration|Backend Integration]] · [[Discover Hub & Search Frontend Delivery|Frontend Delivery]] · [[Discover Hub & Search QA Backend|QA Backend]] · [[Discover Hub & Search QA Frontend|QA Frontend]]

Discover tab (s38): search by `!pinname`, recent searches, entry points to People, Events, Companies, Exhibitors, PinCast, import contacts.

## Design reference

| Screen | Name | Note |
|---|---|---|
| [[Screen Index#s38|s38]] | Discover hub |  |

Wireframe brief sections: [[Wireframe Brief#Discover hub|§6.1 Discover hub]], [[Wireframe Brief#Contacts & Devices|§6.4 Contacts & Devices]]

Prototype: `socialPin-design/.proto2.json` (screen ids above), click-through map in [[Navigation Map]], see [[Design Reference]].

## Tasks

| Task | Status | Priority | Effort |
|---|---|---|---|
| [[T-030 Discover search by !pinname and recent searches]] | ⬜ To do | P1 | S |
| [[T-031 Import contacts]] | ❓ Needs a decision / info | P2 | M |

```dataview
TABLE status, priority, effort FROM #task WHERE feature = "discover-hub" SORT priority ASC
```

## Related

- [[View As & Pin Views]]
- [[PinCast & Nearby]]
- [[Connections]]
- [[Gemma AI]]

Project context: [[Ring Access Model]] · [[Architecture]] · [[API Conventions]] · [[Spec Map]]
