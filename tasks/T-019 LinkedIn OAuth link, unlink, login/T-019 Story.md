---
type: story
code: T-019
scope: task
feature: linked-accounts
module: platform
status: draft
screens: [s01, s04, s68]
depends: []
affects: []
related: []
pending: []
approvedBy: ""
approvedAt: ""
updated: 2026-10-18
tags: [story, story/draft, module/platform, layer/business]
task: T-019
---

# T-019 · LinkedIn OAuth link, unlink, login · User Story

**Task:** [[T-019 LinkedIn OAuth link, unlink, login]] · **Feature:** [[Linked Accounts (OAuth)]] · **Feature-level note:** [[Linked Accounts (OAuth) Story]] · **Status:** Draft (awaiting product sign-off) · **Frontend Requirements:** [[T-019 Frontend Requirements]] · **Backend Integration:** [[T-019 Backend Integration]] · **Verified by:** [[T-019 QA Backend]], [[T-019 QA Frontend]]

> Derived from the task [[T-019 LinkedIn OAuth link, unlink, login]]; **not approved by product yet**. The feature-level story is [[Linked Accounts (OAuth) Story]]; this note says what the user gets from this task in particular. `approved` when product signs off (`approvedBy`, `approvedAt`); `verified` when both QA notes are `passing`.

Callback writes `SocialIdentity`. Login via provider returns a session the same way `POST /auth/login/verify` does (D-01 decided: passwordless, code-only; a linked provider is the second way to prove the identity).

## Persona

Who this is for (personal user, visitor, exhibitor, organizer, Ring owner, Ring member) and the moment they are in.

## Stories

### S1 · LinkedIn OAuth link, unlink, login ([[Screen Index#s01|s01]], [[Screen Index#s04|s04]], [[Screen Index#s68|s68]])

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
