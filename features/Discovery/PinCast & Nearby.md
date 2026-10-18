---
type: feature
id: pincast
name: "PinCast & Nearby"
status: todo
priority: P1
domain: discovery
screens: [s11, s39, s40, s41, s42]
updated: 2026-10-18
tags: [feature, status/todo, domain/discovery, priority/P1]
---

# ❌ PinCast & Nearby

**Status:** TODO · **Priority:** P1 · **Domain:** [[Feature Tree#Discovery|Discovery]] · **Story:** [[PinCast & Nearby Story]] · **Requirements:** [[PinCast & Nearby Requirements]]

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

## Backend state

**Endpoints:** none yet.

**Tables / models:** `Pincast`, `PincastRecipient`, `Location`

**Code:** `prisma/migrations/…_constraints_and_indexes (pincasts_geo_gist)`

### What exists

- `pincasts.geo` geography column kept in sync by trigger, GiST index, `PincastRecipient.detectedAt` indexed for purging.

### Gaps

- Setup / start / stop a PinCast bound to a Ring, radius and duration.
- Geo query for nearby PinCasts and nearby-by-Ring (through [[Ring Access Engine]]).
- Results list of who was reached; coordinates never reach a recipient.
- "PinCast ended" and "pins nearby" notifications.
- Recipient purge job, see [[Cleanup Jobs]].

## Tasks

| Task | Status | Priority | Effort |
|---|---|---|---|
| [[T-032 PinCast setup, start, stop, results]] | ⬜ To do | P1 | L |

```dataview
TABLE status, priority, effort FROM #task WHERE feature = "pincast" SORT priority ASC
```

## Related

- [[Discover Hub & Search]]
- [[Ring Access Engine]]
- [[Notifications]]
- [[Cleanup Jobs]]
- [[Connections]]

Project context: [[Ring Access Model]] · [[Architecture]] · [[API Conventions]] · [[SPEC_MAP]]
