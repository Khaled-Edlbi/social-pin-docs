---
type: story
code: profiles
scope: feature
feature: profiles
module: identity
status: approved
screens: [s06]
approvedBy: "khaled"
approvedAt: 2026-10-25
created: 2026-10-18
updated: 2026-10-28
owner: "omar"
related: ["D-02 One main profile every Ring starts from", "D-06 Yearly rename, old name freed, case-insensitive"]
tags: [story, story/approved, module/identity, layer/business]
---

# Profiles & Pin Name · User Story

**Feature:** [[F-07 Profiles & Pin Name]] · **Status:** Approved 2026-10-25 by khaled · **Frontend Requirements:** [[FR-07 Profiles & Pin Name Frontend Requirements]] · **Backend Integration:** [[BI-04 Profiles & Pin Name Backend Integration]]

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
- [ ] When the handle is taken, the field offers a few suggestions built **only from my own name** (what I typed and my full name), each already checked as free; a suggestion never reveals or derives from who holds the taken name ([[D-06 Yearly rename, old name freed, case-insensitive]]). Not available yet: the backend returns no suggestions today.

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
- [ ] No switch on this screen makes a value public; the opt-in lives on each Ring's "what it shows" ([[S-17 Ring Projection Story]]).

### S5 · Rename my Pin (profile editor, reached from [[Screen Index#s68|s68]])

**As an** owner **I want** to change my handle **so that** my badge and lookups follow my new name.

Acceptance criteria:
- [ ] The same live availability check as S1; `PATCH /profiles/:id { pinName }`; 409 `E_PROFILE_02` inline.
- [ ] The copy says the old handle stops resolving at once (`GET /views/pin/:old` becomes a 404 for everyone) and **becomes free for anyone to claim**: nothing redirects to the new name, and a badge or link printed with the old name may later lead to someone else ([[D-06 Yearly rename, old name freed, case-insensitive]]).
- [ ] A handle can be changed **once a year**; the screen says when the next change is allowed, and a rename inside the year is refused with a domain error shown inline. Not available yet: today a rename is unlimited.
- [ ] A change of capitals only (`SaraAz` → `saraaz`) is the same name and is not a rename.
- [ ] Taken names offer suggestions as in S1.

### S8 · My work details, once (profile editor, reached from [[Screen Index#s68|s68]])

**As an** owner **I want** to write my headline, role, company, location, photo and bio once **so that** every Ring shows them without my retyping them ([[D-02 One main profile every Ring starts from]]).

Acceptance criteria:
- [ ] The editor has a "work" section with headline, role, company, location, photo and bio; these six are the whole main profile, nothing else is added.
- [ ] Every Ring shows these values unless the Ring changed a field for itself ([[S-17 Ring Projection Story]] S3); a Ring that changed a field keeps its own value when I change the main one.
- [ ] My full name is the same in every Ring; no Ring changes it.
- [ ] Imports fill this section, not one Ring ([[S-08 Onboarding Imports Story]]).
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
- [ ] The look-up itself and the one-message 404 are in [[S-19 View As & Pin Views Story]].

### S9 · Sign-up keeps what I typed (*Profile basics*, no screen id yet)

*From T-078 Main profile fields from D-02 (status then: To do), merged 2026-10-27.*

**As a** new user **I want** the headline, company, location and photo I enter during sign-up to be on my profile **so that** I do not type them again and my first Ring already shows them.

Acceptance criteria:
- [ ] Right after `POST /auth/complete-registration` returns, the client sends what *Profile basics* collected to `PATCH /profiles/:id` on the new default profile; a field left empty is not sent.
- [ ] The photo is uploaded with `POST /files` first and sent as its file id; until [[S-06 Files Upload Story|Files Upload · showing files]] ships it shows as initials everywhere.
- [ ] A failure here never undoes the account: the values are kept on the phone and sent again on the next launch, or edited on Me.
- [ ] Imports fill the same fields ([[S-08 Onboarding Imports Story|Onboarding Imports · S7]], [[S-08 Onboarding Imports Story|Onboarding Imports · S8]]): not available yet.

### S10 · See and change my main profile ([[Screen Index#s68|s68]])

**As a** signed-in user **I want** to see and edit my headline, role, company, location, photo and bio on Me **so that** one change reaches every Ring that follows it.

Acceptance criteria:
- [ ] `GET /profiles` (default first) returns the six fields, `null` when not set; the Me header shows headline and company under the name.
- [ ] Each field is changed with `PATCH /profiles/:id`, sending only that field; `null` clears it. The response replaces the held and saved profile.
- [ ] Full name is edited here too and is the same on every Ring; no Ring can change it.
- [ ] The limits the backend sets (length per field) are checked on the client before sending; a 400 shows under the field.

### S11 · Rings start from the main profile ([[Screen Index#s23|s23]])

**As a** Ring owner **I want** a new Ring to show my main values until I change them for that Ring **so that** I set up a Ring without retyping who I am.

Acceptance criteria:
- [ ] The main values are what "Inherit from your Pin" on s23 refers to.
- [ ] How each Ring follows or overrides each field is [[D-05 Inherit per field, copy without members]], built on [[F-10 Ring Projection]]: not in this task.
- [ ] The main profile itself is never shown to another person: a viewer only ever sees a Ring's projection.

