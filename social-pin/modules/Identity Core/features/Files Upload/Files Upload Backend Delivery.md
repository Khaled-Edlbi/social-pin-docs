---
type: backend-delivery
code: files
scope: feature
feature: files
module: identity
status: done
screens: [s14, s20, s36]
created: 2026-10-15
updated: 2026-10-27
tags: [backend-delivery, backend-delivery/done, module/identity, layer/backend]
---

# ✅ Files Upload · Backend Delivery

**Feature:** [[Files Upload]] · **Status:** Done · **Integration guide:** [[Files Upload Backend Integration]] · **Requirements:** [[Files Upload Frontend Requirements]] · **QA:** [[Files Upload QA Backend]]

What the backend shipped for this feature and how it works. The sum of this feature's task-level Backend Delivery notes (see the *Tasks* table below).

## Endpoints, tables and code

**Endpoints**

- `POST /files`
- `GET /files/:id`
- `DELETE /files/:id`

**Tables / models:** `File`

**Code:** `src/modules/file/`, `src/common/upload/`

## How it works

`POST /files` runs through `FileInterceptor('file')`; `FileService.upload` rejects a missing part (400 `E_FILE_02`), a MIME type outside the allow-list (415 `E_FILE_02`; an allow-list because a context-scoped file is served from the API's own origin and an unexpected type is a stored-XSS risk) and anything over 25 MB (413 `E_FILE_03`). The row is written **before** the bytes are flushed to `<uploadsDir>/files/<random-uuid><safe-ext>`, inside a transaction, so a failed write rolls the row back rather than leaving a reference to a file that is not there; `checksum` is the SHA-256 of the bytes. `persist` and `discard` are the only two methods that touch bytes, so moving to object storage replaces those two. `GET /files/:id` and `DELETE /files/:id` are scoped to the uploader (404 `E_FILE_01`); delete is a soft delete followed by a best-effort unlink, and the row survives because `ring_profile_files`, `exhibitor_documents` and `chat_messages` reference it. Who may *read* a file is not this service's question: it follows the context that references the file (`RingProfileService.assertOwnFile` on write, the access engine on read). `FileEntity` omits `storageKey`, so a client cannot address the bucket directly.

### What exists

- Max 25 MB. Accepted: JPEG, PNG, WebP, GIF, PDF, DOCX / XLSX / PPTX, DOC / PPT, TXT, CSV. Anything else is a 415.
- Binaries in object storage, metadata in the database; `FileService.persist` / `discard` are the only methods touching bytes.
- The response omits the storage path.

### Gaps

- No "list my files" and no "N Rings inherit it" count. See [[Photo Library]].
- **No route serves the bytes back.** `storageKey` is private, the static `/uploads` mount is keyed by it, and nothing maps a file id to a download, so photos and attachments cannot be displayed by a client yet. See [[Files Upload Story|Files Upload · showing files]].

## Tasks delivered

| Task | Delivery note | Status |
|---|---|---|
| — | — | — |

## Log

- 2026-10-18 · split out of [[Files Upload]] when the vault moved to layers
