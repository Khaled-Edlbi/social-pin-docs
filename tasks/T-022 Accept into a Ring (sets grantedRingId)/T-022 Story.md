---
type: story
code: T-022
scope: task
feature: connections
module: connections
status: draft
screens: [s46]
depends: []
affects: []
related: ["Rings", "Ring Members"]
pending: []
approvedBy: ""
approvedAt: ""
owner: "omar"
updated: 2026-10-25
tags: [story, story/draft, module/connections, layer/business]
task: T-022
---

# T-022 · Accept into a Ring (sets grantedRingId) · User Story

**Task:** [[T-022 Accept into a Ring (sets grantedRingId)]] · **Feature:** [[Connections]] · **Feature-level note:** [[Connections Story]] · **Status:** Draft (awaiting product sign-off) · **Frontend Requirements:** [[T-022 Frontend Requirements]] · **Backend Integration:** [[T-022 Backend Integration]] · **Verified by:** [[T-022 QA Backend]], [[T-022 QA Frontend]]

> Derived from the task [[T-022 Accept into a Ring (sets grantedRingId)]]; **not approved by product yet**. The feature-level story is [[Connections Story]]; this note says what the user gets from this task in particular. `approved` when product signs off (`approvedBy`, `approvedAt`); `verified` when both QA notes are `passing`.

One `@Transactional`: create `Connection`, add `RingMember`, set `grantedRingId`. Never expose `grantedRingId` to the requester. Decline path too.

## Persona

The **receiver** of a connection request, on Requests (s45), deciding whether to let this person in and which Ring they belong in: Clients, Family, an event. Behind them, the **requester**, who will see whatever that Ring shows but must never learn which Ring it was. Sending and listing requests is [[T-021 Connect request send, inbox, cancel]].

## Stories

### S1 · Accept into the right Ring ([[Screen Index#s46|s46]])

**As a** receiver **I want** to accept a request and choose the Ring this person goes into **so that** they see the version of me I meant.

Acceptance criteria:
- [ ] s46 lists my live Rings from `GET /rings` (not `EVENT` or `MEETING` Rings unless the request came from that event).
- [ ] Accept sends the request id and the chosen `ringId`, and in **one transaction** the server creates the connection, adds the requester as a member of that Ring and records `grantedRingId`. All three happen or none do.
- [ ] The app shows the result only after the server answers (no optimistic accept); the request leaves the inbox.

### S2 · Only for a while ([[Screen Index#s46|s46]])

**As a** receiver **I want** to let someone in for a limited time **so that** event contacts don't keep access forever.

Acceptance criteria:
- [ ] Accept takes an optional `startsAt` / `expiresAt` for the membership; without them, access is open-ended.

### S3 · The requester never learns the Ring

**As a** receiver **I want** the Ring I chose kept private **so that** nobody knows they're in "Acquaintances" rather than "Friends".

Acceptance criteria:
- [ ] `grantedRingId` is never returned to the requester, in any response.
- [ ] On the requester's side the connection appears, and the Ring's view becomes readable; whether that Ring is listed by name on Shared with me is the open question below.

### S4 · Decline ([[Screen Index#s45|s45]])

**As a** receiver **I want** to decline **so that** the request goes away without a connection.

Acceptance criteria:
- [ ] Decline closes the request; no connection, no membership.
- [ ] The requester isn't told it was declined (see the open question in [[T-021 Story]]).
- [ ] The requester may ask again later.

### S5 · It shows up everywhere at once

**As a** receiver **I want** the new person to appear where I'd look **so that** I can find them again.

Acceptance criteria:
- [ ] They're on the Ring's People tab ([[Screen Index#s15|s15]]) and in the Ring's `memberCount` ([[T-004 Member count per Ring on list and detail]]) on the next fetch.
- [ ] My connection count ([[T-005 Connection count on Me and Home]]) goes up by one.
- [ ] Accepting someone already in that Ring is treated as done (`E_RING_MEMBER_01`), not as an error.

### S6 · When adding them isn't allowed ([[Screen Index#s46|s46]])

**As a** receiver **I want** a clear, quiet failure **so that** I'm not shown something I can't act on.

Acceptance criteria:
- [ ] A Ring that's been deleted since the picker loaded, or isn't mine: 404 `E_RING_02`; the app refetches the picker.
- [ ] A user who can't be added because a block exists in either direction: 409 `E_RING_MEMBER_04`, "Cannot add this user", without saying why.
- [ ] A request already cancelled by the requester: the row leaves the inbox.

## States and motion the design asks for

- s46: the Ring picker with one Ring selected (the design opens with a suggestion picked: [[T-051 Gemma assistant sheet and suggestions]]); optional access window; *Accept into <Ring>* → saving → done.
- s45: a row leaves the list after accept or decline.
- Motion: none beyond the row exit.

## Rules the backend already enforces

- `POST /rings/:ringId/members` already grants a Ring's view to a user, and re-adding someone whose access lapsed reactivates their row; accept should reuse it inside the transaction.
- Reassign (`POST …/members/:userId/reassign`) moves a member in one transaction, so they never see two perspectives at once; revoke marks the row `REMOVED`.
- Only the owner or a delegated admin manages a Ring's members ([[T-006 Delegated admin endpoints]]).

## Open questions

- **Shared with me by name.** A connection-granted Ring would show on the requester's Shared with me (`GET /rings/shared-with-me` lists every live membership) with its name, which reveals the Ring the receiver chose. Either it's listed without a name ("Sam's card"), or not listed, with the person reached through contacts ([[T-023 Connection detail and contacts list]]).
- **Accept route.** `POST /connections/requests/:id/accept { ringId, startsAt?, expiresAt? }` and `…/decline`, or a status `PATCH`.
- **The suggested Ring.** Whether the server suggests a Ring now (by last used, by event), or s46 opens with none picked until [[T-051 Gemma assistant sheet and suggestions]].