### S12 · Change my Pin name (profile editor, from [[Screen Index#s68|s68]])

*From T-079 Enforce the once-a-year Pin name rename (status then: To do), merged 2026-10-27.*

**As a** signed-in user **I want** to change my Pin name and know when I can change it again **so that** I am never surprised by a refusal.

Acceptance criteria:
- [ ] The first rename after sign-up is allowed (claiming at s06 is not a rename); `PATCH /profiles/:id { pinName }` still checks the name is free (409 `E_PROFILE_02`).
- [ ] After a rename, the profile says when the next one is allowed; the editor shows it next to the name ("You can change it again on 26 Oct 2027").
- [ ] A rename within a year of the last one is refused with its own error code; the editor says "You can change your Pin name once a year. Next change: <date>." and keeps the current name.
- [ ] A change of capitals only is not a rename and is not counted.
- [ ] The old name is free for anyone at once, as today; nothing redirects to the new one.

### S13 · Claim at sign-up ([[Screen Index#s06|s06]])

**As a** new user **I want** the "once a year" promise to be true **so that** I choose carefully, knowing I can still change it once.

Acceptance criteria:
- [ ] s06's copy stays "You can change it once a year."; claiming the name does not start the year.

## States and motion the design asks for

- State on s06: typing, checking, available, taken, invalid format, taken-at-submit.
- State in the editor: saving, cleared sensitive field, default badge on the profile list.
- Motion: s06 is one step of the onboarding ring-fill; availability feedback is an inline state change, no extra motion. Reduced motion: no change needed.
- (Profiles & Pin Name · S9–S11) *Profile basics*: every field optional except the name; the photo picker shows the chosen photo at once.
- (Profiles & Pin Name · S9–S11) Me: an empty field reads "Add"; saving shows the loader on that field only.
- (Profiles & Pin Name · S12–S13) Editor: the Pin-name row shows the next allowed date when it is in the future, nothing extra otherwise.
- (Profiles & Pin Name · S12–S13) Refused rename: the message under the field; the field keeps the current name.

## Rules the backend already enforces

- Uniqueness is global and case-insensitive on `pinNameNormalized`; the original casing is kept for display. The availability route is public and answers only a boolean.
- `POST /profiles` and a `PATCH` that changes the handle run the check and the write in one transaction; two concurrent claims cannot both win.
- The first profile is created inside `completeRegistration`'s transaction and is the default; one default per account (partial unique index); `POST /profiles/:id/default` demotes then promotes in one transaction.
- `DELETE /profiles/:id` is a soft delete and refuses the default (409 `E_PROFILE_03`).
- The three sensitive fields are nullable; `null` clears. Whether an audience sees them is decided per Ring in `RingProfileService.toView`, nowhere else.
- These endpoints return the caller's own profiles only; another person is reachable through `/views/…`.
- (Profiles & Pin Name · S9–S11) `PATCH /profiles/:id` sends only the keys it changes; unknown keys are a 400 ([[BI-04 Profiles & Pin Name Backend Integration]]).
- (Profiles & Pin Name · S9–S11) Visibility goes through `RingAccessService`: a person's profile is reachable only through a Ring projection; there is no `GET /users/:id`.
- (Profiles & Pin Name · S9–S11) Uploads: `POST /files` exists; the bytes can't be fetched back until [[S-06 Files Upload Story|Files Upload · showing files]].
- (Profiles & Pin Name · S12–S13) Pin names are unique globally and ignore capitals (`pinNameNormalized`); 3–30 letters, digits, `.`, `_`; sent without the `!` ([[BI-04 Profiles & Pin Name Backend Integration]]).
- (Profiles & Pin Name · S12–S13) A handle change re-checks uniqueness in the same transaction as the write.

## Open questions

- Decided: [[D-02 One main profile every Ring starts from]] (the work section, S8) and [[D-06 Yearly rename, old name freed, case-insensitive]] (S1 suggestions, S5 limit). Building them is not ticketed yet.
- Whether a Ring may change **role** was not asked; until product says otherwise it follows headline (D-02, *Still open*).
- Whether the first year counts from sign-up or from the first rename; the natural reading is that the first rename is free (D-06, *Still open*).
- (Profiles & Pin Name · S9–S11) **Role** was left out of D-02's per-Ring table; until product says otherwise it behaves like headline (D-02 *Still open*).
- (Profiles & Pin Name · S9–S11) Which main-profile fields an import may overwrite without asking is [[F-05 Onboarding Imports]]' story to say.
- (Profiles & Pin Name · S9–S11) Sign-up's *Profile basics* step has no screen id in [[Screen Index]]; the design team should give it one.
- (Profiles & Pin Name · S12–S13) D-06 left open whether the year starts at sign-up or at the first rename; this task takes the natural reading (first rename free). Product can say otherwise before the task starts.
- (Profiles & Pin Name · S12–S13) What a printed badge or saved link does after its name is released: [[F-18 Badge & QR]], [[ND-12 What the badge QR encodes]].

