---
type: feature
id: widgets
name: "Widgets"
status: partial
priority: P1
domain: identity
screens: [s36, s37]
updated: 2026-10-15
tags: [feature, status/partial, domain/identity, priority/P1]
---

# 🟡 Widgets

**Status:** Partial (needs more) · **Priority:** P1 · **Domain:** [[Feature Tree#Identity Core|Identity Core]]

Widgets on a Ring (s37). The table exists; no endpoints; the type list does not match the design.

## Design reference

| Screen | Name | Note |
|---|---|---|
| [[Screen Index#s36|s36]] | Add to this Ring |  |
| [[Screen Index#s37|s37]] | Widgets |  |

Wireframe brief sections: [[Wireframe Brief#Home — Rings hub + active profile|§4.1 Home — Rings hub + active profile]]

Prototype: `socialPin-design/.proto2.json` (screen ids above), click-through map in [[Navigation Map]], see [[Design Reference]].

## Backend state

**Endpoints:** none yet.

**Tables / models:** `RingWidget`

**Code:** `prisma/schema/ring.prisma (WIDGET_TYPE)`

### What exists

- `RingWidget` with `WIDGET_TYPE`: LINKS, GALLERY, VIDEO, FILES, CALENDAR, CONTACT_CARD, MAP, CUSTOM.

### Gaps

- Add the design's types: **Availability, Payment, Now playing, Testimonial** (Map already exists).
- CRUD under `/rings/:ringId/projection/widgets` with sort order and visibility.
- Viewer rendering through `RingProfileService.toView`.

## Tasks

| Task | Status | Priority | Effort |
|---|---|---|---|
| [[T-017 Extend WIDGET_TYPE to the design's list]] | ⬜ To do | P1 | S |
| [[T-018 Widget CRUD on the projection]] | ❓ Needs a decision / info | P1 | M |

```dataview
TABLE status, priority, effort FROM #task WHERE feature = "widgets" SORT priority ASC
```

## Open decisions

- [[D-03 Field library vs per-Ring copies]]

## Related

- [[Ring Projection]]
- [[Meetings]]

Project context: [[Ring Access Model]] · [[Architecture]] · [[API Conventions]] · [[SPEC_MAP]]
