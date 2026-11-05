---
id: D-30
type: decision
status: decided
features: [auth]
decision: ND-30
decidedBy: "khaled"
decidedAt: 2026-11-05
owner: "khaled"
affects: ["S-02 Auth & Sign-up Story", "BD-02 Auth & Sign-up Backend Delivery", "BI-02 Auth & Sign-up Backend Integration", "QB-05 Auth & Sign-up QA Backend", "S-78 Code Delivery Story"]
related: ["ND-30 When five wrong code tries lock the code", "F-02 Auth & Sign-up", "FR-02 Auth & Sign-up Frontend Requirements", "POST /auth/verify-code", "POST /auth/login/verify", E_AUTH_05, E_AUTH_06]
created: 2026-11-05
updated: 2026-11-05
tags: [decision, decision/decided]
---

# ✅ D-30 · The fifth wrong code try locks the code

**Answers:** [[ND-30 When five wrong code tries lock the code]] · **Decided by:** khaled · **On:** 2026-11-05 · **Feature:** [[F-02 Auth & Sign-up]]

> This card is the answer to [[ND-30 When five wrong code tries lock the code]]. The needs-decision card keeps the question, the facts and the options; this decision card says what was decided, why, and what it changes. `draft` while the answer is prepared; `decided` only by the PM or the owner, on the user's word, with `decidedBy` and `decidedAt`: then [[ND-30 When five wrong code tries lock the code]] shows Fulfilled by itself and the cards it blocked continue.

## What was decided

**Option 1: the fifth wrong try locks the code, and says so.** A six-digit code takes five wrong guesses. The fifth wrong guess itself answers 429 `E_AUTH_06` "Too many attempts. Request a new code." and burns the code, on `POST /auth/verify-code` and on `POST /auth/login/verify` alike. Guesses one to four answer 400 `E_AUTH_05` as today. After the lock, every submission of that code, a correct one included, is refused until *Send a new code* issues a new one. This rules out option 2: keeping the 429 on the sixth submission and rewording [[S-02 Auth & Sign-up Story|S-02 · S2]] to match.

## Why

- The server says the code is dead on the try that kills it, so s02 disables the cells exactly then. The client never counts tries, which would break across devices and app restarts.
- Nobody types a correct code into a code that is already dead. Today, five wrong tries followed by the right code answer 429, and nothing before that told the person the code had stopped working.
- The story, FR-02 and the screen already say "five wrong tries"; only the build and the notes that describe it say "sixth".
- Nothing is traded on security: five wrong guesses per code are allowed in both options.

## What it changes

- [[S-02 Auth & Sign-up Story]]: nothing to reword. S2's "After five wrong tries (429 `E_AUTH_06`)" stands as written and is now what the build must do (`/pm`).
- [[BD-02 Auth & Sign-up Backend Delivery]]: `AuthService.consumeCode` burns the code and answers 429 `E_AUTH_06` on the wrong guess that brings its count to five, not on the next submission, for both purposes. Specs cover the fifth guess and a correct code after the lock. BD-02 takes it as a `pending` entry until it ships (`/backend`).
- [[BI-02 Auth & Sign-up Backend Integration]]: the sign-up flow's "Sixth wrong guess: 429" becomes the fifth; the sign-in flow's "429 `E_AUTH_06`: five wrong tries" stays (`/backend`).
- [[QB-05 Auth & Sign-up QA Backend]]: rows B14 and B36 and the error matrix move from "five 400s, then 429 on the sixth submission" to "four 400s, then 429 on the fifth wrong guess; the right code after it is refused". Re-run once the backend ships, then clear the ND-30 `pending` entry (`/qa`).
- [[S-78 Code Delivery Story]]: S4's "After the sixth wrong guess the code is burned" becomes the fifth. S-78 is `approved`, so the reword sends it back to `draft` until product re-approves it; flagged, not edited (`/pm`, on the user's word).
- [[FR-02 Auth & Sign-up Frontend Requirements]]: no change. "five wrong tries lock them until Send a new code" already says this; the lock now comes from the server's 429 on the fifth try.

## Still open

- The 429's body is the same on both routes; whether the screen's copy tells "too many tries" apart from "code expired" is S2's copy, not this decision.

## Log

- 2026-11-05 · flagged [[BD-02 Auth & Sign-up Backend Delivery]]: ND-30 decided, option 1: AuthService.consumeCode must answer 429 E_AUTH_06 and burn the code on the wrong guess that brings its count to five (today the 429 comes on the next submission), for verify-code and login/verify; take it as a pending entry and ship it (/backend)
- 2026-11-05 · flagged [[BI-02 Auth & Sign-up Backend Integration]]: ND-30 decided, option 1: the fifth wrong guess answers 429 E_AUTH_06; the sign-up flow's 'Sixth wrong guess: 429' becomes the fifth once the backend ships it (/backend)
- 2026-11-05 · flagged [[QB-05 Auth & Sign-up QA Backend]]: ND-30 decided, option 1: B14, B36 and the error matrix become four 400s then 429 on the fifth wrong guess, with a correct code after it refused; re-run once the backend ships, then clear the ND-30 pending entry (/qa)
- 2026-11-05 · flagged [[S-78 Code Delivery Story]]: ND-30 decided, option 1: S4's 'After the sixth wrong guess the code is burned' should read the fifth; S-78 is approved, so the reword sends it back to draft until product re-approves it (/pm, on the user's word)
