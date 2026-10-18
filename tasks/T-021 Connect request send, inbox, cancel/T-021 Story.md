---
type: story
code: T-021
scope: task
feature: connections
module: connections
status: draft
screens: [s44, s45]
depends: []
affects: []
related: []
pending: []
approvedBy: ""
approvedAt: ""
updated: 2026-10-18
tags: [story, story/draft, module/connections, layer/business]
task: T-021
---

# T-021 · Connect request send, inbox, cancel · User Story

**Task:** [[T-021 Connect request send, inbox, cancel]] · **Feature:** [[Connections]] · **Feature-level note:** [[Connections Story]] · **Status:** Draft (awaiting product sign-off) · **Frontend Requirements:** [[T-021 Frontend Requirements]] · **Backend Integration:** [[T-021 Backend Integration]] · **Verified by:** [[T-021 QA Backend]], [[T-021 QA Frontend]]

> Derived from the task [[T-021 Connect request send, inbox, cancel]]; **not approved by product yet**. The feature-level story is [[Connections Story]]; this note says what the user gets from this task in particular. `approved` when product signs off (`approvedBy`, `approvedAt`); `verified` when both QA notes are `passing`.

`POST /connections/requests` (target by user id from a resolved view), `GET /connections/requests?direction=incoming|sent`, `DELETE …/:id`. Blocked pairs rejected with the same 404 as views.

## Persona

Who this is for (personal user, visitor, exhibitor, organizer, Ring owner, Ring member) and the moment they are in.

## Stories

### S1 · Connect request send, inbox, cancel ([[Screen Index#s44|s44]], [[Screen Index#s45|s45]])

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
