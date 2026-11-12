---
id: S-73
type: story
module: platform
feature: app-shell
status: approved
scope: feature
screens: [s00a, s00b, s00c, s00d]
approvedBy: "khaled"
approvedAt: 2026-10-25
owner: "Omar Fostok"
created: 2026-10-18
updated: 2026-11-12
tags: [story, story/approved, module/platform, layer/business]
---

# App Shell & Onboarding Narrative · User Story

**Feature:** [[F-29 App Shell & Onboarding Narrative]] · **Status:** Approved 2026-10-25 by khaled · **Frontend Requirements:** [[FR-29 App Shell & Onboarding Narrative Frontend Requirements]] · **API Integration:** none needed (frontend only)

A person has just installed the app. In the first thirty seconds they need to understand one idea, that they have one profile and many audiences, and then reach the sign-up choice without feeling they walked through a slideshow. After sign-up the same person lives in a five-slot tab bar whose centre is the badge. This feature is the frame everything else sits in; it talks to no endpoint.

## Persona

A first-time personal user, phone in hand, who has heard "Social Pin" from someone who scanned them a badge. Later, the same user as a returning user who opens the app several times a day to raise the badge.

## Stories

### S1 · Splash ([[Screen Index#s00a|s00a]])

**As a** first-time user **I want** a short brand moment that leads straight into the value panels **so that** the app feels deliberate rather than slow.

Acceptance criteria:
- [ ] The splash shows the mark and the name, holds **1.8 s**, and moves on by itself; a tap anywhere moves on at once.
- [ ] A returning user with a live session goes from the splash straight to Home, with no value panels.
- [ ] A returning user without a session goes from the splash to s01, not to the value panels, once the panels have been seen (`onboardingIntroSeen`, S4).
- [ ] The ring element that becomes the onboarding progress indicator first appears here, so it is the shared anchor from the first frame.

### S2 · Value · Rings ([[Screen Index#s00b|s00b]])

**As a** first-time user **I want** the first panel to say "one you, many audiences" in one sentence and one picture **so that** I understand what a Ring is before I am asked to make one.

Acceptance criteria:
- [ ] One headline, one supporting line, one illustration of a single profile fanning into several Rings.
- [ ] "Next" goes to s00c; "Skip" goes to s01 and records that the panels were seen.
- [ ] The panel transition is a horizontal slide with the ring element persisting between panels.

### S3 · Value · PinCast ([[Screen Index#s00c|s00c]])

**As a** first-time user **I want** the second panel to show that I can be found nearby on my own terms **so that** the proximity feature reads as control, not exposure.

