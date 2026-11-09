---
id: B-26
type: bug
module: identity
feature: account
status: done
resolution: fixed
priority: medium
effort: S
foundOn: "FD-04 Account Frontend Delivery"
screens: [s68]
depends: []
affects: []
related: ["FD-04 Account Frontend Delivery", "QF-04 Account QA Frontend", "S-01 Account Story", "DELETE /users/me"]
pending: []
created: 2026-11-09
updated: 2026-11-09
tags: [bug, bug/done, module/identity, priority/medium, resolution/fixed]
---

# ✅ B-26 · The delete sheet doesn't say every Ring, projection and session goes

**Found against:** [[FD-04 Account Frontend Delivery]] · **Feature:** [[F-01 Account]] · **Status:** Done · **Resolution:** fixed · **Priority:** Medium · **Deadline:** — · **Effort:** S

**Found by:** [[QF-04 Account QA Frontend]] row DA-02b (F13), on build `social_pin` `b646053` (emulator-5554, Medium_Phone), 2026-11-09.

## What

**What happens.** The "Delete your account?" sheet says it signs you out and frees the email and phone, but not that **every Ring, projection and session** goes away.

**What should happen.** The confirmation names the consequence: every Ring, projection and session goes away; the email and phone become free to sign up again ([[S-01 Account Story|Account · S4]]).

**Where.** s68, the delete sheet; the `deleteAccount` copy (English and Arabic).

**On which build.** `social_pin` `rings/F-11/honest-rings` @ `b646053`, the fake backend (Patrol).

The fix is `/frontend`'s. It sets `in-progress` when it starts and `ready` when the fix ships; QA re-runs DA-02b and closes or reopens it.

## Design

- [[Screen Index#s68|s68]]

## Impact

- [[FD-04 Account Frontend Delivery]] — found against
- [[QF-04 Account QA Frontend]] — row DA-02b, `pending`

## Definition of done

- [ ] The delete sheet names every Ring, projection and session going away, and the email and phone freed, in English and Arabic
- [ ] DA-02b re-run against the fix, on a named build
- [ ] `node scripts/build-tree.mjs` run; generated files committed

## Log

- 2026-11-09 · re-run on social_pin `0aaca9e` (emulator-5554, fake backend) · DA-02b ✅: the delete sheet's body (`deleteAccount.confirmBody`, English and Arabic) now names the Rings and what they show going away, besides the sign-out and the freed email and phone. Closed `done`, `resolution: fixed`, on Omar Fostok's word.
- 2026-11-09 · filed from QF-04 DA-02b, found against FD-04 Account Frontend Delivery
