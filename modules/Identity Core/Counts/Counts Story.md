---
type: story
code: counts
scope: feature
feature: counts
module: identity
status: approved
screens: [s11, s12, s14, s16, s17, s68]
approvedBy: "khaled"
approvedAt: 2026-10-25
owner: "omar"
created: 2026-10-18
updated: 2026-10-25
related: ["DR-04 Ring settings at launch and their defaults", "DR-14 Shared with me lists people, never the Ring"]
tags: [story, story/approved, module/identity, layer/business]
---

# Counts · User Story

**Feature:** [[Counts]] · **Status:** Approved 2026-10-25 by khaled · **Frontend Requirements:** [[Counts Frontend Requirements]] · **API Integration:** not yet (backend not built)

A Ring owner glances at Home or My Rings and wants a sense of scale: how many people each Ring reaches ("148 people"), how many Rings they own and how many were shared with them, and, on Me, how many connections they have ("218 connections"). The numbers are derived from data that exists today; what is missing is a way to read them.

**Task stories:** [[T-004 Story]] (T-004: the member count in S1, S2, S3 and S5). S4 waits on [[T-005 Story]], still the empty template.

## Persona

A Ring owner on Home ([[Wireframe Brief#Home — Rings hub + active profile|§4.1]]) or My Rings ([[Wireframe Brief#Ring management|§4.2]]) deciding which Ring to make active, or checking on Me how their network has grown. Counts are read-only and owner-facing.

## Stories

### S1 · Ring switcher with counts ([[Screen Index#s11|s11]], [[Screen Index#s12|s12]])

**As a** Ring owner **I want** each card in the Ring carousel to show how many people are in it **so that** I know which audience I am about to broadcast to.

Acceptance criteria:
- [ ] Each owned Ring card shows "N people"; the count includes live members only (both windows open, not removed).
- [ ] Until the count ships, the card shows the name and colour without a number, not "0 people".
- [ ] "All 5" on the carousel header uses `meta.total` of `GET /rings`, which exists today.
- [ ] Switching Rings re-composes the profile; the count moves with its card.

### S2 · My Rings and Shared with me tabs ([[Screen Index#s16|s16]], [[Screen Index#s17|s17]])

**As a** Ring owner **I want** the tab chips to read "My Rings · 5" and "Shared with me · 2" **so that** I can see both sides of my network at a glance.

Acceptance criteria:
- [ ] "My Rings · N" is `meta.total` of `GET /rings`; "Shared with me · N" counts the **people** who share with me right now, one per person, since Shared with me lists people, not Rings ([[DR-14 Shared with me lists people, never the Ring]]). Not available yet: `meta.total` of `GET /rings/shared-with-me` counts live Rings today, so someone sharing two Rings counts twice.
- [ ] Each owned Ring row shows "N people" when the member count exists; a row on Shared with me is a person and never shows a member count.
- [ ] The shared count can change without any action of the viewer; it refetches on screen focus.

### S3 · Ring data header ([[Screen Index#s14|s14]])

**As a** Ring owner **I want** "People · 148" on the Ring's detail **so that** I can open the roster knowing how large it is.

Acceptance criteria:
- [ ] The "People" row shows the live member count and leads to s15.
- [ ] Until the count ships, the row reads "People" with no number; it still leads to the roster.
- [ ] The count refetches after any add, reassign or revoke on s15 / s47.

### S4 · Connections on Me ([[Screen Index#s68|s68]])

**As a** user **I want** "218 connections" on Me **so that** I see how many people I have exchanged access with.

Acceptance criteria:
- [ ] The row is hidden, not zero, until connections exist in the backend.
- [ ] When it ships, the count is the number of accepted connections, not the sum of Ring members.

### S5 · Counts stay honest after changes (journey, no prototype screen)

**As a** Ring owner **I want** the numbers to reflect expiry and revocation **so that** a lapsed member is not counted as reach.

Acceptance criteria:
- [ ] A member whose window closed, or whose Ring expired, is not counted; the count follows the same live filter the access engine uses.
- [ ] A reassign moves one unit from the source Ring's count to the target's on the next fetch.

## States and motion the design asks for

- State: counts on carousel cards, tab chips and the Ring data header; a shared Ring card shows no member count.
- State: empty ("No Rings shared with you yet") when the shared count is 0.
- Motion: counts ride on their cards during the Ring re-compose; no counter animation is asked for.

## Rules the backend already enforces

- Access is resolved per request against `now`; a member count must apply the same `membershipLiveFilter` / `ringLiveFilter` logic or it will disagree with what viewers can actually see.
- Membership is private to the owner. "Members can see each other" is a Ring setting, off by default ([[DR-04 Ring settings at launch and their defaults]], not available yet); while it is off, nothing on the member's side counts the Ring's members.
- `GET /rings/shared-with-me` already returns only live-accessible Rings, so its `meta.total` is a truthful "Shared with me · N".
- Connections do not exist yet; nothing can be counted.

## Open questions

- Whether the member count rides on `RingEntity` (`memberCount`) or on a separate stats endpoint is left open in [[T-004 Member count per Ring on list and detail]]; the client prefers it on the entity so the list needs one call.
- Whether members of a Ring with "members can see each other" on see a member count: DR-04 says they see each other's full cards, and the count follows from that list; not asked separately ([[DR-04 Ring settings at launch and their defaults]], *Still open*). It never shows on Shared with me, which names no Ring.
