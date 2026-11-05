---
id: B-12
type: bug
module: identity
feature: ring-projection
status: todo
priority: medium
effort: S
foundOn: "BI-07 Ring Projection Backend Integration"
screens: [s24, s25, s36]
depends: []
affects: ["BI-07 Ring Projection Backend Integration", "QB-13 Ring Projection QA Backend"]
related: ["BI-07 Ring Projection Backend Integration", "QB-13 Ring Projection QA Backend", "BD-10 Ring Projection Backend Delivery", "PATCH /rings/:ringId/projection/links/:linkId"]
pending: []
created: 2026-11-05
updated: 2026-11-05
tags: [bug, bug/todo, module/identity, priority/medium]
---

# ⬜ B-12 · Null on a link or custom field's required field answers 500

**Found against:** [[BI-07 Ring Projection Backend Integration]] · **Feature:** [[F-10 Ring Projection]] · **Status:** To do · **Priority:** Medium (`critical | high | medium | low`, from `docs.config.json`) · **Deadline:** — · **Effort:** S (S < 1 day, M 1–3 days, L > 3 days)

**Found by:** [[QB-13 Ring Projection QA Backend]] rows B64, B65, B67 and B90, on build `main @ 12172c6 · localhost:3110, Node 22.22.2`.

## What

**What happens.** `PATCH /rings/:ringId/projection/links/:linkId` with `{ "value": null }`, `{ "type": null }` or `{ "isVisible": null }`, and `PATCH …/info-blocks/:blockId` with `{ "title": null }`, answer **500 "Internal server error"**. The server log shows Prisma refusing the write (`libraryLink.update()`, `ringProfileLink.upsert()`); nothing is changed (the transaction rolls back). `null` on the nullable fields works as documented: `label: null` and `body: null` clear them (200).

**What should happen.** A 400 validation body, as for any other wrong value of these fields ([[BI-07 Ring Projection Backend Integration]], *Errors to handle*: a client error is a 4xx; the project rule "validate all input at the edge"). `type`, `value`, `isVisible`, `sortOrder` and `title` are not nullable.

**Where.** `UpdateRingProfileLinkDto` and `UpdateRingInfoBlockDto` are `PartialType(Create…Dto)` from `@nestjs/swagger`, which marks every field optional with `null` skipping every rule, so `null` reaches `RingProfileService.updateLink` / `updateInfoBlock` and Prisma. F-07 met the same and fixed `UpdateProfileDto` with `{ skipNullProperties: false }`; `UpdateRingDto` (F-11) has the same pattern.

**On which build.** backend `main @ 12172c6`, 2026-11-05.

The fix is the backend's (`/backend`). That agent sets `in-progress` when it starts and `ready` when the fix ships (status, tag, H1 and the Status segment only; the fix itself is recorded in its own delivery note, with a flag line here); QA re-tests a `ready` bug and closes it or reopens it.

## Design

- [[Screen Index#s24|s24]], [[Screen Index#s25|s25]], [[Screen Index#s36|s36]]: the link and field edit sheets

## Impact

Output of `node scripts/build-tree.mjs --impact B-12` when the bug was filed: the notes the fix touches and that must be updated or flagged when it ships.

- [[BI-07 Ring Projection Backend Integration]] — related →
- [[F-10 Ring Projection]] — wikilink →

## Definition of done

- [ ] The behaviour is fixed, or the notes are corrected, as the decision says (`resolution:` set, the tag `resolution/<id>` with it)
- [ ] The QA row that found it re-run against the fix, on a named build
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-11-05 · filed with --scaffold bug, found against BI-07 Ring Projection Backend Integration
