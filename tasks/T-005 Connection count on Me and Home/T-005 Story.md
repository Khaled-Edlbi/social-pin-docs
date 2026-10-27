---
type: story
code: T-005
scope: task
feature: counts
module: identity
status: draft
screens: [s68]
depends: [T-021]
affects: []
related: ["Counts Story", "Counts Frontend Requirements", "DR-15 Several Rings per connection, remove or disconnect", "DR-17 Requests expire after 30 days, optional note, ask again at once", "Connections", "Account"]
pending: []
approvedBy: ""
approvedAt: ""
created: 2026-10-18
updated: 2026-10-27
owner: "Omar Fostok"
tags: [story, story/draft, module/identity, layer/business]
task: T-005
---

# T-005 · Connection count on Me and Home · User Story

**Task:** [[T-005 Connection count on Me and Home]] · **Feature:** [[Counts]] · **Feature-level note:** [[Counts Story]] · **Status:** Draft (awaiting product sign-off) · **Frontend Requirements:** [[T-005 Frontend Requirements]] · **Backend Integration:** [[T-005 Backend Integration]] · **Verified by:** [[T-005 QA Backend]], [[T-005 QA Frontend]]

> Derived from the task [[T-005 Connection count on Me and Home]]; **not approved by product yet**. The feature-level story is [[Counts Story]]; this note says what the user gets from this task in particular. `approved` when product signs off (`approvedBy`, `approvedAt`); `verified` when both QA notes are `passing`.

A person who has started connecting with others wants to see, on Me, how many connections they have ("218 connections"), next to how many Rings they own. Connections don't exist in the backend yet ([[T-021 Connect request send, inbox, cancel]]), so until then the number is simply not shown. **Me only**: Home shows no connections count (decided 2026-10-27 by omar, [[Counts Story]] S4).

## Persona

A **personal user** on Me ([[Screen Index#s68|s68]]), checking how their network has grown after an event or a week of scanning badges.

## Stories

### S1 · Connections on Me ([[Screen Index#s68|s68]])

**As a** user **I want** "N connections" on my profile card on Me **so that** I see how many people I have exchanged access with.

Acceptance criteria:
- [ ] The profile card under my name reads "2 Rings · 218 connections": the Rings part is `meta.total` of `GET /rings` (exists today), the connections part is the number this task adds.
- [ ] N counts **people I have an accepted connection with**, once each, however many of my Rings they are in ([[DR-15 Several Rings per connection, remove or disconnect]]).
- [ ] Someone I removed from all my Rings but kept as a connection ("Remove from Rings") still counts; someone I **disconnected** does not.
- [ ] Pending, declined, cancelled and expired requests don't count ([[DR-17 Requests expire after 30 days, optional note, ask again at once]]).
- [ ] Until connections exist, the connections part is **hidden**: not "0 connections", not a sample number. The card reads "2 Rings".
- [ ] The number is mine only: nobody else ever sees how many connections I have.
- [ ] It refetches when Me opens and after I accept a request or disconnect someone.

## States and motion the design asks for

- State: the connections part appears only once the backend sends a number; 0 is shown as "0 connections" only once connections exist and I have none.
- Motion: none asked for.

## Rules the backend already enforces

- Connections don't exist yet: nothing can be counted ([[Counts Backend Delivery]]).
- Every visibility decision goes through `RingAccessService`; a count is owner-facing and never part of a view or a perspective.

## Open questions

- Whether the count rides on `GET /users/me`, on a stats endpoint, or on the connections list's `meta.total` is for the backend to choose in T-005-be; the client needs one number and no extra list call on Me.
- The task keeps its title "on Me and Home"; Home is out by the 2026-10-27 decision.
