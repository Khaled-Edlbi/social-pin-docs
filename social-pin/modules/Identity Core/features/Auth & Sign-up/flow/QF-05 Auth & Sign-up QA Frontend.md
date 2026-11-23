---
id: QF-05
type: qa-frontend
module: identity
feature: auth
status: passing
scope: feature
screens: [s01, s02, s06, s08, s68, s75]
owner: "Omar Fostok"
depends: ["FD-05 Auth & Sign-up Frontend Delivery"]
affects: []
related: ["S-02 Auth & Sign-up Story", "BI-02 Auth & Sign-up Backend Integration", "QB-05 Auth & Sign-up QA Backend", "D-30 The fifth wrong code try locks the code", "D-06 Yearly rename, old name freed, case-insensitive", "S-87 Error Contract Story", "S-78 Code Delivery Story", "B-03 Two refreshes at once both succeed and fork the session", "B-04 Sign-up accepts an email and a phone together", "B-05 Expired onboarding token answers 401, not the documented 400", "B-18 Sign-in Verify overflows when the not-active message shows", "B-19 Claim your Pin shows the prefix @ instead of !", "B-20 In Arabic the code boxes fill right to left", "B-21 A failed resend restarts the countdown", "B-22 The code's expiry counts with the phone clock", "POST /auth/sign-up", "POST /auth/login", "POST /auth/verify-code", "POST /auth/login/verify", "POST /auth/request-code", "POST /auth/complete-registration", "POST /auth/refresh", "POST /auth/logout", "POST /auth/logout-everywhere", "GET /profiles/pin-name/:pinName/availability", "GET /rings", "GET /users/me", E_AUTH_01, E_AUTH_03, E_AUTH_04, E_AUTH_05, E_AUTH_06, E_AUTH_08, E_PROFILE_02, E_USER_01]
pending: []
unmet: []
created: 2026-11-08
updated: 2026-11-23
tags: [qa-frontend, qa-frontend/passing, module/identity, layer/qa]
---

# 🧪 Auth & Sign-up · QA Frontend

**Feature:** [[F-02 Auth & Sign-up]] · **Verifies:** [[FD-05 Auth & Sign-up Frontend Delivery]] against [[S-02 Auth & Sign-up Story]] · **Verdict:** ✅ Passing · 2026-11-23 · `social_pin` `778d9b4` · all 85 rows pass; B-18 to B-22 closed

Expected behaviour of the screens, as artefacts: journeys, states and copy to check a build against, **not test code**. `status: passing` or `failing` after a run; the verdict tells the PM whether the story can be fulfilled (passing with nothing pending or unmet). A failing row is one of two things: a story part the delivery does not fulfil (not built, or built other than the story says) goes in `unmet` and turns the story's badge ✕; a bug (built as asked, but it breaks) is filed against the Frontend Delivery and goes in `pending`, and leaves the story alone.

## Scope

- **Screens:** s01 Welcome, s02 Verify (sign-up and sign-in), s06 Claim your Pin, s08 Your Pin is live, s68 Me · Sign out, s75 My devices · Sign out everywhere. The steps between them (Start from, imports, *Profile basics*, Interests, Create first Ring) belong to F-05, F-07, F-37 and F-11 and are only walked through.
- **85 rows, AU-01 to AU-85**, from the client's case list `social_pin/docs/testing/patrol/F-02 Auth test cases.md` (2026-11-08, extended 2026-11-23), which replaces the Maestro checklist PL-01 to PL-22. Rows AU-49 to AU-62 were added after a second check (2026-11-08), and AU-63 to AU-85 (2026-11-23, all faked) cover the S-02 criteria and edge cases the first 62 left out. They sit in their sections, so the numbers aren't in order.
- **How a row runs** (Patrol, Android emulator or phone, `development` flavor):
  - **R**: against the development API; the code comes from `devCode`, which the app pre-fills;
  - **F**: against a fake backend the test controls (every answer, error and timing chosen), for the edge cases the server can't produce on demand.
- **The lock** follows [[D-30 The fifth wrong code try locks the code]] (backend `ce2a2e8`): the fifth wrong guess itself answers 429 `E_AUTH_06`.
- **Not here:** the server's rules (codes hashed, rotation, timestamps, the unknown-address challenge), checked by [[QB-05 Auth & Sign-up QA Backend]]; real email and SMS delivery, which doesn't exist yet ([[S-78 Code Delivery Story|Code Delivery]]).

