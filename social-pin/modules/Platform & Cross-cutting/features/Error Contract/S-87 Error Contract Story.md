---
id: S-87
type: story
module: platform
feature: error-contract
status: approved
scope: feature
screens: []
approvedBy: "khaled"
approvedAt: 2026-10-25
owner: "khaled"
created: 2026-10-18
updated: 2026-10-29
tags: [story, story/approved, module/platform, layer/business]
---

# Error Contract · User Story

**Feature:** [[F-35 Error Contract]] · **Status:** Approved 2026-10-25 by khaled · **Frontend Requirements:** [[FR-35 Error Contract Frontend Requirements]] · **API Integration:** not yet (backend not built)

Every error state in the app, from "invalid or expired code" on s02 to "this Ring was deleted", is rendered from one error body. The frontend developer needs two things from it: a stable code to branch on and a message to display. Today the body has the message but drops the code, so the client branches on status and endpoint instead. There is no screen; every screen depends on this.

**Task stories:** [[S-87 Error Contract Story|Error Contract · S4–S8]] (Error Contract · S4–S8: the stable code on the wire in S2) · [[S-87 Error Contract Story|Error Contract · S9–S11]] (Error Contract · S9–S11: splitting the codes that carry two meanings, S3; it waits on Error Contract · S4–S8). S1 is already true.

## Persona

The frontend developer writing the error layer once, and the product owner who wants the same mistake to read the same way on every screen.

## Stories

### S1 · One body shape everywhere

**As a** frontend developer **I want** every error, from a 400 to a 500, to arrive as `{ statusCode, message, error, path, timestamp }` **so that** one parser handles the whole API.

Acceptance criteria:
- [ ] Domain errors, validation errors, auth failures and unexpected exceptions all use the same keys.
- [ ] A validation failure's `message` is a string array, one entry per failed constraint; unknown body keys are a 400.
- [ ] A Prisma error never reaches the body; anything that is not an `HttpException` is a 500 `"Internal server error"`.

### S2 · A stable code on the wire

**As a** frontend developer **I want** the `ErrorCode` the service threw to be on the body **so that** I switch on `E_AUTH_05`, not on the English message.

Acceptance criteria:
- [ ] The body carries the code (Error Contract · S4–S8 proposes `errorCode`, camelCase) when the exception had one, and omits it otherwise.
- [ ] `error` stops reading `"HttpException"` for every domain error.
- [ ] Codes are never reused after retirement, so a switch written today stays valid.

### S3 · One code, one meaning

**As the** product owner **I want** each code to mean one thing **so that** the UI copy keyed on it is never wrong.

Acceptance criteria:
- [ ] `E_RING_01` (name clash *and* disallowed type) and `E_RING_PROFILE_03` (bad link, missing link *and* missing info block) are split before the client switches on them — [[S-87 Error Contract Story|Error Contract · S9–S11]].

### S4 · A taken Ring name is said under the field ([[Screen Index#s18|s18]], Rename)

*From T-063 Put the ErrorCode on the error body (status then: To do), merged 2026-10-27.*

**As a** Ring owner **I want** "You already have a Ring with that name" under the name field when I create or rename a Ring **so that** I know what to change instead of reading a generic toast.

Acceptance criteria:
- [ ] Create and rename with a name already used answer 409 with `errorCode: "E_RING_01"`.
- [ ] The app shows its own copy under the field and, in the New Ring wizard, goes back to the name step.

### S5 · Deleting the default Ring says why it can't

**As a** Ring owner **I want** to be told my default Ring can't be deleted **so that** I make another one the default first.

Acceptance criteria:
- [ ] `DELETE /rings/:id` on the default Ring answers 409 with `errorCode: "E_RING_04"`.
- [ ] The app shows a snack bar saying so; the Ring stays.

### S6 · Each one-time code failure reads differently ([[Screen Index#s02|s02]])

**As a** user signing in or up **I want** a wrong code, too many tries and an unavailable account to read differently **so that** I know whether to retype, ask for a new code or start again.

Acceptance criteria:
- [ ] Wrong or expired: `E_AUTH_05`. The boxes shake and empty.
- [ ] Too many tries: `E_AUTH_06`. The boxes lock until a new code is sent.
- [ ] Suspended or unfinished account on sign-in: `E_AUTH_03`. The app offers to sign up again; the two causes stay indistinguishable.
- [ ] Sign-up for an existing account: `E_AUTH_01`. The app moves to sign-in.

### S7 · Claiming a pin name that's taken ([[Screen Index#s06|s06]])

**As a** new user **I want** to be told my pin name is taken **so that** I pick another.

Acceptance criteria:
- [ ] Complete registration with a taken pin name answers with `errorCode: "E_PROFILE_02"`; an account already set up answers `E_AUTH_08` and the app signs in instead.

