---
id: B-17
type: bug
module: identity
feature: view-as
status: todo
priority: high
effort: S
foundOn: "BI-09 View As & Pin Views Backend Integration"
screens: [s10, s31, s44, s62]
depends: []
affects: ["BI-09 View As & Pin Views Backend Integration", "QB-14 View As & Pin Views QA Backend"]
related: ["BI-09 View As & Pin Views Backend Integration", "BD-12 View As & Pin Views Backend Delivery", "QB-14 View As & Pin Views QA Backend", "S-19 View As & Pin Views Story", "BD-10 Ring Projection Backend Delivery", "GET /views/ring/:ringId", "GET /views/user/:userId/perspectives", "GET /rings/:ringId/projection"]
pending: []
created: 2026-11-05
updated: 2026-11-05
tags: [bug, bug/todo, module/identity, priority/high]
---

# ⬜ B-17 · A new Ring answers 404 to its own owner until its projection is opened

**Found against:** [[BI-09 View As & Pin Views Backend Integration]] · **Feature:** [[F-12 View As & Pin Views]] · **Status:** To do · **Priority:** High (`critical | high | medium | low`, from `docs.config.json`) · **Deadline:** — · **Effort:** S (S < 1 day, M 1–3 days, L > 3 days)

**Found by:** [[QB-14 View As & Pin Views QA Backend]] rows B33, B34 and B45, on build `main @ 12172c6 · localhost:3112, Node 22.22.2`.

## What

**What happens.** A Ring made with `POST /rings` has no projection row until its owner first opens `GET /rings/:ringId/projection`, which creates it. Until then the Ring is live and its members are live, yet `GET /views/ring/:ringId` answers **404 "This profile is not shared with you"** (the `E_RING_ACCESS_01` body) to everyone, **its own owner on View as included** (B33) and a live member (B34). `GET /views/user/:userId/perspectives` leaves the Ring out without a word (B45: five entries, six once the owner opens the projection). After that one owner read, both answer 200 with a view that has the profile's name and nothing else, which is what they should have answered from the start (B35).

**What should happen.** [[S-19 View As & Pin Views Story]] S1: View as opens on a Ring just created and "works on a Ring with almost nothing set: the name from the profile and whatever s09 switched on; the rest absent". [[BI-09 View As & Pin Views Backend Integration]] *Flow* 2 and 4: the owner always gets the projection of a live Ring, a member gets it while the Ring and the membership are live, and `E_RING_ACCESS_01` means "not in it or blocked". A Ring nobody has written a projection for yet is the empty projection, not "not shared".

**Where.** `GET /views/ring/:ringId` and `GET /views/user/:userId/perspectives`. `RingProfileService.viewByRing` throws the not-shared error when `ringProfile.findFirst({ where: { ringId } })` finds nothing, and `viewAllPerspectives` skips such a Ring; the projection is created only in `openForOwner`, on the owner's first projection read or write. The default Ring (made at registration) and a copied Ring get their projection when they are made, so only `POST /rings` leaves this state.

**On which build.** `main @ 12172c6`, 2026-11-05, on a throwaway database.

The fix is the layer's work: `/backend` (create the projection with the Ring, or render a missing one as the empty projection). That agent sets `in-progress` when it starts and `ready` when the fix ships (status, tag, H1 and the Status segment only; the fix itself is recorded in its own delivery note, with a flag line here); QA re-tests a `ready` bug and closes it or reopens it.

## Design

- [[Screen Index#s10|s10]], [[Screen Index#s31|s31]], [[Screen Index#s44|s44]], [[Screen Index#s62|s62]]

## Impact

Output of `node scripts/build-tree.mjs --impact B-17` when the bug was filed: the notes the fix touches and that must be updated or flagged when it ships.

- [[BI-09 View As & Pin Views Backend Integration]] — related →
- [[F-12 View As & Pin Views]] — wikilink →

## Definition of done

- [ ] The behaviour is fixed, or the notes are corrected, as the decision says (`resolution:` set, the tag `resolution/<id>` with it)
- [ ] The QA row that found it re-run against the fix, on a named build
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-11-05 · filed with --scaffold bug, found against BI-09 View As & Pin Views Backend Integration, by [[QB-14 View As & Pin Views QA Backend]] rows B33, B34, B45 on `main @ 12172c6`
