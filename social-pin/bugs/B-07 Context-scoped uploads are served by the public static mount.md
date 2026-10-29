---
type: bug
id: B-07
status: todo
priority: high
effort: S
feature: files
module: identity
foundOn: "BD-04 Files Upload Backend Delivery"
screens: [s14, s20, s24, s36, s29, s30, s31, s44]
depends: []
affects: ["BD-04 Files Upload Backend Delivery", "BI-03 Files Upload Backend Integration"]
related: ["BD-04 Files Upload Backend Delivery", "BI-03 Files Upload Backend Integration", "ND-16 Viewer access to file bytes", "S-06 Files Upload Story", "POST /files"]
pending: []
created: 2026-10-29
updated: 2026-10-29
tags: [bug, bug/todo, module/identity, priority/high]
---

# ⬜ B-07 · Context-scoped uploads are served by the public static mount

**Found against:** [[BD-04 Files Upload Backend Delivery]] · **Feature:** [[F-04 Files Upload]] · **Status:** To do · **Priority:** High · **Deadline:** — · **Effort:** S

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

- [ ] The behaviour is fixed, or the notes are corrected, as the decision says (`resolution:` set, the tag `resolution/<id>` with it)
- [ ] The QA row that found it re-run against the fix, on a named build
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-10-29 · filed with --scaffold bug, found against BD-04 Files Upload Backend Delivery, by `/backend` while reviewing [[ND-16 Viewer access to file bytes]] on `main @ b4984d6`
