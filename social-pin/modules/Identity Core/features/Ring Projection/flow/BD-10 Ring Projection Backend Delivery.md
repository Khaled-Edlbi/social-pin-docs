---
id: BD-10
type: backend-delivery
module: identity
feature: ring-projection
status: done
scope: feature
screens: [s14, s20, s23, s24, s25, s29, s36]
created: 2026-10-15
updated: 2026-10-29
tags: [backend-delivery, backend-delivery/done, module/identity, layer/backend]
---

# ✅ Ring Projection · Backend Delivery

> ⚠ Affected by [[D-02 One main profile every Ring starts from]] (2026-10-25): ND-02 decided, one main profile (headline, role, company, location, photo, bio) every Ring starts from; a Ring may change all of them but the full name and keeps its own value when the main one changes.

> ⚠ Affected by [[D-03 Links entered once, switched on or off per Ring]] (2026-10-25): ND-03 decided, links are entered once and only switched on or off per Ring; booking, Behance, Dribbble, GitHub and YouTube join the types, detected from the pasted link.

> ⚠ Affected by [[D-05 Inherit per field, copy without members]] (2026-10-25): ND-05 decided, a Ring inherits the main profile field by field until it changes that field; copying a Ring copies fields, bio, photo, colour and settings, never members.

**Feature:** [[F-10 Ring Projection]] · **Status:** Done · **Integration guide:** [[BI-07 Ring Projection Backend Integration]] · **Requirements:** [[FR-10 Ring Projection Frontend Requirements]] · **QA:** [[Ring Projection QA Backend]]

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

`RingProfileService` is the owner editing surface and the viewer read path in one service, with two select objects: `selectRingProfileForOwner` (includes `isVisible` and hidden rows) and `selectRingProfileProjection` (visible rows only, hidden ones excluded **by the query**). `GET /rings/:ringId/projection` requires `assertCanAdminister(…, 'CONTENT_MANAGER')` and creates the projection on first access for the Ring's profile (falling back to the owner's default), so a Ring made by any flow has something to edit. `PATCH` updates `displayName`, `nickname`, `bio`, `avatarFileId`, `themeConfig` and the five `show*` flags; `null` clears and falls back to the base profile; `avatarFileId` must be a file the caller uploaded (`assertOwnFile`, 400 `E_FILE_04`). Links are validated by `assertLinkValueMatchesType`: ten URL types need an absolute `http(s)` URL (`javascript:` and `data:` refused as stored-XSS vectors), three phone types need E.164, `EMAIL` an address, `LOCATION` a `lat,lng` pair; several links of one type are allowed. Info blocks and attachments are plain child rows with `sortOrder` and `isVisible`; an attachment references a `File` the caller uploaded. Every sub-resource write is `@Transactional` and scoped to the Ring, so a link id from another projection is simply not found (404 `E_RING_PROFILE_03` / `E_RING_PROFILE_04`). The viewer shape is produced in exactly one place, `toView`: `displayName` falls back to the profile's full name (never the nickname), and `birthdate`, `gender`, `maritalStatus`, `email` and `phone` are `null` unless that Ring's `show*` flag is on. The owner's shape is produced in one place too, `toOwnerView`: every owner route returns through it, and it flattens each attachment's file to `fileId`, `filename`, `mimeType` and `sizeBytes`, because the query nests them under `file` and the serializer keeps only what the entity names ([[B-08 Owner projection drops each attachment's file details]]). Widgets are selected and returned but have no endpoints yet.

### What exists

- Owner entity (`RingProfileOwnerEntity`) includes `isVisible` flags and hidden rows; the viewer entity never does.
- Hidden rows are excluded by the query, not the serializer, so they are never read into a response.
- Sensitive fields are gated in exactly one place: `RingProfileService.toView`. All `show*` flags default to `false`.
- Link values are validated by type: absolute `http(s)` URLs, E.164 phones, `lat,lng` locations. Several links of one type are allowed.

### Gaps

- The design assumes **one library of fields** that each Ring turns on or off ("4 of 7 on", s20 / s24). The backend stores a separate copy per Ring. See [[ND-03 Field library vs per-Ring copies]].
- "Inherit, stays in sync with your Pin" (s23) and "Copy another Ring's bio" (s28) need the base profile bio and photo. See [[ND-05 Copy or inherit]] and [[ND-02 Base profile work fields]].
- Widgets (s37) have a table but no endpoints. See [[F-13 Widgets]].
- **`avatarFileId` and attachment ids cannot be fetched**: no route serves file bytes by id. See [[S-06 Files Upload Story|Files Upload · showing files]].

## Log

- 2026-10-18 · split out of [[F-10 Ring Projection]] when the vault moved to layers
- 2026-10-29 · branch `B-08/ring-profile/owner-attachment-file-details`, merged to `main @ c80ed9d` · fixes [[B-08 Owner projection drops each attachment's file details]]: `GET` and `PATCH /rings/:ringId/projection` and `POST …/attachments` return each attachment's `fileId`, `filename`, `mimeType` and `sizeBytes`, as [[BI-07 Ring Projection Backend Integration]] documents. No contract change; the viewer's shape is untouched. Specs in `ring-profile.service.spec.ts` (*owner editing view*). The flag on BI-07 is cleared.
