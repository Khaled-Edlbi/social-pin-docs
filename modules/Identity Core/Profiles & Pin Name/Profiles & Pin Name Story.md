---
type: story
code: profiles
scope: feature
feature: profiles
module: identity
status: draft
screens: [s06]
created: 2026-10-18
updated: 2026-10-25
owner: "omar"
related: ["DR-02 One main profile every Ring starts from", "DR-06 Yearly rename, old name freed, case-insensitive"]
tags: [story, story/draft, module/identity, layer/business]
---

# Profiles & Pin Name · User Story

**Feature:** [[Profiles & Pin Name]] · **Status:** Draft (awaiting product sign-off) · **Frontend Requirements:** [[Profiles & Pin Name Frontend Requirements]] · **Backend Integration:** [[Profiles & Pin Name Backend Integration]]

A person claims a `!handle` that is theirs across the whole product, the thing printed on a badge and typed into Discover, and keeps the canonical facts about themselves (name, nickname, birthdate, gender, marital status, and the work details of the main profile: headline, role, company, location, photo, bio) in one place. Rings then decide what each audience gets. The Pin name is public by nature; the sensitive fields are private by default and opt-in per Ring.

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
- [ ] When the handle is taken, the field offers a few suggestions built **only from my own name** (what I typed and my full name), each already checked as free; a suggestion never reveals or derives from who holds the taken name ([[DR-06 Yearly rename, old name freed, case-insensitive]]). Not available yet: the backend returns no suggestions today.

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
- [ ] The copy says the old handle stops resolving at once (`GET /views/pin/:old` becomes a 404 for everyone) and **becomes free for anyone to claim**: nothing redirects to the new name, and a badge or link printed with the old name may later lead to someone else ([[DR-06 Yearly rename, old name freed, case-insensitive]]).
- [ ] A handle can be changed **once a year**; the screen says when the next change is allowed, and a rename inside the year is refused with a domain error shown inline. Not available yet: today a rename is unlimited.
- [ ] A change of capitals only (`SaraAz` → `saraaz`) is the same name and is not a rename.
- [ ] Taken names offer suggestions as in S1.

### S8 · My work details, once (profile editor, reached from [[Screen Index#s68|s68]])

**As an** owner **I want** to write my headline, role, company, location, photo and bio once **so that** every Ring shows them without my retyping them ([[DR-02 One main profile every Ring starts from]]).

Acceptance criteria:
- [ ] The editor has a "work" section with headline, role, company, location, photo and bio; these six are the whole main profile, nothing else is added.
- [ ] Every Ring shows these values unless the Ring changed a field for itself ([[Ring Projection Story]] S3); a Ring that changed a field keeps its own value when I change the main one.
- [ ] My full name is the same in every Ring; no Ring changes it.
- [ ] Imports fill this section, not one Ring ([[Onboarding Imports Story]]).
- [ ] Not available yet: `Profile` has none of these six fields today.

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

- Decided: [[DR-02 One main profile every Ring starts from]] (the work section, S8) and [[DR-06 Yearly rename, old name freed, case-insensitive]] (S1 suggestions, S5 limit). Building them is not ticketed yet.
- Whether a Ring may change **role** was not asked; until product says otherwise it follows headline (DR-02, *Still open*).
- Whether the first year counts from sign-up or from the first rename; the natural reading is that the first rename is free (DR-06, *Still open*).
