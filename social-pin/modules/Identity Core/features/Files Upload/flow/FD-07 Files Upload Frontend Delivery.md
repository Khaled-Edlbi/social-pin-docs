---
id: FD-07
type: frontend-delivery
module: identity
feature: files
status: done
scope: feature
deployedTo: []
screens: [s14, s20, s24, s36, s29, s30, s31, s44]
owner: "Omar Fostok"
depends: ["BI-03 Files Upload Backend Integration"]
affects: []
related: ["FR-04 Files Upload Frontend Requirements", "S-06 Files Upload Story", "D-16 Files load from signed links that expire in 15 minutes", "D-03 Links entered once, switched on or off per Ring", "BI-07 Ring Projection Backend Integration", "S-11 Photo Library Story", "S-20 Widgets Story", "S-17 Ring Projection Story", "S-18 Rings Story"]
pending: []
created: 2026-11-05
updated: 2026-11-05
tags: [frontend-delivery, frontend-delivery/done, module/identity, layer/frontend]
---

# ✅ Files Upload · Frontend Delivery

> ⚠ Affected by [[BD-04 Files Upload Backend Delivery]] (2026-11-08): followerCount shipped on backend main cb95a39: every GET /files item has isMainPhoto and followerCount (a number on the main photo, null elsewhere); the s30 inherit count is no longer waiting; shapes in BI-03; for /frontend

**Feature:** [[F-04 Files Upload]] · **Status:** Done · **Built from:** [[BI-03 Files Upload Backend Integration]] · **Against:** [[S-06 Files Upload Story]] · **Requirements:** [[FR-04 Files Upload Frontend Requirements]] · **QA:** [[Files Upload QA Frontend]]

What the client shipped for uploading, attaching, showing and opening photos and files. Attaching from s36, the files on Ring data and switching them on s24 are on `social_pin` `main` (`aae765d`, `2a5d690`, `4887fcb`, 2026-11-01 to 11-03); the signed links, the photos, the library and the documents list are on `rings/F-11/honest-rings` @ `8939d8e` (2026-11-05), not on `main` yet. The QA checklist is PH-01…PH-11 and FL-01…FL-08 in the client's test cases.

## Screens shipped

| Screen | State | Note |
|---|---|---|
| [[Screen Index#s36\|s36]] Add to this Ring · File | ✅ | The phone's picker, then a review: preview (photo, PDF first page, type icon), type, size and a name for the Ring. The allow-list and 25 MB are checked there; nothing is sent until Upload, which shows progress and Cancel. Attached under the name given; Try again or Discard when a step fails (S1, S6). |
| [[Screen Index#s14\|s14]] Ring data | ✅ | Files as chips beside the links; a chip opens a sheet (name, type, size) whose Open shows the file in the phone's viewer (S3, S10). The Ring's photo on the header and in the switcher (S7). |
| [[Screen Index#s24\|s24]] What this Ring shows | ✅ | A Files section listing **all** my documents, attached ones on, the rest off; switching on attaches, off detaches (the file stays mine), renaming attaches it again under the new name, all saved with the screen (S12). "+ Add a file" opens the picker right there. |
| [[Screen Index#s20\|s20]] New Ring · step 3 | ✅ | My documents, each off until switched on; the ones on are attached once the Ring is created (S2, S12). |
| [[Screen Index#s29\|s29]] Photo for this Ring | ✅ | Pick, take, or choose from the library; remove. The photo shows here, on the Ring's header, in the switcher, on My Rings and Home, and after relaunch (S4, S7). |
| [[Screen Index#s30\|s30]] Photo library | ✅ | My photos as thumbnails, each with the Rings using it; upload; delete, its Rings cleared first. The real count on Me (S5, S8). |
| [[Screen Index#s31\|s31]] View as | ✅ | The same photo and files a viewer gets (S9). |
| [[Screen Index#s44\|s44]] A person's card | ✅ | Their photo for my Ring and the files it shows, each opening in the phone's viewer (S9). |

## Calls made

| Endpoint | Where | Notes (retries, cache keys, optimistic updates) |
|---|---|---|
| `POST /files` | s36, s24, s29, s30 | `multipart/form-data`, one part `file`, the real MIME type, with progress. Photos are downsized to 1600 × 1600 on the phone before upload. |
| `GET /files?kind=image` | s30, s29 (the library), Me (count) | Paged by `skip`; `usedBy` names the Rings using each photo; `meta.total` is the count on Me. |
| `GET /files?kind=document` | s24, s20 step 3 | Every page, merged with the projection's `attachments[]` by `fileId`. A failed read leaves the list empty, quietly. |
| `DELETE /files/:id` | s30, s36 (Discard) | On s30 the Rings in `usedBy` are cleared first (`avatarFileId: null`), so no Ring points at a deleted photo. |
| `PATCH /rings/:ringId/projection { avatarFileId }` | s29 | Set or clear the Ring's photo ([[BI-07 Ring Projection Backend Integration]]). |
| `POST /rings/:ringId/projection/attachments { fileId, label }` | s36, s24, s20 | `label` is the name given, or the file name without its extension. |
| `DELETE /rings/:ringId/projection/attachments/:attachmentId` | s24 | Switching off; the file stays in the library. |
| `GET /rings/:ringId/projection`, `GET /views/…` | s14, s29, s31, s44 | The source of every `url` and `avatarUrl`, read again for a fresh link when one fails. |

## State kept on the client

- **Links are never stored.** `url` and `avatarUrl` are taken from the answer that carried them, made absolute, and live 14 minutes on the client, under their 15 ([[D-16 Files load from signed links that expire in 15 minutes]]). No bearer token on them.
- **An expired link is read again once.** A photo that fails to load, or a file that won't open, reads its source (the projection, the view) again for a fresh link; if that one fails too, the file is treated as gone: a photo falls back to the initials, a file doesn't open. Never a loop.
- Files open in the phone's own viewer or browser; nothing is downloaded into the app.

## Deviations from the story or the integration note

- **New Ring creates the Ring at the end, not in step 1** (S2: "The Ring exists before step 3"). Step 3 lists the documents already uploaded, switched off; the ones switched on are attached after `POST /rings`. So nothing is uploaded in the wizard and Cancel has nothing to delete; a new file is added from s24 or s36 once the Ring exists.
- **The file sheet on s14 opens the file** (S10 shipped), so "Download coming soon" is gone.
- **Renaming a file on s24 attaches it again** under the new name (detach, then attach): there is no route to rename an attachment.

## Not done yet

- A gallery of several photos as one item → [[S-20 Widgets Story]]; crop for this Ring, the camera as a library source, the LinkedIn photo → [[S-11 Photo Library Story]] and Linked Accounts (outside this feature).
- How many people follow the main photo on s30 (`followerCount`) → [[S-11 Photo Library Story|Photo Library · S8]], waiting on the main photo itself ([[BD-04 Files Upload Backend Delivery]] keeps it pending).

## Log

- 2026-11-01 · `main` @ `aae765d` (social_pin) · s36 attach a file, reviewed and named first; `2a5d690` s14 file chips and sheet, s24 switch off and rename · flagged nothing
- 2026-11-03 · `main` @ `4887fcb` (social_pin) · s24 redrawn with its Files section and "+ Add a file" · flagged nothing
- 2026-11-05 · `rings/F-11/honest-rings` @ `8939d8e` (social_pin, not on `main` yet) · signed links everywhere, photos for real (s29, header, switcher, My Rings, Home, s31, s44), s30 library, files open in the phone's viewer, all documents on s24 and in New Ring step 3; PH-01…PH-11, FL-01…FL-08 · flagged nothing
