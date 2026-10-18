---
type: feature
id: view-as
name: "View As & Pin Views"
status: done
priority: P0
domain: identity
screens: [s10, s31, s44]
updated: 2026-10-18
tags: [feature, status/done, domain/identity, priority/P0]
---

# ✅ View As & Pin Views

**Status:** Done · **Priority:** P0 · **Domain:** [[Feature Tree#Identity Core|Identity Core]] · **Frontend guide:** [[View As & Pin Views Frontend]] · **Story:** [[View As & Pin Views Story]] · **Requirements:** [[View As & Pin Views Requirements]]

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

## How it works

Three routes on `ProfileViewController`, all returning `RingProfileViewEntity`, all resolving access **first** through `RingAccessService`. `GET /views/pin/:pinName` looks up the profile by normalised handle, then `resolveDefaultAccess(viewer, owner)`: the owner's own Rings if the viewer is the owner, otherwise, after the mutual-block check, the live Rings of that owner the viewer is a live member of, default Ring first then oldest; the first one is rendered. No profile, no live Ring, or a block all throw the **same** 404 `E_RING_ACCESS_01` body from the same helper, which the specs assert. `GET /views/ring/:ringId` calls `assertRingReadable`: the Ring must be live (404 `E_RING_ACCESS_02` otherwise, owner included), the owner passes, a blocked or non-member viewer gets the not-shared 404, a live member passes; the owner's "View as" is literally this route with their own Ring id. `GET /views/user/:userId/perspectives` calls `resolveAccessibleRings` and renders one projection per Ring in that order, returning an empty array rather than a 404 when nothing is shared. Rendering goes through `selectRingProfileProjection` (hidden rows excluded) and `toView` (sensitive fields gated by the Ring's `show*` flags). Nothing in the entity names the Ring, the owner's user id or the membership.

### What exists

- `GET /views/ring/:ringId` is the **same code path** for the owner and for a member, which is what makes "View as" trustworthy.
- `RingProfileViewEntity` has no `ringId`: the viewer never learns which Ring they are in.
- "Not shared with you", "blocked" and "no such pin name" return the **same 404 body**. Specs assert the bodies are identical.
- Perspectives arrive in a stable order (default Ring first) with no identifier; the switcher indexes by position.

### Gaps

- The scanned-pin screen (s44) continues into a Connect request, which does not exist. See [[Connections]].
- Scanning resolves a **QR token**, not a ring id; token issue / resolve is not written. See [[Badge & QR]].
- **The photo and the attachments cannot be rendered**: no route serves file bytes by id. See [[T-062 Serve uploaded file bytes by id]].
- The owner's "View as" of an **expired** Ring is a 404 `E_RING_ACCESS_02`, because `assertRingReadable` applies the live filter to the owner too. Fine for the member's view; the s62 post-event screen must not rely on it to preview an expired Event Ring.

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
