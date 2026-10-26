---
type: story
code: T-063
scope: task
feature: error-contract
module: platform
status: approved
screens: []
depends: []
affects: []
related: ["T-063", "Error Contract Story", "Error Contract", "D-19"]
pending: []
approvedBy: "khaled"
approvedAt: 2026-10-25
owner: "omar"
created: 2026-10-18
updated: 2026-10-26
tags: [story, story/approved, module/platform, layer/business]
task: T-063
---

# T-063 · Put the ErrorCode on the error body · User Story

**Task:** [[T-063 Put the ErrorCode on the error body]] · **Feature:** [[Error Contract]] · **Feature-level note:** [[Error Contract Story]] · **Status:** Approved 2026-10-25 by khaled · **Frontend Requirements:** [[T-063 Frontend Requirements]] · **Backend Integration:** [[T-063 Backend Integration]] · **Verified by:** [[T-063 QA Backend]], [[T-063 QA Frontend]]

> Derived from the task [[T-063 Put the ErrorCode on the error body]]; **approved by khaled on 2026-10-25**, so the chain below it is unblocked and [[T-063 Frontend Requirements]] can be written. The feature-level story is [[Error Contract Story]]; this note says what the user gets from this task in particular. It is `verified` — fulfilled — only when [[T-063 QA Backend]] and [[T-063 QA Frontend]] are both `passing` with nothing left in `pending`, and only the PM sets that.

Every service throws `new HttpException({ ErrorCode, message }, status)` and the Frontend guide tells clients to **branch on the code and display the message**. But `AllExceptionsFilter` (`src/common/filters/all-exceptions.filter.ts`) copies only `message` and `error` from the exception response into the body it sends. The wire body is `{ statusCode, message, error, path, timestamp }` and `error` reads `"HttpException"` for every domain error. The stable code never reaches the client.

## Persona

Any signed-in or signing-up user at the moment something they did is refused: a Ring name already used, a wrong one-time code, the default Ring they tried to delete. Behind them, the frontend developer who decides what each refusal looks like and needs one reliable thing to branch on.

## Stories

### S1 · A taken Ring name is said under the field ([[Screen Index#s18|s18]], Rename)

**As a** Ring owner **I want** "You already have a Ring with that name" under the name field when I create or rename a Ring **so that** I know what to change instead of reading a generic toast.

Acceptance criteria:
- [ ] Create and rename with a name already used answer 409 with `errorCode: "E_RING_01"`.
- [ ] The app shows its own copy under the field and, in the New Ring wizard, goes back to the name step.

### S2 · Deleting the default Ring says why it can't

**As a** Ring owner **I want** to be told my default Ring can't be deleted **so that** I make another one the default first.

Acceptance criteria:
- [ ] `DELETE /rings/:id` on the default Ring answers 409 with `errorCode: "E_RING_04"`.
- [ ] The app shows a snack bar saying so; the Ring stays.

### S3 · Each one-time code failure reads differently ([[Screen Index#s02|s02]])

**As a** user signing in or up **I want** a wrong code, too many tries and an unavailable account to read differently **so that** I know whether to retype, ask for a new code or start again.

Acceptance criteria:
- [ ] Wrong or expired: `E_AUTH_05`. The boxes shake and empty.
- [ ] Too many tries: `E_AUTH_06`. The boxes lock until a new code is sent.
- [ ] Suspended or unfinished account on sign-in: `E_AUTH_03`. The app offers to sign up again; the two causes stay indistinguishable.
- [ ] Sign-up for an existing account: `E_AUTH_01`. The app moves to sign-in.

### S4 · Claiming a pin name that's taken ([[Screen Index#s06|s06]])

**As a** new user **I want** to be told my pin name is taken **so that** I pick another.

Acceptance criteria:
- [ ] Complete registration with a taken pin name answers with `errorCode: "E_PROFILE_02"`; an account already set up answers `E_AUTH_08` and the app signs in instead.

### S5 · Form errors still list every field

**As a** user filling a form **I want** every field that failed to be named **so that** I fix them all at once.

Acceptance criteria:
- [ ] A validation failure from the `ValidationPipe` carries **no** `errorCode`; `message` stays a string array.
- [ ] A domain error carries `errorCode` and a string `message`.

## States and motion the design asks for

- No new state. The design already draws each one; today the app reaches them by guessing from the status (a 409 on create is "name taken") and this task makes them exact.

## Rules the backend already enforces

- The body keeps `{ statusCode, message, error, path, timestamp }`; `errorCode` is added, never replaces a key.
- `errorCode` is set only when the exception carried one; absent otherwise.
- A retired code is never reused (`E_AUTH_02`, `E_USER_04`).
- Enumeration resistance stays: `E_AUTH_03` covers both suspended and never-finished accounts.

## Open questions

- `E_RING_01` also means a disallowed Ring type and `E_RING_PROFILE_03` covers a bad link, a missing link and a missing info block (see [[Error Contract Story]] S3). No task splits them yet; until one does, the app treats `E_RING_01` as "name taken" only because it never sends a refused type.
