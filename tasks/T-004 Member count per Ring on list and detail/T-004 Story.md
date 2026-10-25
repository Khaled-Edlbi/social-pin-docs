---
type: story
code: T-004
scope: task
feature: counts
module: identity
status: draft
screens: [s14, s16]
depends: []
affects: []
related: []
pending: []
approvedBy: ""
approvedAt: ""
owner: "khaled"
updated: 2026-10-25
tags: [story, story/draft, module/identity, layer/business]
task: T-004
---

# T-004 · Member count per Ring on list and detail · User Story

**Task:** [[T-004 Member count per Ring on list and detail]] · **Feature:** [[Counts]] · **Feature-level note:** [[Counts Story]] · **Status:** Draft (awaiting product sign-off) · **Frontend Requirements:** [[T-004 Frontend Requirements]] · **Backend Integration:** [[T-004 Backend Integration]] · **Verified by:** [[T-004 QA Backend]], [[T-004 QA Frontend]]

> Derived from the task [[T-004 Member count per Ring on list and detail]]; **not approved by product yet**. The feature-level story is [[Counts Story]]; this note says what the user gets from this task in particular. `approved` when product signs off (`approvedBy`, `approvedAt`); `verified` when both QA notes are `passing`.

Add `memberCount` (live members only) to `RingEntity` via a `_count` select filtered by the same window logic, or a stats sub-endpoint. Owner-only.

## Persona

A Ring owner choosing which Ring to show or broadcast to, on Home, My Rings or a Ring's own screen, who wants to know how many people each Ring reaches right now. This task covers the **member count on Rings you own**; the Ring totals, the connection count and shared Rings are in [[Counts Story]].

## Stories

### S1 · How many people are in each of my Rings ([[Screen Index#s16|s16]])

**As a** Ring owner **I want** each Ring on My Rings to show "N people" **so that** I compare my audiences at a glance.

Acceptance criteria:
- [ ] Every owned Ring in `GET /rings` carries `memberCount`; each row shows it.
- [ ] A Ring with no members shows "0 people": a real zero, now that the number is known.

### S2 · The Ring I'm on says how big it is ([[Screen Index#s14|s14]])

**As a** Ring owner **I want** "People · N" on a Ring's screen and "N in Ring" on its header and switcher chips **so that** I open the roster knowing its size.

Acceptance criteria:
- [ ] `GET /rings/:id` carries `memberCount`; the header, each switcher chip and the People row show it.
- [ ] The People row still leads to [[Screen Index#s15|s15]].

### S3 · Choosing a Ring on Home ([[Screen Index#s11|s11]], [[Screen Index#s12|s12]])

**As a** Ring owner **I want** each Ring card on Home and in the Ring picker to show "N people" **so that** I know who I'm about to show my badge or broadcast to.

Acceptance criteria:
- [ ] The cards use the same `memberCount` as My Rings; no extra request per Ring.

### S4 · The number is honest

**As a** Ring owner **I want** the count to include only people who can see the Ring now **so that** a lapsed member isn't counted as reach.

Acceptance criteria:
- [ ] A member who was removed, left, is pending, or whose access window closed is not counted; nor is anyone once the Ring has expired.
- [ ] The count matches what the access engine lets people see (the same live filter), not the `ACTIVE` rows of the roster.
- [ ] After an add, remove or reassign, the next fetch of the Ring has the new number.

### S5 · Only the owner sees it

**As a** Ring member **I want** the size of someone else's Ring kept private **so that** membership isn't revealed.

Acceptance criteria:
- [ ] `memberCount` is on the owner's Rings only; `GET /rings/shared-with-me` doesn't carry it ([[D-04 Ring settings]] decides whether members see each other).

## States and motion the design asks for

- Known: "N people", "N in Ring", "People · N", with "0" a real zero.
- Not known yet (before this ships, or while loading): no number. The app shows "—" in the number's place today ("— people", "— in Ring"); never "0".
- Motion: none; the count moves with its card when the Ring changes.

## Rules the backend already enforces

- Access is resolved per request against `now`; a member is live only while both the membership's and the Ring's windows are open (`membershipLiveFilter`, `ringLiveFilter`). The count must use the same filters.
- The roster (`GET /rings/:ringId/members`) is owner or delegated-admin only, and `status=ACTIVE` still includes members whose window has lapsed; that's why its `meta.total` is not the count.
- Membership is private to the owner.

## Open questions

- **On the Ring, or a stats endpoint.** The task allows either. The app asks for `memberCount` on `RingEntity` in both `GET /rings` and `GET /rings/:id`: one request for the whole list, no call per Ring.
- **"N added today"** on Home ("148 people · 2 added today") isn't in this task. Either a second number here, or dropped from the design.
- **My Rings wording.** The design says "148 connections" on My Rings rows and "148 people" elsewhere for the same number; one word should be chosen.
