---
type: story
code: T-063
scope: task
feature: error-contract
module: platform
status: draft
screens: []
depends: []
affects: []
related: []
pending: []
approvedBy: ""
approvedAt: ""
updated: 2026-10-18
tags: [story, story/draft, module/platform, layer/business]
task: T-063
---

# T-063 · Put the ErrorCode on the error body · User Story

**Task:** [[T-063 Put the ErrorCode on the error body]] · **Feature:** [[Error Contract]] · **Feature-level note:** [[Error Contract Story]] · **Status:** Draft (awaiting product sign-off) · **Frontend Requirements:** [[T-063 Frontend Requirements]] · **Backend Integration:** [[T-063 Backend Integration]] · **Verified by:** [[T-063 QA Backend]], [[T-063 QA Frontend]]

> Derived from the task [[T-063 Put the ErrorCode on the error body]]; **not approved by product yet**. The feature-level story is [[Error Contract Story]]; this note says what the user gets from this task in particular. `approved` when product signs off (`approvedBy`, `approvedAt`); `verified` when both QA notes are `passing`.

Every service throws `new HttpException({ ErrorCode, message }, status)` and the Frontend guide tells clients to **branch on the code and display the message**. But `AllExceptionsFilter` (`src/common/filters/all-exceptions.filter.ts`) copies only `message` and `error` from the exception response into the body it sends. The wire body is `{ statusCode, message, error, path, timestamp }` and `error` reads `"HttpException"` for every domain error. The stable code never reaches the client.

## Persona

Who this is for (personal user, visitor, exhibitor, organizer, Ring owner, Ring member) and the moment they are in.

## Stories

### S1 · Put the ErrorCode on the error body (—)

**As a** … **I want** … **so that** …

Acceptance criteria:
- [ ] …
- [ ] …

## States and motion the design asks for

- State: …
- Motion: …

## Rules the backend already enforces

Edge cases a story must respect because the backend decides them (from the feature's Backend Delivery note).

## Open questions

- [[D-NN …]] — what it blocks here.
