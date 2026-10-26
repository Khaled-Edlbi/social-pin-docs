---
type: bug
id: B-01
aliases: [B-01]
status: done
resolution: by-design
priority: high
effort: S
feature: account
module: identity
foundOn: Account Backend Integration
labels: []
screens: [s68]
depends: []
affects: ["Account Backend Delivery", "Account Story", "Account QA Backend"]
related: ["Account Backend Integration", "Account QA Backend", "Account QA Frontend", "Auth & Sign-up Backend Integration", "Passwordless login", "T-003 Remove devCode once delivery works", "Whether an unverified new address may sign in", "DR-20 The changed address still signs in, the words are corrected"]
pending: ["[[Account Backend Delivery]]: correct the \"proven again before it can sign in\" sentence and clear the QA flag (/backend)", "[[Account Backend Integration]]: say that a changed destination is unverified and still signs in (/backend)", "[[Account QA Backend]]: re-run row B9 against the corrected notes (/qa)", "[[Account QA Frontend]]: re-run row F10 against the corrected notes (/qa)", "@khaled: re-approve [[Account Story]] after the S2 and S3 copy change (/owner)"]
owner: "khaled"
created: 2026-10-26
updated: 2026-10-26
tags: [bug, bug/done, module/identity, priority/high, resolution/by-design]
---

# ✅ B-01 · An unverified changed email still signs in

**Found against:** [[Account Backend Integration]] · **Feature:** [[Account]] · **Status:** Done · **Resolution:** By design ([[DR-20 The changed address still signs in, the words are corrected]]) · **Priority:** High · **Deadline:** — · **Effort:** S

**Found by:** [[Account QA Backend]] row B9, on build `dev 2026-10-26 · localhost:3000`, and seen from the client in [[Account QA Frontend]] row F10.

## What

**What happens.** `PATCH /users/me { email }` writes the new address and clears `emailVerifiedAt`, as [[Account Backend Integration]] documents. But the new, unverified address signs in straight away: `POST /auth/login` with it answers 201 **with a `devCode`**, and `POST /auth/login/verify` returns a full `accessToken` / `refreshToken` pair. The same holds for a changed phone.

**What should happen.** [[Account Story]] S2 asks the client to tell the user the new address must be verified before it can be used to sign in, and [[Account Backend Delivery]] says the cleared flag is what enforces that. One of the two has to move: either `login` and `login/verify` refuse a destination whose `…VerifiedAt` is `null` (403 `E_AUTH_03`, the shape the client already handles), or both notes and S2's copy are corrected to say the changed address signs in at once.

