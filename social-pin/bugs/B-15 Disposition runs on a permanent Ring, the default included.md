---
id: B-15
type: bug
module: identity
feature: rings
status: ready
priority: medium
effort: S
foundOn: "BI-08 Rings Backend Integration"
screens: [s26, s62]
depends: []
affects: []
related: ["BI-08 Rings Backend Integration", "QB-12 Rings QA Backend", "BD-11 Rings Backend Delivery", "S-18 Rings Story", "POST /rings/:id/disposition", "DELETE /rings/:id", E_RING_04]
pending: []
created: 2026-11-05
updated: 2026-11-08
tags: [bug, bug/ready, module/identity, priority/medium]
---

# 📨 B-15 · Disposition runs on a permanent Ring, the default included

> ⚠ Affected by [[BD-11 Rings Backend Delivery]] (2026-11-08): fixed on backend main e483d49 (dc5f665: `POST /rings/:id/disposition` on a permanent Ring, the default, or a temporary Ring whose window has not ended (or has no `expiresAt`) is 409 `E_RING_10`; `UNDECIDED` is a 400), ready for re-test

**Found against:** [[BI-08 Rings Backend Integration]] · **Feature:** [[F-11 Rings]] · **Status:** Ready · **Priority:** Medium (`critical | high | medium | low`, from `docs.config.json`) · **Deadline:** — · **Effort:** S (S < 1 day, M 1–3 days, L > 3 days)

**Found by:** [[QB-12 Rings QA Backend]] rows B63 and B64, on build backend `main @ 12172c6` (2026-11-05).

## What

**What happens.** `POST /rings/:id/disposition` takes any Ring of the owner and any value of the enum:

- On a **permanent** Ring, `{ "disposition": "AUTO_DELETE" }` answers 201 and archives it (`status: "ARCHIVED"`, `expiresAt` now). On **the default Ring** it does the same: the default becomes `ARCHIVED` while staying `isDefault: true`, so the owner is left with no live default, the state `DELETE` refuses with 409 `E_RING_04` because a scanned QR needs one Ring that resolves. (A `KEEP` afterwards brought it back to `ACTIVE`.)
- `{ "disposition": "UNDECIDED" }` answers 201 and runs a **KEEP**: a lapsed temporary Ring becomes permanent and its window is cleared, though the client asked for no decision.

**What should happen.** [[BI-08 Rings Backend Integration]], *Flow* step 8: disposition is for **temporary** Rings (s62), with `disposition` one of `KEEP`, `MERGE`, `AUTO_DELETE`; [[S-18 Rings Story]] S8: the choice is offered when `isTemporary` and the window is past. A permanent Ring, and above all the default Ring, should be refused (a 4xx; which code is the backend's choice, `E_RING_04`'s reasoning applies to the default), and `UNDECIDED` should be a 400 validation error like any other value outside the three.

**Where.** `POST /rings/:id/disposition`; `RingService.resolveDisposition` (no `isTemporary` or `isDefault` check; anything that is not `MERGE` or `AUTO_DELETE` falls through to the `KEEP` update) and `ResolveRingDispositionDto` (`@IsEnum(RING_DISPOSITION)` admits `UNDECIDED`).

**On which build.** Backend `main @ 12172c6`, localhost:3111, throwaway database, 2026-11-05.

The fix is `/backend`'s. That agent sets `in-progress` when it starts and `ready` when the fix ships (status, tag, H1 and the Status segment only; the fix itself is recorded in its own delivery note, with a flag line here); QA re-tests a `ready` bug and closes it or reopens it.

## Design

- [[Screen Index#s62|s62]] (the post-event sheet, the only caller), [[Screen Index#s26|s26]] (the default Ring)

## Impact

Output of `node scripts/build-tree.mjs --impact B-15` when the bug was filed: the notes the fix touches and that must be updated or flagged when it ships.

- [[BI-08 Rings Backend Integration]] — related →
- [[QB-12 Rings QA Backend]] — pending ← (rows B63, B64)
- [[F-11 Rings]] — wikilink →

## Definition of done

- [ ] The behaviour is fixed, or the notes are corrected, as the decision says (`resolution:` set, the tag `resolution/<id>` with it)
- [ ] The QA row that found it re-run against the fix, on a named build
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-11-05 · filed with --scaffold bug, found against BI-08 Rings Backend Integration
- 2026-11-05 · filled from [[QB-12 Rings QA Backend]] B63 and B64 on backend `main @ 12172c6`
