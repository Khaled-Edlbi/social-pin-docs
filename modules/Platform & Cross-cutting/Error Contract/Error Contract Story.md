---
type: story
code: error-contract
scope: feature
feature: error-contract
module: platform
status: draft
screens: []
owner: "omar"
updated: 2026-10-25
tags: [story, story/draft, module/platform, layer/business]
---

# Error Contract · User Story

**Feature:** [[Error Contract]] · **Status:** Draft (awaiting product sign-off) · **Frontend Requirements:** [[Error Contract Frontend Requirements]] · **API Integration:** not yet (backend not built)

Every error state in the app, from "invalid or expired code" on s02 to "this Ring was deleted", is rendered from one error body. The frontend developer needs two things from it: a stable code to branch on and a message to display. Today the body has the message but drops the code, so the client branches on status and endpoint instead. There is no screen; every screen depends on this.

**Task stories:** [[T-063 Story]] (T-063: the stable code on the wire in S2). S3, splitting the codes that carry two meanings, has no task yet.

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
- [ ] The body carries the code (T-063 proposes `errorCode`, camelCase) when the exception had one, and omits it otherwise.
- [ ] `error` stops reading `"HttpException"` for every domain error.
- [ ] Codes are never reused after retirement, so a switch written today stays valid.

### S3 · One code, one meaning

**As the** product owner **I want** each code to mean one thing **so that** the UI copy keyed on it is never wrong.

Acceptance criteria:
- [ ] `E_RING_01` (name clash *and* disallowed type) and `E_RING_PROFILE_03` (bad link, missing link *and* missing info block) are split before the client switches on them.

## States and motion the design asks for

- None. The design draws error states per screen; this feature supplies what they branch on.

## Rules the backend already enforces

- Services throw `new HttpException({ ErrorCode, message }, status)`; 41 codes exist across AUTH, USER, PROFILE, RING, RING_MEMBER, RING_PROFILE, RING_ACCESS and FILE in one enum.
- `AllExceptionsFilter` is wired by `configureApp` for the app and every e2e spec; it copies `message` and `error` but not `ErrorCode` ([[T-063 Put the ErrorCode on the error body]]).
- Enumeration resistance is part of the contract: one body for login failures, one 404 for missing / not shared / blocked.

## Open questions

- No decision note names this feature. The wire name of the code (`errorCode`) is set by T-063.
