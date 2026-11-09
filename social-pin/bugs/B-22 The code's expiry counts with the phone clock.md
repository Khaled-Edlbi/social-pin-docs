---
id: B-22
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
related: ["FD-05 Auth & Sign-up Frontend Delivery", "QF-05 Auth & Sign-up QA Frontend", "S-02 Auth & Sign-up Story", "POST /auth/sign-up", "POST /auth/login", "POST /auth/request-code"]
pending: []
created: 2026-11-08
updated: 2026-11-09
tags: [bug, bug/ready, module/identity, priority/high]
---

# 📨 B-22 · The code's expiry counts with the phone clock

> ⚠ Affected by [[FD-05 Auth & Sign-up Frontend Delivery]] (2026-11-09): fixed in social_pin f801aaa (on rings/F-11/honest-rings @ f9c19e3), ready for re-test

**Found against:** [[FD-05 Auth & Sign-up Frontend Delivery]] · **Feature:** [[F-02 Auth & Sign-up]] · **Status:** Ready · **Priority:** High · **Deadline:** — · **Effort:** S

**Found by:** [[QF-05 Auth & Sign-up QA Frontend]] row AU-60, on build `social_pin` `28d4ee7` (emulator Medium_Phone, Android 16), 2026-11-08.

## What

**What happens.** Verify (s02) decides that the code has expired by comparing the challenge's `expiresAt` with the **phone's** clock. A phone whose clock is off by some minutes shows "expired" too early (clock ahead) or keeps the boxes open after the code died (clock behind).

**What should happen.** The expired state follows the server's time: the client works out how long the code has left from the server's answer (`expiresAt` against the answer's `Date` header), so a wrong phone clock changes nothing ([[S-02 Auth & Sign-up Story|Auth & Sign-up · S2]]: "the 'expired' state is driven by `expiresAt`, not a client constant"; AU-60's expected line).

**Where.** s02, sign-up and sign-in. `verify_controller.dart`, `_watchExpiry`, compares with `DateTime.now()`.

**On which build.** `social_pin` `rings/F-11/honest-rings` @ `28d4ee7` (Patrol, fake backend with the phone clock moved 10 minutes).

The fix is `/frontend`'s. It sets `in-progress` when it starts and `ready` when the fix ships; QA re-runs AU-60 and closes or reopens it.

## Design

- [[Screen Index#s02|s02]]

## Impact

- [[FD-05 Auth & Sign-up Frontend Delivery]] — found against
- [[QF-05 Auth & Sign-up QA Frontend]] — row AU-60, `pending`

## Definition of done

- [ ] With the phone clock 10 minutes ahead or behind, the code expires when the server says it does
- [ ] AU-60 re-run against the fix, on a named build
- [ ] `node scripts/build-tree.mjs` run; generated files committed

## Log

- 2026-11-08 · filed from QF-05 AU-60, found against FD-05 Auth & Sign-up Frontend Delivery
