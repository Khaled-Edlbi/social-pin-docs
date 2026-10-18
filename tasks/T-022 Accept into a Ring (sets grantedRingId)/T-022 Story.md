---
type: story
code: T-022
scope: task
feature: connections
module: connections
status: draft
screens: [s46]
depends: []
affects: []
related: []
pending: []
approvedBy: ""
approvedAt: ""
updated: 2026-10-18
tags: [story, story/draft, module/connections, layer/business]
task: T-022
---

# T-022 · Accept into a Ring (sets grantedRingId) · User Story

**Task:** [[T-022 Accept into a Ring (sets grantedRingId)]] · **Feature:** [[Connections]] · **Feature-level note:** [[Connections Story]] · **Status:** Draft (awaiting product sign-off) · **Frontend Requirements:** [[T-022 Frontend Requirements]] · **Backend Integration:** [[T-022 Backend Integration]] · **Verified by:** [[T-022 QA Backend]], [[T-022 QA Frontend]]

> Derived from the task [[T-022 Accept into a Ring (sets grantedRingId)]]; **not approved by product yet**. The feature-level story is [[Connections Story]]; this note says what the user gets from this task in particular. `approved` when product signs off (`approvedBy`, `approvedAt`); `verified` when both QA notes are `passing`.

One `@Transactional`: create `Connection`, add `RingMember`, set `grantedRingId`. Never expose `grantedRingId` to the requester. Decline path too.

## Persona

Who this is for (personal user, visitor, exhibitor, organizer, Ring owner, Ring member) and the moment they are in.

## Stories

### S1 · Accept into a Ring (sets grantedRingId) ([[Screen Index#s46|s46]])

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