Acceptance criteria:
- [ ] The illustration previews the PinCast ripple from [[Wireframe Brief#Motion principles|§14 Motion principles]] in a reduced form.
- [ ] "Next" goes to s00d; "Skip" goes to s01.
- [ ] Swiping back returns to s00b with the reverse of the same slide; the transition is interruptible mid-gesture.

### S4 · Value · Events ([[Screen Index#s00d|s00d]])

**As a** first-time user **I want** the last panel to close with "Get started" **so that** the narrative ends in an action, not a dot indicator.

Acceptance criteria:
- [ ] "Get started" and "Skip" both go to s01; the difference is only the label.
- [ ] The ring element morphs into the onboarding progress ring that s01 carries, so the user sees the same object continue.
- [ ] The panels show **once**: finishing with "Get started" or tapping "Skip" on any panel sets `onboardingIntroSeen` on the phone, and the panels never show again on this installation. The flag is per installation, not per person: **signing out keeps it**; uninstalling clears it, so a reinstall shows the panels again. A "replay the intro" entry is not available.

### S5 · Tab bar and persistent chrome

**As a** signed-in user **I want** Home, Events, Badge, Discover and Me always one tap away, with the badge in the centre **so that** the action I take most is under my thumb.

Acceptance criteria:
- [ ] Five slots in the order Home · Events · ◎ Badge · Discover · Me; the centre button is elevated and larger than the four tabs.
- [ ] Tab changes **cross-fade**; they don't slide, and there is no hard cut ([[D-40 The bell count, the tab cross-fade and Go Pro coming soon stay|D-40]]). A slide would suggest the tabs sit side by side, and they don't.
- [ ] The centre button uses the rise-and-expand transition into the badge sheet and collapses back into the button on dismiss; the gesture is reversible at any point.
- [ ] The notifications bell sits top-right on Home and **shows a count** before [[F-39 Notifications]] ships ([[D-40 The bell count, the tab cross-fade and Go Pro coming soon stay|D-40]]); no badge at 0, and screen readers hear the count. The inbox has no API yet, so today the count is the app's demo inbox: the notes under an hour old, until *Mark all read* on s69. That read state is kept on the phone and resets when the session ends. What the count shows on a real account before F-39 ships is not decided ([[#Open questions]]).
- [ ] The active-Ring switcher lives at the top of Home and is reachable elsewhere by pull-down or a persistent chip; changing it triggers the ring re-compose motion owned by [[F-11 Rings]].
- [ ] The active Ring is kept on the phone (the id only) and **restored after a restart** if it is still one of my Rings and live; otherwise the app falls back to my default Ring. Signing out clears it.

### S6 · Reduced motion

**As a** user with reduced motion enabled **I want** every signature motion to have a simplified fallback **so that** the app stays usable and still carries the state change.

Acceptance criteria:
- [ ] With the OS reduced-motion setting on, panel slides become cross-fades, the badge rise becomes a fade, and the ring-fill snaps to its next segment. Tab changes already cross-fade (S5), so they stay as they are.
- [ ] No state change is communicated by motion alone; each also has a visible static cue.

## States and motion the design asks for

- State: first launch (panels), returning without session (s01), returning with session (Home).
- State: panel 1 of 3, 2 of 3, 3 of 3; Skip available on every panel.
- Motion: panels slide horizontally with the ring element as the shared, morphing anchor ([[Wireframe Brief#Onboarding|§3 Onboarding]]).
- Motion: tab changes cross-fade (D-40); the centre badge rises and expands, and collapses back ([[Wireframe Brief#Global navigation & app shell|§2]]).
- Motion: all transitions reversible and interruptible; reduced-motion fallback provided ([[Wireframe Brief#Motion principles|§14 Motion principles]]).

## Rules the backend already enforces

- None. The feature note lists no endpoints and no tables. The only backend fact the shell depends on is whether a session exists, which the token store from [[F-02 Auth & Sign-up]] answers locally (access 15 min, refresh 7 days, rotating).

## Open questions

- No decision note blocks this feature. Whether the value panels can be replayed from Me is a product call the design does not make; the story assumes "shown once per installation".
- **Where the bell's count comes from on a real account** before [[F-39 Notifications]] ships: [[D-40 The bell count, the tab cross-fade and Go Pro coming soon stay|D-40]] keeps a count, and today it counts the demo inbox. Options: pending connection requests and invitations; no badge until F-39; or the demo inbox outside production builds only. This is the owner's call.

## Log

- 2026-11-12 · `tickets/pm/M-08-platform/F-29-app-shell/S-73-app-778d9b4` · S1 the splash holds 1.8 s; S4 the panels show once (`onboardingIntroSeen`, kept on sign-out); S5 tab changes cross-fade (D-40), the bell shows a count (today the demo inbox; the real source is an open question), the active Ring is restored after a restart if it's still mine and live; S6 tabs stay a cross-fade; decided by Omar Fostok 2026-11-11, app 778d9b4. D-40 flag cleared
- 2026-11-12 · flagged [[FR-29 App Shell & Onboarding Narrative Frontend Requirements]]: the splash holds 1.8 s; the active Ring is restored only if it's still mine and live; the bell counts the demo inbox until its source is decided; tab changes cross-fade
