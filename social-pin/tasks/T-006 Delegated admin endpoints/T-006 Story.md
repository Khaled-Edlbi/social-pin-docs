---
type: story
code: T-006
scope: task
feature: delegated-admins
module: shared-rings
status: draft
screens: [s26, s27]
depends: []
affects: []
related: []
pending: []
approvedBy: ""
approvedAt: ""
created: 2026-10-18
updated: 2026-10-26
tags: [story, story/draft, module/shared-rings, layer/business]
task: T-006
---

# T-006 · Delegated admin endpoints · User Story

**Task:** [[T-006 Delegated admin endpoints]] · **Feature:** [[Delegated Admins]] · **Feature-level note:** [[Delegated Admins Story]] · **Status:** Draft (awaiting product sign-off) · **Frontend Requirements:** [[T-006 Frontend Requirements]] · **Backend Integration:** [[T-006 Backend Integration]] · **Verified by:** [[T-006 QA Backend]], [[T-006 QA Frontend]]

> Derived from the task [[T-006 Delegated admin endpoints]]; **not approved by product yet**. The feature-level story is [[Delegated Admins Story]]; this note says what the user gets from this task in particular. `approved` when product signs off (`approvedBy`, `approvedAt`); `verified` when both QA notes are `passing`.

`GET/POST /rings/:ringId/admins`, `PATCH/DELETE …/admins/:userId`. Owner only. Reuse `assertCanAdminister` levels.

## Persona

Who this is for (personal user, visitor, exhibitor, organizer, Ring owner, Ring member) and the moment they are in.

## Stories

### S1 · Delegated admin endpoints ([[Screen Index#s26|s26]], [[Screen Index#s27|s27]])

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

- [[ND-NN …]] — what it blocks here.
