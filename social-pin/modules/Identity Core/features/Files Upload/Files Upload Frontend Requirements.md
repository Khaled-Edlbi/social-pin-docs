---
type: frontend-requirements
code: files
scope: feature
feature: files
module: identity
status: draft
screens: [s14, s20, s36]
created: 2026-10-18
updated: 2026-10-27
tags: [frontend-requirements, frontend-requirements/draft, module/identity, layer/frontend]
---

# Files Upload · Frontend Requirements

**Feature:** [[Files Upload]] · **Status:** Draft · **Story:** [[Files Upload Story]] · **Backend Integration:** [[Files Upload Backend Integration]]

What the client needs from the backend to upload, attach, inspect and delete files behind the Ring screens, and whether each need is met today. The multipart shape, the allow-list and the limits are in [[Files Upload Backend Integration]].

## Per screen

### [[Screen Index#s36|s36]] Add to this Ring

- Needs: upload a document; attach it to this Ring's projection with an optional label; show the result.
- Actions: File → picker → upload → attach; Done.
- States: picking, uploading with progress, uploaded-not-attached, attached, failed (size, type, network).
- Source today: `POST /files`, then `POST /rings/:ringId/projection/attachments`.

### [[Screen Index#s20|s20]] New Ring · step 3 (what it shows)

- Needs: the same upload-then-attach against the Ring created in step 1; discard uploads on cancel.
- Source today: `POST /files`, `POST …/attachments`, `DELETE /files/:id`.

### [[Screen Index#s14|s14]] Ring data

- Needs: the attachment list with `filename`, `mimeType`, `sizeBytes`, `label`, `isVisible`, `sortOrder`; detach; hide / show.
- States: list, empty ("No files yet"), hidden row greyed, "Download coming soon".
- Source today: `GET /rings/:ringId/projection` (`attachments[]`), `DELETE …/attachments/:attachmentId`, `PATCH` is not available on an attachment: hide / show and reorder wait on a task (see Endpoints).

### [[Screen Index#s29|s29]] Photo for this Ring (upload step)

- Needs: upload an image and set it as this Ring's photo.
- Source today: `POST /files`, `PATCH /rings/:ringId/projection { avatarFileId }`.

### Any screen · file metadata and delete (no prototype screen)

- Needs: read one file's metadata; delete a file.
- Source today: `GET /files/:id`, `DELETE /files/:id`.

## Endpoints required

| Need | Endpoint | Available | Task / decision |
|---|---|---|---|
| Upload a file (multipart `file`) | `POST /files` | ✅ | — |
| Read a file's metadata | `GET /files/:id` | ✅ | — |
| Delete a file | `DELETE /files/:id` | ✅ | — |
| Attach a file to a Ring | `POST /rings/:ringId/projection/attachments` | ✅ | — (listed under [[Ring Projection]]) |
| Detach from a Ring | `DELETE …/attachments/:attachmentId` | ✅ | — (listed under [[Ring Projection]]) |
| Use a file as the Ring photo | `PATCH /rings/:ringId/projection` | ✅ | — (listed under [[Ring Projection]]) |
| Display or download the bytes | — | ❌ | [[Files Upload Story|Files Upload · showing files]] |
| List my files (library, filter by kind) | — | ❌ | [[T-012 List my files (photo library)]] |
| "N Rings inherit it" per file | — | ❌ | [[T-013 Usage count per file across Rings]] |
| Hide / show or reorder an attachment in place | — | ❌ | no task yet; attachments have `isVisible` and `sortOrder` on create only (gap to record in [[Ring Projection]]) |

## Behaviour expectations

- Refetch / realtime: after every attach or detach, refetch `GET /rings/:ringId/projection` and invalidate `view:<viewer>:ring:<ringId>` so "View as" is current.
- Caching keys: `file:<fileId>` for metadata; uploaded-but-unattached ids in memory under the editing screen, cleared on screen exit (after offering delete).
- Pagination / ordering: none for the endpoints above; attachments are rendered by `sortOrder`.
- Upload: one multipart part named `file`, real MIME type set, access token as bearer; show progress; allow cancel by aborting the request, then call `GET /files/:id` only if an id was received.
- Client checks before upload: type in the allow-list (JPEG, PNG, WebP, GIF, PDF, DOCX, XLSX, PPTX, DOC, PPT, TXT, CSV) and size ≤ 25 MB. The server remains the authority.
- Two-step semantics: an uploaded file is "in your library", not "on your profile". Only an attached file is shown as part of a Ring.
- Delete order: detach, then delete. A deleted file leaves its attachment rows in place; the UI must not depend on the backend to cascade.
- No URL guessing: never derive a path from `id`, `filename` or `checksum`; render a placeholder until showing files ships (S7–S11 of the story).
- Retention: keep the local image or file handle for the editing session so the owner sees what they picked; after relaunch the placeholder returns.

## Error states the UI must handle

| Status | ErrorCode | Show |
|---|---|---|
| 413 | `E_FILE_03` | "Too large (max 25 MB)" |
| 415 | `E_FILE_02` | "Unsupported file type" |
| 400 | `E_FILE_02` | client bug (no `file` part); log, do not surface |
| 404 | `E_FILE_01` | "This file is no longer available"; drop it from the local state |
| 400 | `E_FILE_04` | "Choose a file from your library" (not the caller's file) |
| 403 | `E_RING_05` | the attach target is not editable by this user: read-only editor |
| 404 | `E_RING_PROFILE_04` | attachment not in this projection: refetch the editor |

Until [[Error Contract Story|Error Contract · S4–S8]] ships, branch on status and endpoint.

## Blocked by

- [[Files Upload Story|Files Upload · showing files]] — every preview, thumbnail and download on s14, s29 and the viewer screens.
- [[T-012 List my files (photo library)]] — picking an already-uploaded file instead of uploading again.
