---
type: story
code: T-062
scope: task
feature: files
module: identity
status: draft
screens: [s14, s29, s30, s31, s44]
depends: []
affects: []
related: []
pending: []
approvedBy: ""
approvedAt: ""
updated: 2026-10-18
tags: [story, story/draft, module/identity, layer/business]
task: T-062
---

# T-062 · Serve uploaded file bytes by id · User Story

**Task:** [[T-062 Serve uploaded file bytes by id]] · **Feature:** [[Files Upload]] · **Feature-level note:** [[Files Upload Story]] · **Status:** Draft (awaiting product sign-off) · **Frontend Requirements:** [[T-062 Frontend Requirements]] · **Backend Integration:** [[T-062 Backend Integration]] · **Verified by:** [[T-062 QA Backend]], [[T-062 QA Frontend]]

> Derived from the task [[T-062 Serve uploaded file bytes by id]]; **not approved by product yet**. The feature-level story is [[Files Upload Story]]; this note says what the user gets from this task in particular. `approved` when product signs off (`approvedBy`, `approvedAt`); `verified` when both QA notes are `passing`.

A client cannot display a Ring photo or download an attachment today. `FileEntity` deliberately omits `storageKey`, the static `/uploads` mount is keyed by that storage path, and nothing maps a file **id** to bytes. So `avatarFileId` on every projection and view, and `attachments[].id`, are dead ends for the UI.

## Persona

Who this is for (personal user, visitor, exhibitor, organizer, Ring owner, Ring member) and the moment they are in.

## Stories

### S1 · Serve uploaded file bytes by id ([[Screen Index#s14|s14]], [[Screen Index#s29|s29]], [[Screen Index#s30|s30]], [[Screen Index#s31|s31]], [[Screen Index#s44|s44]])

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
