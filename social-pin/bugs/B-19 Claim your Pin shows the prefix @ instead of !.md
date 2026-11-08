---
id: B-19
type: bug
module: identity
feature: auth
status: todo
priority: high
effort: S
foundOn: "FD-05 Auth & Sign-up Frontend Delivery"
screens: [s06]
depends: []
affects: []
related: ["FD-05 Auth & Sign-up Frontend Delivery", "QF-05 Auth & Sign-up QA Frontend", "S-02 Auth & Sign-up Story"]
pending: []
created: 2026-11-08
updated: 2026-11-08
tags: [bug, bug/todo, module/identity, priority/high]
---

# ⬜ B-19 · Claim your Pin shows the prefix @ instead of !

**Found against:** [[FD-05 Auth & Sign-up Frontend Delivery]] · **Feature:** [[F-02 Auth & Sign-up]] · **Status:** To do · **Priority:** High · **Deadline:** — · **Effort:** S

**Found by:** [[QF-05 Auth & Sign-up QA Frontend]] row AU-26, on build `social_pin` `28d4ee7` (emulator Medium_Phone, Android 16), 2026-11-08.

## What

**What happens.** On Claim your Pin (s06) the Pin name field's prefix reads `@`. Everywhere else the app writes a Pin name with `!` (Me shows `!sam.k`). The rest of AU-26 passes: the client refuses `ab`, 31 characters and `sam-k`, accepts `sam.k_1`, never sends the prefix, and shows "You can change it once a year."

**What should happen.** The prefix is `!`, as [[S-02 Auth & Sign-up Story|Auth & Sign-up · S3]] says ("The `!` is rendered as a prefix and never sent") and as every other screen shows it.

**Where.** s06, `claim_pin_step.dart`.

**On which build.** `social_pin` `rings/F-11/honest-rings` @ `28d4ee7` (Patrol, fake backend).

The fix is `/frontend`'s. It sets `in-progress` when it starts and `ready` when the fix ships; QA re-runs AU-26 and closes or reopens it.

## Design

- [[Screen Index#s06|s06]]

## Impact

- [[FD-05 Auth & Sign-up Frontend Delivery]] — found against
- [[QF-05 Auth & Sign-up QA Frontend]] — row AU-26, `pending`

## Definition of done

- [ ] s06 shows `!` as the prefix, the same as Me and the badge
- [ ] AU-26 re-run against the fix, on a named build
- [ ] `node scripts/build-tree.mjs` run; generated files committed

## Log

- 2026-11-08 · filed from QF-05 AU-26, found against FD-05 Auth & Sign-up Frontend Delivery