### S8 · Form errors still list every field

**As a** user filling a form **I want** every field that failed to be named **so that** I fix them all at once.

Acceptance criteria:
- [ ] A validation failure from the `ValidationPipe` carries **no** `errorCode`; `message` stays a string array.
- [ ] A domain error carries `errorCode` and a string `message`.

### S9 · A refused Ring name and a refused Ring type read differently ([[Screen Index#s18|s18]])

*From T-067 Split E_RING_01 and E_RING_PROFILE_03 (status then: To do), merged 2026-10-27.*

**As a** Ring owner **I want** "You already have a Ring with that name" when the name is taken and a different sentence when the Ring type is not allowed **so that** I change the right thing.

Acceptance criteria:
- [ ] A name clash answers with its own code; a disallowed Ring type answers with a different one. Neither is `E_RING_01` for both.
- [ ] The app shows the name message under the name field and the type message on the type step; it stops inferring "name taken" from the endpoint.
- [ ] The workaround in [[S-87 Error Contract Story|Error Contract · S4–S8]] — treating `E_RING_01` as "name taken" because the client never sends a refused type — is removed.

### S10 · Each projection refusal says which one it was

**As a** Ring owner editing what a Ring shows **I want** a bad link value, a link that no longer exists and a missing info block to read differently **so that** I know whether to fix what I typed or reload the page.

Acceptance criteria:
- [ ] A bad link value, a missing link and a missing info block each answer with their own code, not `E_RING_PROFILE_03` for all three.
- [ ] A link id from another Ring's projection still answers "not found" and never says the row exists elsewhere.

### S11 · A code written against today keeps its meaning

**As a** frontend developer **I want** a retired code never to come back with a new meaning **so that** a switch I wrote stays correct.

Acceptance criteria:
- [ ] Every number taken away by the split is retired, not reassigned ([[API Conventions]]).
- [ ] The new codes and their single meanings are listed in [[BD-35 Error Contract Backend Delivery]] and in the Frontend API Guide's error table.

## States and motion the design asks for

- None. The design draws error states per screen; this feature supplies what they branch on.
- (Error Contract · S4–S8) No new state. The design already draws each one; today the app reaches them by guessing from the status (a 409 on create is "name taken") and this task makes them exact.
- (Error Contract · S9–S11) No new state. The design already draws the field error, the wizard's type step and the projection editor's row errors; today several of them are reached by one code.

## Rules the backend already enforces

- Services throw `new HttpException({ ErrorCode, message }, status)`; 41 codes exist across AUTH, USER, PROFILE, RING, RING_MEMBER, RING_PROFILE, RING_ACCESS and FILE in one enum.
- `AllExceptionsFilter` is wired by `configureApp` for the app and every e2e spec; it copies `message` and `error` but not `ErrorCode` ([[S-87 Error Contract Story|Error Contract · S4–S8]]).
- Enumeration resistance is part of the contract: one body for login failures, one 404 for missing / not shared / blocked.
- (Error Contract · S4–S8) The body keeps `{ statusCode, message, error, path, timestamp }`; `errorCode` is added, never replaces a key.
- (Error Contract · S4–S8) `errorCode` is set only when the exception carried one; absent otherwise.
- (Error Contract · S4–S8) A retired code is never reused (`E_AUTH_02`, `E_USER_04`).
- (Error Contract · S4–S8) Enumeration resistance stays: `E_AUTH_03` covers both suspended and never-finished accounts.
- (Error Contract · S9–S11) Services throw `new HttpException({ ErrorCode, message }, status)` from one enum of 41 codes.
- (Error Contract · S9–S11) A link id from another projection is simply not found, scoped to the Ring; the split must not make a row from another Ring distinguishable from one that never existed.
- (Error Contract · S9–S11) Enumeration resistance stays: a split never tells a caller about something they may not see.

## Open questions

- No decision note names this feature. The wire name of the code (`errorCode`) is set by Error Contract · S4–S8.
- (Error Contract · S4–S8) `E_RING_01` also means a disallowed Ring type and `E_RING_PROFILE_03` covers a bad link, a missing link and a missing info block (see [[S-87 Error Contract Story]] S3). No task splits them yet; until one does, the app treats `E_RING_01` as "name taken" only because it never sends a refused type.
- (Error Contract · S9–S11) How many codes each split becomes, and their names, follow the enum's conventions and are the backend's to propose in [[BD-35 Error Contract Backend Delivery|Error Contract · S9–S11]]; product only asks that each meaning has one.
- (Error Contract · S9–S11) Nothing is blocked on an answer: the ticket waits on [[S-87 Error Contract Story|Error Contract · S4–S8]] first.

