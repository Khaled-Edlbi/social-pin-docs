---
type: story
code: app-shell
scope: feature
feature: app-shell
module: platform
status: approved
screens: [s00a, s00b, s00c, s00d]
approvedBy: "khaled"
approvedAt: 2026-10-25
owner: "khaled"
created: 2026-10-18
updated: 2026-10-28
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
- [ ] The splash shows the mark and the name and moves to s00b on its own, or on tap, within two seconds.
- [ ] A returning user with a live session skips s00a → s00b → s00d entirely and lands on Home.
- [ ] A returning user without a session lands on s01, not on the value panels, unless they have never completed them.
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
- [ ] The panels are never shown again on this installation once s01 has been reached, except from a "replay the intro" entry that product may add later.

### S5 · Tab bar and persistent chrome

**As a** signed-in user **I want** Home, Events, Badge, Discover and Me always one tap away, with the badge in the centre **so that** the action I take most is under my thumb.

Acceptance criteria:
- [ ] Five slots in the order Home · Events · ◎ Badge · Discover · Me; the centre button is elevated and larger than the four tabs.
- [ ] Tab changes slide along a horizontal axis in the order of the bar; there is no hard cut.
- [ ] The centre button uses the rise-and-expand transition into the badge sheet and collapses back into the button on dismiss; the gesture is reversible at any point.
- [ ] The notifications bell sits top-right on Home with an unread indicator; its count comes from [[F-39 Notifications]] when that feature ships, and shows no number until then.
- [ ] The active-Ring switcher lives at the top of Home and is reachable elsewhere by pull-down or a persistent chip; changing it triggers the ring re-compose motion owned by [[F-11 Rings]].

### S6 · Reduced motion

**As a** user with reduced motion enabled **I want** every signature motion to have a simplified fallback **so that** the app stays usable and still carries the state change.

Acceptance criteria:
- [ ] With the OS reduced-motion setting on, panel slides become cross-fades, the badge rise becomes a fade, and the ring-fill snaps to its next segment.
- [ ] No state change is communicated by motion alone; each also has a visible static cue.

## States and motion the design asks for

- State: first launch (panels), returning without session (s01), returning with session (Home).
- State: panel 1 of 3, 2 of 3, 3 of 3; Skip available on every panel.
- Motion: panels slide horizontally with the ring element as the shared, morphing anchor ([[Wireframe Brief#Onboarding|§3 Onboarding]]).
- Motion: tab changes share a spatial model; the centre badge rises and expands, and collapses back ([[Wireframe Brief#Global navigation & app shell|§2]]).
- Motion: all transitions reversible and interruptible; reduced-motion fallback provided ([[Wireframe Brief#Motion principles|§14 Motion principles]]).

## Rules the backend already enforces

- None. The feature note lists no endpoints and no tables. The only backend fact the shell depends on is whether a session exists, which the token store from [[F-02 Auth & Sign-up]] answers locally (access 15 min, refresh 7 days, rotating).

## Open questions

- No decision note blocks this feature. Whether the value panels can be replayed from Me is a product call the design does not make; the story assumes "shown once per installation".
