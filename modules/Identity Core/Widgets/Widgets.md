---
type: feature
id: widgets
name: "Widgets"
priority: high
module: identity
screens: [s36, s37]
updated: 2026-10-19
tags: [feature, module/identity, priority/high]
---

# Widgets

**Backend:** Partial (needs more) · **Priority:** High · **Module:** [[Identity Core Module|Identity Core]]

**Layers:** [[Widgets Story|Story]] · [[Widgets Frontend Requirements|Frontend Requirements]] · [[Widgets Backend Delivery|Backend Delivery]] · [[Widgets Backend Integration|Backend Integration]] · [[Widgets Frontend Delivery|Frontend Delivery]] · [[Widgets QA Backend|QA Backend]] · [[Widgets QA Frontend|QA Frontend]]

Widgets on a Ring (s37). The table exists; no endpoints; the type list does not match the design.

## Design reference

| Screen | Name | Note |
|---|---|---|
| [[Screen Index#s36|s36]] | Add to this Ring |  |
| [[Screen Index#s37|s37]] | Widgets |  |

Wireframe brief sections: [[Wireframe Brief#Home — Rings hub + active profile|§4.1 Home — Rings hub + active profile]]

Prototype: `socialPin-design/.proto2.json` (screen ids above), click-through map in [[Navigation Map]], see [[Design Reference]].

## Tasks

| Task | Status | Priority | Effort |
|---|---|---|---|
| [[T-017 Extend WIDGET_TYPE to the design's list]] | ⬜ To do | High | S |
| [[T-018 Widget CRUD on the projection]] | ❓ Needs a decision / info | High | M |

```dataview
TABLE status, priority, effort FROM #task WHERE feature = "widgets" SORT priority ASC
```

## Open decisions

- [[D-03 Field library vs per-Ring copies]]

## Related

- [[Ring Projection]]
- [[Meetings]]

Project context: [[Ring Access Model]] · [[Architecture]] · [[API Conventions]] · [[Spec Map]]
