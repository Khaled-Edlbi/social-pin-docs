---
id: ND-30
type: needs-decision
status: open
features: [auth]
blocks: ["S-02 Auth & Sign-up Story"]
decider: "pm"
screens: [s02]
owner: "khaled"
affects: []
related: ["F-02 Auth & Sign-up", "QB-05 Auth & Sign-up QA Backend", "BI-02 Auth & Sign-up Backend Integration", "BD-02 Auth & Sign-up Backend Delivery", "FR-02 Auth & Sign-up Frontend Requirements", "POST /auth/verify-code", "POST /auth/login/verify", E_AUTH_05, E_AUTH_06]
created: 2026-11-05
updated: 2026-11-05
tags: [needs-decision, needs-decision/open]
---

# ✅ ND-30 · When five wrong code tries lock the code

**Status:** open · **Decider:** PM · **Raised:** 2026-11-05 · **Needed by:** [[S-02 Auth & Sign-up Story]] (S2) · **Feature:** [[F-02 Auth & Sign-up]]

> The needs-decision card: `draft` while the question is written, `open` once it is ready for the decider; it shows **Fulfilled** by itself once its decision card (D-NN) is `decided`. The cards in `blocks` are **Blocked · ND-30** while this is `draft` or `open` and return to their own status once it is fulfilled. Nobody edits their `status:` for this, and nobody types `fulfilled` or `decided` here.

## What has to be decided

On which try a wrong six-digit code locks. [[S-02 Auth & Sign-up Story|S-02 · S2]] says *"After five wrong tries (429 `E_AUTH_06`) the cells are disabled and only Send a new code remains"*: the fifth wrong try answers 429. The build answers the fifth wrong try with 400 and the **sixth submission** with 429, whatever that sixth code is. Either the story's words move to what the build does, or the build moves to what the story says. Until it is decided S-02 cannot be fulfilled, and [[QB-05 Auth & Sign-up QA Backend]] keeps this as its one `pending` entry.

## Notes

- **What the build does** (`main @ 8997be1`, `AuthService.consumeCode`, the same for `POST /auth/verify-code` and `POST /auth/login/verify`): each wrong guess answers 400 `E_AUTH_05` "That code is invalid or has expired" and adds one to the code's count. The limit is checked **before** the code is compared, on the next submission: once the count is 5, that submission answers 429 `E_AUTH_06` "Too many attempts. Request a new code." and burns the code.
- **So the lock is felt on the sixth submission, and it refuses a correct code.** Someone who gets it wrong five times and then types the right code gets 429, not a session. After the fifth wrong try the server has said only 400, so nothing tells the client the code is already dead.
- **The notes disagree with each other.**
  - [[S-02 Auth & Sign-up Story|S-02 · S2]]: "After five wrong tries (429 `E_AUTH_06`)".
  - [[FR-02 Auth & Sign-up Frontend Requirements]]: "five wrong tries lock them until Send a new code".
  - [[BI-02 Auth & Sign-up Backend Integration]]: "Sixth wrong guess: 429" in the sign-up flow, and "429 `E_AUTH_06`: five wrong tries" in the sign-in flow.
  - [[QB-05 Auth & Sign-up QA Backend]] (B14, B36 and its error matrix): "sixth submission of one code".
- **Found by** QB-05's run of 2026-10-27 on `main @ b4984d6`, and still the same on `8997be1`. It is a disagreement between the story and the build, not a bug, so it is QB-05's `pending` entry for `/pm` and not a bug card.
- Five wrong guesses at one code are allowed in both readings: the guessing odds (5 in 1 000 000 per code) do not change between the options.

## Options

1. **The fifth wrong try locks, and says so.** The backend answers the fifth wrong guess with 429 `E_AUTH_06` and burns the code there, so the 429 arrives on the try that locks it, as S2 says. Only the backend and the notes that say "sixth" change (BI-02's sign-up flow, QB-05 B14, B36 and its error matrix); S2 and FR-02 stay as written. The client never counts tries, and a correct code is never typed into a dead code.
2. **Keep the build; S2 says "sixth".** The story becomes "five wrong tries are allowed; the next submission is refused (429 `E_AUTH_06`) and only Send a new code remains". No code change. The client either counts five 400s itself to disable the cells early, which breaks across devices and app restarts, or lets the person type a sixth code that cannot work, even a correct one. FR-02's line and BI-02's sign-in line move to "sixth".

Recommendation: option 1. The server tells the client the code is dead on the try that kills it, so the screen locks exactly when it should, and nobody is refused for typing the right code.

## Responsible

`decider` above: the PM, who owns [[S-02 Auth & Sign-up Story]]. Hear `/backend` (option 1 is a small change to `consumeCode` and its specs) and `/frontend` (the s02 lock state in FR-02). Then QA re-runs B14 and B36.

## Decision

Fulfilled by [[D-30 The fifth wrong code try locks the code]] — decided 2026-11-05 by khaled: option 1.
