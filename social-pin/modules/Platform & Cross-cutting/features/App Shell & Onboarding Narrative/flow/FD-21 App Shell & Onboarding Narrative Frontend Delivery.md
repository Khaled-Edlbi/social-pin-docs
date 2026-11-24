---
id: FD-21
type: frontend-delivery
module: platform
feature: app-shell
status: done
scope: feature
deployedTo: []
screens: [s00a, s00b, s00c, s00d]
owner: "Omar Fostok"
blockedBy: []
depends: []
affects: []
related: ["S-73 App Shell & Onboarding Narrative Story", "FR-29 App Shell & Onboarding Narrative Frontend Requirements", "BD-29 App Shell & Onboarding Narrative Backend Delivery", "D-40 The bell count, the tab cross-fade and Go Pro coming soon stay", "F-39 Notifications", "F-11 Rings", "F-02 Auth & Sign-up"]
pending: []
created: 2026-11-15
updated: 2026-11-24
tags: [frontend-delivery, frontend-delivery/done, module/platform, layer/frontend]
---

# ✅ App Shell & Onboarding Narrative · Frontend Delivery

**Feature:** [[F-29 App Shell & Onboarding Narrative]] · **Status:** Done · **Built from:** no endpoint (the local session; [[BD-29 App Shell & Onboarding Narrative Backend Delivery|BD-29]] adds none) · **Against:** [[S-73 App Shell & Onboarding Narrative Story]] · **Requirements:** [[FR-29 App Shell & Onboarding Narrative Frontend Requirements]] · **QA:** [[App Shell & Onboarding Narrative QA Frontend]]

What the client shipped for the splash, the three value panels, the tab bar and the chrome around it. It is on `social_pin` `rings/F-11/honest-rings` @ `778d9b4` (2026-11-12), on `main` since 2026-11-24 at `866240a`. The shell, the launch flow and the tab bar date from the first builds (`271b518`, laid out again in `814e81f`). `778d9b4` adds the intro shown once, the active Ring kept across restarts, and the 1.8 s splash. At `778d9b4`: `dart analyze` 0 errors, `flutter test` 1752 passed. Unit and widget tests only; not yet tried on a device.

**Why it isn't blocked by the flow:** `blockedBy: []`. The shell calls no endpoint, so there is no Backend Integration to wait on (FR-29: "This feature calls no endpoint").

## Screens shipped

| Screen | State | Note |
|---|---|---|
| [[Screen Index#s00a\|s00a]] Splash | ✅ | It holds **1.8 s**, and a tap anywhere moves on at once. While it plays, the app decides where to open: a live session goes to Home; no session with the panels already seen goes to Welcome (s01); otherwise the value panels (S1, `778d9b4`) |
| [[Screen Index#s00b\|s00b]]–[[Screen Index#s00d\|s00d]] Value panels | ✅ | Rings, PinCast and Events on one Aurora canvas that doesn't restart between panels. *Next* and swipe move between them; *Skip* on any panel and *Get started* on the last hand off to sign-up, **replacing** the launch flow so a back gesture can't return to it. Finishing or skipping writes `onboardingIntroSeen`, so the panels **show once** on this installation (S2–S4, `778d9b4`) |
| Tab bar and chrome (no screen id) | ✅ | Five slots: Home · Events · ◎ Badge · Discover · Me. The badge rises over whatever is open and closes with ✕. Each tab keeps its own navigation stack. **Tab changes cross-fade** ([[D-40 The bell count, the tab cross-fade and Go Pro coming soon stay\|D-40]]). **The bell** on Home shows the unread count, with no badge at 0; the count comes from the demo inbox (see Deviations). **The active Ring** (Home's *My badge* card) is kept on the phone and restored after a restart if it is still mine and live; otherwise the default Ring. It is forgotten on sign-out (S5, `778d9b4`) |

## Calls made

| Endpoint | Where | Notes (retries, cache keys, optimistic updates) |
|---|---|---|
| — | s00a | None. The splash reads the local session only; a stale token is refreshed by the first real request after it. |
| `GET /rings` | restoring the active Ring | Not a call of its own: the restore waits for My Rings' copy to check that the kept Ring is still mine and live ([[F-11 Rings]]). |

## State kept on the client

- **`onboardingIntroSeen`:** per installation, in normal storage. Signing out keeps it; uninstalling wipes it, so a reinstall shows the panels again.
- **The active Ring id:** per signed-in person, on the phone. It is restored only if that Ring is still one of mine and live; it is cleared when the session ends. If my Rings aren't known yet at startup, it is left saved for the next launch.

## Deviations from the story or the integration note

- **The bell counts the demo inbox:** notes under an hour old, until *Mark all read*. The inbox has no API until [[F-39 Notifications]] ships. FR-29 says to render the bell without a number; the owner kept the count ([[D-40 The bell count, the tab cross-fade and Go Pro coming soon stay|D-40]]). What it should count on a real account is S-73's open question.
- **Value-panel motion:** the step from the splash to the panels fades with a slight slide; the panels themselves move as a page view. The ring element morphing between panels, as the story describes it, isn't built.

## Not done yet

- **A real bell count:** [[F-39 Notifications]] (S-96).
- **The ring element morphing between the value panels:** [[S-73 App Shell & Onboarding Narrative Story|S-73]] S2–S4.

## Tests

Unit and widget, at `778d9b4`: `startup_test` (new: where the app opens, intro once, active Ring restored or dropped), `launch_startup_test` (updated), `session_reset_test` (the active Ring forgotten on sign-out), `current_ring_test`, `tab_routes_test`, `tab_messages_test`. Not yet on a device.

## Log

- 2026-11-15 · app branch `rings/F-11/honest-rings` @ `778d9b4` (with the shell from `271b518` and `814e81f`; social_pin, on `main` since 2026-11-24 at `866240a`; analyze 0 errors, 1752 tests pass) · S1–S5 · s00a (1.8 s splash, tap to skip, launch routing), s00b–s00d (show once with `onboardingIntroSeen`), tab bar (cross-fade, bell count from the demo inbox, active Ring restored) · written; `blockedBy: []` because the shell calls no endpoint · flagged nothing (S-73's 2026-11-12 update, `S-73-app-778d9b4`, already says this; the bell's source is its open question)
