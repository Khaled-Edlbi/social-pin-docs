---
type: needs-decision
id: ND-20
aliases: [ND-20]
status: open
priority: high
features: [account]
blocks: [B-01]
decider: "pm"
screens: [s68]
affects: ["Account Story", "Account Backend Delivery", "Account Backend Integration", "Account QA Backend", "Account QA Frontend"]
related: ["An unverified changed email still signs in", "Auth & Sign-up Backend Integration", "Account Frontend Delivery", "Auth Model", "T-003 Remove devCode once delivery works", "D-20 The changed address still signs in, the words are corrected"]
owner: "khaled"
created: 2026-10-26
updated: 2026-10-26
tags: [needs-decision, needs-decision/open, priority/high]
---

# ✅ ND-20 · Whether an unverified new address may sign in

**Status:** open · **Decider:** pm · **Raised:** 2026-10-26 · **Needed by:** [[An unverified changed email still signs in]] · **Feature:** [[Account]]

> The needs-decision card: `draft` while the question is written, `open` once it is ready for the decider; it shows **Fulfilled** by itself once its decision card (D-NN) is `decided`. The cards in `blocks` are **Blocked · ND-20** while this is `draft` or `open` and return to their own status once it is fulfilled. Nobody edits their `status:` for this, and nobody types `fulfilled` or `decided` here.

## What has to be decided

An address changed through `PATCH /users/me` comes back with `emailVerifiedAt: null`, and signs in at once all the same: `POST /auth/login` issues a code for it and `POST /auth/login/verify` returns a session ([[An unverified changed email still signs in]]). Two notes say otherwise — [[Account Story]] S2 promises the user "the new address must be verified before it can be used to sign in", and [[Account Backend Delivery]] says the cleared flag is what enforces it. The build does not enforce it, so one of the two sides has to move, and the backend cannot pick: either `login` and `login/verify` grow a gate on the `…VerifiedAt` flags (403 `E_AUTH_03`), which changes what the API does to every client, or the story drops the promise and the two backend notes are corrected to describe the behaviour as it is. Decided the first way, B-01 becomes backend work on `src/modules/auth/` plus a re-approval of S2's copy; decided the second way, B-01 is a documentation correction on three notes and no code ships.

## Notes

- **There is no re-verify route.** [[Account Backend Delivery]] records it: a changed email or phone comes back unverified and nothing marks it verified again (`request-code` + `verify-code` with purpose `SIGN_UP` is not designed for it and not tested). A gate added today would therefore shut a person out of the address they just moved to, with no way back, unless a second destination is still verified — and for an email-only account that is the whole account. Any gate needs the re-verify route first, which is not scoped and has no task.
- **The gate buys little security while `devCode` is returned.** `POST /auth/login` answers with the code in every environment ([[T-003 Remove devCode once delivery works]]), so knowing an address is already enough to sign in as it. The gate becomes worth something the moment T-003 lands, not before.
- **The client has already taken the second side.** [[Account Frontend Delivery]] refuses to promise what S2 asks and ships the honest copy instead — "Confirming a new email or number isn't in the app yet" — because the backend does not enforce the promise. The screen and the build agree with each other; only the story and [[Account Backend Delivery]] disagree with both.
- **The endpoints are not this feature's.** `login` and `login/verify` belong to [[Auth & Sign-up Backend Integration]] (BI-02), so a gate is a change to the Auth & Sign-up contract, documented in [[Frontend API Guide]], and not a change local to Account.
- The same holds for a changed phone, and `PATCH /users/me` clears whichever flag matches.
- Found by QA: [[Account QA Backend]] row B9 and [[Account QA Frontend]] row F10, on build `dev 2026-10-26 · localhost:3000`; both rows stay pending until this is settled and re-run.

## Options

1. **Gate the sign-in on the verified flags.** `login` and `login/verify` refuse a destination whose `…VerifiedAt` is `null` with 403 `E_AUTH_03`, the shape the client already handles. The story keeps its promise and [[Account Backend Delivery]] stays true. Costs the re-verify route first — without it a changed address is a dead end and an email-only account locks itself out — so it is a task of its own before B-01 can close, and it moves the Auth & Sign-up contract for every client.
2. **Leave the behaviour as it is and correct the words.** No code ships. [[Account Story]] S2's acceptance criterion and copy drop the promise (`/pm`, re-approved by `/owner`), [[Account Backend Delivery]]'s "proven again before it can sign in" sentence is corrected and its flag line cleared, and [[Account Backend Integration]] says plainly that a changed destination is unverified but still signs in. The gap stays written down in [[Account#Gaps]] with the re-verify route, to be revisited when [[T-003 Remove devCode once delivery works]] lands and the gate starts to mean something. **Recommended by the backend:** it matches what the build and the screens already do, and it does not ship a lock-out.

## Responsible

`decider` above: the **PM**, because the promise in [[Account Story]] S2 is a product commitment and dropping it is a scope call, not an API one; if S2's copy changes the owner re-approves the story ([[Agent Rules#4 · Statuses, blocking and sign-off]]). Raised by the backend, which owns the endpoints and both notes the answer corrects. Needed before B-01 is picked up by either side — it is the first item of that bug's definition of done, and [[Account QA Backend]] row B9 cannot be re-run until it is answered.

## Decision

Fulfilled by [[D-20 The changed address still signs in, the words are corrected]] — decided 2026-10-26 by khaled: option 2.
