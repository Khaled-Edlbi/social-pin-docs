---
type: story
code: T-008
scope: task
feature: badge-qr
module: discovery
status: draft
screens: [s43, s44]
depends: []
affects: []
related: []
pending: []
approvedBy: ""
approvedAt: ""
updated: 2026-10-18
tags: [story, story/draft, module/discovery, layer/business]
task: T-008
---

# T-008 · Resolve a scanned QR token · User Story

**Task:** [[T-008 Resolve a scanned QR token]] · **Feature:** [[Badge & QR]] · **Feature-level note:** [[Badge & QR Story]] · **Status:** Draft (awaiting product sign-off) · **Frontend Requirements:** [[T-008 Frontend Requirements]] · **Backend Integration:** [[T-008 Backend Integration]] · **Verified by:** [[T-008 QA Backend]], [[T-008 QA Frontend]]

> Derived from the task [[T-008 Resolve a scanned QR token]]; **not approved by product yet**. The feature-level story is [[Badge & QR Story]]; this note says what the user gets from this task in particular. `approved` when product signs off (`approvedBy`, `approvedAt`); `verified` when both QA notes are `passing`.

`GET /views/qr/:token` → same body as `GET /views/ring/:ringId`, same single 404. Increments the scan counter. Never returns the ring id.

## Persona

Who this is for (personal user, visitor, exhibitor, organizer, Ring owner, Ring member) and the moment they are in.

## Stories

### S1 · Resolve a scanned QR token ([[Screen Index#s43|s43]], [[Screen Index#s44|s44]])

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
