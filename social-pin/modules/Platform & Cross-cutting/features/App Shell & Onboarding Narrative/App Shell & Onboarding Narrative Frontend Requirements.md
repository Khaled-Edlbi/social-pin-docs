---
type: frontend-requirements
code: app-shell
scope: feature
feature: app-shell
module: platform
status: draft
screens: [s00a, s00b, s00c, s00d]
created: 2026-10-18
updated: 2026-10-27
tags: [frontend-requirements, frontend-requirements/draft, module/platform, layer/frontend]
---

# App Shell & Onboarding Narrative · Frontend Requirements

**Feature:** [[App Shell & Onboarding Narrative]] · **Status:** Draft · **Story:** [[App Shell & Onboarding Narrative Story]] · **API Integration:** none needed (frontend only)

What the client needs to build the splash, the three value panels, the tab bar and the persistent chrome. This feature calls no endpoint; its only dependency is the local session state that [[Auth & Sign-up]] already defines.

## Per screen

### [[Screen Index#s00a|s00a]] Splash

- Needs: the brand mark; a decision "session / no session / never onboarded" taken from local storage before the first frame is drawn; the ring element that later becomes the onboarding progress indicator.
- Source today: local token store (see the sessions section of [[Frontend Contract]]). No call is made here; a stale access token is refreshed lazily by the first real request on Home, not by the splash.

### [[Screen Index#s00b|s00b]] Value · Rings

- Needs: static copy and illustration; "Next" and "Skip"; panel position 1 of 3.
- Source today: bundled assets. Nothing is fetched.

### [[Screen Index#s00c|s00c]] Value · PinCast

- Needs: static copy and illustration with a reduced PinCast ripple; "Next" and "Skip"; position 2 of 3.
- Source today: bundled assets.

### [[Screen Index#s00d|s00d]] Value · Events

- Needs: static copy and illustration; "Get started" and "Skip"; position 3 of 3; the ring morphs into the progress ring carried by s01.
- Source today: bundled assets. On exit, write an `onboardingIntroSeen` flag locally so the panels are not shown again on this installation.

### Tab bar and persistent chrome (no screen id)

- Needs: five slots Home · Events · ◎ Badge · Discover · Me; centre button elevated; the notifications bell with an unread indicator; the active-Ring switcher at the top of Home.
- Source today: the bell has no count to show until [[Notifications]] ships ([[T-045 NotificationService.emit and the inbox]]); render it without a number. The switcher reads `GET /rings`, owned by [[Rings]]. The badge sheet reads the active Ring, owned by [[Badge & QR]].

## Endpoints required

| Need | Endpoint | Available | Task / decision |
|---|---|---|---|
| Splash, value panels, tab bar | — | n/a | frontend only; the feature note lists no endpoints |
| Unread count on the bell | — | ❌ | [[T-045 NotificationService.emit and the inbox]] (owned by [[Notifications]]) |
| Session decision on launch | — | n/a | local token store; refresh behaviour documented under [[Auth & Sign-up]] |

## Behaviour expectations

- Refetch / realtime: none. The shell makes no request of its own. The first request after launch belongs to Home and may trigger one `POST /auth/refresh`; the shell must not race it with a second refresh (one in-flight refresh promise, per [[Frontend Contract]]).
- Caching keys: `onboardingIntroSeen` (boolean, per installation); the active Ring id, per user, so the badge and the switcher agree after a cold start.
- Pagination / ordering: none.
- Motion: tab changes slide horizontally in bar order; the centre button rises and expands into the badge sheet and collapses back; every transition is reversible and interruptible; honour the OS reduced-motion setting with cross-fades and snaps ([[Wireframe Brief#Motion principles|§14 Motion principles]]).
- Navigation: s00b, s00c and s00d each offer Skip → s01; s00d's "Get started" also → s01 ([[Navigation Map]]).
- Launch routing: live session → Home; no session and intro seen → s01; no session and intro not seen → s00a.

## Error states the UI must handle

| Status | ErrorCode | Show |
|---|---|---|
| — | — | None. The shell issues no request. A failed lazy refresh on Home (401, `E_AUTH_04` once [[Error Contract Story|Error Contract · S4–S8]] ships) is handled by the token store and sends the user to s01. |

## Blocked by

- Nothing. No decision note names this feature. The bell count waits on [[T-045 NotificationService.emit and the inbox]], but the shell can ship without it.
