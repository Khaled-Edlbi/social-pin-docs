---
type: backend-delivery
code: error-contract
scope: feature
feature: error-contract
module: platform
status: in-progress
screens: []
created: 2026-10-15
updated: 2026-10-28
tags: [backend-delivery, backend-delivery/in-progress, module/platform, layer/backend]
---

# 🟡 Error Contract · Backend Delivery

**Feature:** [[F-35 Error Contract]] · **Status:** In progress · **Integration guide:** [[Error Contract Backend Integration]] · **Requirements:** [[FR-35 Error Contract Frontend Requirements]] · **QA:** [[Error Contract QA Backend]]

What the backend shipped for this feature and how it works. The sum of this feature's task-level Backend Delivery notes (see the *Tasks* table below).

## Endpoints, tables and code

**Endpoints:** none (cross-cutting).

**Tables / models:** none.

**Code:** `src/common/filters/all-exceptions.filter.ts`, `src/common/enums/error-code.enum.ts`

## How it works

- Services throw `new HttpException({ ErrorCode: ErrorCode.E_RING_02, message: 'Ring not found' }, HttpStatus.NOT_FOUND)`. Every code lives in the one enum, numbered per domain, never reused after retirement.
- `AllExceptionsFilter` catches everything and writes `{ statusCode, message, error, path, timestamp }`. Validation failures (the global `ValidationPipe`, `whitelist` + `forbidNonWhitelisted`) arrive as a `BadRequestException` whose `message` is a **string array**, one entry per failed constraint; unknown body keys are a 400.
- Prisma errors never reach the body: anything that is not an `HttpException` becomes a 500 `"Internal server error"` and is logged.

### What exists

- The enum, 41 codes across AUTH, USER, PROFILE, RING, RING_MEMBER, RING_PROFILE, RING_ACCESS and FILE; `E_AUTH_02` and `E_USER_04` are retired with the password (kept in the enum, never reused).
- The filter and the one body shape; `configureApp` wires it for the app and for every e2e spec.

### Gaps

- **The code is dropped on the wire.** The filter copies `message` and `error` from the exception response but not `ErrorCode`, so the body never carries it and `error` reads `"HttpException"` for every domain error. The Frontend guide's "branch on the code" is therefore not yet possible; clients branch on status and endpoint. See [[S-87 Error Contract Story|Error Contract · S4–S8]].
- One code is used for two meanings in places (`E_RING_01` for a name clash **and** a disallowed type; `E_RING_PROFILE_03` for a bad link value, a missing link **and** a missing info block). Worth a split when Error Contract · S4–S8 lands, since the code becomes something clients switch on.

## Log

- 2026-10-18 · split out of [[F-35 Error Contract]] when the vault moved to layers
