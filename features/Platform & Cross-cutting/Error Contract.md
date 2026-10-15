---
type: feature
id: error-contract
name: "Error Contract"
status: partial
priority: P0
domain: platform
screens: []
updated: 2026-10-15
tags: [feature, status/partial, domain/platform, priority/P0]
---

# 🟡 Error Contract

**Status:** Partial (needs more) · **Priority:** P0 · **Domain:** [[Feature Tree#Platform & Cross-cutting|Platform & Cross-cutting]] · **Frontend guide:** [[Frontend Contract]]

One error body for the whole API, with a stable per-domain code the client branches on and a human message it displays.

## Design reference

_No prototype screen. Every error state in the app depends on it._

## Backend state

**Endpoints:** none (cross-cutting).

**Tables / models:** none.

**Code:** `src/common/filters/all-exceptions.filter.ts`, `src/common/enums/error-code.enum.ts`

## How it works

- Services throw `new HttpException({ ErrorCode: ErrorCode.E_RING_02, message: 'Ring not found' }, HttpStatus.NOT_FOUND)`. Every code lives in the one enum, numbered per domain, never reused after retirement.
- `AllExceptionsFilter` catches everything and writes `{ statusCode, message, error, path, timestamp }`. Validation failures (the global `ValidationPipe`, `whitelist` + `forbidNonWhitelisted`) arrive as a `BadRequestException` whose `message` is a **string array**, one entry per failed constraint; unknown body keys are a 400.
- Prisma errors never reach the body: anything that is not an `HttpException` becomes a 500 `"Internal server error"` and is logged.

### What exists

- The enum, 41 codes across AUTH, USER, PROFILE, RING, RING_MEMBER, RING_PROFILE, RING_ACCESS and FILE.
- The filter and the one body shape; `configureApp` wires it for the app and for every e2e spec.

### Gaps

- **The code is dropped on the wire.** The filter copies `message` and `error` from the exception response but not `ErrorCode`, so the body never carries it and `error` reads `"HttpException"` for every domain error. The Frontend guide's "branch on the code" is therefore not yet possible; clients branch on status and endpoint. See [[T-063 Put the ErrorCode on the error body]].
- One code is used for two meanings in places (`E_RING_01` for a name clash **and** a disallowed type; `E_RING_PROFILE_03` for a bad link value, a missing link **and** a missing info block). Worth a split when T-063 lands, since the code becomes something clients switch on.

## Tasks

| Task | Status | Priority | Effort |
|---|---|---|---|
| [[T-063 Put the ErrorCode on the error body]] | ⬜ To do | P0 | S |

```dataview
TABLE status, priority, effort FROM #task WHERE feature = "error-contract" SORT priority ASC
```

## Related

- [[API Conventions]]
- [[Frontend Contract]]
- [[Frontend Index]]

Project context: [[Ring Access Model]] · [[Architecture]] · [[API Conventions]] · [[SPEC_MAP]]
