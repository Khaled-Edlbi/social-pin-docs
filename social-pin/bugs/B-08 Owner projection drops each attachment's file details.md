---
id: B-08
type: bug
module: identity
feature: ring-projection
status: done
resolution: fixed
priority: high
effort: S
foundOn: "BI-07 Ring Projection Backend Integration"
screens: [s14, s24, s36]
depends: []
affects: ["BI-07 Ring Projection Backend Integration", "QB-06 Files Upload QA Backend"]
related: ["BI-07 Ring Projection Backend Integration", "BD-10 Ring Projection Backend Delivery", "QB-06 Files Upload QA Backend", "S-06 Files Upload Story", "BI-03 Files Upload Backend Integration", "BI-09 View As & Pin Views Backend Integration", "GET /rings/:ringId/projection", "PATCH /rings/:ringId/projection", "POST /rings/:ringId/projection/attachments"]
pending: []
created: 2026-10-29
updated: 2026-10-29
tags: [bug, bug/done, module/identity, priority/high, resolution/fixed]
---

# ✅ B-08 · Owner projection drops each attachment's file details

**Found against:** [[BI-07 Ring Projection Backend Integration]] · **Feature:** [[F-10 Ring Projection]] · **Status:** Done · **Resolution:** fixed · **Priority:** High · **Deadline:** — · **Effort:** S

**Found by:** [[QB-06 Files Upload QA Backend]] rows B12 and B16, on build `main @ c85db4b · localhost:3101, Node 22.22.2`.

## What

**What happens.** Every route that returns the owner's projection (`GET /rings/:ringId/projection`, `PATCH /rings/:ringId/projection`, `POST /rings/:ringId/projection/attachments`) answers each `attachments[]` row with only `id`, `label`, `sortOrder` and `isVisible`. The file's `fileId`, `filename`, `mimeType` and `sizeBytes` are missing, so the owner's editor cannot name, size or tell apart the files on a Ring.

**What should happen.** [[BI-07 Ring Projection Backend Integration]]: *"attachments also `fileId`, `filename`, `mimeType`, `sizeBytes`"*. [[S-06 Files Upload Story]] S3: attachments show as chips with the file name, and the detail sheet shows the type and size. The viewer's view (`GET /views/pin/:pinName`) does carry `filename`, `mimeType` and `sizeBytes` (row B21 passes), so only the owner's shape is wrong.

**Where.** The three owner routes above. The query selects the file's details nested under `file` (`selectRingProfileForOwner` in `src/prisma/validators/ring.validator.ts`), while the owner's response entity (`RingAttachmentOwnerEntity`) expects them flat on the row; the serializer drops the nested object and the flat fields are never filled. The viewer path flattens them in `RingProfileService.toView`; the owner path has no such step.

**On which build.** `main @ c85db4b`, run 2026-10-29 on `localhost:3101` under Node 22.22.2.

The fix is the backend's (`/backend`). Nothing in the viewer's shape changes.

## Design

- [[Screen Index#s14|s14]], [[Screen Index#s24|s24]], [[Screen Index#s36|s36]]

## Impact

Output of `node scripts/build-tree.mjs --impact B-08` when the bug was filed: the notes the fix touches and that must be updated or flagged when it ships.

- [[BI-07 Ring Projection Backend Integration]] — the owner's attachment shape
- [[QB-06 Files Upload QA Backend]] — rows B12 and B16, re-run when this ships
- [[F-10 Ring Projection]] — wikilink →

## Definition of done

- [x] The behaviour is fixed: `RingProfileService.toOwnerView` returns each attachment's `fileId`, `filename`, `mimeType` and `sizeBytes` on every owner route (`main @ c80ed9d`); `resolution: fixed`, the tag `resolution/fixed` with it
- [x] The QA rows that found it (B12, B16) re-run against the fix: ✅ on `main @ c80ed9d · localhost:3101, Node 22.22.2`, with the other 30 rows of [[QB-06 Files Upload QA Backend]]
- [x] `depends` / `affects` / `related` declared; [[BD-10 Ring Projection Backend Delivery]] records the fix and the flag on [[BI-07 Ring Projection Backend Integration]] is cleared
- [x] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-10-29 · filed with --scaffold bug, found against BI-07 Ring Projection Backend Integration, from [[QB-06 Files Upload QA Backend]] rows B12 and B16 on `main @ c85db4b`
- 2026-10-29 · fix merged: branch `B-08/ring-profile/owner-attachment-file-details`, backend `main @ c80ed9d`. `RingProfileService.toOwnerView` flattens each attachment's file on every owner route; recorded in [[BD-10 Ring Projection Backend Delivery]], BI-07's flag cleared. [[QB-06 Files Upload QA Backend]] re-run on that build: B12 and B16 ✅, 32 of 32. Left: `resolution` and `status`, on the user's word.
- 2026-10-29 · closed by `/qa` on khaled's word: [[QB-06 Files Upload QA Backend]] B12 and B16 ✅ on `main @ c80ed9d`. `status: done`, `resolution: fixed`.
