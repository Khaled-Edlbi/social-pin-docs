---
id: B-24
type: bug
module: identity
feature: account
status: done
resolution: fixed
priority: medium
effort: S
foundOn: "FD-04 Account Frontend Delivery"
screens: [s68, s01]
depends: []
affects: []
related: ["FD-04 Account Frontend Delivery", "QF-04 Account QA Frontend", "S-01 Account Story", "GET /users/me", E_AUTH_03]
pending: []
created: 2026-11-09
updated: 2026-11-09
tags: [bug, bug/done, module/identity, priority/medium, resolution/fixed]
---

# ✅ B-24 · A suspended account stays signed in when the account read says SUSPENDED

**Found against:** [[FD-04 Account Frontend Delivery]] · **Feature:** [[F-01 Account]] · **Status:** Done · **Resolution:** fixed · **Priority:** Medium · **Deadline:** — · **Effort:** S

**Found by:** [[QF-04 Account QA Frontend]] row AC-33 (F19), on build `social_pin` `b646053` (emulator-5554, Medium_Phone), 2026-11-09.

## What

**What happens.** On a return to the foreground, `GET /users/me` answers 200 with `status: SUSPENDED`: the app stays signed in on Me. `CurrentAccountController._refresh` keeps an account that can't use the app; only a 401 `E_AUTH_03` signs out.

**What should happen.** Signed out to Welcome with "This account can't sign in right now. Contact support if this keeps happening.", as at startup, where the client's own `canUseApp` check already does it ([[S-01 Account Story|Account · S6]]).

**Where.** s68 on resume; `current_account_controller.dart`.

**On which build.** `social_pin` `rings/F-11/honest-rings` @ `b646053`, the fake backend (Patrol): the dev API has no route that suspends an account.

The fix is `/frontend`'s. It sets `in-progress` when it starts and `ready` when the fix ships; QA re-runs AC-33 and closes or reopens it.

## Design

- [[Screen Index#s68|s68]] · [[Screen Index#s01|s01]]

## Impact

- [[FD-04 Account Frontend Delivery]] — found against
- [[QF-04 Account QA Frontend]] — row AC-33, `pending`

## Definition of done

- [ ] A 200 from `GET /users/me` with a status that can't use the app signs out with the not-active message, on resume as at startup
- [ ] AC-33 re-run against the fix, on a named build
- [ ] `node scripts/build-tree.mjs` run; generated files committed

## Log

- 2026-11-09 · re-run on social_pin `0aaca9e` (emulator-5554, fake backend) · AC-33 ✅: `CurrentAccountController` now ends the session when a fresh `GET /users/me` says `SUSPENDED` (not-active message) or `DELETED` (deleted message), as startup does; unit tests added. Closed `done`, `resolution: fixed`, on Omar Fostok's word.
- 2026-11-09 · filed from QF-04 AC-33, found against FD-04 Account Frontend Delivery
