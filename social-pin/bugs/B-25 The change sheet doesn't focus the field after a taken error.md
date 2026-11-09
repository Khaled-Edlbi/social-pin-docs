---
id: B-25
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
related: ["FD-04 Account Frontend Delivery", "QF-04 Account QA Frontend", "S-01 Account Story", "PATCH /users/me", E_USER_02, E_USER_03]
pending: []
created: 2026-11-09
updated: 2026-11-09
tags: [bug, bug/todo, module/identity, priority/low]
---

# ⬜ B-25 · The change sheet doesn't focus the field after a taken error

**Found against:** [[FD-04 Account Frontend Delivery]] · **Feature:** [[F-01 Account]] · **Status:** To do · **Priority:** Low · **Deadline:** — · **Effort:** S

**Found by:** [[QF-04 Account QA Frontend]] row AC-27 (F8, F11), on build `social_pin` `b646053` (emulator-5554, Medium_Phone), 2026-11-09.

## What

**What happens.** `PATCH /users/me` answers 409 (`E_USER_02`, a bare 409, then `E_USER_03` for the phone): the taken message shows under the field and the typed text is kept, but the field **isn't focused**. The sheet never calls `requestFocus` on an error.

**What should happen.** The 409 shows inline and the field is focused, so the person can correct it at once ([[S-01 Account Story|Account · S2]]: "409 inline, field focused").

**Where.** s68, the change email / phone sheet; `edit_contact_sheet.dart`.

**On which build.** `social_pin` `rings/F-11/honest-rings` @ `b646053`, the fake backend (Patrol).

The fix is `/frontend`'s. It sets `in-progress` when it starts and `ready` when the fix ships; QA re-runs AC-27 and closes or reopens it.

## Design

- [[Screen Index#s68|s68]]

## Impact

- [[FD-04 Account Frontend Delivery]] — found against
- [[QF-04 Account QA Frontend]] — row AC-27, `pending`

## Definition of done

- [ ] After a 409 (with or without its code) the field has focus and keeps what was typed, email and phone
- [ ] AC-27 re-run against the fix, on a named build
- [ ] `node scripts/build-tree.mjs` run; generated files committed

## Log

- 2026-11-09 · filed from QF-04 AC-27, found against FD-04 Account Frontend Delivery
