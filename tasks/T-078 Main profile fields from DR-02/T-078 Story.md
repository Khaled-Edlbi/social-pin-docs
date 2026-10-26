---
type: story
code: T-078
scope: task
feature: profiles
module: identity
status: approved
screens: [s05, s23, s68]
depends: ["DR-02 One main profile every Ring starts from"]
affects: []
related: ["DR-05 Inherit per field, copy without members", "T-062 Serve uploaded file bytes by id", "T-020 LinkedIn import → review → base profile", "T-020b Business card scan and portfolio URL import", "Onboarding Imports", "Ring Projection", "Files Upload", "Auth & Sign-up"]
pending: []
approvedBy: "omar"
approvedAt: 2026-10-26
created: 2026-10-26
updated: 2026-10-26
owner: "Omar Fostok"
tags: [story, story/approved, module/identity, layer/business]
task: T-078
---

# T-078 · Main profile fields from DR-02 · User Story

**Task:** [[T-078 Main profile fields from DR-02]] · **Feature:** [[Profiles & Pin Name]] · **Feature-level note:** [[Profiles & Pin Name Story]] · **Status:** Approved 2026-10-26 by omar · **Frontend Requirements:** [[T-078 Frontend Requirements]] · **Backend Integration:** [[T-078 Backend Integration]] · **Verified by:** [[T-078 QA Backend]], [[T-078 QA Frontend]]

A person writes their work details once, during sign-up or later on Me, and finds them on every Ring that has not been given its own: headline, role, company, location, photo and bio, as [[DR-02 One main profile every Ring starts from]] decided. Today none of these can be saved: sign-up asks for them and drops them. `approved` (👍) when product signs off (`approvedBy`, `approvedAt`); `verified` (✅ Fulfilled) set by the PM once every QA note of its scope is `passing` with nothing pending.

## Persona

A **personal user**, in two moments: the first minute, on sign-up's *Profile basics* step, typing how they want to be introduced; and later on Me, after a new job or a move, changing it once instead of Ring by Ring.

## Stories

### S1 · Sign-up keeps what I typed (*Profile basics*, no screen id yet)

**As a** new user **I want** the headline, company, location and photo I enter during sign-up to be on my profile **so that** I do not type them again and my first Ring already shows them.

Acceptance criteria:
- [ ] Right after `POST /auth/complete-registration` returns, the client sends what *Profile basics* collected to `PATCH /profiles/:id` on the new default profile; a field left empty is not sent.
- [ ] The photo is uploaded with `POST /files` first and sent as its file id; until [[T-062 Serve uploaded file bytes by id]] ships it shows as initials everywhere.
- [ ] A failure here never undoes the account: the values are kept on the phone and sent again on the next launch, or edited on Me.
- [ ] Imports fill the same fields ([[T-020 LinkedIn import → review → base profile]], [[T-020b Business card scan and portfolio URL import]]): not available yet.

### S2 · See and change my main profile ([[Screen Index#s68|s68]])

**As a** signed-in user **I want** to see and edit my headline, role, company, location, photo and bio on Me **so that** one change reaches every Ring that follows it.

Acceptance criteria:
- [ ] `GET /profiles` (default first) returns the six fields, `null` when not set; the Me header shows headline and company under the name.
- [ ] Each field is changed with `PATCH /profiles/:id`, sending only that field; `null` clears it. The response replaces the held and saved profile.
- [ ] Full name is edited here too and is the same on every Ring; no Ring can change it.
- [ ] The limits the backend sets (length per field) are checked on the client before sending; a 400 shows under the field.

### S3 · Rings start from the main profile ([[Screen Index#s23|s23]])

**As a** Ring owner **I want** a new Ring to show my main values until I change them for that Ring **so that** I set up a Ring without retyping who I am.

Acceptance criteria:
- [ ] The main values are what "Inherit from your Pin" on s23 refers to.
- [ ] How each Ring follows or overrides each field is [[DR-05 Inherit per field, copy without members]], built on [[Ring Projection]]: not in this task.
- [ ] The main profile itself is never shown to another person: a viewer only ever sees a Ring's projection.

## States and motion the design asks for

- *Profile basics*: every field optional except the name; the photo picker shows the chosen photo at once.
- Me: an empty field reads "Add"; saving shows the loader on that field only.

## Rules the backend already enforces

- `PATCH /profiles/:id` sends only the keys it changes; unknown keys are a 400 ([[Profiles & Pin Name Backend Integration]]).
- Visibility goes through `RingAccessService`: a person's profile is reachable only through a Ring projection; there is no `GET /users/:id`.
- Uploads: `POST /files` exists; the bytes can't be fetched back until [[T-062 Serve uploaded file bytes by id]].

## Open questions

- **Role** was left out of DR-02's per-Ring table; until product says otherwise it behaves like headline (DR-02 *Still open*).
- Which main-profile fields an import may overwrite without asking is [[Onboarding Imports]]' story to say.
- Sign-up's *Profile basics* step has no screen id in [[Screen Index]]; the design team should give it one.
