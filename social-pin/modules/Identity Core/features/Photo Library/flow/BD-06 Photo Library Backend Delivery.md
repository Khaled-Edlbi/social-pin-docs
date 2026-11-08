---
id: BD-06
type: backend-delivery
module: identity
feature: photo-library
status: done
scope: feature
screens: [s29, s30]
related: ["BD-04 Files Upload Backend Delivery", "BD-07 Profiles & Pin Name Backend Delivery", "D-02 One main profile every Ring starts from", "D-05 Inherit per field, copy without members", "D-16 Files load from signed links that expire in 15 minutes", "GET /files", "GET /files/content/:token", "PATCH /profiles/:id"]
pending: []
created: 2026-10-18
updated: 2026-11-08
tags: [backend-delivery, backend-delivery/done, module/identity, layer/backend]
---

# ✅ Photo Library · Backend Delivery

> ⚠ Affected by [[D-02 One main profile every Ring starts from]] (2026-10-25): ND-02 decided, one main profile (headline, role, company, location, photo, bio) every Ring starts from; a Ring may change all of them but the full name and keeps its own value when the main one changes.

**Feature:** [[F-06 Photo Library]] · **Status:** Done · **Integration guide:** [[BI-13 Photo Library Backend Integration]] · **Requirements:** [[FR-06 Photo Library Frontend Requirements]] · **QA:** [[QB-08 Photo Library QA Backend]]

What the backend shipped for this feature and how it works. The sum of this feature's task-level Backend Delivery notes (see the *Tasks* table below).

## Endpoints, tables and code

**Endpoints**

- `POST /files` (upload)
- `GET /files?kind=image` (the library; shipped with [[BD-04 Files Upload Backend Delivery]])
- `DELETE /files/:id`
- `avatarUrl` on `GET /rings/:ringId/projection` and `GET /views/*`

**Tables / models:** `File`, `RingProfile`

**Code:** `src/modules/file/`, `RingProfileService.avatarUsage` in `src/modules/ring-profile/`, `RingAccessService.countMainPhotoFollowers` in `src/modules/ring-access/`

### What exists

- Upload, metadata, delete.
- **The library (S7).** `GET /files?kind=image` lists the caller's own photos, newest first, paginated (`limit` ≤ 50, `meta.total` unpaginated), owner only; `kind=document` for [[FR-04 Files Upload Frontend Requirements|FR-04]]. How it works: [[BD-04 Files Upload Backend Delivery]].
- **Which Rings use each photo (S8).** Every list item carries `usedBy: [{ ringId, name }]`: the caller's Rings whose projection has `avatarFileId` = the photo, by name. Attachments are not counted.
- **The main photo and its followers (S8).** Every list item carries `isMainPhoto` and `followerCount`. The main photo is the caller's default profile's `avatarFileId` (set with `PATCH /profiles/:id { avatarFileId }`, [[BD-07 Profiles & Pin Name Backend Delivery]]). On that item `isMainPhoto: true`, and `followerCount` is the number of the caller's **live** Rings that present the main profile and whose projection has no photo of its own (`avatarFileId: null` means "follow the main photo", [[D-02 One main profile every Ring starts from]], [[D-05 Inherit per field, copy without members]]); a Ring with no projection row yet counts too. Rings that picked the main photo themselves are in `usedBy`, not in the count. Expired, archived, deleted and not-yet-started Rings are not counted; another user's Rings never are. Every other item: `isMainPhoto: false`, `followerCount: null` (both always present). With no main photo, or when it is on another page or outside the `kind`, no item is marked.
  - *How it works:* `FileService.findAllForOwner` reads the default profile once (`selectMainPhoto`) and, only when the main photo is on the page, asks the access engine: `RingAccessService.countMainPhotoFollowers(ownerUserId, mainProfileId)`, one `COUNT` over `rings` with `ringLiveFilter`, never one query per Ring. S-17 S10 (per-field follow) keeps `null` = follow for the photo, so the count holds.
- **Thumbnails and the full photo.** A signed `url` per item, and `avatarUrl` on a Ring's projection and view, valid 15 minutes ([[D-16 Files load from signed links that expire in 15 minutes]]). Every link serves the original image; there are no resized thumbnails.

### Gaps

- **`usedBy` is not filtered to live Rings.** It leaves out deleted Rings only, so an expired or archived Ring that picked a photo is still named. That suits Delete (S5: clear every Ring that points at the file), but it is wider than S8's "live Rings" and than `followerCount`, which counts live Rings only.
- Resized thumbnails: every link serves the original image (not part of D-16).

## Log

- 2026-10-18 · split out of [[F-06 Photo Library]] when the vault moved to layers
- 2026-11-05 · the endpoint this feature asks for shipped as asks of [[FR-04 Files Upload Frontend Requirements]]; the branch and the build are on [[BD-04 Files Upload Backend Delivery]]'s log. For this feature: S7 (`GET /files?kind=image`), S8's `usedBy` and thumbnails from signed links (D-16) exist. Still open: `followerCount` and the main photo, waiting on [[BD-07 Profiles & Pin Name Backend Delivery]]. FR-06's rows flipped ✅ where they exist. This note stays `in-progress` and blocked until [[FR-06 Photo Library Frontend Requirements]] is approved; then it goes `done` with `followerCount` in `pending`.
- 2026-11-05 · FR-06 was approved on `main` (`6c54025`), so this note goes `done`, Partial: `followerCount` and the main photo stay in `pending`, waiting on [[BD-07 Profiles & Pin Name Backend Delivery]]. Its integration note [[BI-13 Photo Library Backend Integration]] is written (`current`), pointing at [[BI-03 Files Upload Backend Integration]] for the shared endpoint.
- 2026-11-08 · backend `main @ cb95a39` (branch `FR-06/file/follower-count`, `d5f1026`) · S8's other half: `isMainPhoto` and `followerCount` on every item of `GET /files?kind=image` (`followerCount` a number on the main photo, `null` elsewhere); the count is `RingAccessService.countMainPhotoFollowers`. Reading and setting the main photo is `GET /profiles` and `PATCH /profiles/:id { avatarFileId }` from [[BD-07 Profiles & Pin Name Backend Delivery]]. No schema change, no new error code. Specs: `file.service.spec.ts`, `ring-access.service.spec.ts`; the merged build: typecheck clean, 716/716 tests, migrations and seed on a fresh database. Checked live on a throwaway database: two following Rings counted; a Ring with its own photo, a Ring that picked the main photo (in `usedBy`), an expired Ring and a not-yet-started Ring not counted; another user's Rings never counted. The `pending` entry is cleared, so this note is no longer Partial. Updated [[BI-13 Photo Library Backend Integration]] and the ✅ rows of [[FR-06 Photo Library Frontend Requirements]]; flagged [[QB-08 Photo Library QA Backend]] (rows to re-run). Wrote down the `usedBy` liveness gap.
- 2026-11-08 · flagged [[QB-08 Photo Library QA Backend]]: followerCount and isMainPhoto shipped on backend main cb95a39: GET /files?kind=image marks the main photo (isMainPhoto true) with followerCount = live Rings with no photo of their own; every other item isMainPhoto false, followerCount null. The main photo is read and set with GET /profiles and PATCH /profiles/:id { avatarFileId }, so B22, S4 Make main and S6 Reset to Pin can run now; for /qa
