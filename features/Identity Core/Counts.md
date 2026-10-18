---
type: feature
id: counts
name: "Counts"
status: partial
priority: P1
domain: identity
screens: [s11, s12, s14, s16, s17, s68]
updated: 2026-10-18
tags: [feature, status/partial, domain/identity, priority/P1]
---

# 🟡 Counts

**Status:** Partial (needs more) · **Priority:** P1 · **Domain:** [[Feature Tree#Identity Core|Identity Core]] · **Story:** [[Counts Story]] · **Requirements:** [[Counts Requirements]]

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

## Backend state

**Endpoints:** none yet.

**Tables / models:** `RingMember`, `Connection`

**Code:** `src/modules/ring/`

### What exists

- All the data exists; counts are derived.

### Gaps

- No endpoint returns a member count per Ring.
- No endpoint returns a connection count (and connections do not exist yet).
- Decide whether counts ride on the list entities (`memberCount` on `RingEntity`) or on a separate stats endpoint.

## Tasks

| Task | Status | Priority | Effort |
|---|---|---|---|
| [[T-004 Member count per Ring on list and detail]] | ⬜ To do | P1 | S |
| [[T-005 Connection count on Me and Home]] | ⛔ Blocked | P1 | S |

```dataview
TABLE status, priority, effort FROM #task WHERE feature = "counts" SORT priority ASC
```

## Related

- [[Rings]]
- [[Connections]]
- [[Account]]

Project context: [[Ring Access Model]] · [[Architecture]] · [[API Conventions]] · [[SPEC_MAP]]
