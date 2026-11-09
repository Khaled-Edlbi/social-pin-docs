---
id: B-23
type: bug
module: identity
feature: account
status: done
resolution: cannot-reproduce
priority: high
effort: S
foundOn: "FD-04 Account Frontend Delivery"
screens: [s68, s01, s11]
depends: []
affects: []
related: ["FD-04 Account Frontend Delivery", "QF-04 Account QA Frontend", "S-01 Account Story", "B-02 Deleted account answers 401, not the documented 404 E_USER_01", "GET /users/me", E_USER_01]
pending: []
created: 2026-11-09
updated: 2026-11-09
tags: [bug, bug/done, module/identity, priority/high, resolution/cannot-reproduce]
---

# ✅ B-23 · A deleted account opened cold lands on Home, not Welcome

**Found against:** [[FD-04 Account Frontend Delivery]] · **Feature:** [[F-01 Account]] · **Status:** Done · **Resolution:** cannot-reproduce (a test fault, not the app) · **Priority:** High · **Deadline:** — · **Effort:** S

**Found by:** [[QF-04 Account QA Frontend]] row AC-14 (F15), on build `social_pin` `b646053` (emulator-5554, Medium_Phone), 2026-11-09.

## What

**What happens.** The account is deleted from another phone (the test deletes it through the API), then the app is opened cold: it lands on **Home** (s11, in 530 ms), not Welcome. The API side of [[B-02 Deleted account answers 401, not the documented 404 E_USER_01|B-02]] holds (the old token gets a 404 "User not found", without the `E_USER_01` code), but a cold start to Home doesn't read `GET /users/me`, so nothing signs out until Me is opened. A new app bug, not B-02 coming back.

**What should happen.** Welcome with "Your account has been deleted.", never Home ([[S-01 Account Story|Account · S4]]: a later 404 signs out, not a toast). [[FD-04 Account Frontend Delivery|FD-04]] says a 404 on `GET /users/me` ends the session "at startup too".

**Where.** Startup → s11 Home; the account read at startup (`GET /users/me`).

**On which build.** `social_pin` `rings/F-11/honest-rings` @ `b646053`, development API (Patrol, real API).

The fix is `/frontend`'s. It sets `in-progress` when it starts and `ready` when the fix ships; QA re-runs AC-14 and closes or reopens it.

## Design

- [[Screen Index#s01|s01]] · [[Screen Index#s11|s11]] · [[Screen Index#s68|s68]]

## Impact

- [[FD-04 Account Frontend Delivery]] — found against
- [[QF-04 Account QA Frontend]] — row AC-14, `pending`

## Definition of done

- [ ] A cold start with a deleted account's saved session lands on Welcome with "Your account has been deleted.", never Home
- [ ] AC-14 re-run against the fix, on a named build
- [ ] `node scripts/build-tree.mjs` run; generated files committed

## Log

- 2026-11-09 · re-run on social_pin `0aaca9e` (emulator-5554) · AC-14 ✅: the cold start lands on Welcome with "Your account has been deleted." (2.5 s). The first run's failure was the test, not the app: its restart kept the shared `appRouter` stack, so the app reopened Home without the splash or `GET /users/me`; `startApp(restart: true)` now empties the stack. Closed `done`, `resolution: cannot-reproduce`, on Omar Fostok's word; no app change was needed.
- 2026-11-09 · filed from QF-04 AC-14, found against FD-04 Account Frontend Delivery
