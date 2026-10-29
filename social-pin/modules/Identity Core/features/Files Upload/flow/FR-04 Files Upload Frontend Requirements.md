---
type: frontend-requirements
code: files
scope: feature
feature: files
module: identity
status: approved
approvedBy: "khaled"
approvedAt: 2026-10-29
screens: [s14, s20, s24, s36, s29, s30, s31, s44]
owner: "Omar Fostok"
depends: ["S-06 Files Upload Story"]
affects: ["BD-04 Files Upload Backend Delivery"]
related: ["BI-03 Files Upload Backend Integration", "BI-07 Ring Projection Backend Integration", "BI-09 View As & Pin Views Backend Integration", "FR-06 Photo Library Frontend Requirements", "FR-10 Ring Projection Frontend Requirements", "FR-12 View As & Pin Views Frontend Requirements", "ND-16 Viewer access to file bytes", "D-16 Files load from signed links that expire in 15 minutes", "D-03 Links entered once, switched on or off per Ring", "POST /files", "GET /files", "GET /files/:id", "DELETE /files/:id", "GET /rings/:ringId/projection", "PATCH /rings/:ringId/projection", "POST /rings/:ringId/projection/attachments", "DELETE /rings/:ringId/projection/attachments/:attachmentId", E_FILE_01, E_FILE_02, E_FILE_03, E_FILE_04, E_RING_05]
created: 2026-10-18
updated: 2026-10-29
tags: [frontend-requirements, frontend-requirements/approved, module/identity, layer/frontend]
---

# Files Upload · Frontend Requirements

