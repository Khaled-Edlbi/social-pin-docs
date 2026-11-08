---
id: B-10
type: bug
module: identity
feature: ring-members
status: ready
priority: medium
effort: S
foundOn: "BI-06 Ring Members Backend Integration"
screens: [s15, s16, s35, s46, s47]
depends: []
affects: ["BI-06 Ring Members Backend Integration", "QB-11 Ring Members QA Backend"]
related: ["BI-06 Ring Members Backend Integration", "BD-09 Ring Members Backend Delivery", "QB-11 Ring Members QA Backend", "BD-35 Error Contract Backend Delivery", "POST /rings/:ringId/members"]
pending: []
created: 2026-11-05
updated: 2026-11-08
tags: [bug, bug/ready, module/identity, priority/high]
---

# 📨 B-10 · Adding an unknown userId answers 500

> ⚠ Affected by [[BD-09 Ring Members Backend Delivery]] (2026-11-08): fixed on backend main e483d49, ready for re-test

**Found against:** [[BI-06 Ring Members Backend Integration]] · **Feature:** [[F-09 Ring Members]] · **Status:** Ready · **Priority:** Medium (`critical | high | medium | low`, from `docs.config.json`) · **Deadline:** — · **Effort:** S (S < 1 day, M 1–3 days, L > 3 days)

**Found by:** [[QB-11 Ring Members QA Backend]] row B15, on build `main @ 12172c6 · localhost:3109, Node 22.22.2`.

## What

**What happens.** `POST /rings/:ringId/members { userId: "00000000-0000-4000-8000-000000000001" }`, a well-formed UUID that belongs to no user, answers **500** `{ statusCode: 500, message: "Internal server error", error: "InternalServerError" }`. The server log shows a Prisma foreign-key violation on `ring_members_user_id_fkey` from the upsert. The body leaks nothing, but the client gets a server error for its own bad input and cannot tell it from an outage.

**What should happen.** Every other bad input on this route answers a 4xx the client can act on ([[BI-06 Ring Members Backend Integration]], *Errors to handle*; the one error body of [[BD-35 Error Contract Backend Delivery]]). An unknown `userId` should be refused before the write, with a 4xx and a domain message (for example 404 "User not found", or the same 409 "This user cannot be added" the block case uses, if the backend prefers not to say whether an id exists). Which one is the backend's call; the contract should then list it.

**Where.** `POST /rings/:ringId/members`, `RingMemberService.add` in `src/modules/ring/ring-member.service.ts`: nothing checks that `dto.userId` names a user before the upsert. `POST …/:userId/reassign` cannot reach it, because the source row must exist first.

**On which build.** `main @ 12172c6`, run 2026-11-05 on `localhost:3109` under Node 22.22.2, throwaway database `social_pin_qa_f09`.

The fix is the backend's (`/backend`). That agent sets `in-progress` when it starts and `ready` when the fix ships (status, tag, H1 and the Status segment only; the fix itself is recorded in its own delivery note, with a flag line here); QA re-tests a `ready` bug and closes it or reopens it.

## Design

- [[Screen Index#s15|s15]], [[Screen Index#s16|s16]], [[Screen Index#s35|s35]], [[Screen Index#s46|s46]], [[Screen Index#s47|s47]]

## Impact

Output of `node scripts/build-tree.mjs --impact B-10` when the bug was filed: the notes the fix touches and that must be updated or flagged when it ships.

- [[BI-06 Ring Members Backend Integration]] — related →
- [[F-09 Ring Members]] — wikilink →

## Definition of done

- [ ] The behaviour is fixed, or the notes are corrected, as the decision says (`resolution:` set, the tag `resolution/<id>` with it)
- [ ] The QA row that found it re-run against the fix, on a named build
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-11-05 · filed with --scaffold bug, found against BI-06 Ring Members Backend Integration
