---
type: story
code: profiles
scope: feature
feature: profiles
module: identity
status: approved
screens: [s05b, s06, s23, s44, s68]
approvedBy: "Omar Fostok"
approvedAt: 2026-10-29
created: 2026-10-18
updated: 2026-10-29
owner: "Omar Fostok"
related: ["D-02 One main profile every Ring starts from", "D-05 Inherit per field, copy without members", "D-06 Yearly rename, old name freed, case-insensitive", "ND-22 Public web page by Pin name", "S-01 Account Story", "S-08 Onboarding Imports Story", "S-17 Ring Projection Story", "S-19 View As & Pin Views Story", "S-89 Gemma AI Story", "F-18 Badge & QR"]
tags: [story, story/approved, module/identity, layer/business]
---

# Profiles & Pin Name · User Story

> ⚠ Affected by [[S-17 Ring Projection Story]] (2026-10-29): Me's privacy rows (S4) now **list and switch Rings**: each of Birthdate, Gender, Marital status shows which Rings show it ("Family Ring only") and opens the value plus a list of my Rings with a switch each; the same switches as each Ring's s24 (`showBirthdate`, `showGender`, `showMaritalStatus`; [[S-17 Ring Projection Story|Ring Projection · S4]]).

**Feature:** [[F-07 Profiles & Pin Name]] · **Status:** Approved 2026-10-29 by Omar Fostok (first approved 2026-10-25 by khaled; reworked 2026-10-29 by the design review: S1–S3, S7, S9, S10, S12 changed; S5, S6, S8 merged or moved) · **Frontend Requirements:** [[FR-07 Profiles & Pin Name Frontend Requirements]] · **Backend Integration:** [[BI-04 Profiles & Pin Name Backend Integration]]

A person claims a `!handle` that is theirs across the whole product, the thing printed on a badge and typed into Discover, and keeps the canonical facts about themselves (full name, nickname, birthdate, gender, marital status, and the work details of the main profile: headline, role, company, location, photo, bio) in one place. Rings then decide what each audience gets. The Pin name is public by nature; the sensitive fields are private by default and opt-in per Ring. One profile per person in v1.

## Persona

