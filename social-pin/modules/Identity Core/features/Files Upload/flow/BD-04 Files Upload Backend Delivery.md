---
id: BD-04
type: backend-delivery
module: identity
feature: files
status: done
scope: feature
screens: [s14, s20, s36]
pending: ["[[FR-04 Files Upload Frontend Requirements]]: GET /files?kind=image|document, the library list (Photo Library · S7)", "[[FR-04 Files Upload Frontend Requirements]]: signed avatarUrl and url per attachment on the owner projection and the view, valid 15 minutes (D-16, S7–S11)", "[[FR-04 Files Upload Frontend Requirements]]: usedBy and followerCount on GET /files?kind=image (Photo Library · S8)"]
created: 2026-10-15
updated: 2026-10-29
tags: [backend-delivery, backend-delivery/done, module/identity, layer/backend]
---

# ✅ Files Upload · Backend Delivery

> ⚠ Affected by [[D-16 Files load from signed links that expire in 15 minutes]] (2026-10-29): next work: the signed-link route, its secret and the 15-minute lifetime, and `url` on the uploader's file metadata. For `/backend`.

**Feature:** [[F-04 Files Upload]] · **Status:** Done · **Integration guide:** [[BI-03 Files Upload Backend Integration]] · **Requirements:** [[FR-04 Files Upload Frontend Requirements]] · **QA:** [[QB-06 Files Upload QA Backend]]

What the backend shipped for this feature and how it works. The sum of this feature's task-level Backend Delivery notes (see the *Tasks* table below).

## Endpoints, tables and code

**Endpoints**

- `POST /files`
- `GET /files/:id`
- `DELETE /files/:id`

**Tables / models:** `File`

**Code:** `src/modules/file/`, `src/common/upload/`

## How it works

`POST /files` runs through `FileInterceptor('file')`; `FileService.upload` rejects a missing part (400 `E_FILE_02`), a MIME type outside the allow-list (415 `E_FILE_02`; an allow-list because a context-scoped file is served from the API's own origin and an unexpected type is a stored-XSS risk) and anything over 25 MB (413 `E_FILE_03`). The row is written **before** the bytes are flushed to `<uploadsDir>/files/<random-uuid><safe-ext>`, inside a transaction, so a failed write rolls the row back rather than leaving a reference to a file that is not there; `checksum` is the SHA-256 of the bytes. `persist` and `discard` are the only two methods that touch bytes, so moving to object storage replaces those two. `GET /files/:id` and `DELETE /files/:id` are scoped to the uploader (404 `E_FILE_01`); delete is a soft delete followed by a best-effort unlink, and the row survives because `ring_profile_files`, `exhibitor_documents` and `chat_messages` reference it. Who may *read* a file is not this service's question: it follows the context that references the file (`RingProfileService.assertOwnFile` on write, the access engine on read). `FileEntity` omits `storageKey`, so a client cannot address the bucket directly. The static mount serves **only** `<uploadsDir>/public`, at `/uploads/public`, for `PUBLIC` files (event covers, logos; nothing writes one yet). Context-scoped uploads live in `<uploadsDir>/files/`, beside that folder, and no URL reaches them: the mount runs before every guard, so anything it served would be readable by anyone with the path, with no way to revoke it ([[B-07 Context-scoped uploads are served by the public static mount]]).

### What exists

- Max 25 MB. Accepted: JPEG, PNG, WebP, GIF, PDF, DOCX / XLSX / PPTX, DOC / PPT, TXT, CSV. Anything else is a 415.
- Binaries in object storage, metadata in the database; `FileService.persist` / `discard` are the only methods touching bytes.
- The response omits the storage path.

### Gaps

- No "list my files" and no "N Rings inherit it" count. See [[F-06 Photo Library]].
- **No route serves the bytes back.** `storageKey` is private, the static mount serves only the public folder, and nothing maps a file id to a download, so photos and attachments cannot be displayed by a client yet. See [[S-06 Files Upload Story|Files Upload · showing files]].

## Log

- 2026-10-18 · split out of [[F-04 Files Upload]] when the vault moved to layers
- 2026-10-29 · branch `B-07/file/uploads-public-only`, merged to `main @ c85db4b` · fixes [[B-07 Context-scoped uploads are served by the public static mount]]: the static mount serves only `<uploadsDir>/public` at `/uploads/public`; context-scoped uploads are no longer reachable at `/uploads/files/…`. No endpoint or response shape changed. Spec: `src/common/bootstrap/configure-app.spec.ts`. Flagged nothing: no client calls the mount.
- 2026-10-29 · [[FR-04 Files Upload Frontend Requirements]] approved by the backend (branch `tickets/backend/M-01-identity/F-04-files/FR-04-accepted`). This note stays `done`; its three open asks are in `pending` (the library list, the signed links of [[D-16 Files load from signed links that expire in 15 minutes]], `usedBy`), so it reads Partial until they ship.
