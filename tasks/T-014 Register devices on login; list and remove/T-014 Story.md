---
type: story
code: T-014
scope: task
feature: devices
module: platform
status: draft
screens: [s75]
depends: []
affects: []
related: []
pending: []
approvedBy: ""
approvedAt: ""
created: 2026-10-18
updated: 2026-10-18
tags: [story, story/draft, module/platform, layer/business]
task: T-014
---

# T-014 · Register devices on login; list and remove · User Story

**Task:** [[T-014 Register devices on login; list and remove]] · **Feature:** [[Devices & NFC]] · **Feature-level note:** [[Devices & NFC Story]] · **Status:** Draft (awaiting product sign-off) · **Frontend Requirements:** [[T-014 Frontend Requirements]] · **Backend Integration:** [[T-014 Backend Integration]] · **Verified by:** [[T-014 QA Backend]], [[T-014 QA Frontend]]

> Derived from the task [[T-014 Register devices on login; list and remove]]; **not approved by product yet**. The feature-level story is [[Devices & NFC Story]]; this note says what the user gets from this task in particular. `approved` when product signs off (`approvedBy`, `approvedAt`); `verified` when both QA notes are `passing`.

`UserDevice` row on login (name, platform, push token). `GET /users/me/devices`, `DELETE …/devices/:id` revoking that device's refresh tokens.

## Persona

Who this is for (personal user, visitor, exhibitor, organizer, Ring owner, Ring member) and the moment they are in.

## Stories

### S1 · Register devices on login; list and remove ([[Screen Index#s75|s75]])

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
