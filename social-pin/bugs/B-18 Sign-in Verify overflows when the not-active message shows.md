---
id: B-18
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
related: ["FD-05 Auth & Sign-up Frontend Delivery", "QF-05 Auth & Sign-up QA Frontend", "S-02 Auth & Sign-up Story", E_AUTH_03]
pending: []
created: 2026-11-08
updated: 2026-11-08
tags: [bug, bug/todo, module/identity, priority/high]
---

# ⬜ B-18 · Sign-in Verify overflows when the not-active message shows

**Found against:** [[FD-05 Auth & Sign-up Frontend Delivery]] · **Feature:** [[F-02 Auth & Sign-up]] · **Status:** To do · **Priority:** High · **Deadline:** — · **Effort:** S

**Found by:** [[QF-05 Auth & Sign-up QA Frontend]] row AU-23, on build `social_pin` `28d4ee7` (emulator Medium_Phone, Android 16), 2026-11-08.

## What

**What happens.** On sign-in Verify (s02), when `POST /auth/login/verify` answers 403 `E_AUTH_03`, the screen shows "This account isn't active…" and *Start sign-up again*, and the layout overflows by 23 px: the content runs past the bottom of the screen (Flutter's overflow stripe in a debug build).

**What should happen.** The not-active message and *Start sign-up again* fit on the screen, scrolling if they must ([[S-02 Auth & Sign-up Story|Auth & Sign-up · S5]]: "403 `E_AUTH_03` on verify shows 'This account is not active' and offers *Start sign-up again*").

**Where.** s02, sign-in. The Verify step's column, `lib/src/shared/ui/animations/entrance_column.dart`.

**On which build.** `social_pin` `rings/F-11/honest-rings` @ `28d4ee7`, development API faked for the 403 (Patrol, fake backend).

The fix is `/frontend`'s. It sets `in-progress` when it starts and `ready` when the fix ships; QA re-runs AU-23 and closes or reopens it.

## Design

- [[Screen Index#s02|s02]]

## Impact

- [[FD-05 Auth & Sign-up Frontend Delivery]] — found against
- [[QF-05 Auth & Sign-up QA Frontend]] — row AU-23, `pending`

## Definition of done

- [ ] The not-active state fits on s02 (no overflow), on a small phone and with the largest text size
- [ ] AU-23 re-run against the fix, on a named build
- [ ] `node scripts/build-tree.mjs` run; generated files committed

## Log

- 2026-11-08 · filed from QF-05 AU-23, found against FD-05 Auth & Sign-up Frontend Delivery
