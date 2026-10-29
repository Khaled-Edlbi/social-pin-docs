---
id: B-07
type: bug
module: identity
feature: files
status: done
resolution: fixed
priority: high
effort: S
foundOn: "BD-04 Files Upload Backend Delivery"
screens: [s14, s20, s24, s36, s29, s30, s31, s44]
depends: []
affects: ["BD-04 Files Upload Backend Delivery", "BI-03 Files Upload Backend Integration", "QB-06 Files Upload QA Backend"]
related: ["QB-06 Files Upload QA Backend", "BD-04 Files Upload Backend Delivery", "BI-03 Files Upload Backend Integration", "ND-16 Viewer access to file bytes", "S-06 Files Upload Story", "POST /files"]
pending: []
created: 2026-10-29
updated: 2026-10-29
tags: [bug, bug/done, module/identity, priority/high, resolution/fixed]
---

# ✅ B-07 · Context-scoped uploads are served by the public static mount

**Found against:** [[BD-04 Files Upload Backend Delivery]] · **Feature:** [[F-04 Files Upload]] · **Status:** Done · **Resolution:** fixed · **Priority:** High · **Deadline:** — · **Effort:** S

**Found by:** the backend, reading the code for [[ND-16 Viewer access to file bytes]], on build `main @ b4984d6`. Filed by `/backend` on the owner's word (khaled, 2026-10-29); no QA row covers it yet.

## What

**What happens.** `POST /files` stores every upload as `<uploadsDir>/files/<uuid>.<ext>` with `visibility: CONTEXT_SCOPED`. `configureApp` serves the **whole** `uploadsDir` as static files at `/uploads`, outside the auth guard, so `GET /uploads/files/<uuid>.<ext>` returns the bytes of any upload, Ring photos and attachments included, to anyone, with no token and no expiry. The only protection is that the storage key is random and never handed out; once one leaks (a log, a screenshot, a future bug), access to that file cannot be revoked.

**What should happen.** A context-scoped file is readable only through a context the viewer can reach ([[BD-04 Files Upload Backend Delivery]]: *"visibility follows the context that references it"*; [[S-06 Files Upload Story]] S5: a link copied out of the app is useless without access). The static mount serves only `PUBLIC` files (event covers, logos); context-scoped bytes leave only through the route [[ND-16 Viewer access to file bytes]] decides.

**Where.** The static mount: `serveUploads` in `src/common/bootstrap/configure-app.ts`. The storage path: `FileService.upload` in `src/modules/file/file.service.ts`.

**On which build.** `main @ b4984d6`.

The fix is the backend's (`/backend`): mount only a `public/` folder under `uploadsDir`, and keep `CONTEXT_SCOPED` files out of it. It does not wait on ND-16; until ND-16 ships, no client can load a context-scoped file at all, which is the state [[BI-03 Files Upload Backend Integration]] already documents.

## Design

- [[Screen Index#s14|s14]], [[Screen Index#s20|s20]], [[Screen Index#s24|s24]], [[Screen Index#s36|s36]], [[Screen Index#s29|s29]], [[Screen Index#s30|s30]], [[Screen Index#s31|s31]], [[Screen Index#s44|s44]]

## Impact

Output of `node scripts/build-tree.mjs --impact B-07` when the bug was filed: the notes the fix touches and that must be updated or flagged when it ships.

- [[BD-04 Files Upload Backend Delivery]] — related →
- [[F-04 Files Upload]] — wikilink →

## Definition of done

- [x] The behaviour is fixed: the static mount serves only `<uploadsDir>/public` (`main @ c85db4b`); `resolution: fixed`, the tag `resolution/fixed` with it
- [x] Checked against the fix on a named build: [[QB-06 Files Upload QA Backend]] rows B30–B32 ✅ on `main @ c85db4b · localhost:3101, Node 22.22.2` (no QA row found it; the backend did)
- [x] `depends` / `affects` / `related` declared; [[BD-04 Files Upload Backend Delivery]] records the fix, the Developer Guide shows the new address
- [x] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-10-29 · filed with --scaffold bug, found against BD-04 Files Upload Backend Delivery, by `/backend` while reviewing [[ND-16 Viewer access to file bytes]] on `main @ b4984d6`
- 2026-10-29 · fix merged: branch `B-07/file/uploads-public-only`, backend `main @ c85db4b`. The static mount serves only `<uploadsDir>/public` at `/uploads/public`; `GET /uploads/files/<key>` is a 404. Recorded in [[BD-04 Files Upload Backend Delivery]]. Left for QA: re-run against `main @ c85db4b`, then `resolution` and `status` (QA and the PM's, not the backend's).
- 2026-10-29 · closed by `/qa` on khaled's word: [[QB-06 Files Upload QA Backend]] B30 (`/uploads/files/<key>` 404 with and without a token), B31 (no way in through `/uploads/public`, encoded `../` included) and B32 (only `public/` served, with `nosniff`) all ✅ on `main @ c85db4b · localhost:3101, Node 22.22.2`. `status: done`, `resolution: fixed`.
