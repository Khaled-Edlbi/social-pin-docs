---
type: task
id: B-01
status: todo
priority: high
effort: S
feature: account
module: identity
foundOn: Account Backend Integration
labels: [bug]
screens: [s68]
depends: []
affects: ["Account Backend Delivery", "Account Story", "Account QA Backend"]
related: ["Account Backend Integration", "Account QA Backend", "Account QA Frontend", "Auth & Sign-up Backend Integration", "D-01 Passwordless login", "T-003 Remove devCode once delivery works"]
pending: []
created: 2026-10-26
updated: 2026-10-26
tags: [task, task/todo, module/identity, priority/high, bug]
---

# ⬜ B-01 · An unverified changed email still signs in

**Found against:** [[Account Backend Integration]] · **Feature:** [[Account]] · **Status:** To do · **Priority:** High · **Deadline:** — · **Effort:** S

**Found by:** [[Account QA Backend]] row B9, on build `dev 2026-10-26 · localhost:3000`, and seen from the client in [[Account QA Frontend]] row F10.

## What

**What happens.** `PATCH /users/me { email }` writes the new address and clears `emailVerifiedAt`, as [[Account Backend Integration]] documents. But the new, unverified address signs in straight away: `POST /auth/login` with it answers 201 **with a `devCode`**, and `POST /auth/login/verify` returns a full `accessToken` / `refreshToken` pair. The same holds for a changed phone.

**What should happen.** [[Account Story]] S2 asks the client to tell the user the new address must be verified before it can be used to sign in, and [[Account Backend Delivery]] says the cleared flag is what enforces that. One of the two has to move: either `login` and `login/verify` refuse a destination whose `…VerifiedAt` is `null` (403 `E_AUTH_03`, the shape the client already handles), or both notes and S2's copy are corrected to say the changed address signs in at once.

**Where.** `POST /auth/login` and `POST /auth/login/verify`, against an account changed through `PATCH /users/me`. Code: `src/modules/auth/`, `src/modules/user/`. Screen [[Screen Index#s68|s68]].

**On which build.** `dev 2026-10-26 · localhost:3000`.

**The client has already taken a side.** [[Account Frontend Delivery]] refuses to promise what S2 asks, because the backend does not enforce it: the copy reads "Confirming a new email or number isn't in the app yet". So the screen is honest and the **story** is the thing that is wrong. Settling this bug means deciding whether the backend grows the gate or the story drops the promise.

**Worth knowing before fixing.** While `devCode` is returned in every environment ([[T-003 Remove devCode once delivery works]]), knowing an address is already enough to sign in as it, so this gate buys little security today. It becomes real the moment T-003 lands. Which way it goes is a product call as much as a backend one — if the answer is not obvious, raise a decision card rather than guessing.

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

- [ ] Decided which way it goes: the sign-in is gated on the verified flags, or the story and the notes are corrected
- [ ] If gated: `login` and `login/verify` refuse an unverified destination with the documented status, and an account with **no** verified destination left cannot be locked out
- [ ] Code per the backend's `CLAUDE.md` (every visibility decision through `RingAccessService`)
- [ ] `pnpm typecheck && pnpm test` green
- [ ] [[Account Backend Delivery]] and [[Account Backend Integration]] updated and the flag line cleared; [[Account Story]] S2 re-approved if its copy changed (`/pm`, then `/owner`)
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] [[Account QA Backend]] row B9 and [[Account QA Frontend]] row F10 re-run on a named build and cleared from their `pending` (`/qa`)
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-10-26 · created with --scaffold task --label bug --found-on "Account Backend Integration", filed by QA from [[Account QA Backend]] row B9. Replaces T-074 and T-076, both withdrawn the same day with their codes retired, as the bug rule moved twice: first to hang a parentless bug under the feature's story, then to hang it under the card it was found against and number it `B-NN`.
