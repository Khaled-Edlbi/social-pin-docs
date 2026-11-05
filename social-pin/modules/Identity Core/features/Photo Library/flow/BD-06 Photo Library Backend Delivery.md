---
id: BD-06
type: backend-delivery
module: identity
feature: photo-library
status: in-progress
scope: feature
screens: [s29, s30]
related: ["BD-04 Files Upload Backend Delivery", "BD-07 Profiles & Pin Name Backend Delivery", "D-16 Files load from signed links that expire in 15 minutes", "GET /files", "GET /files/content/:token"]
created: 2026-10-18
updated: 2026-11-05
tags: [backend-delivery, backend-delivery/in-progress, module/identity, layer/backend]
---

# 🟡 Photo Library · Backend Delivery

> ⚠ Affected by [[D-02 One main profile every Ring starts from]] (2026-10-25): ND-02 decided, one main profile (headline, role, company, location, photo, bio) every Ring starts from; a Ring may change all of them but the full name and keeps its own value when the main one changes.

**Feature:** [[F-06 Photo Library]] · **Status:** In progress · **Integration guide:** [[Photo Library Backend Integration]] · **Requirements:** [[FR-06 Photo Library Frontend Requirements]] · **QA:** [[Photo Library QA Backend]]

What the backend shipped for this feature and how it works. The sum of this feature's task-level Backend Delivery notes (see the *Tasks* table below).

## Endpoints, tables and code

**Endpoints**

- `POST /files` (upload)
- `GET /files?kind=image` (the library; shipped with [[BD-04 Files Upload Backend Delivery]])
- `DELETE /files/:id`
- `avatarUrl` on `GET /rings/:ringId/projection` and `GET /views/*`

**Tables / models:** `File`, `RingProfile`

**Code:** `src/modules/file/`, `RingProfileService.avatarUsage` in `src/modules/ring-profile/`

### What exists

- Upload, metadata, delete.
- **The library (S7).** `GET /files?kind=image` lists the caller's own photos, newest first, paginated (`limit` ≤ 50, `meta.total` unpaginated), owner only; `kind=document` for [[FR-04 Files Upload Frontend Requirements|FR-04]]. How it works: [[BD-04 Files Upload Backend Delivery]].
- **Which Rings use each photo (S8, half).** Every list item carries `usedBy: [{ ringId, name }]`: the caller's live Rings whose projection has `avatarFileId` = the photo. Attachments are not counted.
- **Thumbnails and the full photo.** A signed `url` per item, and `avatarUrl` on a Ring's projection and view, valid 15 minutes ([[D-16 Files load from signed links that expire in 15 minutes]]). Every link serves the original image; there are no resized thumbnails.

### Gaps

- **`followerCount` on the main photo (S8, the other half)** and **reading and setting the main photo**: there is no main photo until the main profile exists ([[D-02 One main profile every Ring starts from]], [[D-05 Inherit per field, copy without members]]), which is [[BD-07 Profiles & Pin Name Backend Delivery]]'s S-14 S9–S11. "Reset to Pin" (s29) waits on the same.
- [[FR-06 Photo Library Frontend Requirements]] is `ready`, not yet approved by the backend: the list and `usedBy` shipped as asks of [[FR-04 Files Upload Frontend Requirements]], which asks for the same endpoint.

## Log

- 2026-10-18 · split out of [[F-06 Photo Library]] when the vault moved to layers
- 2026-11-05 · the endpoint this feature asks for shipped as asks of [[FR-04 Files Upload Frontend Requirements]]; the branch and the build are on [[BD-04 Files Upload Backend Delivery]]'s log. For this feature: S7 (`GET /files?kind=image`), S8's `usedBy` and thumbnails from signed links (D-16) exist. Still open: `followerCount` and the main photo, waiting on [[BD-07 Profiles & Pin Name Backend Delivery]]. FR-06's rows flipped ✅ where they exist. This note stays `in-progress` and blocked until [[FR-06 Photo Library Frontend Requirements]] is approved; then it goes `done` with `followerCount` in `pending`.