## Journeys

### A · Welcome (s01) · S1

| # | Story | Steps | Expected | Run | Checked |
|---|---|---|---|---|---|
| AU-01 | S1 | Open signed out | One field, Email / Phone switch, *Send me a code*; no "Sign in" link, no password; LinkedIn *Coming soon* | R | ✅ |
| AU-02 | S1 | Phone, +971, `50 123 4567` → Send | `phone: "+971501234567"`, no `email` | F | ✅ |
| AU-03 | S1 | Email, switch to Phone, phone → Send | Exactly one of `email` / `phone` ([[B-04 Sign-up accepts an email and a phone together|B-04]]) | F | ✅ |
| AU-04 | S1 | `sam@`, then a 3-digit phone | Can't send; no request | F | ✅ |
| AU-05 | S1 | New email → Send | `sign-up` 201; Verify with the step bar, the email, when the code expires, boxes pre-filled | R | ✅ |
| AU-06 | S1, S5 | `qaEmail` → Send | 409 `E_AUTH_01` → `login` with the same address, no tap; sign-in Verify, no step bar, back arrow | R | ✅ |
| AU-07 | S1, S5 | `qaPhone` → Send | As AU-06; "Check your messages", number spaced out | R | ✅ |
| AU-08 | S1 | Unfinished sign-up's address → Send | A new code, no error; sign-up Verify | R | ✅ |
| AU-09 | — | Airplane mode → Send | Connection toast; address kept; works once online | R + F | ✅ |
| AU-10 | — | `sign-up` 500 | Generic toast; stays on Welcome | F | ✅ |
| AU-11 | States | Double tap; answer after 2 s | Button disabled and sending while waiting; one request, one Verify | F | ✅ |
| AU-52 | S1, S5 | ` Sam@Example.com ` → Send; later sign in `sam@example.com` | Trimmed alike on `sign-up`, `login`, `login/verify`; same account | F | ✅ |
| AU-61 | — | Tap LinkedIn | *Coming soon*; nothing else | R | ✅ |
| AU-63 | S1 | `sign-up` 429 | "Too many attempts. Wait a moment and try again."; still on Welcome, the address kept; Send works again later | F | ✅ |
| AU-64 | S1, S5 | `sign-up` 409 `E_AUTH_01`, then `login` 429 | The same message; still on Welcome; `login` asked once | F | ✅ |
| AU-65 | S1 | Type a phone, switch to Email, type an email → Send | Only `email` is sent, never the phone typed before | F | ✅ |

### B · Verify (s02) · S2, S5

