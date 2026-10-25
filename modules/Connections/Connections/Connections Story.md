---
type: story
code: connections
scope: feature
feature: connections
module: connections
status: draft
screens: [s44, s45, s46, s47, s62]
owner: "omar"
updated: 2026-10-25
tags: [story, story/draft, module/connections, layer/business]
---

# Connections · User Story

**Feature:** [[Connections]] · **Status:** Draft (awaiting product sign-off) · **Frontend Requirements:** [[Connections Frontend Requirements]] · **API Integration:** not yet (backend not built)

Two people met, one scanned the other, and now one of them wants access. A connection in Social Pin is an access request: the requester asks to be let in, the owner decides which Ring to put them in, and from that moment the requester sees exactly that Ring's perspective and nothing about the Ring itself. There is no feed, no follower count on display, no "following back".

**Task stories:** [[T-021 Story]] (T-021: sending, the inbox and cancel in S1 and S2) · [[T-022 Story]] (T-022: accept into a Ring and decline in S3) · [[T-023 Story]] (T-023: the connection detail and the contacts list in S4 and S6). S5 waits on [[T-024 Story]] and *Introduce* on [[T-025 Story]], both still the empty template; S7 has no task story yet.

## Persona

Two roles on the same journey. The **requester** is a personal user who just scanned a badge (s44), found someone in PinCast results (s42) or typed a `!pinname` on Discover; they want to keep seeing this person after the moment passes. The **Ring owner** is the person being asked; they receive the request in the inbox (s45), accept it into one Ring (s46), and later manage that person from Connection detail (s47). After an event, the owner reviews the requests it produced from the post-event summary (s62).

## Stories

### S1 · Connect from a scanned Pin ([[Screen Index#s44|s44]])

**As a** requester looking at a resolved profile, **I want** to tap *Connect* and send one request, **so that** the owner can decide to keep me in a Ring of theirs.

Acceptance criteria:
- [ ] *Connect* is shown under the resolved `RingProfileViewEntity`; tapping it sends a request addressed by the person's user id, never by a Ring id (the view carries none).
- [ ] After sending, the button becomes a *Requested* state and stays so on return to the screen; tapping again cancels (confirm first).
- [ ] If the pair is blocked in either direction, or the person does not exist, the request fails with the same 404 body the view gives; the UI shows one neutral message and never says "blocked".
- [ ] *Save for later* returns Home without sending anything.

### S2 · Requests inbox, incoming and sent ([[Screen Index#s45|s45]])

**As a** Ring owner, **I want** an inbox of incoming requests and a tab of the ones I sent, **so that** nothing waits on me unnoticed and I can withdraw my own.

Acceptance criteria:
- [ ] Two segments: *Incoming* (needs action) and *Sent · N*; each row shows the person's display name, Pin name, avatar placeholder and when it was sent.
- [ ] Incoming row: *Accept* opens s46; tapping the row opens the person's view (what they share with me, if anything).
- [ ] Sent row: *Cancel* removes the request; a declined request is shown as *Declined* with no further action, an accepted one disappears from Sent.
- [ ] Empty state per segment ("No requests") with a hint pointing to the badge.
- [ ] The list refetches on screen focus and after every accept, decline or cancel.

### S3 · Accept and pick a Ring ([[Screen Index#s46|s46]])

**As a** Ring owner accepting a request, **I want** a bottom sheet listing my Rings with one suggested, **so that** the person is placed in the right audience in one tap.

Acceptance criteria:
- [ ] The sheet lists the owner's live Rings (name, colour, type), default Ring first; one is pre-selected as suggested when Gemma is available, otherwise the default Ring.
- [ ] *Accept & add to Ring* performs one atomic action: the connection exists, the person is a member of exactly that Ring, and the request is closed; a failure leaves none of the three.
- [ ] *Not now* returns to s45 with the request still pending; *Decline* closes it without creating anything and is undoable only by a new request from the other side.
- [ ] After acceptance the sheet navigates to Connection detail (s47) for that person.
- [ ] An optional access window (from / until) can be set on the sheet; `null` means "until removed".

### S4 · Connection detail, owner side ([[Screen Index#s47|s47]])