A new user at *Profile basics* ([[Screen Index#s05b|s05b]]) and Claim your Pin ([[Screen Index#s06|s06]]) during sign-up, and later the same person editing their profile from the header of Me ([[Screen Index#s68|s68]]).

## Stories

### S1 · Claim your Pin ([[Screen Index#s06|s06]])

**As a** new user **I want** to type a handle and see at once whether it is free **so that** I leave onboarding with a Pin name I like.

Acceptance criteria:
- [ ] The field shows a fixed `!` prefix as decoration; the value sent never contains it.
- [ ] Client rule before any request: **3 to 30** characters, letters, digits, `.` and `_`; the hint reads the rule, not a regex. The design's counter "/24" is out of date: the rule is 30, as the backend and the app already enforce.
- [ ] A debounced (300 ms) `GET /profiles/pin-name/:pinName/availability` returns `{ pinName, available }`; the field shows a check or "Taken" without naming anyone.
- [ ] Case does not matter for availability (`SaraAz` = `saraaz`); the casing typed is what is displayed later.
- [ ] When available, the line reads "Available — socialpin.me/<handle>", as designed. It is **text, not a link**, until [[ND-22 Public web page by Pin name]] is decided and the page is built.
- [ ] Continue is enabled only on `available: true`; the ring progress indicator fills a segment on success.
- [ ] Suggestion chips are built **on the phone, only from my own name** (what I typed and my full name), each checked as free; a suggestion never reveals or derives from who holds a taken name ([[D-06 Yearly rename, old name freed, case-insensitive]]).
- [ ] The design's **"Gemma: suggest"** chip is [[S-89 Gemma AI Story|Gemma AI · S6]]'s and is **not shown** until Gemma is built.
- [ ] The "Your code is ready · Temporary and rotating…" card on s06 is [[F-18 Badge & QR]]'s, not this story's.

### S2 · Taken at the last moment ([[Screen Index#s06|s06]])

**As a** new user **I want** a clear recovery when the handle was taken between the check and submit **so that** I am not thrown back to the start.

Acceptance criteria:
- [ ] A 409 `E_PROFILE_02` from `POST /auth/complete-registration` keeps the user on s06 with the field focused and the message "That Pin name was just taken".
- [ ] The full name typed on *Profile basics* (s05b, S9) is retained.

### S3 · Edit my name and nickname (the profile editor, opened from the Me header, [[Screen Index#s68|s68]])

**As an** owner **I want** to edit my full name and nickname **so that** every Ring that follows them shows the right ones.

Acceptance criteria:
- [ ] The **profile editor** is opened by tapping the **header card on Me** (photo, name, "!handle · N Rings · N connections", ›). It holds the full name, the nickname, the Pin name (S12) and the work details (S10). **For the designer:** the editor is not drawn; it needs designing and a screen id.
- [ ] The editor loads `GET /profiles` and edits `data[0]` (the default, and in v1 the only, profile) with `PATCH /profiles/:id`.
- [ ] `fullName` ≤ 120. The full name is the same in every Ring.
- [ ] **"What friends call you"**: the nickname, optional, ≤ 60, sent as `nickname`; `null` clears it. It's extra, never a replacement for the full name.
- [ ] **Rings show the nickname** unless a Ring sets its own: a Ring's projection has its own `nickname`, and `null` there follows the profile's ([[D-05 Inherit per field, copy without members]]). **For the designer:** where the nickname sits on a Ring's card (the viewer's card on s31 and s44, [[S-19 View As & Pin Views Story]]) and the Ring's own nickname on s23 ([[S-17 Ring Projection Story]]) are not drawn.
- [ ] A save returns the updated `ProfileEntity` and the editor refetches.
- [ ] The copy explains that a Ring's `displayName` falls back to this full name, never to the nickname.

### S4 · Sensitive base fields (Me, [[Screen Index#s68|s68]])

**As an** owner **I want** to store my birthdate, gender and marital status once **so that** I can share them with the Rings I choose and no other.

Acceptance criteria:
- [ ] Each field is labelled "shared only with Rings you choose" and has an explicit Clear action that sends `null`.
- [ ] `birthdate` is an ISO date; `gender` and `maritalStatus` are enum pickers from `/docs`.
- [ ] No switch on this screen makes a value public; the opt-in lives on each Ring's "what it shows" ([[S-17 Ring Projection Story]]).

### S5 · Rename my Pin

*Merged into S12 on 2026-10-29 (design review): the same rename, once a year, with the old name freed.*

### S6 · Several profiles and the default

*Moved to Open questions on 2026-10-29 (design review): one profile per person in v1.*

### S7 · My Pin name is how others find me (journey, [[Screen Index#s44|s44]])

**As an** owner **I want** to know what my handle does for others **so that** I understand what claiming it means.

Acceptance criteria:
- [ ] Me shows the handle in its header (Account's, [[S-01 Account Story]]). No separate share hint: the design has none.
- [ ] The look-up itself and the one-message 404 are in [[S-19 View As & Pin Views Story]]; a public web page by Pin name is [[ND-22 Public web page by Pin name]].

### S8 · My work details, once

*Merged into S10 on 2026-10-29 (design review): the same work details, edited in the profile editor.*

### S9 · Sign-up keeps what I typed (*Profile basics*, [[Screen Index#s05b|s05b]])

*From T-078 Main profile fields from D-02 (status then: To do), merged 2026-10-27; screen id given 2026-10-29.*

**As a** new user **I want** the name, headline, company, location and photo I enter during sign-up to be on my profile **so that** I do not type them again and my first Ring already shows them.

Acceptance criteria:
- [ ] ***Profile basics* (s05b)** is built in the app and not drawn in the prototype (**for the designer:** it goes between s03 / s05 and s06). Title "Tell people who you are"; **full name** required; photo (camera or library), headline, company and location optional.
- [ ] Reached from "Fill it in myself" on s03; from Edit and each "Add" on s05 (it returns to s05 on Continue, so the import is still confirmed); from Skip on the portfolio step; and after a failed import. Continue → s06.
- [ ] The full name is sent as `fullName` on `POST /auth/complete-registration`.
- [ ] Right after `POST /auth/complete-registration` returns, the client sends the rest to `PATCH /profiles/:id` on the new default profile; a field left empty is not sent.
- [ ] The photo is uploaded with `POST /files` first and sent as its file id; until [[ND-16 Viewer access to file bytes]] is decided and served it shows as initials everywhere.
- [ ] A failure here never undoes the account: the values are kept on the phone and sent again on the next launch, or edited in the profile editor.
- [ ] Imports fill the same fields ([[S-08 Onboarding Imports Story|Onboarding Imports · S7]], [[S-08 Onboarding Imports Story|Onboarding Imports · S8]]): not available yet.

### S10 · See and change my main profile (the profile editor, from the Me header, [[Screen Index#s68|s68]])

**As a** signed-in user **I want** to write my headline, role, company, location, photo and bio once, and change them in one place **so that** one change reaches every Ring that follows it ([[D-02 One main profile every Ring starts from]]).

Acceptance criteria:
- [ ] The profile editor (S3) has a "work" section with headline, role, company, location, photo and bio; these six are the whole main profile, nothing else is added.
- [ ] `GET /profiles` (default first) returns the six fields, `null` when not set.
- [ ] Each field is changed with `PATCH /profiles/:id`, sending only that field; `null` clears it. The response replaces the held and saved profile.
- [ ] Every Ring shows these values unless the Ring changed a field for itself ([[S-17 Ring Projection Story]] S3); a Ring that changed a field keeps its own value when I change the main one.
- [ ] Full name is edited in the same editor and is the same on every Ring; no Ring can change it.
- [ ] The limits the backend sets (length per field) are checked on the client before sending; a 400 shows under the field.
- [ ] Imports fill this section, not one Ring ([[S-08 Onboarding Imports Story]]).
- [ ] The Me header is not this story's: it shows photo, name and "!handle · N Rings · N connections" ([[S-01 Account Story]]); headline and company are seen in the editor and on the Rings.
- [ ] Not available yet: `Profile` has none of these six fields today.

### S11 · Rings start from the main profile ([[Screen Index#s23|s23]])

**As a** Ring owner **I want** a new Ring to show my main values until I change them for that Ring **so that** I set up a Ring without retyping who I am.

Acceptance criteria:
- [ ] The main values are what "Inherit from your Pin" on s23 refers to.
- [ ] How each Ring follows or overrides each field is [[D-05 Inherit per field, copy without members]], built on [[F-10 Ring Projection]]: not in this story.
- [ ] The main profile itself is never shown to another person: a viewer only ever sees a Ring's projection.

### S12 · Change my Pin name (the profile editor, from the Me header, [[Screen Index#s68|s68]])

*From T-079 Enforce the once-a-year Pin name rename (status then: To do), merged 2026-10-27; S5 merged in 2026-10-29.*

**As a** signed-in user **I want** to change my Pin name and know when I can change it again **so that** my badge and lookups follow my new name and I am never surprised by a refusal.

Acceptance criteria:
- [ ] The same live availability check as S1 (3–30, suggestions from my own name); `PATCH /profiles/:id { pinName }`; 409 `E_PROFILE_02` inline.
- [ ] The first rename after sign-up is allowed (claiming at s06 is not a rename).
- [ ] After a rename, the profile says when the next one is allowed; the editor shows it next to the name ("You can change it again on 26 Oct 2027").
- [ ] A rename within a year of the last one is refused with its own error code; the editor says "You can change your Pin name once a year. Next change: <date>." and keeps the current name. Not available yet: today a rename is unlimited.
- [ ] A change of capitals only (`SaraAz` → `saraaz`) is the same name and is not a rename, and is not counted.
- [ ] The copy says the old handle stops resolving at once (`GET /views/pin/:old` becomes a 404 for everyone) and **becomes free for anyone to claim**: nothing redirects to the new name, and a badge or link printed with the old name may later lead to someone else ([[D-06 Yearly rename, old name freed, case-insensitive]]; what a public web page does after a rename is [[ND-22 Public web page by Pin name]]).

### S13 · Claim at sign-up ([[Screen Index#s06|s06]])

**As a** new user **I want** the "once a year" promise to be true **so that** I choose carefully, knowing I can still change it once.

Acceptance criteria:
- [ ] s06's copy stays "You can change it once a year."; claiming the name does not start the year.

## States and motion the design asks for

- State on s06: typing, checking, available ("Available — socialpin.me/<handle>", as text), taken, invalid format, taken-at-submit, suggestions.
- State on s05b: name missing (error under the field), photo picked / removed, optional fields empty.
- State in the profile editor: saving (the loader on that field only), an empty field reads "Add", cleared sensitive field, the next allowed rename date when it is in the future, a refused rename (the message under the field; the field keeps the current name).
- Motion: s05b and s06 are steps of the onboarding ring-fill; availability feedback is an inline state change, no extra motion. Reduced motion: no change needed.

## Rules the backend already enforces

- Uniqueness is global and case-insensitive on `pinNameNormalized`; the original casing is kept for display. The availability route is public and answers only a boolean. Pin names are 3–30 letters, digits, `.`, `_`, sent without the `!` ([[BI-04 Profiles & Pin Name Backend Integration]]).
- `POST /profiles` and a `PATCH` that changes the handle run the check and the write in one transaction; two concurrent claims cannot both win.
- The first profile is created inside `completeRegistration`'s transaction and is the default; one default per account (partial unique index).
- The three sensitive fields are nullable; `null` clears. Whether an audience sees them is decided per Ring in `RingProfileService.toView`, nowhere else.
- `nickname` (≤ 60) is on the profile; a Ring's projection has its own `nickname`, and `null` there falls back to the profile's ([[BI-07 Ring Projection Backend Integration]]).
- These endpoints return the caller's own profiles only; another person is reachable through `/views/…`. Visibility goes through `RingAccessService`; there is no `GET /users/:id`.
- `PATCH /profiles/:id` sends only the keys it changes; unknown keys are a 400.
- Uploads: `POST /files` exists; the bytes can't be fetched back until [[ND-16 Viewer access to file bytes]].

## Open questions

- Decided: [[D-02 One main profile every Ring starts from]] (the work section, S10) and [[D-06 Yearly rename, old name freed, case-insensitive]] (S1 suggestions, S12 limit). Building them: S9–S11 and S12–S13.
- Whether a Ring may change **role** was not asked; until product says otherwise it follows headline (D-02, *Still open*).
- D-06 left open whether the year starts at sign-up or at the first rename; this story takes the natural reading (first rename free). Product can say otherwise before S12 is built.
- Which main-profile fields an import may overwrite without asking is [[F-05 Onboarding Imports]]' story to say.
- **Public web page by Pin name** (`socialpin.me/<pinName>`): [[ND-22 Public web page by Pin name]]; it blocks this story until decided, though only S1's link waits on it.
- **Several profiles per account** (Personal, Professional, Business) and choosing the default: later, not in v1. The backend supports it (`POST /profiles`, `POST /profiles/:id/default`, `DELETE /profiles/:id`, 409 `E_PROFILE_03`); the app uses the default profile only. A business identity is a company ([[F-15 Companies]], s63), not a second profile.
- **The nickname on Rings**: shown to every Ring by default, or only to Rings that switch it on (like the sensitive fields)? Until product says otherwise, it follows the main profile like the bio: shown unless a Ring changes it. For the designer, with S3.
- What a printed badge or saved link does after its name is released: [[F-18 Badge & QR]], [[ND-12 What the badge QR encodes]].