| # | Story | Steps | Expected | Run | Checked |
|---|---|---|---|---|---|
| AU-12 | S2 | AU-05 → Verify and continue | `verify-code` `SIGN_UP` → Start from; no password step | R | ✅ |
| AU-13 | S2 | Type, paste `123456`, delete | Auto-advance; paste fills six; delete moves back; numeric keyboard | F | ✅ |
| AU-14 | S2 | Challenge without `devCode` | Boxes empty; typing by hand works | F | ✅ |
| AU-15 | S2 | Wrong code → Verify | Boxes shake and empty; "That code is wrong or has expired." | R + F | ✅ |
| AU-16 | S2 | 4 wrong (400), a 5th wrong, then the right code | 5th → 429 `E_AUTH_06` (D-30): "Too many tries. Ask for a new code."; boxes disabled; the right code refused; only resend; sign-up and sign-in | R + F | ✅ |
| AU-17 | S2 | Open Verify | Resend disabled, countdown from 60, enabled at 0 | F | ✅ |
| AU-18 | S2, S5 | After AU-16 → resend | `request-code` `SIGN_UP` / `LOGIN`; "We've sent you a new code."; boxes enabled, pre-filled with the new code, which works; the old one doesn't | R + F | ✅ |
| AU-19 | S2 | `expiresAt` = now + 5 s, wait | "This code has expired. Ask for a new one."; boxes disabled; resend fixes it | F | ✅ |
| AU-20 | — | "Use a different email" | Welcome with the address kept | R | ✅ |
| AU-21 | S5 | AU-06 → Verify and continue | `login/verify` → Home; Back can't reach Welcome; real name shows | R | ✅ |
| AU-22 | S5 | Sign in with a phone typed with spaces | `login/verify` identifier byte-identical to `login`'s | F | ✅ |
| AU-23 | S5 | `login/verify` 403 `E_AUTH_03` | Not-active copy + *Start sign-up again* → can't-sign-in copy | F | ✅ (failed 2026-11-08 → [[B-18 Sign-in Verify overflows when the not-active message shows|B-18]], fixed) |
| AU-24 | — | Airplane mode → Verify | Connection toast; code kept; works once online | F | ✅ |
| AU-25 | S2 | Any flavor | Pre-filled while `DevCode.untilCodeDelivery` is `true` (FD-05 deviation) | F | ✅ |
| AU-49 | S5 | Sign-in, `login/verify` 400 `E_AUTH_05` | Boxes empty, the wrong-code copy; **no** *Sign up* | F | ✅ |
| AU-54 | — | Sign-in Verify → back arrow | Welcome with the address kept | R | ✅ |
| AU-55 | S2 | `request-code` 500 or offline | Error toast; countdown doesn't restart; the sent code still works | F | ✅ (failed 2026-11-08 → [[B-21 A failed resend restarts the countdown|B-21]], fixed) |
| AU-60 | S2 | Phone clock 10 min behind | Expiry follows the server's `expiresAt` (offset from `Date`), not the phone's clock | F | ✅ (failed 2026-11-08 → [[B-22 The code's expiry counts with the phone clock|B-22]], fixed) |
| AU-66 | S2 | Sign-in Verify in the not-active state; open the keyboard | *Verify*, *Send a new code* and *Start sign-up again* all on screen above the keyboard; no overflow (S2 layout, B-18) | F | ✅ |
| AU-67 | S2 | Type `12a-3 4`; paste `9876543210` | The boxes hold `1234`, then `987654`; only `987654` is sent | F | ✅ |
| AU-68 | S2 | Type `123` → Verify | "Enter all six digits."; nothing is sent | F | ✅ |
| AU-69 | S2 | `verify-code` answers after 2 s; tap Verify twice | One `verify-code` request; one Start from | F | ✅ |
| AU-70 | S5 | Sign-in Verify → wait 60 s → Resend | `request-code` `LOGIN`, the same destination; the new code fills the boxes; the first is refused; the new one opens Home | F | ✅ |
| AU-71 | S5 | `login/verify` 429 `E_AUTH_06` | "Too many tries…"; boxes disabled; only *Send a new code* (D-30) | F | ✅ |
| AU-72 | S5 | The sign-in challenge has no `devCode` | Boxes empty; the typed code opens Home | F | ✅ |
| AU-73 | S5 | The sign-in challenge's `expiresAt` = now + 5 s | "This code has expired…"; boxes disabled; Resend offered | F | ✅ |
| AU-74 | S2 | Sign-up `expiresAt` = now + 6 s; the app in the background 9 s, then back | "This code has expired…" on return; boxes disabled | F | ✅ |

### C · Claim your Pin and registration (s06 → s08) · S3, S4

| # | Story | Steps | Expected | Run | Checked |
|---|---|---|---|---|---|
| AU-26 | S3 | `ab`, 31 chars, `sam-k`, `sam.k_1` | First three refused on the phone; `sam.k_1` accepted; `!` prefix never sent; "You can change it once a year." shown | F | ✅ (failed 2026-11-08 on the `@` prefix → [[B-19 Claim your Pin shows the prefix @ instead of !|B-19]], fixed) |
| AU-27 | S3 | Type `samk` quickly | One availability call, 400 ms after the last key | F | ✅ |
| AU-28 | S3 | A taken name in other capitals | "Taken"; never who holds it ([[D-06 Yearly rename, old name freed, case-insensitive|D-06]]) | R + F | ✅ |
| AU-29 | S3 | Full name "Sam Khoury" → s06 | Chips from that name only; tap fills; no request | F | ✅ |
| AU-30 | S3, S4 | Profile basics → Claim pin → Continue | `complete-registration { onboardingToken, pinName, fullName }` 201 → Interests → s08; no password anywhere | R | ✅ |
| AU-31 | S4 | On s08, Back | Can't reach any step before registration | R | ✅ |
| AU-32 | S4 | After AU-30 | `GET /rings` has the default Ring | R | ✅ |
| AU-33 | S3 | Bare 409, then `sign-up` 201 | The *just taken* state on s06, focus on the handle | F | ✅ |
| AU-34 | S3 | Bare 409, then `sign-up` 409 | Sign-in code; sign-in Verify, "already set up" | F | ✅ |
| AU-35 | S3 | `complete-registration` 400 (token expired) | "Your verification expired. We've sent you a new code."; Verify with a new code; Claim pin input kept ([[B-05 Expired onboarding token answers 401, not the documented 400|B-05]]) | F | ✅ |
| AU-36 | — | Continue offline | Connection toast; Continue again | F | ✅ |
| AU-50 | S3 | 121 characters on Profile basics | Stops at 120; `fullName` ≤ 120 | F | ✅ |
| AU-51 | S4 | AU-30 with animations on | "New ring forming" plays once; the Ring named and themed | F | ✅ |
| AU-56 | S3 | Availability 500 or offline | Never "free"; can't-check state; Continue waits | F | ✅ |
| AU-57 | S4 | Kill the app at Claim pin, reopen | Welcome; the same address continues as an unfinished sign-up | R | ✅ |
| AU-75 | S3 | Profile basics: Continue empty, then with spaces only | "Enter your full name"; Claim pin doesn't open until a real name is typed | F | ✅ |
| AU-76 | S3 | Half the suggested names are taken | Every chip shown was answered free; none of the taken ones shows | F | ✅ |
| AU-77 | S3 | The name reads Taken → Continue | No `complete-registration`; still on Claim pin | F | ✅ |
| AU-78 | S3 | `complete-registration` 409 `E_PROFILE_02` | The *just taken* state; focus on the handle; no extra `sign-up` probe | F | ✅ |
| AU-79 | S3, S4 | Full name `  Sam Khoury  `, Pin `Sam.K` → Continue → Interests → s08 → the app | `onboardingToken` from Verify, `pinName` without `!`, `fullName` trimmed; afterwards no `/auth/*` call, `GET /rings` read, every call with the new access token | F | ✅ |

### D · Staying signed in, signing out (s68, s75) · S6

| # | Story | Steps | Expected | Run | Checked |
|---|---|---|---|---|---|
| AU-37 | S6 | Sign in, restart | Home, no code | R | ✅ |
| AU-38 | S6 | A call answers 401 | One `refresh`; the call retried once; nothing shows | F | ✅ |
| AU-39 | S6 | Two calls answer 401 together | One refresh; both retried once ([[B-03 Two refreshes at once both succeed and fork the session|B-03]]) | F | ✅ |
| AU-40 | S6 | `refresh` 401 `E_AUTH_04` | Welcome, "Please sign in again" | F | ✅ |
| AU-41 | S6 | Any call 401 `E_AUTH_03` | Signed out at once (copy per FD-05 until S-87) | F | ✅ |
| AU-42 | S6 | Me → Sign out → confirm | Confirmation mentions a code; `logout` with the refresh token; Welcome; restart stays there | R | ✅ |
| AU-43 | S6 | Sign out offline | Still signed out here | F | ✅ |
| AU-44 | S6 | My devices → Sign out of all devices | `logout-everywhere`; Welcome, "Signed out everywhere"; a second session refused on its next refresh | R | ✅ |
| AU-45 | S6 | Sign out everywhere offline | Error toast; still signed in | F | ✅ |
| AU-46 | S6 | Me; My devices → Security | No "Change password" on either | R | ✅ |
| AU-58 | S6 | Session revoked elsewhere, open the app | Welcome, "Please sign in again"; never a broken Home | R | ✅ |
| AU-59 | S6 | `GET /users/me` 404 `E_USER_01` | Signed out (FD-05) | F | ✅ |
| AU-80 | S6 | A call answers 401, then `refresh` 401 `E_AUTH_03` | Signed out, on Welcome | F | ✅ |
| AU-81 | S6 | A call answers 401, `refresh` gets no answer | Still signed in (no connection is not a rejection); after a restart online, Home | F | ✅ |
| AU-82 | S6 | Two expiries, each found after a restart | The second `refresh` sends the refresh token the first returned: the rotation is stored | F | ✅ |
| AU-83 | S6 | Me → Sign out | `logout` carries `Bearer <refresh token>`; a restart stays signed out | F | ✅ |
| AU-84 | S6 | `logout` answers 500 | Still signed out here; a restart stays signed out | F | ✅ |
| AU-85 | S6 | My devices → Sign out of all devices | `logout-everywhere` carries `Bearer <access token>`; Welcome; a restart stays signed out | F | ✅ |

### E · Across the flow

| # | Story | Steps | Expected | Run | Checked |
|---|---|---|---|---|---|
| AU-47 | — | Arabic → AU-05, AU-06, a wrong code, Sign out | Arabic, right-to-left on s01, s02, s06, the errors and the sign-out sheets; boxes and digits left-to-right | R | ✅ (failed 2026-11-08 on the code boxes → [[B-20 In Arabic the code boxes fill right to left|B-20]], fixed) |
| AU-48 | — | Animations off → AU-30 | Same states; no ring animation | F | ✅ |
| AU-53 | S4 | System Back on each screen | Welcome leaves; sign-in Verify → Welcome; sign-up goes back up to Claim pin, never past registration | R | ✅ |
| AU-62 | — | TalkBack on s01, s02, s06 | Field, switch, Send, six boxes ("digit 1 of 6"…), Resend, Verify all labelled | F | ✅ |

## Screen states

| Screen | State | Expected rendering |
|---|---|---|
| [[Screen Index#s01\|s01]] | idle | One field with Email / Phone, *Send me a code*, LinkedIn *Coming soon* |
| [[Screen Index#s01\|s01]] | sending | Button disabled, sending indicator |
| [[Screen Index#s01\|s01]] | offline / error | Toast; the address kept |
| [[Screen Index#s02\|s02]] | waiting (sign-up) | Step bar, the address, "It expires in 10 minutes.", six boxes (pre-filled from `devCode`), resend countdown |
| [[Screen Index#s02\|s02]] | waiting (sign-in) | No step bar, back arrow, otherwise the same |
| [[Screen Index#s02\|s02]] | wrong code | Boxes shake and empty, wrong-code copy |
| [[Screen Index#s02\|s02]] | locked | Boxes disabled, too-many-tries copy, only resend |
| [[Screen Index#s02\|s02]] | expired | Boxes disabled, expired copy, resend |
| [[Screen Index#s02\|s02]] | not active | Not-active copy, *Start sign-up again* |
| [[Screen Index#s06\|s06]] | typing / checking / free / taken / can't check | `!` prefix, the rule line, "once a year", suggestion chips |
| [[Screen Index#s08\|s08]] | live | "Your Pin is live", the new ring forming once (none with reduced motion) |
| [[Screen Index#s68\|s68]] | sign-out sheet | Mentions a code, not a password |
| [[Screen Index#s75\|s75]] | sign-out-everywhere sheet; done | Confirmation; on Welcome, "Signed out everywhere" |

## Flow diagram

```mermaid
flowchart LR
  s01[s01 Welcome] -->|new or unfinished| s02u[s02 Verify · sign-up]
  s01 -->|409 E_AUTH_01| s02i[s02 Verify · sign-in]
  s02u --> mid[Start from … Profile basics] --> s06[s06 Claim your Pin]
  s06 -->|201| s08[s08 Your Pin is live] --> home[Home]
  s06 -->|400 token expired| s02u
  s06 -->|409 finished elsewhere| s02i
  s02i -->|login/verify| home
  s02i -->|403 E_AUTH_03| s01
  home -->|Sign out · s68| s01
  home -->|Sign out everywhere · s75| s01
  home -->|refresh refused · E_AUTH_04| s01
```

## Error copy

| ErrorCode | Where | Copy shown |
|---|---|---|
| `E_AUTH_01` (409) | s01, sign-up | nothing: a sign-in code is asked for instead |
| — (429 on `sign-up` or `login`) | s01 | "Too many attempts. Wait a moment and try again." (a 4xx that carries a message shows that message: AU-64) |
| `E_AUTH_05` (400) | s02 | "That code is wrong or has expired." |
| `E_AUTH_06` (429, the fifth wrong guess: D-30) | s02 | "Too many tries. Ask for a new code." |
| — (client, `expiresAt` passed) | s02 | "This code has expired. Ask for a new one." |
| — (client) | s02 | "Enter all six digits." |
| `E_AUTH_03` (403) | s02, sign-in verify | "This account isn't active. If you never finished signing up, you can start again." + *Start sign-up again* |
| `E_AUTH_01` (409) after *Start sign-up again* | s02 | "This account can't sign in right now. Contact support if this keeps happening." |
| — (client) | s06 | "Use 3 to 30 characters: letters, numbers, dots and underscores." |
| `E_PROFILE_02` (409, or a bare 409 while sign-up is still open) | s06 | "Taken — try another" |
| `E_AUTH_08` (409, or a bare 409 once sign-up finished) | s06 → s02 | "This account is already set up. We've sent you a code to sign in." |
| `E_AUTH_05` (400, onboarding token expired) | s06 → s02 | "Your verification expired. We've sent you a new code." |
| `E_AUTH_04` (401, refresh refused) | any → s01 | "Your session has expired. Please sign in again." |
| `E_AUTH_03` (401, suspended) | any → s01 | "This account can't sign in right now. Contact support if this keeps happening." (once [[S-87 Error Contract Story\|Error Contract · S4–S8]] ships) |
| `E_USER_01` (404 on `GET /users/me`) | any → s01 | signed out |
| — (no connection) | s01, s02, s06 | "Connection error. Please check your internet and try again." |

Accepted wording (2026-11-05, Omar Fostok): the story's "That code is invalid or has expired" is shown as "That code is wrong or has expired."; S2's "a new code replaces the old one" as "We've sent you a new code."; S1's "says when the code expires" as "It expires in 10 minutes." (the expired state itself follows `expiresAt`).

## Verdict

- Run on: 2026-11-23 · build: `social_pin` `rings/F-11/honest-rings` @ `778d9b4` plus the Patrol suite's changes (not committed yet), `development` flavor, emulator Medium_Phone (Android 16), the development API and the fake backend · result: ✅ **passing** · **all 85 rows ✅** (AU-01 to AU-85): 63 faked, 21 against the development API (one real test covers AU-30, AU-31 and AU-32 together).
- The five bugs of the 2026-11-08 run re-tested on this build and passing, each closed `done`, `resolution: fixed`: AU-23 → [[B-18 Sign-in Verify overflows when the not-active message shows|B-18]]; AU-26 → [[B-19 Claim your Pin shows the prefix @ instead of !|B-19]]; AU-47 → [[B-20 In Arabic the code boxes fill right to left|B-20]]; AU-55 → [[B-21 A failed resend restarts the countdown|B-21]]; AU-60 → [[B-22 The code's expiry counts with the phone clock|B-22]]. Nothing is pending.
- Fixed in the tests, not the app: AU-13, AU-14 and AU-62 waited for the code boxes; AU-40, AU-41 and AU-59 no longer lean on Me's account read (gone since `social_pin` `776e6ca`); AU-33 checks the *just taken* state the app shows; AU-45 waits for Me's list; AU-30/32 reads Me's count and label apart.
- Found, not a bug: a 4xx that carries a message is shown with that message (AU-64), so a real throttle answer from the server should carry readable words.
- Story parts unmet: none.
- Not re-checked: the 2026-11-08 observation that a 401 in the first second after signing in brings the person back to the old Verify step instead of Welcome. Still no row and no bug.
- Earlier run: 2026-11-08 on `28d4ee7`, 57 of 62 rows, AU-23, AU-26, AU-47, AU-55 and AU-60 failing (B-18 to B-22).

## Log

- 2026-11-08 · `docs/qa/M-01-identity/F-02-auth/QF-05-written` · written from the client's case list (62 rows, AU-01 to AU-62) to be run with Patrol, real API and faked, against FD-05; the lock per D-30; replaces the Maestro checklist PL-01 to PL-22 and the uncommitted 2026-11-05 draft; stays draft until the suite runs
- 2026-11-08 · `docs/qa/M-01-identity/F-02-auth/QF-05-run-28d4ee7` · run on `social_pin` `28d4ee7`, Medium_Phone (Android 16): 57 of 62 rows pass; failing AU-23, AU-26, AU-47, AU-55, AU-60, filed as B-18 to B-22 against FD-05 and in `pending`; status failing
- 2026-11-23 · `docs/qa/M-01-identity/F-02-auth/QF-05-passing` · rows AU-63 to AU-85 added from the extended case list (all faked); run on `social_pin` `778d9b4` with the uncommitted suite, Medium_Phone (Android 16): all 85 rows pass; B-18 to B-22 re-tested, passed and closed (`resolution: fixed`); `pending` cleared; status passing, on Omar Fostok's word
