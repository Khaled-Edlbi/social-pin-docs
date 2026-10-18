---
type: story
code: T-007
scope: task
feature: badge-qr
module: discovery
status: draft
screens: [s34]
depends: []
affects: []
related: []
pending: []
approvedBy: ""
approvedAt: ""
updated: 2026-10-18
tags: [story, story/draft, module/discovery, layer/business]
task: T-007
---

# T-007 · Issue and rotate the QR token for a Ring · User Story

**Task:** [[T-007 Issue and rotate the QR token for a Ring]] · **Feature:** [[Badge & QR]] · **Feature-level note:** [[Badge & QR Story]] · **Status:** Draft (awaiting product sign-off) · **Frontend Requirements:** [[T-007 Frontend Requirements]] · **Backend Integration:** [[T-007 Backend Integration]] · **Verified by:** [[T-007 QA Backend]], [[T-007 QA Frontend]]

> Derived from the task [[T-007 Issue and rotate the QR token for a Ring]]; **not approved by product yet**. The feature-level story is [[Badge & QR Story]]; this note says what the user gets from this task in particular. `approved` when product signs off (`approvedBy`, `approvedAt`); `verified` when both QA notes are `passing`.

`POST /rings/:ringId/qr` returns an opaque token; previous token revoked; 24 h rotation. Permanent token behind the Pro gate (T-049).

## Persona

Who this is for (personal user, visitor, exhibitor, organizer, Ring owner, Ring member) and the moment they are in.

## Stories

### S1 · Issue and rotate the QR token for a Ring ([[Screen Index#s34|s34]])

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
