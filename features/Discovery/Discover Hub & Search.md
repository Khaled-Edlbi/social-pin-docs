---
type: feature
id: discover-hub
name: "Discover Hub & Search"
status: todo
priority: P1
domain: discovery
screens: [s38]
updated: 2026-10-18
tags: [feature, status/todo, domain/discovery, priority/P1]
---

# ❌ Discover Hub & Search

**Status:** TODO · **Priority:** P1 · **Domain:** [[Feature Tree#Discovery|Discovery]] · **Story:** [[Discover Hub & Search Story]] · **Requirements:** [[Discover Hub & Search Requirements]]

Discover tab (s38): search by `!pinname`, recent searches, entry points to People, Events, Companies, Exhibitors, PinCast, import contacts.

## Design reference

| Screen | Name | Note |
|---|---|---|
| [[Screen Index#s38|s38]] | Discover hub |  |

Wireframe brief sections: [[Wireframe Brief#Discover hub|§6.1 Discover hub]], [[Wireframe Brief#Contacts & Devices|§6.4 Contacts & Devices]]

Prototype: `socialPin-design/.proto2.json` (screen ids above), click-through map in [[Navigation Map]], see [[Design Reference]].

## Backend state

**Endpoints**

- `GET /views/pin/:pinName (resolve one name)`

**Tables / models:** `Profile`, `AnalyticsEvent`

### What exists

- Resolving one exact Pin name works.

### Gaps

- Search must **not** become a membership oracle: a `!pinname` lookup returns the same 404 whether unknown, not shared, or blocked.
- Recent searches (per user, private).
- Import contacts (phone book match by hashed email / phone).

## Tasks

| Task | Status | Priority | Effort |
|---|---|---|---|
| [[T-030 Discover search by !pinname and recent searches]] | ⬜ To do | P1 | S |
| [[T-031 Import contacts]] | ❓ Needs a decision / info | P2 | M |

```dataview
TABLE status, priority, effort FROM #task WHERE feature = "discover-hub" SORT priority ASC
```

## Related

- [[View As & Pin Views]]
- [[PinCast & Nearby]]
- [[Connections]]
- [[Gemma AI]]

Project context: [[Ring Access Model]] · [[Architecture]] · [[API Conventions]] · [[SPEC_MAP]]
