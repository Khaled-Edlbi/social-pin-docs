---
type: backend-delivery
code: view-as
scope: feature
feature: view-as
module: identity
status: done
screens: [s10, s31, s44]
updated: 2026-10-18
tags: [backend-delivery, backend-delivery/done, module/identity, layer/backend]
---

# ✅ View As & Pin Views · Backend Delivery

**Feature:** [[View As & Pin Views]] · **Status:** Done · **Integration guide:** [[View As & Pin Views Backend Integration]] · **Requirements:** [[View As & Pin Views Frontend Requirements]] · **QA:** [[View As & Pin Views QA Backend]]

What the backend shipped for this feature and how it works. The sum of this feature's task-level Backend Delivery notes (see the *Tasks* table below).

## Endpoints, tables and code

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

## Tasks delivered

| Task | Delivery note | Status |
|---|---|---|
| — | — | — |

## Log

- 2026-10-18 · split out of [[View As & Pin Views]] when the vault moved to layers ([[T-064 Restructure the docs vault]])
