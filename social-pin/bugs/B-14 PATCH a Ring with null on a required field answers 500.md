---
id: B-14
type: bug
module: identity
feature: rings
status: done
resolution: fixed
priority: medium
effort: S
foundOn: "BI-08 Rings Backend Integration"
screens: [s22, s26, s27]
depends: []
affects: []
related: ["BI-08 Rings Backend Integration", "QB-12 Rings QA Backend", "BD-11 Rings Backend Delivery", "PATCH /rings/:id"]
pending: []
created: 2026-11-05
updated: 2026-11-08
tags: [bug, bug/done, module/identity, priority/medium, resolution/fixed]
---

# ✅ B-14 · PATCH a Ring with null on a required field answers 500

**Found against:** [[BI-08 Rings Backend Integration]] · **Feature:** [[F-11 Rings]] · **Status:** Done · **Priority:** Medium (`critical | high | medium | low`, from `docs.config.json`) · **Deadline:** — · **Effort:** S (S < 1 day, M 1–3 days, L > 3 days)

**Found by:** [[QB-12 Rings QA Backend]] row B30, on build backend `main @ 12172c6` (2026-11-05).

## What

**What happens.** `PATCH /rings/:id` by the owner with `null` on any of seven fields that cannot be empty, `name`, `isTemporary`, `joinPolicy`, `requireApproval`, `membersCanSeeEachOther`, `membersCanInvite`, `membersCanSaveAttachments`, answers **500** `{ "message": "Internal server error" }`: the request passes validation and the database refuses the null. Nothing is saved. (`POST /rings` with the same nulls answers 400, as it should.) The six fields that do take `null` (`purpose`, `colorHex`, `style`, `startsAt`, `expiresAt`, `parentRingId`) answer 200 and clear, as documented.

**What should happen.** [[BI-08 Rings Backend Integration]], *Flow* step 5 and *Errors to handle*: `PATCH` takes "any subset of the create fields", `null` only where the contract says it clears (`purpose: null`, `startsAt` / `expiresAt` `null`); anything else invalid is a 400 validation error with `message` naming the field. A 500 tells the client nothing and is logged as a server fault.

**Where.** `PATCH /rings/:id`; `UpdateRingDto` is `PartialType(CreateRingDto)`; `PartialType` marks every field optional in the class-validator sense, which skips validation for `null` as well as `undefined`, so the `@MyIsOptional()` (undefined-only) rule the create DTO relies on is lost on the update and `null` goes through to Prisma. The same 500-on-null shows on the projection's link and custom-field routes in the F-10 QA run (B-12 there, on its own branch, not merged).

**On which build.** Backend `main @ 12172c6`, localhost:3111, throwaway database, 2026-11-05.

The fix is `/backend`'s. That agent sets `in-progress` when it starts and `ready` when the fix ships (status, tag, H1 and the Status segment only; the fix itself is recorded in its own delivery note, with a flag line here); QA re-tests a `ready` bug and closes it or reopens it.

## Design

- [[Screen Index#s22|s22]], [[Screen Index#s26|s26]], [[Screen Index#s27|s27]] (the edit screens; the app does not send these nulls today)

## Impact

Output of `node scripts/build-tree.mjs --impact B-14` when the bug was filed: the notes the fix touches and that must be updated or flagged when it ships.

- [[BI-08 Rings Backend Integration]] — related →
- [[QB-12 Rings QA Backend]] — pending ← (row B30)
- [[F-11 Rings]] — wikilink →

## Definition of done

- [x] The behaviour is fixed, or the notes are corrected, as the decision says (`resolution:` set, the tag `resolution/<id>` with it)
- [x] The QA row that found it re-run against the fix, on a named build
- [x] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [x] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-11-05 · filed with --scaffold bug, found against BI-08 Rings Backend Integration
- 2026-11-05 · filled from [[QB-12 Rings QA Backend]] B30 on backend `main @ 12172c6`
- 2026-11-08 · backend main e483d49 · re-test passed: `PATCH /rings/:id` with `null` on `name`, `type`, `isTemporary`, `joinPolicy`, `requireApproval`, `membersCanSeeEachOther`, `membersCanInvite`, `membersCanSaveAttachments` and `profileId` is 400 naming the field each time, no 500 in the server log; `null` on `purpose`, `colorHex`, `style`, `startsAt`, `expiresAt`, `parentRingId` is 200 and clears. Closed `done`, `resolution: fixed`, on the user's word relayed by the session that asked for the re-test
