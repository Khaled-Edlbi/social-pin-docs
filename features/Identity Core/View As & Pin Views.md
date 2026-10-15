---
type: feature
id: view-as
name: "View As & Pin Views"
status: done
priority: P0
domain: identity
screens: [s10, s31, s44]
updated: 2026-10-15
tags: [feature, status/done, domain/identity, priority/P0]
---

# ✅ View As & Pin Views

**Status:** Done · **Priority:** P0 · **Domain:** [[Feature Tree#Identity Core|Identity Core]]

The viewer-facing read path: open someone by Pin name, render one Ring (QR scan and the owner's "View as"), and list every perspective you hold of one person.

## Design reference

| Screen | Name | Note |
|---|---|---|
| [[Screen Index#s10|s10]] | View as teaser |  |
| [[Screen Index#s31|s31]] | View as (flip) |  |
| [[Screen Index#s44|s44]] | Scanned Pin | Read part done; Connect todo |

Wireframe brief sections: [[Wireframe Brief#Core product concept|§1 Core product concept]], [[Wireframe Brief#View as|§4.3 View as]], [[Wireframe Brief#QR scan|§4.5 QR scan]]

Prototype: `socialPin-design/.proto2.json` (screen ids above), click-through map in [[Navigation Map]], see [[Design Reference]].

## Backend state

**Endpoints**

- `GET /views/pin/:pinName`
- `GET /views/ring/:ringId`
- `GET /views/user/:userId/perspectives`

**Tables / models:** `RingProfile`, `RingMember`, `UserBlock`

**Code:** `src/modules/ring-profile/profile-view.controller.ts`, `src/modules/ring-profile/ring-profile.service.ts`

### What exists

- `GET /views/ring/:ringId` is the **same code path** for the owner and for a member, which is what makes "View as" trustworthy.
- `RingProfileViewEntity` has no `ringId`: the viewer never learns which Ring they are in.
- "Not shared with you", "blocked" and "no such pin name" return the **same 404 body**. Specs assert the bodies are identical.
- Perspectives arrive in a stable order (default Ring first) with no identifier; the switcher indexes by position.

### Gaps

- The scanned-pin screen (s44) continues into a Connect request, which does not exist. See [[Connections]].
- Scanning resolves a **QR token**, not a ring id; token issue / resolve is not written. See [[Badge & QR]].

## Tasks

_No open tasks._

```dataview
TABLE status, priority, effort FROM #task WHERE feature = "view-as" SORT priority ASC
```

## Related

- [[Ring Access Engine]]
- [[Ring Projection]]
- [[Badge & QR]]
- [[Connections]]

Project context: [[Ring Access Model]] · [[Architecture]] · [[API Conventions]] · [[SPEC_MAP]]
