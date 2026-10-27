---
type: backend-integration
code: files
scope: feature
feature: files
module: identity
status: current
screens: [s14, s20, s36]
created: 2026-10-15
updated: 2026-10-27
tags: [backend-integration, backend-integration/current, module/identity, layer/backend]
---

# 🔌 Files Upload · Backend Integration

**Feature:** [[Files Upload]] · **Backend:** ✅ Done · **Read first:** [[Frontend Contract]]

What the client builds: the upload step behind a Ring photo and a Ring attachment (Portfolio.pdf, pitch deck), with the type and size checks done before the request leaves the device.

## Screens → calls

| Screen | The user does | Calls |
|---|---|---|
| [[Screen Index#s29\|s29]] Photo for this Ring | picks a photo | `POST /files` then `PATCH /rings/:ringId/projection { avatarFileId }` |
| [[Screen Index#s36\|s36]], [[Screen Index#s20\|s20]], [[Screen Index#s14\|s14]] | attaches a file | `POST /files` then `POST /rings/:ringId/projection/attachments { fileId }` |
| any | checks a file they uploaded | `GET /files/:id` |
| any | deletes a file | `DELETE /files/:id` |

## Flow

1. **Upload.** `POST /files` as `multipart/form-data` with one field named `file`, the access token as bearer → 201 `FileEntity`. The file is now in the caller's library and visible to nobody else.
2. **Reference it** from a context: `avatarFileId` or an attachment on a Ring projection ([[Ring Projection Backend Integration]]). Visibility follows the context: whoever may see that Ring may see the file.
3. **Metadata.** `GET /files/:id` → `FileEntity`, only for files the caller uploaded (404 otherwise).
4. **Delete.** `DELETE /files/:id` → 200. Soft delete; the bytes are removed. Contexts that referenced it keep their row, so detach first in the UI if you want a clean list.

## Shapes that matter

`FileEntity`: `id`, `filename`, `mimeType`, `sizeBytes`, `checksum` (SHA-256), `visibility` (`CONTEXT_SCOPED` / `PUBLIC`), `createdById`, `createdAt`. **No URL and no storage path**, on purpose.

Limits, enforced server-side and worth checking client-side first:

| Rule | Value |
|---|---|
| Max size | 25 MB (413 `E_FILE_03`) |
| Accepted types | `image/jpeg`, `image/png`, `image/webp`, `image/gif`, `application/pdf`, DOCX, XLSX, PPTX, `application/msword`, `application/vnd.ms-powerpoint`, `text/plain`, `text/csv` (anything else 415 `E_FILE_02`) |
| Missing field | 400 `E_FILE_02` |

Send the real MIME type with the part; the allow-list is checked on the declared type.

## State to keep on the client

The `id` returned by the upload, until it is referenced. There is no list endpoint yet, so an uploaded-but-unreferenced file is only known to the client that uploaded it.

## Errors to handle

| Status | ErrorCode | When | Show |
|---|---|---|---|
| 413 | `E_FILE_03` | over 25 MB | "Too large" before upload where possible |
| 415 | `E_FILE_02` | type not on the allow-list | "Unsupported type" |
| 400 | `E_FILE_02` | no `file` part | client bug |
| 404 | `E_FILE_01` | not one of the caller's files | missing |
| 400 | `E_FILE_04` | referencing someone else's file from a projection | re-pick |

## Rules the UI must respect

- Uploading does not publish. Do not show a file as "on your profile" until it is attached to a Ring.
- Do not try to guess a URL from the id or the filename: the storage path is private and the static mount is not the contract.

## Not available yet

- **Fetching the bytes back.** No endpoint or URL serves a file by id, so photos and attachments cannot be displayed or downloaded in a client yet: [[Files Upload Story|Files Upload · showing files]].
- "My files" list and the photo library (s30): [[T-012 List my files (photo library)]].
- "N Rings inherit it": [[T-013 Usage count per file across Rings]].

## Checklist

- [ ] Client-side type and size check mirroring the table.
- [ ] Multipart field named `file`, correct MIME type set.
- [ ] Upload → reference as two steps, with the id held in between.
- [ ] No URL built from ids; placeholder rendering until showing files ships ([[Files Upload Story]] S7–S11).
