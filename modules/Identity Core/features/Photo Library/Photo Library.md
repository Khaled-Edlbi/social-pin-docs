---
type: feature
id: photo-library
name: "Photo Library"
priority: high
release: v1
module: identity
screens: [s29, s30]
created: 2026-10-15
updated: 2026-10-26
owner: "omar"
tags: [feature, module/identity, priority/high, release/v1]
---

# Photo Library

**Backend:** Partial (needs more) · **Priority:** High · **Release:** v1 · **Module:** [[Identity Core Module|Identity Core]]

**Layers:** [[Photo Library Story|Story]] · [[Photo Library Frontend Requirements|Frontend Requirements]] · [[Photo Library Backend Delivery|Backend Delivery]] · [[Photo Library Backend Integration|Backend Integration]] · [[Photo Library Frontend Delivery|Frontend Delivery]] · [[Photo Library QA Backend|QA Backend]] · [[Photo Library QA Frontend|QA Frontend]]

The user's uploaded photos, reusable across Rings, with a "N Rings inherit it" count (s30).

## Design reference

| Screen | Name | Note |
|---|---|---|
| [[Screen Index#s29|s29]] | Photo for this Ring | "Reset to Pin" → ND-02 |
| [[Screen Index#s30|s30]] | Photo library |  |

Wireframe brief sections: [[Wireframe Brief#Home — Rings hub + active profile|§4.1 Home — Rings hub + active profile]]

Prototype: `socialPin-design/.proto2.json` (screen ids above), click-through map in [[Navigation Map]], see [[Design Reference]].

## Tasks

| Task | Status | Priority | Effort |
|---|---|---|---|
| [[T-012 List my files (photo library)]] | ⬜ To do | High | S |
| [[T-013 Usage count per file across Rings]] | ⬜ To do | Medium | S |

```dataview
TABLE status, priority, effort FROM #task WHERE feature = "photo-library" SORT priority ASC
```

## Decisions

- [[ND-02 Base profile work fields]] — decided, one main profile every Ring starts from; a Ring may pick its own photo ([[D-02 One main profile every Ring starts from|D-02]])
- [[ND-05 Copy or inherit]] — decided, inherit per field, copy without members ([[D-05 Inherit per field, copy without members|D-05]])

## Related

- [[Files Upload]]
- [[Ring Projection]]
- [[Profiles & Pin Name]]

Project context: [[Ring Access Model]] · [[Architecture]] · [[API Conventions]] · [[Spec Map]]
