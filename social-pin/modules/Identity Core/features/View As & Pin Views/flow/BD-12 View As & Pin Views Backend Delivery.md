---
id: BD-12
type: backend-delivery
module: identity
feature: view-as
status: done
scope: feature
screens: [s10, s31, s44]
pending: ["[[FR-12 View As & Pin Views Frontend Requirements]]: GET /views/ring/:ringId answers an expired Ring with its own 404 body before the membership check; decide with BD-08 whether a non-member gets the not-shared body"]
created: 2026-10-15
updated: 2026-11-08
tags: [backend-delivery, backend-delivery/done, module/identity, layer/backend]
---

# ✅ View As & Pin Views · Backend Delivery

> ⚠ Affected by [[BD-07 Profiles & Pin Name Backend Delivery]] (2026-11-05): backend main a249ab2: a Ring's viewer view now shows the main profile's bio, and its photo as avatarUrl, while the Ring sets none (S-14 S11); the main photo's file id never reaches the viewer (avatarFileId stays the Ring's own); for /backend

**Feature:** [[F-12 View As & Pin Views]] · **Status:** Done · **Integration guide:** [[BI-09 View As & Pin Views Backend Integration]] · **Requirements:** [[FR-12 View As & Pin Views Frontend Requirements]] · **QA:** [[QB-14 View As & Pin Views QA Backend]]

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

A Ring with no projection row yet is rendered as the **empty projection** ([[B-17 A new Ring answers 404 to its own owner until its projection is opened]]). Only `POST /rings` leaves a Ring in that state, until its owner first opens or edits the projection, which creates the row. The empty projection is built in memory from the profile the row will be created with: the Ring's own profile, else the owner's default, the same choice `resolveRingProfileId` makes. It has no overrides, every `show*` switch `false` (the column default) and no links, fields, widgets or attachments, so the view does not change when the row is created. It goes through the same `toView`, after the same access check. It is read-only on purpose: a viewer's `GET` never writes the owner's rows, and there is no create to race. A Pin name lookup still renders a Ring only when that Ring presents the looked-up profile. With no profile to present, the answer is the same not-shared 404.

### What exists

- `GET /views/ring/:ringId` is the **same code path** for the owner and for a member, which is what makes "View as" trustworthy.
- `RingProfileViewEntity` has no `ringId`: the viewer never learns which Ring they are in.
- A Ring just made renders from its first moment, for its owner on View as and for its members, as the empty projection; `/perspectives` includes it (S-19 S1).
- "Not shared with you", "blocked" and "no such pin name" return the **same 404 body**. Specs assert the bodies are identical.
- Perspectives arrive in a stable order (default Ring first) with no identifier; the switcher indexes by position.
- Every view carries `avatarUrl` and a `url` per attachment: signed links valid 15 minutes, made in `toView` after `RingAccessService` let the request through, so a viewer gets a link for exactly what they may see. A viewer never receives a file id, on the photo or on an attachment: `RingProfileViewEntity` has no `avatarFileId`; the owner's projection keeps it ([[BD-10 Ring Projection Backend Delivery]]) ([[D-16 Files load from signed links that expire in 15 minutes]]; served by `GET /files/content/:token`, [[BD-04 Files Upload Backend Delivery]]).

### Gaps

- The scanned-pin screen (s44) continues into a Connect request, which does not exist: [[S-23 Connections Story|Connections · S2–S4]] ([[F-14 Connections]]).
- ~~Scanning resolves a QR token; token issue / resolve is not written.~~ Shipped by [[F-18 Badge & QR]] on backend `main` `1c460b0`: `POST /rings/:ringId/qr` issues the token, `GET /views/qr/:token` resolves it into this feature's `RingProfileViewEntity` (plus the code's `expiresAt`) through `RingAccessService.assertRingPresented`, then `viewByRing` as View as ([[BD-18 Badge & QR Backend Delivery]]). `GET /views/ring/:ringId` is no longer the scan's route; it stays View as and the member's view.
- Not built, each in its own feature: blocking a person ([[S-23 Connections Story|Connections · S13]]); the public page by Pin name ([[D-22 The public page only says the Pin exists]], on [[BD-07 Profiles & Pin Name Backend Delivery]]); headline and company on a view (the main profile fields, BD-07; per Ring, [[BD-10 Ring Projection Backend Delivery]]); widget routes ([[BD-13 Widgets Backend Delivery]]; `widgets[]` is already on the view).
- No route validates a Pin name: a malformed one answers the same 404 as an unknown one. Only a malformed `ringId` or `userId` is a 400 (`ParseUUIDPipe`). Auth on these routes: a missing or expired token is a plain 401 with no code; a suspended account 401 `E_AUTH_03`, a deleted one 404 `E_USER_01`.
- The owner's "View as" of an **expired** Ring is a 404 `E_RING_ACCESS_02`, because `assertRingReadable` applies the live filter to the owner too. Fine for the member's view; the s62 post-event screen must not rely on it to preview an expired Event Ring.

