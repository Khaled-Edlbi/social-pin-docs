---
id: BD-12
type: backend-delivery
module: identity
feature: view-as
status: done
scope: feature
screens: [s10, s31, s44]
created: 2026-10-15
updated: 2026-11-05
tags: [backend-delivery, backend-delivery/done, module/identity, layer/backend]
---

# ✅ View As & Pin Views · Backend Delivery

**Feature:** [[F-12 View As & Pin Views]] · **Status:** Done · **Integration guide:** [[BI-09 View As & Pin Views Backend Integration]] · **Requirements:** [[FR-12 View As & Pin Views Frontend Requirements]] · **QA:** [[View As & Pin Views QA Backend]]

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
- Every view carries `avatarUrl` and a `url` per attachment: signed links valid 15 minutes, made in `toView` after `RingAccessService` let the request through, so a viewer gets a link for exactly what they may see and never a file id on an attachment ([[D-16 Files load from signed links that expire in 15 minutes]]; served by `GET /files/content/:token`, [[BD-04 Files Upload Backend Delivery]]).

### Gaps

- The scanned-pin screen (s44) continues into a Connect request, which does not exist. See [[F-14 Connections]].
- Scanning resolves a **QR token**, not a ring id; token issue / resolve is not written. See [[F-18 Badge & QR]].
- **The view still carries `avatarFileId`**, from before D-16, which says viewers never receive a file id. The client should read `avatarUrl` instead; the field is removed once [[FR-12 View As & Pin Views Frontend Requirements|FR-12]] no longer reads it (flagged there).
- The owner's "View as" of an **expired** Ring is a 404 `E_RING_ACCESS_02`, because `assertRingReadable` applies the live filter to the owner too. Fine for the member's view; the s62 post-event screen must not rely on it to preview an expired Event Ring.

## Log

- 2026-10-18 · split out of [[F-12 View As & Pin Views]] when the vault moved to layers
- 2026-11-05 · branch `FR-04/file/signed-links-and-library` (`df93921`), merged to `main @ 80e7fa2` · every `/views/*` response carries `avatarUrl` and `attachments[].url`, signed, valid 15 minutes, made after the access check ([[D-16 Files load from signed links that expire in 15 minutes]]); the rest is on [[BD-04 Files Upload Backend Delivery]]'s log. Checked live on View as: both links load, the attachment carries no `fileId`. `avatarFileId` stays on the view for now (Gaps). Updated [[BI-09 View As & Pin Views Backend Integration]]; FR-12's rows flipped and FR-12 flagged.