**Feature:** [[F-04 Files Upload]] · **Status:** 👍 Approved 2026-10-29 by khaled (the backend's review) · **Story:** [[S-06 Files Upload Story]] · **Backend Integration:** [[BI-03 Files Upload Backend Integration]]

What the client needs from the backend to upload, attach, switch on or off, inspect and delete files behind the Ring screens, and whether each need is met today. The multipart shape, the allow-list and the limits are in [[BI-03 Files Upload Backend Integration]].

Files follow the library rule of [[D-03 Links entered once, switched on or off per Ring]]: a file is uploaded once and each Ring switches it on or off. The attachment row is the Ring's "on" record: attach = on, detach = off. The client never hides an attachment in place.

## Per screen

### [[Screen Index#s36|s36]] Add to this Ring (S1)

- Needs: upload one document or image; attach it to this Ring's projection with an optional label.
- Actions: File → the system picker straight away (not s24) → device check → upload → attach → back on s36; Done → s14. One file per pick; a gallery is a widget ([[S-20 Widgets Story]]).
- States: picking, uploading with progress, uploaded-not-attached (attach failed: retry or discard), attached, failed (size, type, network).
- Source today: `POST /files`, then `POST /rings/:ringId/projection/attachments { fileId, label? }`; discard is `DELETE /files/:id`.

### [[Screen Index#s20|s20]] New Ring · step 3 (what it shows) (S2, S12)

- Needs: the Ring's files as switches beside the fields (as on s24, below), against the Ring created in step 1; "+ Add a field, link or file" → s36 for a new upload.
- Cancel: no prompt (the design goes straight to s16); the Ring is deleted ([[S-18 Rings Story]]). Files uploaded during the wizard stay in the library. **Until `GET /files` ships**, the client deletes them on Cancel (`DELETE /files/:id`), since nothing could list them afterwards. Files switched on from the library are never deleted.
- The count carried into step 4 matches the projection's `attachments[]`.
- Source today: `POST /files`, `POST …/attachments`, `DELETE …/attachments/:attachmentId`, `DELETE /files/:id`. The library list: not available yet (see s24).

### [[Screen Index#s24|s24]] Edit · what it shows: file rows (S12)

The screen is [[FR-10 Ring Projection Frontend Requirements|Ring Projection's]]; this section is the file rows on it.

- Needs: my documents (`GET /files?kind=document`) merged with this Ring's `attachments[]` by `fileId`: attached → on, the rest → off; the "N of M on" count includes both.
- Actions: switch on → `POST /rings/:ringId/projection/attachments { fileId }`; switch off → `DELETE /rings/:ringId/projection/attachments/:attachmentId` (the file stays in the library); "+ Add a field, link or file" → s36.
- States: on, off, switching (pending), failed (revert the switch), read-only (403).
- **Until `GET /files` ships**: only this Ring's `attachments[]` are listed; a file switched off stays on the list, shown off, until the owner leaves the screen.
- Source today: `GET /rings/:ringId/projection`, `POST …/attachments`, `DELETE …/attachments/:attachmentId`. `GET /files`: not available yet ([[S-11 Photo Library Story|Photo Library · S7]]).

### [[Screen Index#s14|s14]] Ring data (S3)

- Needs: `attachments[]` with `filename` and `sortOrder` for the chips; `mimeType` and `sizeBytes` for the detail sheet.
- Shows: file chips with the name only, in the "Attachments & links" row with the links, by `sortOrder`; a tap opens a sheet with name, type and size and "Download coming soon" until S10 ships; the pencil → s24; with no files or links, only the dashed "+ Add" chip (→ s36).
- States: chips, empty ("+ Add" only), detail sheet, "Download coming soon".
- Source today: `GET /rings/:ringId/projection` (`attachments[]`). Opening a file: from the attachment's signed `url` (valid 15 minutes) once the backend ships it ([[D-16 Files load from signed links that expire in 15 minutes]]); until then "Download coming soon".

### [[Screen Index#s29|s29]] Photo for this Ring (upload step) (S4, S7)

- Needs: upload an image and set it as this Ring's photo; show it.
- Source today: `POST /files`, `PATCH /rings/:ringId/projection { avatarFileId }`. Showing the photo: from the projection's signed `avatarUrl` (valid 15 minutes) once the backend ships it ([[D-16 Files load from signed links that expire in 15 minutes]]). The rest of the screen, crop for this Ring included, is [[FR-06 Photo Library Frontend Requirements|Photo Library's]].

### [[Screen Index#s30|s30]] Photo library: the file side (S8)

- Needs: upload a photo into the library (`POST /files`, image types only); a thumbnail for every photo listed.
- Source today: `POST /files`. The list (`GET /files?kind=image`) is [[FR-06 Photo Library Frontend Requirements|Photo Library's]]; thumbnails: from each photo's signed link once the backend ships it ([[D-16 Files load from signed links that expire in 15 minutes]]). Camera as a source and the LinkedIn photo are other features' ([[S-11 Photo Library Story]], [[S-94 Linked Accounts (OAuth) Story]]).

### [[Screen Index#s31|s31]] View as · [[Screen Index#s44|s44]] Scanned Pin: the file side (S9)

The screens are [[FR-12 View As & Pin Views Frontend Requirements|View As & Pin Views']]; this section is the photo and the attachments on them.

- Needs: the view's `attachments[]` (`id`, `label`, `filename`, `mimeType`, `sizeBytes`), each shown with its name and size; opening (PDF, image) or downloading one; the photo from `avatarFileId`.
- Not requested: a date on the attachment (the design's "updated Mar"): a file is never replaced, only uploaded again.
- Not this feature's: s31's owner face, "Where each field goes" ([[S-19 View As & Pin Views Story]]).
- Source today: `GET /views/ring/:ringId` (`attachments[]`, `avatarFileId`). Opening and the photo: from the view's signed `url` per attachment and `avatarUrl` (valid 15 minutes, no file id), once the backend ships them ([[D-16 Files load from signed links that expire in 15 minutes]], [[FR-12 View As & Pin Views Frontend Requirements|FR-12]]).

### Any screen · file metadata and delete (S5, no prototype screen)

- Needs: read one file's metadata; delete a file.
- Source today: `GET /files/:id`, `DELETE /files/:id`.

## Endpoints required

| Need | Endpoint | Available | Story part / decision |
|---|---|---|---|
| Upload a file (multipart `file`) | `POST /files` | ✅ | S1, S4 |
| Read a file's metadata | `GET /files/:id` | ✅ | S5 |
| Delete a file | `DELETE /files/:id` | ✅ | S2, S5 |
| Attach a file to a Ring (switch on) | `POST /rings/:ringId/projection/attachments` | ✅ | S1, S12 (listed under [[F-10 Ring Projection]]) |
| Detach from a Ring (switch off) | `DELETE /rings/:ringId/projection/attachments/:attachmentId` | ✅ | S3, S12 (listed under [[F-10 Ring Projection]]) |
| Use a file as the Ring photo | `PATCH /rings/:ringId/projection` | ✅ | S4 (listed under [[F-10 Ring Projection]]) |
| List my files by kind: `kind=image` (JPEG, PNG, WebP, GIF) and `kind=document` (every other type on the allow-list) | `GET /files?kind=` | ❌ | [[S-11 Photo Library Story\|Photo Library · S7]]; F-04 needs `document` as well as `image` (S12, S2) |
| Display or download the bytes (owner and viewer): a signed `avatarUrl` and a signed `url` per attachment on the owner projection and the view, valid 15 minutes, no file id | `GET …/projection`, `GET /views/*` | ❌ | [[D-16 Files load from signed links that expire in 15 minutes]] (decided); S7–S11 |
| Rings using each photo: `usedBy: [{ ringId, name }]` and `followerCount` on the main photo, photos only (attachments not counted) | `GET /files?kind=image` | ❌ | [[S-11 Photo Library Story\|Photo Library · S8]], asked in [[FR-06 Photo Library Frontend Requirements\|FR-06]]; s30 only, not needed for documents |
| Reorder or rename an attachment | — | not asked | not in the design; later (S12) |

## Behaviour expectations

- Refetch / realtime: after every attach or detach, refetch `GET /rings/:ringId/projection` and invalidate `view:<viewer>:ring:<ringId>` so "View as" is current.
- Caching keys: `file:<fileId>` for metadata; `files:<kind>` for the library list once `GET /files` exists; uploaded-but-unattached ids in memory under the editing screen. On wizard Cancel they are deleted until `GET /files` ships, kept after (S2).
- Pagination / ordering: `GET /files` is expected paginated, newest first, as [[FR-06 Photo Library Frontend Requirements]] asks; attachments are rendered by `sortOrder`.
- Upload: one multipart part named `file`, real MIME type set, access token as bearer; show progress; allow cancel by aborting the request, then call `GET /files/:id` only if an id was received.
- Client checks before upload: type in the allow-list (JPEG, PNG, WebP, GIF, PDF, DOCX, XLSX, PPTX, DOC, PPT, TXT, CSV) and size ≤ 25 MB. The server remains the authority.
- Two-step semantics: an uploaded file is "in your library", not "on your profile". Only an attached file is shown as part of a Ring.
- On / off: the client never sends `isVisible` on an attachment. A row that arrives with `isVisible: false` (written outside the app) is shown off; switching it on detaches it and attaches it again.
- Delete order: detach, then delete. A deleted file leaves its attachment rows in place; the UI must not depend on the backend to cascade.
- No URL guessing: never derive a path from `id`, `filename` or `checksum`; load photos and files only from the signed `avatarUrl` / `url` ([[D-16 Files load from signed links that expire in 15 minutes]]); a placeholder until they ship (S7–S11).
- Signed links are valid 15 minutes: when one fails to load (expired), read the projection or view again for fresh links; never keep a link beyond the session.
- Retention: keep the local image or file handle for the editing session so the owner sees what they picked; after relaunch the placeholder returns.

## Error states the UI must handle

| Status | ErrorCode | Show |
|---|---|---|
| 413 | `E_FILE_03` | "Too large (max 25 MB)" |
| 415 | `E_FILE_02` | "Unsupported file type" |
| 400 | `E_FILE_02` | client bug (no `file` part); log, do not surface |
| 404 | `E_FILE_01` | "This file is no longer available"; drop it from the local state (on a wizard Cancel delete: already gone, nothing to show) |
| 400 | `E_FILE_04` | "Choose a file from your library" (not the caller's file) |
| 403 | `E_RING_05` | the target Ring is not editable by this user: read-only editor, switches disabled |
| 404 | `E_RING_PROFILE_04` | attachment not in this projection: on switch off, it is already off; refetch the editor |

Until [[S-87 Error Contract Story|Error Contract · S4–S8]] ships, branch on status and endpoint.

## Blocked by

- [[D-16 Files load from signed links that expire in 15 minutes]] (decided, not built): every preview, thumbnail, photo and download on s14, s29, s30, s31 and s44 (S7–S11).
- [[S-11 Photo Library Story|Photo Library · S7]]: listing the library (`GET /files?kind=`), so s20 and s24 can offer files not yet on this Ring, and wizard uploads can be kept on Cancel.

## Sign-off

- Approved by: khaled · on: 2026-10-29 (the backend's review, against `main @ c80ed9d`). The six ✅ rows are on `main` and pass live in [[QB-06 Files Upload QA Backend]] (32 of 32). The three ❌ rows are accepted as asks and sit as `pending` on [[BD-04 Files Upload Backend Delivery]] until they ship; this list shows ✅ Delivered on its own once they are cleared.