## Log

- 2026-10-18 · split out of [[F-12 View As & Pin Views]] when the vault moved to layers
- 2026-11-05 · branch `FR-04/file/signed-links-and-library` (`df93921`), merged to `main @ 80e7fa2` · every `/views/*` response carries `avatarUrl` and `attachments[].url`, signed, valid 15 minutes, made after the access check ([[D-16 Files load from signed links that expire in 15 minutes]]); the rest is on [[BD-04 Files Upload Backend Delivery]]'s log. Checked live on View as: both links load, the attachment carries no `fileId`. `avatarFileId` stays on the view for now (Gaps). Updated [[BI-09 View As & Pin Views Backend Integration]]; FR-12's rows flipped and FR-12 flagged.
- 2026-11-05 · `docs/backend/M-01-identity/F-12-view-as/BD-12-open-asks` · checked against backend `main` f186ba1 in the review of [[FR-12 View As & Pin Views Frontend Requirements]] (sent back to `draft` on its own branch): removing `avatarFileId` from the view and the `/views/ring` expired-body question added to `pending`; the Gaps name what other features owe and how auth and a bad Pin name answer.
- 2026-11-08 · branch `B-17/ring-profile/new-ring-view-and-null-fields` (`90fc7b3`), merged to `main @ e483d49` · fixes [[B-17 A new Ring answers 404 to its own owner until its projection is opened]]. `viewByRing`, `viewAllPerspectives` and `viewByPinName` render a Ring with no projection row as the empty projection, after `RingAccessService`, as *How it works* describes. I chose to render it rather than create the row on read: a viewer's `GET` must not write the owner's data, and `cardsForRings` (Shared with me) already rendered a missing projection this way. `RingService.create` is unchanged; `RingProfileViewEntity` is unchanged and still has no `ringId`. Checked live on a throwaway database: before the owner opened the projection, the owner and a member got 200, a stranger the not-shared 404, and the member's perspectives included the new Ring. Specs in `ring-profile.service.spec.ts` (*a Ring with no projection yet (B-17)*); 428 unit tests green on the branch, 624 on the merged `main`. [[BI-09 View As & Pin Views Backend Integration]] updated and its QB-14 flag cleared. B-17 is `ready` for QA's re-test. The same merge carries [[B-12 Null on a link or custom field's required field answers 500]], logged on [[BD-10 Ring Projection Backend Delivery]].
- 2026-11-08 · branch `FR-12/ring-profile/view-without-file-id` (`35fe046`), merged to backend `main @ cb95a39` · viewers get no file id on any `/views/*` route: `avatarFileId` left `RingProfileViewEntity` (and its Swagger schema) on `GET /views/pin/:pinName`, `GET /views/ring/:ringId` and `GET /views/user/:userId/perspectives`; `toView` reads the Ring's or the main profile's photo id only to make `avatarUrl` ([[D-16 Files load from signed links that expire in 15 minutes]]). The owner's projection (`GET /rings/:ringId/projection`, `RingProfileOwnerEntity`) keeps `avatarFileId`. Specs in `ring-profile.view-without-file-id.spec.ts` run the real serializer on each route and find no file id anywhere in the body; typecheck clean, 716/716 unit tests on the merged `main`. Its `pending` entry and the Gap are removed; the expired-Ring body stays pending. [[BI-09 View As & Pin Views Backend Integration]] updated on its own branch.
- 2026-11-08 · flagged [[FR-12 View As & Pin Views Frontend Requirements]]: backend main cb95a39: point 3 of the backend note is resolved: a viewer now gets no file id on any /views/* route (avatarFileId left the view; the owner's projection keeps it, D-16); read avatarUrl and attachments[].url; for /frontend
- 2026-11-08 · flagged [[QB-14 View As & Pin Views QA Backend]]: backend main cb95a39: avatarFileId left the viewer's view on every /views/* route (D-16); the owner's projection keeps it. Row B56 is delivered and ready to re-run (and B46's key list loses avatarFileId); for /qa
- 2026-11-08 · `docs/backend/M-01-identity/F-12-view-as/BD-12-qr-gap` · backend `main` `1c460b0`: the *Gaps* line "token issue / resolve is not written" is out of date; F-18 shipped them (`POST /rings/:ringId/qr`, `GET /views/qr/:token`, [[BD-18 Badge & QR Backend Delivery]]). The scan renders this feature's view and changes none of its routes. FR-12's two QR rows flipped ✅ with the endpoints and FR-12 flagged.
- 2026-11-08 · flagged [[FR-12 View As & Pin Views Frontend Requirements]]: backend main 1c460b0: the QR rows are delivered: POST /rings/:ringId/qr issues the badge code, GET /views/qr/:token resolves it into RingProfileViewEntity plus expiresAt (BI-15). 'Source today' (a Ring id in the QR, temporary) is out of date: the QR carries https://socialpin.me/q/<token>, never a Ring id; for /frontend
