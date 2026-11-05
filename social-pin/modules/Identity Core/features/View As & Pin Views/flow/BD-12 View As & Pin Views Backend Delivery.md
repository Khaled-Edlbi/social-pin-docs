---
id: BD-12
type: backend-delivery
module: identity
feature: view-as
status: done
scope: feature
screens: [s10, s31, s44]
pending: ["[[FR-12 View As & Pin Views Frontend Requirements]]: remove avatarFileId from the viewer's view (RingProfileViewEntity), so a viewer never receives a file id (D-16); the owner's projection keeps it", "[[FR-12 View As & Pin Views Frontend Requirements]]: GET /views/ring/:ringId answers an expired Ring with its own 404 body before the membership check; decide with BD-08 whether a non-member gets the not-shared body"]
created: 2026-10-15
updated: 2026-11-05
tags: [backend-delivery, backend-delivery/done, module/identity, layer/backend]
---

# ✅ View As & Pin Views · Backend Delivery

> ⚠ Affected by [[BD-07 Profiles & Pin Name Backend Delivery]] (2026-11-05): backend main a249ab2: a Ring's viewer view now shows the main profile's bio, and its photo as avatarUrl, while the Ring sets none (S-14 S11); the main photo's file id never reaches the viewer (avatarFileId stays the Ring's own); for /backend

**Feature:** [[F-12 View As & Pin Views]] · **Status:** Done · **Integration guide:** [[BI-09 View As & Pin Views Backend Integration]] · **Requirements:** [[FR-12 View As & Pin Views Frontend Requirements]] · **QA:** [[View As & Pin Views QA Backend]]

What the backend shipped for this feature and how it works.

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

- The scanned-pin screen (s44) continues into a Connect request, which does not exist: [[S-23 Connections Story|Connections · S2–S4]] ([[F-14 Connections]]).
- Scanning resolves a **QR token**, not a ring id; token issue / resolve is not written. See [[F-18 Badge & QR]].
- **The view still carries `avatarFileId`**, from before D-16, which says viewers never receive a file id. The client reads `avatarUrl` instead; removing the field from the viewer's entity is `pending` (FR-12 says so since its 2026-11-05 review).
- Not built, each in its own feature: blocking a person ([[S-23 Connections Story|Connections · S13]]); the public page by Pin name ([[D-22 The public page only says the Pin exists]], on [[BD-07 Profiles & Pin Name Backend Delivery]]); headline and company on a view (the main profile fields, BD-07; per Ring, [[BD-10 Ring Projection Backend Delivery]]); widget routes ([[BD-13 Widgets Backend Delivery]]; `widgets[]` is already on the view).
- No route validates a Pin name: a malformed one answers the same 404 as an unknown one. Only a malformed `ringId` or `userId` is a 400 (`ParseUUIDPipe`). Auth on these routes: a missing or expired token is a plain 401 with no code; a suspended account 401 `E_AUTH_03`, a deleted one 404 `E_USER_01`.
- The owner's "View as" of an **expired** Ring is a 404 `E_RING_ACCESS_02`, because `assertRingReadable` applies the live filter to the owner too. Fine for the member's view; the s62 post-event screen must not rely on it to preview an expired Event Ring.

## Log

- 2026-10-18 · split out of [[F-12 View As & Pin Views]] when the vault moved to layers
- 2026-11-05 · branch `FR-04/file/signed-links-and-library` (`df93921`), merged to `main @ 80e7fa2` · every `/views/*` response carries `avatarUrl` and `attachments[].url`, signed, valid 15 minutes, made after the access check ([[D-16 Files load from signed links that expire in 15 minutes]]); the rest is on [[BD-04 Files Upload Backend Delivery]]'s log. Checked live on View as: both links load, the attachment carries no `fileId`. `avatarFileId` stays on the view for now (Gaps). Updated [[BI-09 View As & Pin Views Backend Integration]]; FR-12's rows flipped and FR-12 flagged.
- 2026-11-05 · `docs/backend/M-01-identity/F-12-view-as/BD-12-open-asks` · checked against backend `main` f186ba1 in the review of [[FR-12 View As & Pin Views Frontend Requirements]] (sent back to `draft` on its own branch): removing `avatarFileId` from the view and the `/views/ring` expired-body question added to `pending`; the Gaps name what other features owe and how auth and a bad Pin name answer.
