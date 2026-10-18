---
type: feature
id: exhibitor
name: "Exhibitor"
status: todo
priority: P1
domain: events
screens: [s63, s64, s65]
updated: 2026-10-18
tags: [feature, status/todo, domain/events, priority/P1]
---

# ❌ Exhibitor

**Status:** TODO · **Priority:** P1 · **Domain:** [[Feature Tree#Events|Events]] · **Story:** [[Exhibitor Story]] · **Requirements:** [[Exhibitor Requirements]]

Business account setup and business Ring (s63), team on the stand, "Discoverable via Gemma" toggle, booth analytics and leads CSV export (s65), organizer touchpoints (invitation, requested files, booth and payment status).

## Design reference

| Screen | Name | Note |
|---|---|---|
| [[Screen Index#s63|s63]] | Business account |  |
| [[Screen Index#s64|s64]] | Incoming meetings |  |
| [[Screen Index#s65|s65]] | Booth analytics |  |

Wireframe brief sections: [[Wireframe Brief#Exhibitor journeys|§9 Exhibitor journeys]]

Prototype: `socialPin-design/.proto2.json` (screen ids above), click-through map in [[Navigation Map]], see [[Design Reference]].

## Backend state

**Endpoints:** none yet.

**Tables / models:** `Business`, `BusinessMember`, `Exhibitor`, `ExhibitorDocument`, `Booth`, `AnalyticsEvent`

### What exists

- Exhibitor, document and booth schema; `AnalyticsEvent` table.

### Gaps

- Business account multi-step setup, creating a business `CORPORATE` Ring.
- Team members on the stand (business members → Ring members).
- Discoverable-via-AI toggle (feeds [[Gemma AI]]).
- Analytics: QR scans, video clicks, Rings opened, leads export.

## Tasks

| Task | Status | Priority | Effort |
|---|---|---|---|
| [[T-048 Business account setup → business Ring]] | ⬜ To do | P1 | L |
| [[T-048b Booth analytics and leads CSV export]] | ⛔ Blocked | P1 | M |

```dataview
TABLE status, priority, effort FROM #task WHERE feature = "exhibitor" SORT priority ASC
```

## Related

- [[Companies]]
- [[Events During]]
- [[Meetings]]
- [[Badge & QR]]
- [[Gemma AI]]

Project context: [[Ring Access Model]] · [[Architecture]] · [[API Conventions]] · [[SPEC_MAP]]
