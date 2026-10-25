---
type: story
code: T-024
scope: task
feature: connections
module: connections
status: draft
screens: [s47]
depends: []
affects: []
related: []
pending: []
approvedBy: ""
approvedAt: ""
created: 2026-10-18
updated: 2026-10-18
tags: [story, story/draft, module/connections, layer/business]
task: T-024
---

# T-024 · Block and unblock · User Story

**Task:** [[T-024 Block and unblock]] · **Feature:** [[Connections]] · **Feature-level note:** [[Connections Story]] · **Status:** Draft (awaiting product sign-off) · **Frontend Requirements:** [[T-024 Frontend Requirements]] · **Backend Integration:** [[T-024 Backend Integration]] · **Verified by:** [[T-024 QA Backend]], [[T-024 QA Frontend]]

> Derived from the task [[T-024 Block and unblock]]; **not approved by product yet**. The feature-level story is [[Connections Story]]; this note says what the user gets from this task in particular. `approved` when product signs off (`approvedBy`, `approvedAt`); `verified` when both QA notes are `passing`.

`POST/DELETE /blocks/:userId`. `UserBlock` is already enforced by `RingAccessService`. Blocking removes both directions of membership.

## Persona

Who this is for (personal user, visitor, exhibitor, organizer, Ring owner, Ring member) and the moment they are in.

## Stories

### S1 · Block and unblock ([[Screen Index#s47|s47]])

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
