---
type: feature
id: photo-library
name: "Photo Library"
status: partial
priority: P1
domain: identity
screens: [s29, s30]
updated: 2026-10-15
tags: [feature, status/partial, domain/identity, priority/P1]
---

# 🟡 Photo Library

**Status:** Partial (needs more) · **Priority:** P1 · **Domain:** [[Feature Tree#Identity Core|Identity Core]]

The user's uploaded photos, reusable across Rings, with a "N Rings inherit it" count (s30).

## Design reference

| Screen | Name | Note |
|---|---|---|
| [[Screen Index#s29|s29]] | Photo for this Ring | "Reset to Pin" → D-02 |
| [[Screen Index#s30|s30]] | Photo library |  |

Wireframe brief sections: [[Wireframe Brief#Home — Rings hub + active profile|§4.1 Home — Rings hub + active profile]]

Prototype: `socialPin-design/.proto2.json` (screen ids above), click-through map in [[Navigation Map]], see [[Design Reference]].

## Backend state

**Endpoints**

- `POST /files (upload works)`

**Tables / models:** `File`, `RingProfile`

**Code:** `src/modules/file/`

### What exists

- Upload, metadata, delete.

### Gaps

- `GET /files` list of my files (paginated, filter by kind).
- Usage count per file across Ring projections.
- "Reset to Pin" (s29) needs a base profile photo. See [[D-02 Base profile work fields]].

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

Project context: [[Ring Access Model]] · [[Architecture]] · [[API Conventions]] · [[SPEC_MAP]]
