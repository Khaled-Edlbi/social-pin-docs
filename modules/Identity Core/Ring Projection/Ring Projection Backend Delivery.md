---
type: backend-delivery
code: ring-projection
scope: feature
feature: ring-projection
module: identity
status: done
screens: [s14, s20, s23, s24, s25, s29, s36]
updated: 2026-10-18
tags: [backend-delivery, backend-delivery/done, module/identity, layer/backend]
---

# ✅ Ring Projection · Backend Delivery

**Feature:** [[Ring Projection]] · **Status:** Done · **Integration guide:** [[Ring Projection Backend Integration]] · **Requirements:** [[Ring Projection Frontend Requirements]] · **QA:** [[Ring Projection QA Backend]]

What the backend shipped for this feature and how it works. The sum of this feature's task-level Backend Delivery notes (see the *Tasks* table below).

## Endpoints, tables and code

**Endpoints**

- `GET /rings/:ringId/projection`
- `PATCH /rings/:ringId/projection`
- `POST /rings/:ringId/projection/links`
- `PATCH …/links/:linkId`
- `DELETE …/links/:linkId`
- `POST …/info-blocks`
- `PATCH …/info-blocks/:blockId`
- `DELETE …/info-blocks/:blockId`
- `POST …/attachments`
- `DELETE …/attachments/:attachmentId`

**Tables / models:** `RingProfile`, `RingProfileLink`, `RingInfoBlock`, `RingProfileFile`

**Code:** `src/modules/ring-profile/`, `src/prisma/validators/ring-profile.validator.ts`

## How it works

`RingProfileService` is the owner editing surface and the viewer read path in one service, with two select objects: `selectRingProfileForOwner` (includes `isVisible` and hidden rows) and `selectRingProfileProjection` (visible rows only, hidden ones excluded **by the query**). `GET /rings/:ringId/projection` requires `assertCanAdminister(…, 'CONTENT_MANAGER')` and creates the projection on first access for the Ring's profile (falling back to the owner's default), so a Ring made by any flow has something to edit. `PATCH` updates `displayName`, `nickname`, `bio`, `avatarFileId`, `themeConfig` and the five `show*` flags; `null` clears and falls back to the base profile; `avatarFileId` must be a file the caller uploaded (`assertOwnFile`, 400 `E_FILE_04`). Links are validated by `assertLinkValueMatchesType`: ten URL types need an absolute `http(s)` URL (`javascript:` and `data:` refused as stored-XSS vectors), three phone types need E.164, `EMAIL` an address, `LOCATION` a `lat,lng` pair; several links of one type are allowed. Info blocks and attachments are plain child rows with `sortOrder` and `isVisible`; an attachment references a `File` the caller uploaded. Every sub-resource write is `@Transactional` and scoped to the Ring, so a link id from another projection is simply not found (404 `E_RING_PROFILE_03` / `E_RING_PROFILE_04`). The viewer shape is produced in exactly one place, `toView`: `displayName` falls back to the profile's full name (never the nickname), and `birthdate`, `gender`, `maritalStatus`, `email` and `phone` are `null` unless that Ring's `show*` flag is on. Widgets are selected and returned but have no endpoints yet.

### What exists

- Owner entity (`RingProfileOwnerEntity`) includes `isVisible` flags and hidden rows; the viewer entity never does.
- Hidden rows are excluded by the query, not the serializer, so they are never read into a response.
- Sensitive fields are gated in exactly one place: `RingProfileService.toView`. All `show*` flags default to `false`.
- Link values are validated by type: absolute `http(s)` URLs, E.164 phones, `lat,lng` locations. Several links of one type are allowed.

### Gaps

- The design assumes **one library of fields** that each Ring turns on or off ("4 of 7 on", s20 / s24). The backend stores a separate copy per Ring. See [[D-03 Field library vs per-Ring copies]].
- "Inherit, stays in sync with your Pin" (s23) and "Copy another Ring's bio" (s28) need the base profile bio and photo. See [[D-05 Copy or inherit]] and [[D-02 Base profile work fields]].
- Widgets (s37) have a table but no endpoints. See [[Widgets]].
- **`avatarFileId` and attachment ids cannot be fetched**: no route serves file bytes by id. See [[T-062 Serve uploaded file bytes by id]].

## Tasks delivered

| Task | Delivery note | Status |
|---|---|---|
| — | — | — |

## Log

- 2026-10-18 · split out of [[Ring Projection]] when the vault moved to layers ([[T-064 Restructure the docs vault]])
