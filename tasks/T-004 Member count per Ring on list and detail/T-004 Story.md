---
type: story
code: T-004
scope: task
feature: counts
module: identity
status: draft
screens: [s14, s16]
depends: []
affects: []
related: []
pending: []
approvedBy: ""
approvedAt: ""
updated: 2026-10-18
tags: [story, story/draft, module/identity, layer/business]
task: T-004
---

# T-004 · Member count per Ring on list and detail · User Story

**Task:** [[T-004 Member count per Ring on list and detail]] · **Feature:** [[Counts]] · **Feature-level note:** [[Counts Story]] · **Status:** Draft (awaiting product sign-off) · **Frontend Requirements:** [[T-004 Frontend Requirements]] · **Backend Integration:** [[T-004 Backend Integration]] · **Verified by:** [[T-004 QA Backend]], [[T-004 QA Frontend]]

> Derived from the task [[T-004 Member count per Ring on list and detail]]; **not approved by product yet**. The feature-level story is [[Counts Story]]; this note says what the user gets from this task in particular. `approved` when product signs off (`approvedBy`, `approvedAt`); `verified` when both QA notes are `passing`.

Add `memberCount` (live members only) to `RingEntity` via a `_count` select filtered by the same window logic, or a stats sub-endpoint. Owner-only.

## Persona

Who this is for (personal user, visitor, exhibitor, organizer, Ring owner, Ring member) and the moment they are in.

## Stories

### S1 · Member count per Ring on list and detail ([[Screen Index#s14|s14]], [[Screen Index#s16|s16]])

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