**As a** Ring owner, **I want** one screen per connection showing which of my Rings they are in, events we have in common and mutual connections, **so that** I can move or revoke their access without leaving the person.

Acceptance criteria:
- [ ] Shows the person (name, Pin name, avatar placeholder), the Ring they are in (owner-only information), the access window, and when they connected.
- [ ] *Move to another Ring* lists my other Rings and reassigns live; the copy states "what they see just changed".
- [ ] *Revoke access* removes the membership and the connection row stays as history; confirm first.
- [ ] *Request meeting* goes to s59; *Introduce* is shown disabled with "not available yet" until its semantics are decided.

### S5 · Block and unblock ([[Screen Index#s47|s47]])

**As a** user, **I want** to block a person from Connection detail and undo it later from the same place, **so that** they lose every view of me at once.

Acceptance criteria:
- [ ] *Block* is under an overflow menu with a confirmation; on success the person's memberships in my Rings and mine in theirs are gone, the connection is closed, and the detail screen closes.
- [ ] A blocked person's lookup of me returns the same 404 as "no such pin"; my lookup of them does the same.
- [ ] A *Blocked people* list in Me offers *Unblock*; unblocking restores nothing, a new request is needed.

### S6 · Contacts list, searchable (reached from [[Screen Index#s38|s38]] People)

**As a** user, **I want** a searchable list of my connections, **so that** I can find one person fast and open their detail.

Acceptance criteria:
- [ ] Paginated list ordered by display name, with a search field matching name and Pin name on my own connections only, never across the platform.
- [ ] Each row opens s47; the list carries the person's user id so the detail and the perspectives call can be made.

### S7 · Review requests after an event ([[Screen Index#s62|s62]])

**As a** Ring owner closing an event, **I want** *Review 4* to walk me through the requests that event produced, **so that** I place each one before the Event Ring expires.

Acceptance criteria:
- [ ] The count on s62 equals the number of pending incoming requests created during the event's window.
- [ ] Each review step is the s46 sheet; *Not now* skips to the next; the summary updates its count as requests are settled.

## States and motion the design asks for

- State: no requests (empty), pending, accepted, declined; *Requested* on the requester's button.
- Motion: accept = the person's card **slides into the chosen Ring** on the sheet (spatial confirmation); reassignment on s47 animates the move between Rings; reduced-motion fallback is a fade.
- State on s47: the Ring row is owner-only; mutual connections and events in common list only what the current user may see and never name a Ring of the other person.

## Rules the backend already enforces

- A block is mutual and overrides membership in both directions ([[Ring Access Model]]); `POST /rings/:ringId/members` already refuses a blocked pair with 409 `E_RING_MEMBER_04`, so acceptance of a blocked requester must fail the same way, surfaced as the neutral 404 to the requester.
- Reassign and revoke on s47 exist today (`POST …/reassign`, `DELETE …/members/:userId`, [[Ring Members Backend Integration]]) and take effect on the person's next request; both Rings must share an owner (400 `E_RING_07`).
- "Not shared", "blocked" and "no such pin" are one 404 (`E_RING_ACCESS_01`); T-021 extends the same body to sending a request.
- `ConnectionRequest.grantedRingId` is never exposed to the requester; `RingProfileViewEntity` has no `ringId`.
- The owner may add a member only to a Ring they own or administer at `MEMBER_MANAGER` level; the picker on s46 must list only those.

## Open questions

- [[T-025 Introduce a connection to another]] — semantics of *Introduce* on s47 (a request on someone's behalf, or a suggestion to Gemma); the button stays disabled until decided.
- [[T-022 Accept into a Ring (sets grantedRingId)]] — a membership granted by acceptance would list on `GET /rings/shared-with-me` with the Ring's name, which tells the requester which Ring they are in. Decide whether connection-granted memberships are hidden from that list or whether the owner accepts that the Ring name is shown.
- [[D-04 Ring settings]] — "members can see each other" would change what mutual connections may show on s47; until decided, mutual connections are computed over the viewer's own connections only.
- [[T-051 Gemma assistant sheet and suggestions]] — the suggested Ring on s46; the default Ring is the fallback.
