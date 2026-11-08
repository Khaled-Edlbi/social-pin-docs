---
id: B-09
type: bug
module: identity
feature: ring-members
status: ready
priority: high
effort: S
foundOn: "BI-06 Ring Members Backend Integration"
screens: [s15, s16, s35, s46, s47]
depends: []
affects: ["BI-06 Ring Members Backend Integration", "QB-11 Ring Members QA Backend"]
related: ["BI-06 Ring Members Backend Integration", "BD-09 Ring Members Backend Delivery", "QB-11 Ring Members QA Backend", "S-16 Ring Members Story", "POST /rings/:ringId/members"]
pending: []
created: 2026-11-05
updated: 2026-11-08
tags: [bug, bug/ready, module/identity, priority/high]
---

# 📨 B-09 · Re-adding a lapsed member answers 409, not a reactivation

> ⚠ Affected by [[BD-09 Ring Members Backend Delivery]] (2026-11-08): fixed on backend main e483d49, ready for re-test

**Found against:** [[BI-06 Ring Members Backend Integration]] · **Feature:** [[F-09 Ring Members]] · **Status:** Ready · **Priority:** High (`critical | high | medium | low`, from `docs.config.json`) · **Deadline:** — · **Effort:** S (S < 1 day, M 1–3 days, L > 3 days)

**Found by:** [[QB-11 Ring Members QA Backend]] row B10, on build `main @ 12172c6 · localhost:3109, Node 22.22.2`.

## What

**What happens.** A member whose access window has run out (an `ACTIVE` row with `expiresAt` in the past: **lapsed**) cannot be added back. `POST /rings/:ringId/members { userId, expiresAt: <in 10 days> }` answers 409 "This user is already an active member of the ring" (`E_RING_MEMBER_01`), and nothing changes, though the person no longer sees anything of that Ring. Only a `REMOVED` row is reactivated (row B9 passes).

**What should happen.** [[BI-06 Ring Members Backend Integration]] Flow 2: *"Re-adding someone whose row is `REMOVED` or lapsed reactivates it with the new window."* [[S-16 Ring Members Story]] S2: *"Re-adding someone who was removed or lapsed reactivates them with the new window."* [[BD-09 Ring Members Backend Delivery]] says the same. So a re-add on a lapsed row answers 201 with the row `ACTIVE` and the new window, and 409 `E_RING_MEMBER_01` stays for a member whose window is open now. (Extending through `PATCH`, S6, works and is not affected.)

**Where.** `POST /rings/:ringId/members`. `RingMemberService.add` in `src/modules/ring/ring-member.service.ts` refuses any existing row whose `status` is `ACTIVE`, without looking at its window; the upsert after it would already reactivate a lapsed row. Whether a row that has **not started yet** (`startsAt` in the future) counts as active for this check is the backend's call; the contract names only lapsed.

**On which build.** `main @ 12172c6`, run 2026-11-05 on `localhost:3109` under Node 22.22.2, throwaway database `social_pin_qa_f09`.

The fix is the backend's (`/backend`). That agent sets `in-progress` when it starts and `ready` when the fix ships (status, tag, H1 and the Status segment only; the fix itself is recorded in its own delivery note, with a flag line here); QA re-tests a `ready` bug and closes it or reopens it.

## Design

- [[Screen Index#s15|s15]], [[Screen Index#s16|s16]], [[Screen Index#s35|s35]], [[Screen Index#s46|s46]], [[Screen Index#s47|s47]]

## Impact

Output of `node scripts/build-tree.mjs --impact B-09` when the bug was filed: the notes the fix touches and that must be updated or flagged when it ships.

- [[BI-06 Ring Members Backend Integration]] — related →
- [[F-09 Ring Members]] — wikilink →

## Definition of done

- [ ] The behaviour is fixed, or the notes are corrected, as the decision says (`resolution:` set, the tag `resolution/<id>` with it)
- [ ] The QA row that found it re-run against the fix, on a named build
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-11-05 · filed with --scaffold bug, found against BI-06 Ring Members Backend Integration
