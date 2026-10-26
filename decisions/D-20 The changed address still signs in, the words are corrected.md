---
type: decision
id: D-20
decision: ND-20
status: decided
decidedBy: "khaled"
decidedAt: 2026-10-26
features: [account]
affects: ["Account Story", "Account Backend Delivery", "Account Backend Integration", "Account QA Backend", "Account QA Frontend", "An unverified changed email still signs in"]
related: ["Whether an unverified new address may sign in", "Auth & Sign-up Backend Integration", "Account Frontend Delivery", "T-003 Remove devCode once delivery works"]
owner: "khaled"
created: 2026-10-26
updated: 2026-10-26
tags: [decision, decision/decided]
---

# ✅ D-20 · The changed address still signs in, the words are corrected

**Answers:** [[Whether an unverified new address may sign in]] · **Decided by:** khaled · **On:** 2026-10-26 · **Feature:** [[Account]]

> This card is the answer to [[Whether an unverified new address may sign in]]. The needs-decision card keeps the question, the facts and the options; this decision card says what was decided, why, and what it changes. `draft` while the answer is prepared; `decided` only by the PM or the owner, on the user's word, with `decidedBy` and `decidedAt`: then [[Whether an unverified new address may sign in]] shows Fulfilled by itself and the cards it blocked continue.

## What was decided

**Option 2 — it is ok for now.** An address changed through `PATCH /users/me` keeps signing in straight away, unverified, exactly as the build does today: `POST /auth/login` issues a code for it and `POST /auth/login/verify` returns a session. No gate is added to either endpoint, so no code ships for [[An unverified changed email still signs in]]. What moves is the wording: [[Account Story]] S2 and S3 drop the promise that a new address must be verified before it can be used to sign in, and the two backend notes that assert the gate are corrected to describe the behaviour as it is. This rules out option 1 (403 `E_AUTH_03` on an unverified destination) **for now**, not forever: the question comes back the day [[T-003 Remove devCode once delivery works]] lands, and a gate still needs a re-verify route before it can be built at all.

## Why

Three facts pointed the same way. There is **no re-verify route**: nothing marks a changed email or phone verified again, so a gate added today would shut a person out of the address they had just moved to, and for an email-only account out of the account itself. The gate would also buy **almost no security** while `POST /auth/login` returns `devCode` in every environment — knowing an address is already enough to sign in as it — so it would be a lock-out in exchange for nothing. And the **client has already taken this side**: [[Account Frontend Delivery]] shipped the honest copy, "Confirming a new email or number isn't in the app yet", because it would not promise what the backend does not enforce. The screens and the build agreed with each other; only the story and [[Account Backend Delivery]] disagreed with both, so the words were the thing that was wrong.

What was traded away is a real protection: an address nobody has proven can sign in, and a person who mistypes their new email hands sign-in to whoever owns the address they typed. The gap is accepted deliberately, written down rather than described as handled, and tied to T-003 so it is reconsidered before `devCode` disappears.

## What it changes

- [[Account Story]]: S2's and S3's acceptance criteria no longer promise that a new address must be verified before it can sign in; they state that it is marked unverified, signs in all the same, and that re-verifying is not available yet. The copy the criteria ask for is the copy [[Account Frontend Delivery]] already ships. Approved 2026-10-25 against the old wording, so the owner re-approves it (`/owner`).
- [[Account Backend Delivery]]: "a changed address must be proven again before it can be used to sign in or receive a reset code" is wrong on the sign-in half and has to say what the build does; its QA flag line is cleared with that correction (`/backend`).
- [[Account Backend Integration]]: says plainly that a changed destination comes back unverified and still signs in, so no client expects a 403 (`/backend`).
- [[An unverified changed email still signs in]]: no longer blocked and no longer code work. It closes on the two note corrections and the QA re-runs; its gate criteria are struck.
- [[Account QA Backend]] row B9 and [[Account QA Frontend]] row F10: the expectation they tested against is withdrawn. Re-run them against the corrected notes and clear them from `pending` (`/qa`).
- [[Auth & Sign-up Backend Integration]]: unchanged, and that is the point — `login` and `login/verify` keep their contract, and nothing moves for any other client.

## Still open

The **re-verify route** for a changed email or phone: no route exists, it is recorded in [[Account#Gaps]], and it has no task. Nothing is blocked on it today. The **gate itself** is deferred, not refused: when [[T-003 Remove devCode once delivery works]] lands, `devCode` stops covering the hole and option 1 becomes worth its cost — a new needs-decision card then, raised from whichever card needs it, with the re-verify route scoped first.
