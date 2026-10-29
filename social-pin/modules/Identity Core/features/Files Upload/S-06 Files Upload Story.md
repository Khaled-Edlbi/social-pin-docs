---
id: S-06
type: story
module: identity
feature: files
status: approved
scope: feature
screens: [s14, s20, s24, s36, s29, s30, s31, s44]
approvedBy: "Omar Fostok"
approvedAt: 2026-10-29
owner: "Omar Fostok"
related: ["D-03 Links entered once, switched on or off per Ring", "S-17 Ring Projection Story", "S-11 Photo Library Story", "S-19 View As & Pin Views Story", "ND-16 Viewer access to file bytes"]
created: 2026-10-18
updated: 2026-10-29
tags: [story, story/approved, module/identity, layer/business]
---

# Files Upload · User Story

> ⚠ Affected by [[D-16 Files load from signed links that expire in 15 minutes]] (2026-10-29): ND-16 is decided, option 3. Showing files (S7–S11) uses a signed `url` that lives 15 minutes; the "route or signed `url`" wording becomes the signed `url`, and S11's copied link expires. For `/pm`.

**Feature:** [[F-04 Files Upload]] · **Status:** Approved 2026-10-29 by Omar Fostok (first approved 2026-10-25 by khaled; reopened 2026-10-29 by the design review: S1–S3, S9 changed, S12 added) · **Frontend Requirements:** [[FR-04 Files Upload Frontend Requirements]] · **Backend Integration:** [[BI-03 Files Upload Backend Integration]]

A Ring owner wants a Ring to carry a photo and a few documents (a portfolio PDF, a pitch deck) without those files becoming public. Upload is a private step: a file belongs to the uploader and is visible to nobody until a Ring projection references it, at which point whoever may see that Ring may see the file. The client's job is to make the two steps (upload, then attach) feel like one.

Upload, attach and delete (S1 to S6) run on endpoints that exist. **Showing files** (S7 to S11) was the task T-062, merged into this story on 2026-10-27 (one story per feature); it waits on [[ND-16 Viewer access to file bytes]]. **Switching a file on or off for a Ring** (S12) runs on existing endpoints; listing the library waits on `GET /files` ([[S-11 Photo Library Story|Photo Library · S7]]).

Files follow the library rule of [[D-03 Links entered once, switched on or off per Ring]]: a file is uploaded once and belongs to its owner, and each Ring only switches it on or off. The attachment row is the Ring's "this file is on" record: attaching switches a file on, detaching switches it off. There is no hidden-but-attached state in the editor.

## Persona

