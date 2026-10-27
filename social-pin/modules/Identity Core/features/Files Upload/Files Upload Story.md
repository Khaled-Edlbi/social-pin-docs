---
type: story
code: files
scope: feature
feature: files
module: identity
status: approved
screens: [s14, s20, s36, s30, s31, s44]
approvedBy: "khaled"
approvedAt: 2026-10-25
owner: "khaled"
created: 2026-10-18
updated: 2026-10-27
tags: [story, story/approved, module/identity, layer/business]
---

# Files Upload · User Story

**Feature:** [[Files Upload]] · **Status:** Approved 2026-10-25 by khaled · **Frontend Requirements:** [[Files Upload Frontend Requirements]] · **Backend Integration:** [[Files Upload Backend Integration]]

A Ring owner wants a Ring to carry a photo and a few documents (a portfolio PDF, a pitch deck) without those files becoming public. Upload is a private step: a file belongs to the uploader and is visible to nobody until a Ring projection references it, at which point whoever may see that Ring may see the file. The client's job is to make the two steps (upload, then attach) feel like one.

Upload, attach and delete (S1 to S6) run on endpoints that exist. **Showing files** (S7 to S11) was the task T-062, merged into this story on 2026-10-27 (one story per feature); it waits on [[ND-16 Viewer access to file bytes]].

## Persona

A Ring owner editing a Ring from Ring data ([[Screen Index#s14|s14]]), the create wizard's "what it shows" step ([[Screen Index#s20|s20]]) or "Add to this Ring" ([[Screen Index#s36|s36]]), on a phone with the file picker or the camera roll open.

## Stories

### S1 · Attach a file to this Ring ([[Screen Index#s36|s36]])

**As a** Ring owner **I want** to add a PDF or a document to a Ring **so that** this audience can read it from my profile.

Acceptance criteria:
- [ ] "File" opens the system picker; the chosen file is checked on the device against the allow-list and the 25 MB limit before any request.
- [ ] The upload runs as `POST /files` (multipart, one part named `file`, the real MIME type) with a progress indicator; on 201 the returned `id` is held in memory.
- [ ] The file is then attached with `POST /rings/:ringId/projection/attachments { fileId, label? }`; the attachment appears in the list with its `filename`, `mimeType` and `sizeBytes`.
- [ ] If the attach step fails, the upload is not shown as "on your profile"; the user can retry the attach or discard the file (`DELETE /files/:id`).
- [ ] An oversized file reads "Too large (max 25 MB)" before upload; an unsupported type reads "Unsupported file type".

### S2 · Attach while creating a Ring ([[Screen Index#s20|s20]])

**As a** Ring owner **I want** to add attachments in step 3 of the wizard **so that** the new Ring is complete when I finish.

Acceptance criteria:
- [ ] The Ring exists before step 3 (created by `POST /rings` in step 1), so uploads can be attached to its projection right away.
- [ ] Cancelling the wizard offers to delete the files uploaded during it, since nothing else references them.
- [ ] The count of attachments carried into step 4 matches the projection's `attachments[]`.

### S3 · See attachments on Ring data ([[Screen Index#s14|s14]])

**As a** Ring owner **I want** to see which files this Ring shows **so that** I can check the Ring before sharing it.

Acceptance criteria:
- [ ] Attachments list from `GET /rings/:ringId/projection` with name, type icon and size; hidden ones (`isVisible: false`) are greyed in the owner's editor.
- [ ] A tap on an attachment shows its metadata; until S10 ships there is no preview or download, and the UI says "Download coming soon" rather than failing.
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
- [ ] Every photo the library lists shows a thumbnail. The list itself is [[T-012 List my files (photo library)]].

### S9 · A viewer sees the photo and files this Ring shows ([[Screen Index#s31|s31]], [[Screen Index#s44|s44]])

**As a** viewer (a Ring member, or someone who just scanned a badge) **I want** to see the owner's photo for my Ring and open the files it shows **so that** the card reads as a person, not a placeholder.

Acceptance criteria:
- [ ] On s44 (scanned Pin) and s31 (View as), the photo from the view's `avatarFileId` shows.
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

## States and motion the design asks for

- State: picking, uploading (progress), uploaded-not-attached, attached, hidden, failed, too large, unsupported type.
- State: attachment rows on Ring data with type icon and size; "Download coming soon" until bytes can be served.
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
- The library screen waits on [[T-012 List my files (photo library)]].
