---
type: story
code: profiles
scope: feature
feature: profiles
module: identity
status: draft
screens: [s06]
updated: 2026-10-18
tags: [story, story/draft, module/identity, layer/business]
---

# Profiles & Pin Name · User Story

**Feature:** [[Profiles & Pin Name]] · **Status:** Draft (awaiting product sign-off) · **Frontend Requirements:** [[Profiles & Pin Name Frontend Requirements]] · **Backend Integration:** [[Profiles & Pin Name Backend Integration]]

A person claims a `!handle` that is theirs across the whole product, the thing printed on a badge and typed into Discover, and keeps the canonical facts about themselves (name, nickname, birthdate, gender, marital status) in one place. Rings then decide what each audience gets. The Pin name is public by nature; the sensitive fields are private by default and opt-in per Ring.

## Persona

A new user at the Claim your Pin step ([[Screen Index#s06|s06]]) of onboarding, and later the same person as an owner editing their profile from Me ([[Screen Index#s68|s68]]). Accounts with several profiles (personal and business) are a secondary case.

## Stories

### S1 · Claim your Pin ([[Screen Index#s06|s06]])

**As a** new user **I want** to type a handle and see at once whether it is free **so that** I leave onboarding with a Pin name I like.

Acceptance criteria:
- [ ] The field shows a fixed `!` prefix as decoration; the value sent never contains it.
- [ ] Client rule before any request: 3 to 30 characters, letters, digits, `.` and `_`; the hint reads the rule, not a regex.
- [ ] A debounced (300 ms) `GET /profiles/pin-name/:pinName/availability` returns `{ pinName, available }`; the field shows a check or "Taken" without naming anyone.
- [ ] Case does not matter for availability (`SaraAz` = `saraaz`); the casing typed is what is displayed later.
- [ ] Continue is enabled only on `available: true`; the ring progress indicator fills a segment on success.

### S2 · Taken at the last moment ([[Screen Index#s06|s06]])

**As a** new user **I want** a clear recovery when the handle was taken between the check and submit **so that** I am not thrown back to the start.

Acceptance criteria:
- [ ] A 409 `E_PROFILE_02` from `POST /auth/complete-registration` keeps the user on s06 with the field focused and the message "That Pin name was just taken".
- [ ] The optional full name typed on the same screen is retained.

### S3 · Edit my name and nickname (profile editor, reached from [[Screen Index#s68|s68]])

**As an** owner **I want** to edit my full name and nickname **so that** every Ring that inherits them shows the right ones.

Acceptance criteria:
- [ ] The editor loads `GET /profiles` and edits `data[0]` (the default profile) with `PATCH /profiles/:id`.
- [ ] `fullName` ≤ 120, `nickname` ≤ 60; a save returns the updated `ProfileEntity` and the editor refetches.
- [ ] The copy explains that a Ring's `displayName` falls back to this full name, never to the nickname.

### S4 · Sensitive base fields (profile editor, reached from [[Screen Index#s68|s68]])

**As an** owner **I want** to store my birthdate, gender and marital status once **so that** I can share them with the Rings I choose and no other.

Acceptance criteria:
- [ ] Each field is labelled "shared only with Rings you choose" and has an explicit Clear action that sends `null`.
- [ ] `birthdate` is an ISO date; `gender` and `maritalStatus` are enum pickers from `/docs`.
- [ ] No switch on this screen makes a value public; the opt-in lives on each Ring's "what it shows" ([[Ring Projection Story]]).

### S5 · Rename my Pin (profile editor, reached from [[Screen Index#s68|s68]])

**As an** owner **I want** to change my handle **so that** my badge and lookups follow my new name.

Acceptance criteria:
- [ ] The same live availability check as S1; `PATCH /profiles/:id { pinName }`; 409 `E_PROFILE_02` inline.
- [ ] The copy says the old handle stops resolving at once (`GET /views/pin/:old` becomes a 404 for everyone).
- [ ] The design's "change it once a year" and suggested names are not shown until [[D-06 Pin name rules]] is decided; today a rename is unlimited.

### S6 · Several profiles and the default (profile editor, no prototype screen)

**As an** owner with a business identity **I want** a second profile and a choice of default **so that** my badge resolves to the right one.

Acceptance criteria:
- [ ] `POST /profiles` with a free `pinName` and `profileType` (`PERSONAL`, `PROFESSIONAL`, `BUSINESS`); the list shows the default first.
- [ ] "Make default" calls `POST /profiles/:id/default`; the previous default loses its badge in the same refresh.
- [ ] Delete is offered only on non-default profiles; a 409 `E_PROFILE_03` reads "Choose another default first".

### S7 · My Pin name is how others find me (journey, [[Screen Index#s44|s44]])

**As an** owner **I want** to know what my handle does for others **so that** I understand what claiming it means.

Acceptance criteria:
- [ ] Me shows the handle with a "share" hint: anyone who looks it up gets the Ring they are in, or nothing.
- [ ] The look-up itself and the one-message 404 are in [[View As & Pin Views Story]].

## States and motion the design asks for

- State on s06: typing, checking, available, taken, invalid format, taken-at-submit.
- State in the editor: saving, cleared sensitive field, default badge on the profile list.
- Motion: s06 is one step of the onboarding ring-fill; availability feedback is an inline state change, no extra motion. Reduced motion: no change needed.

## Rules the backend already enforces

- Uniqueness is global and case-insensitive on `pinNameNormalized`; the original casing is kept for display. The availability route is public and answers only a boolean.
- `POST /profiles` and a `PATCH` that changes the handle run the check and the write in one transaction; two concurrent claims cannot both win.
- The first profile is created inside `completeRegistration`'s transaction and is the default; one default per account (partial unique index); `POST /profiles/:id/default` demotes then promotes in one transaction.
- `DELETE /profiles/:id` is a soft delete and refuses the default (409 `E_PROFILE_03`).
- The three sensitive fields are nullable; `null` clears. Whether an audience sees them is decided per Ring in `RingProfileService.toView`, nowhere else.
- These endpoints return the caller's own profiles only; another person is reachable through `/views/…`.

## Open questions

- [[D-02 Base profile work fields]] — headline, role, company, location, base photo and bio are on every design screen but not on `Profile`; blocks the "work" section of the editor.
- [[D-06 Pin name rules]] — yearly rename limit and suggested handles on s06; blocks the copy and the suggestion chips.