A Ring owner editing a Ring from Ring data ([[Screen Index#s14|s14]]), the create wizard's "what it shows" step ([[Screen Index#s20|s20]]), "What this Ring shows" ([[Screen Index#s24|s24]]) or "Add to this Ring" ([[Screen Index#s36|s36]]), on a phone with the file picker or the camera roll open.

## Stories

### S1 · Attach a file to this Ring ([[Screen Index#s36|s36]])

**As a** Ring owner **I want** to add a PDF or a document to a Ring **so that** this audience can read it from my profile.

Acceptance criteria:
- [ ] "File" on s36 opens the system picker straight away (the prototype's "File → s24" link is a placeholder: it loops back to s36); the chosen file is checked on the device against the allow-list and the 25 MB limit before any request.
- [ ] The upload runs as `POST /files` (multipart, one part named `file`, the real MIME type) with a progress indicator; on 201 the returned `id` is held in memory.
- [ ] The file is then attached with `POST /rings/:ringId/projection/attachments { fileId, label? }`, and the owner is back on s36; Done goes to s14, where the file shows under "Attachments & links" (S3).
- [ ] One file per pick: a PDF, a PPT or a single image. A gallery of several photos is a widget ([[S-20 Widgets Story]]).
- [ ] If the attach step fails, the upload is not shown as "on your profile"; the user can retry the attach or discard the file (`DELETE /files/:id`).
- [ ] An oversized file reads "Too large (max 25 MB)" before upload; an unsupported type reads "Unsupported file type".

### S2 · Attach while creating a Ring ([[Screen Index#s20|s20]])

**As a** Ring owner **I want** to add attachments in step 3 of the wizard **so that** the new Ring is complete when I finish.

Acceptance criteria:
- [ ] The Ring exists before step 3 (created by `POST /rings` in step 1), so uploads can be attached to its projection right away.
- [ ] Step 3 lists files as switches beside the fields (S12).
- [ ] Cancel asks nothing (the design goes straight to s16) and deletes the Ring ([[S-18 Rings Story]]). Files uploaded during the wizard stay in the library and show, switched off, on the next Ring. Until `GET /files` ships they are deleted on Cancel (`DELETE /files/:id`), since nothing could list them. Files switched on from the library are never deleted.
- [ ] The count of attachments carried into step 4 matches the projection's `attachments[]`.

### S3 · See attachments on Ring data ([[Screen Index#s14|s14]])

**As a** Ring owner **I want** to see which files this Ring shows **so that** I can check the Ring before sharing it.

Acceptance criteria:
- [ ] Attachments from `GET /rings/:ringId/projection` (`attachments[]`, by `sortOrder`) show as chips with the file name, in the same row as the links, as the design draws "Attachments & links". No type icon, no size on the chip.
- [ ] A tap on a file chip opens a sheet with its name, type (`mimeType`) and size (`sizeBytes`); until S10 ships there is no preview or download, and the sheet says "Download coming soon" rather than failing.
- [ ] The pencil next to "Attachments & links" goes to s24, where files are switched on or off (S12).
- [ ] With no files or links, the section shows only the dashed "+ Add" chip, which goes to s36; there is no "No files yet" text.
- [ ] Detaching (`DELETE …/attachments/:attachmentId`) removes it from this Ring but keeps the file in the library.

### S4 · Pick a photo for a Ring (journey, from [[Screen Index#s29|s29]])

**As a** Ring owner **I want** to upload a photo and use it for one Ring **so that** this audience sees the face I choose for them.

Acceptance criteria:
- [ ] JPEG, PNG, WebP or GIF under 25 MB; the client downsizes very large images before upload where it can.
- [ ] After `POST /files`, the photo is set with `PATCH /rings/:ringId/projection { avatarFileId }`; a 400 `E_FILE_04` (not the caller's file) returns to the picker.
- [ ] Until S7 ships the chosen photo cannot be displayed from the server; the client keeps the local image for the session and shows a placeholder after relaunch.

### S5 · Delete a file I uploaded (journey, no prototype screen)

**As a** Ring owner **I want** to delete a file **so that** it is gone from my library and from storage.

Acceptance criteria:
- [ ] `DELETE /files/:id` returns 200; the bytes are removed and the row soft-deleted.
- [ ] Rings that referenced it keep their attachment row; the UI detaches first, then deletes, so no Ring shows a dead attachment.
- [ ] A 404 `E_FILE_01` (not the caller's file, or already deleted) is treated as "already gone".

### S6 · Validate before sending (journey, no prototype screen)

**As a** user on a slow connection **I want** the app to refuse a bad file before uploading **so that** I do not wait for a 413 or 415.

Acceptance criteria:
- [ ] The allow-list and the 25 MB limit are mirrored on the client; the server stays the authority.
- [ ] A 413 or 415 that still arrives is shown with the same wording as the client check.

### S7 · I see the photo I picked for a Ring ([[Screen Index#s29|s29]])

**As a** Ring owner **I want** the photo I set on a Ring to show on that Ring **so that** I know which face each audience sees.

Acceptance criteria:
- [ ] After `PATCH /rings/:ringId/projection { avatarFileId }`, the photo shows on s29, on the Ring's header and in the Ring switcher, and again after relaunch.
- [ ] A Ring without a photo, or one whose file is gone, shows the initials placeholder.

### S8 · I see my photos in the library ([[Screen Index#s30|s30]])

**As a** Ring owner **I want** thumbnails of the photos I uploaded **so that** I pick one by looking at it.

Acceptance criteria:
- [ ] Every photo the library lists shows a thumbnail. The list itself is [[S-11 Photo Library Story|Photo Library · S7]].

### S9 · A viewer sees the photo and files this Ring shows ([[Screen Index#s31|s31]], [[Screen Index#s44|s44]])

**As a** viewer (a Ring member, or someone who just scanned a badge) **I want** to see the owner's photo for my Ring and open the files it shows **so that** the card reads as a person, not a placeholder.

Acceptance criteria:
- [ ] On s44 (scanned Pin) and s31 (View as), the photo from the view's `avatarFileId` shows.
- [ ] Each attachment on the view shows its name and size (`filename`, `sizeBytes`). No date: the design's "updated Mar" is not shown, since a file is never replaced, only uploaded again.
- [ ] Each attachment on the view opens (PDF, image) or downloads.
- [ ] The owner's "View as" shows exactly what a viewer gets: the same photo, the same files, no hidden one.

### S10 · I open a file on a Ring ([[Screen Index#s14|s14]])

**As a** Ring owner **I want** to open an attachment from the Ring's data **so that** I check it's the right file.

Acceptance criteria:
- [ ] Tapping an attachment opens it; "Download coming soon" goes away.

### S11 · What I don't share stays private (journey, no prototype screen)

**As a** Ring owner **I want** a photo or file to reach only people who can see the Ring it's on **so that** a private Ring stays private.

Acceptance criteria:
- [ ] Someone outside the Ring gets the same 404 as for a file that doesn't exist; they can't tell it exists.
- [ ] A hidden attachment (`isVisible: false`) is never served to a viewer.
- [ ] A link or id copied out of the app is no use to someone without access (or expires, if a signed `url` is chosen: [[ND-16 Viewer access to file bytes]]).

### S12 · Switch a file on or off for this Ring ([[Screen Index#s20|s20]], [[Screen Index#s24|s24]])

**As a** Ring owner **I want** my files listed once beside the fields, each switched on or off for this Ring **so that** I upload a file once and choose which Rings show it.

The on/off screens are [[S-17 Ring Projection Story|Ring Projection · S2 and S4]]; this part says how a file behaves on them ([[D-03 Links entered once, switched on or off per Ring]]).

Acceptance criteria:
- [ ] My documents are listed from `GET /files?kind=document` beside the fields: a file attached to this Ring shows on, the rest off, and the "N of M on" count includes both. Not available yet: `GET /files` with its `kind` filter is [[S-11 Photo Library Story|Photo Library · S7]]; F-04 needs the document kind as well as images.
- [ ] Switching a file on attaches it (`POST /rings/:ringId/projection/attachments { fileId }`).
- [ ] Switching a file off detaches it (`DELETE /rings/:ringId/projection/attachments/:attachmentId`); the file stays in the library. The Ring's audience stops seeing it at once.
- [ ] Until `GET /files` ships, only the files already on this Ring are listed; a file switched off stays on the list, shown off, for as long as the owner is on the screen.
- [ ] "+ Add a field, link or file" goes to s36 (S1).
- [ ] Reordering or renaming an attachment is not in the design: later.

## States and motion the design asks for

- State: picking, uploading (progress), uploaded-not-attached, attached (on), not attached (off), failed, too large, unsupported type.
- State: file chips on Ring data with the name only; the detail sheet with type, size and "Download coming soon" until bytes can be served; only "+ Add" when empty.
- Motion: an added attachment slides into the Ring's list as part of the Ring re-compose; no upload-specific motion is asked for.
- Showing a photo (S7–S9): the initials placeholder (or a file icon) until the bytes arrive, with no layout jump when the photo replaces it; a missing or refused photo stays on the placeholder silently, no error toast for a picture.
- Opening a file (S9, S10): a progress state while it downloads; the system viewer opens it.

## Rules the backend already enforces

- `POST /files` refuses a missing part (400 `E_FILE_02`), a MIME type outside the allow-list (415 `E_FILE_02`) and anything over 25 MB (413 `E_FILE_03`). The allow-list exists because a context-scoped file is served from the API's own origin.
- The row is written before the bytes are flushed, in a transaction; a failed write rolls the row back.
- `GET /files/:id` and `DELETE /files/:id` are scoped to the uploader (404 `E_FILE_01`); delete is a soft delete plus a best-effort unlink.
- Who may read a file follows the context that references it: `assertOwnFile` on write, the access engine on read. `FileEntity` omits `storageKey`, so no client can address storage directly.
- Uploading does not publish anything. Visibility starts when a Ring projection references the file.
- No route serves a file's bytes today: `storageKey` never leaves the server, the static `/uploads` mount is keyed by it, and nothing maps a file id to bytes, so `avatarFileId` and `attachments[].id` are dead ends for the UI until S7–S11 ship. The byte route must ask `RingAccessService` whether the caller may see a live Ring that references the file (golden rule 8); `PUBLIC` files (event covers, logos) skip the check.

## Open questions

- No decision blocks uploading (S1–S6). **Showing files (S7–S11) waits on [[ND-16 Viewer access to file bytes]]**: an authenticated route keyed by file id, or a signed `url` on the entities. The view's attachments carry the attachment `id` and no `fileId`, so a viewer cannot call a route keyed by file id with what it is given; a signed `url` on the view answers that and loads like any web image, a route needs the bearer token on every image request.
- Thumbnails: whether the library and Ring lists get a smaller size, or download the full photo.
- The library screen waits on [[S-11 Photo Library Story|Photo Library · S7]].
- Covered by other features, not this story (design review 2026-10-29): the **gallery** on s36 ([[S-20 Widgets Story]], Gallery widget); **camera as a source** on s30 ([[S-11 Photo Library Story|Photo Library · S3]]) and **crop for this Ring** on s29 (Photo Library, later, not in v1: [[S-11 Photo Library Story|Photo Library · Open questions]]); **pulling the LinkedIn photo** into the library on s30 ([[S-94 Linked Accounts (OAuth) Story]], not written there yet); **Gemma's "you have one in another Ring · Add"** file suggestion on s36 ([[S-89 Gemma AI Story]], not written there yet).
- s31's owner face, **"Where each field goes"** (every field, link and file with the Rings it is on), belongs to [[S-19 View As & Pin Views Story]]; no story covers it yet.
- [[S-17 Ring Projection Story]] S1 (hidden rows greyed) and S4 (an `isVisible` switch on file rows) still describe files as hidden, not detached; it takes the change in its own request.
