---
type: feature
id: photo-library
name: "Photo Library"
status: partial
priority: P1
module: identity
screens: [s29, s30]
updated: 2026-10-18
tags: [feature, status/partial, module/identity, priority/P1]
---

# 🟡 Photo Library

**Status:** Partial (needs more) · **Priority:** P1 · **Module:** [[Identity Core Module|Identity Core]]

**Layers:** [[Photo Library Story|Story]] · [[Photo Library Frontend Requirements|Frontend Requirements]] · [[Photo Library Backend Delivery|Backend Delivery]] · [[Photo Library Backend Integration|Backend Integration]] · [[Photo Library Frontend Delivery|Frontend Delivery]] · [[Photo Library QA Backend|QA Backend]] · [[Photo Library QA Frontend|QA Frontend]]

The user's uploaded photos, reusable across Rings, with a "N Rings inherit it" count (s30).

## Design reference

| Screen | Name | Note |
|---|---|---|
| [[Screen Index#s29|s29]] | Photo for this Ring | "Reset to Pin" → D-02 |
| [[Screen Index#s30|s30]] | Photo library |  |

Wireframe brief sections: [[Wireframe Brief#Home — Rings hub + active profile|§4.1 Home — Rings hub + active profile]]

Prototype: `socialPin-design/.proto2.json` (screen ids above), click-through map in [[Navigation Map]], see [[Design Reference]].

## Tasks

| Task | Status | Priority | Effort |
|---|---|---|---|
| [[T-012 List my files (photo library)]] | ⬜ To do | P1 | S |
| [[T-013 Usage count per file across Rings]] | ⬜ To do | P2 | S |

```dataview
TABLE status, priority, effort FROM #task WHERE feature = "photo-library" SORT priority ASC
```

## Open decisions

- [[D-02 Base profile work fields]]
- [[D-05 Copy or inherit]]

## Related

- [[Files Upload]]
- [[Ring Projection]]
- [[Profiles & Pin Name]]

Project context: [[Ring Access Model]] · [[Architecture]] · [[API Conventions]] · [[Spec Map]]
