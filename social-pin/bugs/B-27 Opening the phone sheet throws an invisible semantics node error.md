---
id: B-27
type: bug
module: identity
feature: account
status: todo
priority: low
effort: S
foundOn: "FD-04 Account Frontend Delivery"
screens: [s68]
depends: []
affects: []
related: ["FD-04 Account Frontend Delivery", "QF-04 Account QA Frontend", "S-01 Account Story"]
pending: []
created: 2026-11-09
updated: 2026-11-09
tags: [bug, bug/todo, module/identity, priority/low]
---

# ⬜ B-27 · Opening the phone sheet throws an invisible semantics node error

**Found against:** [[FD-04 Account Frontend Delivery]] · **Feature:** [[F-01 Account]] · **Status:** To do · **Priority:** Low · **Deadline:** — · **Effort:** S

**Found by:** [[QF-04 Account QA Frontend]] row AC-40 (accessibility), on build `social_pin` `b646053` (emulator-5554, Medium_Phone), 2026-11-09.

## What

**What happens.** Opening the change phone sheet throws "Invisible SemanticsNodes should not be added to the tree": the country-code button's semantics node is placed off screen while the sheet slides up. A screen reader can be handed a node that isn't visible.

**What should happen.** The sheet opens without a semantics error; every node a screen reader gets is on screen (accessibility, [[S-01 Account Story|Account · S3]]'s phone field).

**Where.** s68, the change phone sheet: the phone field's country-code button.

**On which build.** `social_pin` `rings/F-11/honest-rings` @ `b646053`, the fake backend (Patrol).

The fix is `/frontend`'s. It sets `in-progress` when it starts and `ready` when the fix ships; QA re-runs AC-40 and closes or reopens it.

## Design

- [[Screen Index#s68|s68]]

## Impact

- [[FD-04 Account Frontend Delivery]] — found against
- [[QF-04 Account QA Frontend]] — row AC-40, `pending`

## Definition of done

- [ ] The phone sheet opens with no semantics error, in English and Arabic
- [ ] AC-40 re-run against the fix, on a named build
- [ ] `node scripts/build-tree.mjs` run; generated files committed

## Log

- 2026-11-09 · filed from QF-04 AC-40, found against FD-04 Account Frontend Delivery