**Where.** `POST /auth/login` and `POST /auth/login/verify`, against an account changed through `PATCH /users/me`. Code: `src/modules/auth/`, `src/modules/user/`. Screen [[Screen Index#s68|s68]].

**On which build.** `dev 2026-10-26 · localhost:3000`.

**The client has already taken a side.** [[Account Frontend Delivery]] refuses to promise what S2 asks, because the backend does not enforce it: the copy reads "Confirming a new email or number isn't in the app yet". So the screen is honest and the **story** is the thing that is wrong. Settling this bug means deciding whether the backend grows the gate or the story drops the promise.

**Worth knowing before fixing.** While `devCode` is returned in every environment ([[T-003 Remove devCode once delivery works]]), knowing an address is already enough to sign in as it, so this gate buys little security today. It becomes real the moment T-003 lands. Which way it goes is a product call as much as a backend one — if the answer is not obvious, raise a decision card rather than guessing.

**Answered 2026-10-26.** [[Whether an unverified new address may sign in]] was raised from this bug and decided on [[DR-20 The changed address still signs in, the words are corrected]]: **option 2**, the words are wrong, not the build. No gate is added and no code ships; the story has dropped the promise, and this bug closes once [[Account Backend Delivery]] and [[Account Backend Integration]] say what the API actually does and rows B9 and F10 have been re-run. The gate itself is deferred, not refused: it comes back with [[T-003 Remove devCode once delivery works]].

## Design

- [[Screen Index#s68|s68]]

## Impact

Output of `node scripts/build-tree.mjs --impact B-01` when the bug was filed: the notes this change touches and that must be updated or flagged when it ships.

- [[Account]] · F-01 — wikilink →
- [[Account Backend Integration]] · BI-01 — the card this bug was found against, and where it hangs
- [[Account QA Backend]] · QB-04 — row B9, re-run when this ships
- [[Account QA Frontend]] · QF-04 — row F10, the same finding from the client
- [[Account Backend Delivery]] · BD-01 — the "proven again" sentence is wrong until this is settled (flagged 2026-10-26)
- [[Account Story]] · S-01 — S2's acceptance criterion and its copy depend on the answer
- [[Auth & Sign-up Backend Integration]] · BI-02 — owns `login` and `login/verify`, the endpoints that would gain the check

## Definition of done

- [x] Decided which way it goes: the sign-in is gated on the verified flags, or the story and the notes are corrected — 2026-10-26, [[DR-20 The changed address still signs in, the words are corrected]], option 2: the behaviour stays, the words are corrected
- [x] ~~If gated: `login` and `login/verify` refuse an unverified destination with the documented status, and an account with **no** verified destination left cannot be locked out~~ — not applicable: no gate ships (DR-20), and it needs a re-verify route first, which does not exist
- [x] ~~Code per the backend's `CLAUDE.md` (every visibility decision through `RingAccessService`)~~ — not applicable: no code ships
- [x] ~~`pnpm typecheck && pnpm test` green~~ — not applicable: no code ships
- [x] [[Account Story]] S2 and S3 corrected: the copy no longer promises verification before sign-in (2026-10-26, `/pm`) — the owner re-approves the story, it is `approved` against the 2026-10-25 wording
- [ ] [[Account Backend Delivery]] and [[Account Backend Integration]] corrected and the flag line cleared (`/backend`)
- [x] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] [[Account QA Backend]] row B9 and [[Account QA Frontend]] row F10 re-run on a named build and cleared from their `pending` (`/qa`)
- [x] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-10-26 · branch `docs/admin/project/bug-type` · retyped by `/admin`: `type: bug` (tags `bug`, `bug/<status>`) instead of a task with `labels: [bug]`, as every bug card now is. Nothing else changed: same code, same place in the tree, same status.
- 2026-10-26 · branch `tickets/pm/M-01-identity/F-01-account/B-01-done` · closed on khaled's word. Nothing is left for this bug itself: the product answer is on [[DR-20 The changed address still signs in, the words are corrected]] and the story carries it. What remains belongs to other agents and is listed in `pending`, so the card reads **Partial** until the backend notes are corrected (`/backend`), rows B9 and F10 are re-run (`/qa`) and the story is re-approved (`/owner`). No code shipped and none is owed.
- 2026-10-26 · branch `docs/pm/M-01-identity/F-01-account/DR-20-decided` · [[Whether an unverified new address may sign in]] decided by khaled on [[DR-20 The changed address still signs in, the words are corrected]], option 2: the behaviour stays, the words are corrected. [[Account Story]] S2 and S3 copy corrected plus the *Rules the backend already enforces* line and an open question; the story stays `approved` against the 2026-10-25 wording and is in `pending` for the owner. Flagged [[Account Backend Delivery]], [[Account Backend Integration]], [[Account QA Backend]] and [[Account QA Frontend]]; the backend and QA entries are in `pending`. No code ships.
- 2026-10-26 · created with --scaffold task --label bug --found-on "Account Backend Integration", filed by QA from [[Account QA Backend]] row B9. Replaces T-074 and T-076, both withdrawn the same day with their codes retired, as the bug rule moved twice: first to hang a parentless bug under the feature's story, then to hang it under the card it was found against and number it `B-NN`.
