---
type: story
code: T-001
scope: task
feature: code-delivery
module: platform
status: draft
screens: [s02]
depends: []
affects: []
related: []
pending: []
approvedBy: ""
approvedAt: ""
created: 2026-10-18
updated: 2026-10-18
tags: [story, story/draft, module/platform, layer/business]
task: T-001
---

# T-001 · Wire an email provider for one-time codes · User Story

**Task:** [[T-001 Wire an email provider for one-time codes]] · **Feature:** [[Code Delivery]] · **Feature-level note:** [[Code Delivery Story]] · **Status:** Draft (awaiting product sign-off) · **Frontend Requirements:** [[T-001 Frontend Requirements]] · **Backend Integration:** [[T-001 Backend Integration]] · **Verified by:** [[T-001 QA Backend]], [[T-001 QA Frontend]]

> Derived from the task [[T-001 Wire an email provider for one-time codes]]; **not approved by product yet**. The feature-level story is [[Code Delivery Story]]; this note says what the user gets from this task in particular. `approved` when product signs off (`approvedBy`, `approvedAt`); `verified` when both QA notes are `passing`.

Replace `AuthService.issueCode`'s log line with a mail send. Keep the `devCode` gate until delivery is verified in staging.

## Persona

Who this is for (personal user, visitor, exhibitor, organizer, Ring owner, Ring member) and the moment they are in.

## Stories

### S1 · Wire an email provider for one-time codes ([[Screen Index#s02|s02]])

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
