---
type: story
code: T-022
scope: task
feature: connections
module: connections
status: approved
screens: [s46]
depends: []
affects: []
related: ["Rings", "Ring Members", "D-13 The requester sees a declined request", "D-14 Shared with me lists people, never the Ring", "D-17 Requests expire after 30 days, optional note, ask again at once"]
pending: []
approvedBy: "khaled"
approvedAt: 2026-10-25
owner: "omar"
created: 2026-10-18
updated: 2026-10-27
tags: [story, story/approved, module/connections, layer/business]
task: T-022
---

# T-022 · Accept into a Ring (sets grantedRingId) · User Story

**Task:** [[T-022 Accept into a Ring (sets grantedRingId)]] · **Feature:** [[Connections]] · **Feature-level note:** [[Connections Story]] · **Status:** Approved 2026-10-25 by khaled · **Frontend Requirements:** [[T-022 Frontend Requirements]] · **Backend Integration:** [[T-022 Backend Integration]] · **Verified by:** [[T-022 QA Backend]], [[T-022 QA Frontend]]

> Derived from the task [[T-022 Accept into a Ring (sets grantedRingId)]]; **not approved by product yet**. The feature-level story is [[Connections Story]]; this note says what the user gets from this task in particular. `approved` when product signs off (`approvedBy`, `approvedAt`); `verified` when both QA notes are `passing`.

One `@Transactional`: create `Connection`, add `RingMember`, set `grantedRingId`. Never expose `grantedRingId` to the requester. Decline path too.

## Persona

The **receiver** of a connection request, on Requests (s45), deciding whether to let this person in and which Ring they belong in: Clients, Family, an event. Behind them, the **requester**, who will see whatever that Ring shows but must never learn which Ring it was. Sending and listing requests is [[T-021 Connect request send, inbox, cancel]].

## Stories

### S1 · Accept into the right Ring ([[Screen Index#s46|s46]])

**As a** receiver **I want** to accept a request and choose the Ring this person goes into **so that** they see the version of me I meant.

Acceptance criteria:
- [ ] s46 lists my live Rings from `GET /rings` (not `EVENT` or `MEETING` Rings unless the request came from that event), and shows the request's note if it has one.
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
- [ ] On the requester's side the connection appears, and the Ring's view becomes readable. On their Shared with me ([[Screen Index#s17|s17]]) I appear as a person ("Sam's card"), never with the Ring's name, colour or type ([[D-14 Shared with me lists people, never the Ring]]).

### S4 · Decline ([[Screen Index#s45|s45]])

**As a** receiver **I want** to decline **so that** the request goes away without a connection.

Acceptance criteria:
- [ ] Decline closes the request as **declined**; no connection, no membership.
- [ ] The requester **sees the decline**: the request shows as declined on their Sent list and on my card's button ([[D-13 The requester sees a declined request]], [[T-021 Story]] S4).
- [ ] The requester can **ask again straight away**; a new request arrives in my inbox like any other ([[D-17 Requests expire after 30 days, optional note, ask again at once]]). If I don't want that, I block them ([[T-024 Block and unblock]]), which never reads as a decline.

### S5 · It shows up everywhere at once

**As a** receiver **I want** the new person to appear where I'd look **so that** I can find them again.

Acceptance criteria:
- [ ] They're on the Ring's People tab ([[Screen Index#s15|s15]]) and in the Ring's `memberCount` ([[Counts Story|Counts · S6–S10]]) on the next fetch.
- [ ] My connection count ([[Counts Story|Counts · S11]]) goes up by one.
- [ ] Accepting someone already in that Ring is treated as done (`E_RING_MEMBER_01`), not as an error.

### S6 · When adding them isn't allowed ([[Screen Index#s46|s46]])

**As a** receiver **I want** a clear, quiet failure **so that** I'm not shown something I can't act on.

Acceptance criteria:
- [ ] A Ring that's been deleted since the picker loaded, or isn't mine: 404 `E_RING_02`; the app refetches the picker.
- [ ] A user who can't be added because a block exists in either direction: 409 `E_RING_MEMBER_04`, "Cannot add this user", without saying why.
- [ ] A request already cancelled by the requester, or expired: the row leaves the inbox.

## States and motion the design asks for

- s46: the Ring picker with one Ring selected (the design opens with a suggestion picked: [[T-051 Gemma assistant sheet and suggestions]]); the request's note; optional access window; *Accept into <Ring>* → saving → done.
- s45: a row leaves the list after accept or decline.
- Motion: none beyond the row exit.

## Rules the backend already enforces

- `POST /rings/:ringId/members` already grants a Ring's view to a user, and re-adding someone whose access lapsed reactivates their row; accept should reuse it inside the transaction.
- Reassign (`POST …/members/:userId/reassign`) moves a member in one transaction, so they never see two perspectives at once; revoke marks the row `REMOVED`.
- Only the owner or a delegated admin manages a Ring's members ([[Delegated Admins Story|Delegated Admins · S6]]).
- Not available yet: `GET /rings/shared-with-me` still returns the Ring's name to members; hiding it is the change [[D-14 Shared with me lists people, never the Ring]] asks of [[Rings]].

## Open questions

- **Accept route.** `POST /connections/requests/:id/accept { ringId, startsAt?, expiresAt? }` and `…/decline`, or a status `PATCH`.
- **The suggested Ring.** Whether the server suggests a Ring now (by last used, by event), or s46 opens with none picked until [[T-051 Gemma assistant sheet and suggestions]].
