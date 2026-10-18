---
type: feature
id: view-as
name: "View As & Pin Views"
priority: P0
module: identity
screens: [s10, s31, s44]
updated: 2026-10-18
tags: [feature, module/identity, priority/P0]
---

# View As & Pin Views

**Backend:** Done · **Priority:** P0 · **Module:** [[Identity Core Module|Identity Core]]

**Layers:** [[View As & Pin Views Story|Story]] · [[View As & Pin Views Frontend Requirements|Frontend Requirements]] · [[View As & Pin Views Backend Delivery|Backend Delivery]] · [[View As & Pin Views Backend Integration|Backend Integration]] · [[View As & Pin Views Frontend Delivery|Frontend Delivery]] · [[View As & Pin Views QA Backend|QA Backend]] · [[View As & Pin Views QA Frontend|QA Frontend]]

The viewer-facing read path: open someone by Pin name, render one Ring (QR scan and the owner's "View as"), and list every perspective you hold of one person.

## Design reference

| Screen | Name | Note |
|---|---|---|
| [[Screen Index#s10|s10]] | View as teaser |  |
| [[Screen Index#s31|s31]] | View as (flip) |  |
| [[Screen Index#s44|s44]] | Scanned Pin | Read part done; Connect todo |

Wireframe brief sections: [[Wireframe Brief#Core product concept|§1 Core product concept]], [[Wireframe Brief#View as|§4.3 View as]], [[Wireframe Brief#QR scan|§4.5 QR scan]]

Prototype: `socialPin-design/.proto2.json` (screen ids above), click-through map in [[Navigation Map]], see [[Design Reference]].

## Tasks

_No open tasks._

```dataview
TABLE status, priority, effort FROM #task WHERE feature = "view-as" SORT priority ASC
```

## Related

- [[Ring Access Engine]]
- [[Ring Projection]]
- [[Badge & QR]]
- [[Connections]]

Project context: [[Ring Access Model]] · [[Architecture]] · [[API Conventions]] · [[Spec Map]]
