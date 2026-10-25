---
type: feature
id: counts
name: "Counts"
priority: high
release: v1
module: identity
screens: [s11, s12, s14, s16, s17, s68]
updated: 2026-10-25
tags: [feature, module/identity, priority/high, release/v1]
---

# Counts

**Backend:** Partial (needs more) · **Priority:** High · **Release:** v1 · **Module:** [[Identity Core Module|Identity Core]]

**Layers:** [[Counts Story|Story]] · [[Counts Frontend Requirements|Frontend Requirements]] · [[Counts Backend Delivery|Backend Delivery]] · [[Counts Backend Integration|Backend Integration]] · [[Counts Frontend Delivery|Frontend Delivery]] · [[Counts QA Backend|QA Backend]] · [[Counts QA Frontend|QA Frontend]]

Member counts per Ring ("148 people") and connection counts ("218 connections") shown on Home, Ring data, My Rings and Me.

## Design reference

| Screen | Name | Note |
|---|---|---|
| [[Screen Index#s11|s11]] | Home · Broadcasting |  |
| [[Screen Index#s12|s12]] | Home · Idle |  |
| [[Screen Index#s14|s14]] | Ring data |  |
| [[Screen Index#s16|s16]] | My Rings |  |
| [[Screen Index#s17|s17]] | Shared with me | List done; review / decline invite todo |
| [[Screen Index#s68|s68]] | Me / Account |  |

Wireframe brief sections: [[Wireframe Brief#Home — Rings hub + active profile|§4.1 Home — Rings hub + active profile]], [[Wireframe Brief#Ring management|§4.2 Ring management]]

Prototype: `socialPin-design/.proto2.json` (screen ids above), click-through map in [[Navigation Map]], see [[Design Reference]].

## Tasks

| Task | Status | Priority | Effort |
|---|---|---|---|
| [[T-004 Member count per Ring on list and detail]] | ⬜ To do | High | S |
| [[T-005 Connection count on Me and Home]] | ⛔ Blocked | High | S |

```dataview
TABLE status, priority, effort FROM #task WHERE feature = "counts" SORT priority ASC
```

## Related

- [[Rings]]
- [[Connections]]
- [[Account]]

Project context: [[Ring Access Model]] · [[Architecture]] · [[API Conventions]] · [[Spec Map]]
