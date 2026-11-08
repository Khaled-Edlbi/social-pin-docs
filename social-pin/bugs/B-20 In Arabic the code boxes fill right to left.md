---
id: B-20
type: bug
module: identity
feature: auth
status: todo
priority: high
effort: S
foundOn: "FD-05 Auth & Sign-up Frontend Delivery"
screens: [s02]
depends: []
affects: []
related: ["FD-05 Auth & Sign-up Frontend Delivery", "QF-05 Auth & Sign-up QA Frontend", "S-02 Auth & Sign-up Story"]
pending: []
created: 2026-11-08
updated: 2026-11-08
tags: [bug, bug/todo, module/identity, priority/high]
---

# ⬜ B-20 · In Arabic the code boxes fill right to left

**Found against:** [[FD-05 Auth & Sign-up Frontend Delivery]] · **Feature:** [[F-02 Auth & Sign-up]] · **Status:** To do · **Priority:** High · **Deadline:** — · **Effort:** S

**Found by:** [[QF-05 Auth & Sign-up QA Frontend]] row AU-47, on build `social_pin` `28d4ee7` (emulator Medium_Phone, Android 16, development API), 2026-11-08.

## What

**What happens.** With the app in Arabic, the six code boxes on Verify (s02) fill **right to left**: the first digit typed lands in the rightmost box, so the code reads backwards on screen. The rest of AU-47 passes: s01, s02, s06, the errors and the sign-out sheets are in Arabic and right to left.

**What should happen.** The screen is right to left, but the code boxes and their digits stay **left to right**, as a phone number does: the first digit in the leftmost box (AU-47's expected line; [[S-02 Auth & Sign-up Story|Auth & Sign-up · S2]], six cells with auto-advance).

**Where.** s02, sign-up and sign-in. `otp_input.dart`: the boxes have no left-to-right wrapper.

**On which build.** `social_pin` `rings/F-11/honest-rings` @ `28d4ee7`, against the development API (Patrol).

The fix is `/frontend`'s. It sets `in-progress` when it starts and `ready` when the fix ships; QA re-runs AU-47 and closes or reopens it.

## Design

- [[Screen Index#s02|s02]]

## Impact

- [[FD-05 Auth & Sign-up Frontend Delivery]] — found against
- [[QF-05 Auth & Sign-up QA Frontend]] — row AU-47, `pending`

## Definition of done

- [ ] In Arabic, the first digit lands in the leftmost box and auto-advance moves right; paste fills left to right
- [ ] AU-47 re-run against the fix, on a named build
- [ ] `node scripts/build-tree.mjs` run; generated files committed

## Log

- 2026-11-08 · filed from QF-05 AU-47, found against FD-05 Auth & Sign-up Frontend Delivery
