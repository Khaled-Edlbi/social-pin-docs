---
id: B-21
type: bug
module: identity
feature: auth
status: ready
priority: high
effort: S
foundOn: "FD-05 Auth & Sign-up Frontend Delivery"
screens: [s02]
depends: []
affects: []
related: ["FD-05 Auth & Sign-up Frontend Delivery", "QF-05 Auth & Sign-up QA Frontend", "S-02 Auth & Sign-up Story", "POST /auth/request-code"]
pending: []
created: 2026-11-08
updated: 2026-11-09
tags: [bug, bug/ready, module/identity, priority/high]
---

# 📨 B-21 · A failed resend restarts the countdown

> ⚠ Affected by [[FD-05 Auth & Sign-up Frontend Delivery]] (2026-11-09): fixed in social_pin f9c19e3, ready for re-test

**Found against:** [[FD-05 Auth & Sign-up Frontend Delivery]] · **Feature:** [[F-02 Auth & Sign-up]] · **Status:** Ready · **Priority:** High · **Deadline:** — · **Effort:** S

**Found by:** [[QF-05 Auth & Sign-up QA Frontend]] row AU-55, on build `social_pin` `28d4ee7` (emulator Medium_Phone, Android 16), 2026-11-08.

## What

**What happens.** On Verify (s02), tapping Resend when `POST /auth/request-code` fails (a 500, or offline) shows the error toast, but the 60-second countdown starts again anyway: the person waits another minute before they can try again, although no new code was sent.

**What should happen.** A failed resend shows the error and leaves the countdown where it was (Resend still available); the code already sent keeps working. The countdown restarts only when a new code was actually issued ([[S-02 Auth & Sign-up Story|Auth & Sign-up · S2]]: "The resend button is disabled for 60 seconds after a code is sent").

**Where.** s02, sign-up and sign-in. `otp_resend_timer.dart` restarts the countdown before the request answers.

**On which build.** `social_pin` `rings/F-11/honest-rings` @ `28d4ee7` (Patrol, fake backend answering 500 and offline).

The fix is `/frontend`'s. It sets `in-progress` when it starts and `ready` when the fix ships; QA re-runs AU-55 and closes or reopens it.

## Design

- [[Screen Index#s02|s02]]

## Impact

- [[FD-05 Auth & Sign-up Frontend Delivery]] — found against
- [[QF-05 Auth & Sign-up QA Frontend]] — row AU-55, `pending`

## Definition of done

- [ ] A failed resend (500, offline) keeps Resend available and the countdown unchanged; a successful one restarts it
- [ ] AU-55 re-run against the fix, on a named build
- [ ] `node scripts/build-tree.mjs` run; generated files committed

## Log

- 2026-11-08 · filed from QF-05 AU-55, found against FD-05 Auth & Sign-up Frontend Delivery
