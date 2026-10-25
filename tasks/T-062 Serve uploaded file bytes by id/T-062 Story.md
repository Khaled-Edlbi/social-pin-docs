---
type: story
code: T-062
scope: task
feature: files
module: identity
status: draft
screens: [s14, s29, s30, s31, s44]
depends: []
affects: []
related: []
pending: []
approvedBy: ""
approvedAt: ""
owner: "khaled"
updated: 2026-10-25
tags: [story, story/draft, module/identity, layer/business]
task: T-062
---

# T-062 · Serve uploaded file bytes by id · User Story

**Task:** [[T-062 Serve uploaded file bytes by id]] · **Feature:** [[Files Upload]] · **Feature-level note:** [[Files Upload Story]] · **Status:** Draft (awaiting product sign-off) · **Frontend Requirements:** [[T-062 Frontend Requirements]] · **Backend Integration:** [[T-062 Backend Integration]] · **Verified by:** [[T-062 QA Backend]], [[T-062 QA Frontend]]

> Derived from the task [[T-062 Serve uploaded file bytes by id]]; **not approved by product yet**. The feature-level story is [[Files Upload Story]]; this note says what the user gets from this task in particular. `approved` when product signs off (`approvedBy`, `approvedAt`); `verified` when both QA notes are `passing`.

A client cannot display a Ring photo or download an attachment today. `FileEntity` deliberately omits `storageKey`, the static `/uploads` mount is keyed by that storage path, and nothing maps a file **id** to bytes. So `avatarFileId` on every projection and view, and `attachments[].id`, are dead ends for the UI.

## Persona

Two people at two moments. The **Ring owner** who just picked a photo for a Ring, or attached a portfolio, and wants to see it there. The **viewer** (a Ring member, or someone who just scanned a badge) looking at that Ring's card and expecting a face, not initials, and a file that opens.

## Stories

### S1 · I see the photo I picked for a Ring ([[Screen Index#s29|s29]])

**As a** Ring owner **I want** the photo I set on a Ring to show on that Ring **so that** I know which face each audience sees.

Acceptance criteria:
- [ ] After `PATCH /rings/:ringId/projection { avatarFileId }`, the photo shows on s29, on the Ring's header and in the Ring switcher, and again after relaunch.
- [ ] A Ring without a photo, or one whose file is gone, shows the initials placeholder.

### S2 · I see my photos in the library ([[Screen Index#s30|s30]])

**As a** Ring owner **I want** thumbnails of the photos I uploaded **so that** I pick one by looking at it.

Acceptance criteria:
- [ ] Every photo the library lists shows a thumbnail. The list itself is [[T-012 List my files (photo library)]].

### S3 · A viewer sees the photo and files this Ring shows ([[Screen Index#s31|s31]], [[Screen Index#s44|s44]])

**As a** viewer **I want** to see the owner's photo for my Ring and open the files it shows **so that** the card reads as a person, not a placeholder.

Acceptance criteria:
- [ ] On s44 (scanned Pin) and s31 (View as), the photo from the view's `avatarFileId` shows.
- [ ] Each attachment on the view opens (PDF, image) or downloads.
- [ ] The owner's "View as" shows exactly what a viewer gets: the same photo, the same files, no hidden one.

### S4 · I open a file on a Ring ([[Screen Index#s14|s14]])

**As a** Ring owner **I want** to open an attachment from the Ring's data **so that** I check it's the right file.

Acceptance criteria:
- [ ] Tapping an attachment opens it; "Download coming soon" goes away.

### S5 · What I don't share stays private

**As a** Ring owner **I want** a photo or file to reach only people who can see the Ring it's on **so that** a private Ring stays private.

Acceptance criteria:
- [ ] Someone outside the Ring gets the same 404 as for a file that doesn't exist; they can't tell it exists.
- [ ] A hidden attachment (`isVisible: false`) is never served to a viewer.
- [ ] A link or id copied out of the app is no use to someone without access (or expires, if a signed `url` is chosen).

## States and motion the design asks for

- Loading: the initials placeholder (or a file icon) until the bytes arrive; no layout jump when the photo replaces it.
- Missing or refused: stays on the placeholder silently; no error toast for a picture.
- Opening a file: a progress state while it downloads; the system viewer opens it.

## Rules the backend already enforces

- A file's `visibility` is `CONTEXT_SCOPED` or `PUBLIC` (event covers, logos). Today `GET /files/:id` and `DELETE /files/:id` are scoped to the uploader, and no route serves the bytes to anyone; letting a viewer of a Ring that references a file read it is what this task adds ([[Files Upload Story]]).
- `storageKey` never leaves the server; the client never builds a path from `id`, `filename` or `checksum`.
- Every Ring visibility decision goes through `RingAccessService` (golden rule 8); the byte route must ask it whether the caller may see a live Ring that references the file, not check memberships itself.
- Enumeration resistance: `GET /files/:id` answers one 404 `E_FILE_01` for a file that isn't the caller's and for one that doesn't exist, as `/views` does for Rings.

## Open questions

- **Which id a viewer has.** The view's attachments (`RingAttachmentViewEntity`) carry the attachment `id` and no `fileId`; only the owner's entity has `fileId`. A viewer can't call `GET /files/:id/content` with what it's given. Either the route accepts the attachment id for viewers, the view adds `fileId`, or the view carries a signed `url` per attachment and for the avatar.
- **Route or signed url.** A signed `url` on the view entities is simpler for the app (images load and cache like any web image, no token on each request) and answers the question above. `GET /files/:id/content` needs the bearer token on every image request.
- **Thumbnails.** Whether the library and Ring lists get a smaller size, or download the full photo.
