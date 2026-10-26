---
type: story
code: T-067
scope: task
feature: error-contract
module: platform
status: draft
screens: [s18]
depends: [T-063]
affects: []
related: ["T-067", "Error Contract Story", "Error Contract", "T-063"]
pending: []
approvedBy: ""
approvedAt: ""
owner: "khaled"
created: 2026-10-26
updated: 2026-10-26
tags: [story, story/draft, module/platform, layer/business]
task: T-067
---

# T-067 · Split E_RING_01 and E_RING_PROFILE_03 · User Story

**Task:** [[T-067 Split E_RING_01 and E_RING_PROFILE_03]] · **Feature:** [[Error Contract]] · **Feature-level note:** [[Error Contract Story]] · **Status:** Draft (awaiting product sign-off) · **Frontend Requirements:** [[T-067 Frontend Requirements]] · **Backend Integration:** [[T-067 Backend Integration]] · **Verified by:** [[T-067 QA Backend]], [[T-067 QA Frontend]]

> Derived from the task [[T-067 Split E_RING_01 and E_RING_PROFILE_03]]; **not approved by product yet**. The feature-level story is [[Error Contract Story]] and this task meets its S3; this note says what the user gets from this task in particular. `approved` when product signs off (`approvedBy`, `approvedAt`); `verified` when both QA notes are `passing`.

Two codes answer more than one question each. `E_RING_01` is sent both when a Ring name is already used and when the Ring type is not allowed; `E_RING_PROFILE_03` is sent for a bad link value, a missing link and a missing info block. The app cannot tell them apart, so it either guesses from the endpoint or shows one sentence for several different mistakes. [[T-063 Put the ErrorCode on the error body]] puts the code on the wire; this task makes each code worth branching on.

## Persona

A Ring owner creating or renaming a Ring, and the same person editing what a Ring shows — links, info blocks — on the projection editor. Behind them, the frontend developer who has to pick one sentence per code and today cannot, because one code covers several mistakes.

## Stories

### S1 · A refused Ring name and a refused Ring type read differently ([[Screen Index#s18|s18]])

**As a** Ring owner **I want** "You already have a Ring with that name" when the name is taken and a different sentence when the Ring type is not allowed **so that** I change the right thing.

Acceptance criteria:
- [ ] A name clash answers with its own code; a disallowed Ring type answers with a different one. Neither is `E_RING_01` for both.
- [ ] The app shows the name message under the name field and the type message on the type step; it stops inferring "name taken" from the endpoint.
- [ ] The workaround in [[T-063 Story]] — treating `E_RING_01` as "name taken" because the client never sends a refused type — is removed.

### S2 · Each projection refusal says which one it was

**As a** Ring owner editing what a Ring shows **I want** a bad link value, a link that no longer exists and a missing info block to read differently **so that** I know whether to fix what I typed or reload the page.

Acceptance criteria:
- [ ] A bad link value, a missing link and a missing info block each answer with their own code, not `E_RING_PROFILE_03` for all three.
- [ ] A link id from another Ring's projection still answers "not found" and never says the row exists elsewhere.

### S3 · A code written against today keeps its meaning

**As a** frontend developer **I want** a retired code never to come back with a new meaning **so that** a switch I wrote stays correct.

Acceptance criteria:
- [ ] Every number taken away by the split is retired, not reassigned ([[API Conventions]]).
- [ ] The new codes and their single meanings are listed in [[Error Contract Backend Delivery]] and in the Frontend API Guide's error table.

## States and motion the design asks for

- No new state. The design already draws the field error, the wizard's type step and the projection editor's row errors; today several of them are reached by one code.

## Rules the backend already enforces

- Services throw `new HttpException({ ErrorCode, message }, status)` from one enum of 41 codes.
- A link id from another projection is simply not found, scoped to the Ring; the split must not make a row from another Ring distinguishable from one that never existed.
- Enumeration resistance stays: a split never tells a caller about something they may not see.

## Open questions

- How many codes each split becomes, and their names, follow the enum's conventions and are the backend's to propose in [[T-067 Backend Delivery]]; product only asks that each meaning has one.
- Nothing is blocked on an answer: the ticket waits on [[T-063 Put the ErrorCode on the error body]] first.
