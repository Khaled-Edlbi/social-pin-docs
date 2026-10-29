---
type: story
code: connections
scope: feature
feature: connections
module: connections
status: draft
screens: [s44, s45, s46, s47, s62]
owner: "omar"
created: 2026-10-18
updated: 2026-10-28
related: ["D-04 Ring settings at launch and their defaults", "D-13 The requester sees a declined request", "D-14 Shared with me lists people, never the Ring", "D-15 Several Rings per connection, remove or disconnect", "D-17 Requests expire after 30 days, optional note, ask again at once"]
tags: [story, story/draft, module/connections, layer/business]
---

# Connections · User Story

> ⚠ Affected by [[S-15 Ring Access Engine Story]] (2026-10-29): s47's "4 mutual connections · Omar, Lina, Rami +1" and "2 events in common" reveal another person's connections and events; nothing decides whether that's allowed. A needs-decision card is to be raised from this story ("Mutual connections and events in common", decider: owner); until it's decided s47 shows neither.

**Feature:** [[F-14 Connections]] · **Status:** Draft (awaiting product sign-off) · **Frontend Requirements:** [[FR-14 Connections Frontend Requirements]] · **API Integration:** not yet (backend not built)

Two people met, one scanned the other, and now one of them wants access. A connection in Social Pin is an access request: the requester asks to be let in, the owner decides which Ring to put them in, and from that moment the requester sees exactly that Ring's perspective and nothing about the Ring itself ([[D-14 Shared with me lists people, never the Ring]]). A request is pending, accepted, declined, cancelled or expired after 30 days, and the requester sees which ([[D-13 The requester sees a declined request]], [[D-17 Requests expire after 30 days, optional note, ask again at once]]). A person can sit in several of the owner's Rings, and a connection outlives access unless the owner disconnects ([[D-15 Several Rings per connection, remove or disconnect]]). There is no feed, no follower count on display, no "following back".

**Task stories:** [[S-23 Connections Story|Connections · S8–S12]] (Connections · S8–S12: sending, the inbox and cancel in S1 and S2) · [[S-23 Connections Story|Connections · S13–S18]] (Connections · S13–S18: accept into a Ring and decline in S3) · [[S-23 Connections Story|Connections · S19–S24]] (Connections · S19–S24: the connection detail and the contacts list in S4 and S6). S5 waits on [[S-23 Connections Story|Connections · S25]] and *Introduce* on [[S-23 Connections Story|Connections · S26]], both still the empty template; S7 has no task story yet.

## Persona

Two roles on the same journey. The **requester** is a personal user who just scanned a badge (s44), found someone in PinCast results (s42) or typed a `!pinname` on Discover; they want to keep seeing this person after the moment passes. The **Ring owner** is the person being asked; they receive the request in the inbox (s45), accept it into one Ring (s46), and later manage that person from Connection detail (s47). After an event, the owner reviews the requests it produced from the post-event summary (s62).

## Stories

### S1 · Connect from a scanned Pin ([[Screen Index#s44|s44]])

**As a** requester looking at a resolved profile, **I want** to tap *Connect* and send one request, **so that** the owner can decide to keep me in a Ring of theirs.

Acceptance criteria:
- [ ] *Connect* is shown under the resolved `RingProfileViewEntity`; tapping it sends a request addressed by the person's user id, never by a Ring id (the view carries none). How the app gets that id is [[ND-10 How Connect addresses the scanned person]], still open.
- [ ] The request may carry an optional note ("We met at TechSummit") of up to 200 characters ([[D-17 Requests expire after 30 days, optional note, ask again at once]]).
- [ ] After sending, the button becomes a *Requested* state and stays so on return to the screen; tapping again cancels (confirm first). After a decline or an expiry it shows that, and *Connect* sends a new request straight away.
- [ ] If the pair is blocked in either direction, or the person does not exist, the request fails with the same 404 body the view gives; the UI shows one neutral message and never says "blocked".
- [ ] *Save for later* returns Home without sending anything.

### S2 · Requests inbox, incoming and sent ([[Screen Index#s45|s45]])

**As a** Ring owner, **I want** an inbox of incoming requests and a tab of the ones I sent, **so that** nothing waits on me unnoticed and I can withdraw my own.

Acceptance criteria:
- [ ] Two segments: *Incoming* (needs action) and *Sent · N*; each row shows the person's display name, Pin name, avatar placeholder, when it was sent and the note if there is one.
- [ ] Incoming row: *Accept* opens s46; tapping the row opens the person's view (what they share with me, if anything). A request unanswered for 30 days expires and leaves the list.
- [ ] Sent row: *Cancel* removes a pending request; a declined request is shown as *Declined* and an expired one as *Expired*, each with *Connect* again; an accepted one disappears from Sent ([[D-13 The requester sees a declined request]], [[D-17 Requests expire after 30 days, optional note, ask again at once]]).
- [ ] Empty state per segment ("No requests") with a hint pointing to the badge.
- [ ] The list refetches on screen focus and after every accept, decline or cancel.

### S3 · Accept and pick a Ring ([[Screen Index#s46|s46]])

**As a** Ring owner accepting a request, **I want** a bottom sheet listing my Rings with one suggested, **so that** the person is placed in the right audience in one tap.

Acceptance criteria:
- [ ] The sheet lists the owner's live Rings (name, colour, type), default Ring first; one is pre-selected as suggested when Gemma is available, otherwise the default Ring.
- [ ] *Accept & add to Ring* performs one atomic action: the connection exists, the person is a member of exactly that Ring, and the request is closed; a failure leaves none of the three.
- [ ] *Not now* returns to s45 with the request still pending; *Decline* closes it as declined without creating anything. The requester sees the decline and may ask again straight away; to stop that, the owner blocks (S5), which never reads as a decline.
- [ ] After acceptance the sheet navigates to Connection detail (s47) for that person.
- [ ] An optional access window (from / until) can be set on the sheet; `null` means "until removed".

### S4 · Connection detail, owner side ([[Screen Index#s47|s47]])

**As a** Ring owner, **I want** one screen per connection showing which of my Rings they are in, events we have in common and mutual connections, **so that** I can move or revoke their access without leaving the person.

Acceptance criteria:
- [ ] Shows the person (name, Pin name, avatar placeholder), **the Rings they are in** (one or several; owner-only information), each with its access window, and when they connected ([[D-15 Several Rings per connection, remove or disconnect]]).
- [ ] *Add to another Ring* and *Move to another Ring* list my other Rings; a move reassigns live; the copy states "what they see just changed". With several Rings, they see the version from the Ring they were put in first.
- [ ] *Revoke access* removes them from one Ring; confirm first. From the **last** Ring it asks: *Remove from Rings* (still a connection, no access, listed in my contacts) or *Disconnect* (the connection ends; a new request is needed). Not available yet: there is no disconnect endpoint.
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
- [ ] Connections with no access (removed from all my Rings but not disconnected) are listed and marked; people I disconnected, or who blocked me, are not ([[S-23 Connections Story|Connections · S19–S24]] S1).
- [ ] Each row opens s47; the list carries the person's user id so the detail and the perspectives call can be made.

### S7 · Review requests after an event ([[Screen Index#s62|s62]])

**As a** Ring owner closing an event, **I want** *Review 4* to walk me through the requests that event produced, **so that** I place each one before the Event Ring expires.

Acceptance criteria:
- [ ] The count on s62 equals the number of pending incoming requests created during the event's window.
- [ ] Each review step is the s46 sheet; *Not now* skips to the next; the summary updates its count as requests are settled.

### S8 · Ask to connect from a scanned card ([[Screen Index#s44|s44]])

*From T-021 Connect request send, inbox, cancel (status then: To do), merged 2026-10-27.*

**As a** requester **I want** *Connect* on the card I just scanned **so that** this person can let me into one of their Rings.

Acceptance criteria:
- [ ] *Connect* sends `POST /connections/requests` addressed to the person on the card. The id comes from the scan ([[S-37 Badge & QR Story|Badge & QR · S13–S18]]) or the lookup, never derived from the view.
- [ ] The request may carry a **note** ("We met at TechSummit"): optional, at most **200 characters**; a longer one is refused with a validation error and the app counts characters as they are typed. The receiver sees the note on the request (S3).
- [ ] The button becomes *Requested* and stays so after leaving and coming back.
- [ ] Asking again while a request is pending doesn't create a second one: the same request comes back.
- [ ] After a decline or an expiry the button offers *Connect* again, and asking sends a **new** request straight away; there is no waiting period ([[D-17 Requests expire after 30 days, optional note, ask again at once]]).
- [ ] Asking someone I'm already connected with says so, instead of sending.

### S9 · A blocked pair learns nothing ([[Screen Index#s44|s44]])

**As a** person who blocked someone **I want** their request to fail exactly like an unavailable profile **so that** they can't tell they're blocked.

Acceptance criteria:
- [ ] Sending to someone who blocked me, or whom I blocked, answers the same 404 body as `/views` ("This profile isn't available to you").
- [ ] Nothing in the wording, timing or status says "blocked". A block is never shown as a decline.

### S10 · See who wants to connect ([[Screen Index#s45|s45]])

**As a** receiver **I want** my incoming requests in one list **so that** I answer them when I have a moment.

Acceptance criteria:
- [ ] `GET /connections/requests?direction=incoming` lists pending requests, newest first, paged (`limit` ≤ 50, `meta.total`).
- [ ] Each row has the person's `displayName`, `pinName`, `avatarFileId` (shown once [[S-06 Files Upload Story|Files Upload · showing files]] ships), when it was sent, where from (scan, event) if known, and the **note** if there is one.
- [ ] The tab label shows `meta.total`.
- [ ] Accept and Decline on a row lead to [[S-23 Connections Story|Connections · S13–S18]].
- [ ] A request left unanswered for **30 days expires**: it leaves the incoming list and closes with no connection.

### S11 · See and cancel what I sent ([[Screen Index#s45|s45]])

**As a** requester **I want** my sent requests listed with what happened to them **so that** I know where I stand and can take one back.

Acceptance criteria:
- [ ] `GET /connections/requests?direction=sent` lists my requests the same way, each with its **status**: pending, declined or expired ([[D-13 The requester sees a declined request]]). Accepted and cancelled requests leave the list.
- [ ] A **declined** request reads as declined, and an **expired** one as expired (no answer in 30 days); both offer *Connect* again (S1).
- [ ] *Cancel* (`DELETE /connections/requests/:id`) on a pending request removes it at once (optimistic) and from the receiver's inbox.
- [ ] Cancelling a request that was just accepted, declined or expired refreshes the list instead of failing loudly.

### S12 · The other person sees the request

**As a** receiver **I want** to know a request came in **so that** I don't miss it.

Acceptance criteria:
- [ ] The People tile shows a count of pending incoming requests. Push and the inbox are [[S-96 Notifications Story|Notifications · S7]]; until then the count refetches on focus, at most once a minute.

### S13 · Accept into the right Ring ([[Screen Index#s46|s46]])

*From T-022 Accept into a Ring (sets grantedRingId) (status then: To do), merged 2026-10-27.*

**As a** receiver **I want** to accept a request and choose the Ring this person goes into **so that** they see the version of me I meant.

Acceptance criteria:
- [ ] s46 lists my live Rings from `GET /rings` (not `EVENT` or `MEETING` Rings unless the request came from that event), and shows the request's note if it has one.
- [ ] Accept sends the request id and the chosen `ringId`, and in **one transaction** the server creates the connection, adds the requester as a member of that Ring and records `grantedRingId`. All three happen or none do.
- [ ] The app shows the result only after the server answers (no optimistic accept); the request leaves the inbox.

### S14 · Only for a while ([[Screen Index#s46|s46]])

**As a** receiver **I want** to let someone in for a limited time **so that** event contacts don't keep access forever.

Acceptance criteria:
- [ ] Accept takes an optional `startsAt` / `expiresAt` for the membership; without them, access is open-ended.

### S15 · The requester never learns the Ring

**As a** receiver **I want** the Ring I chose kept private **so that** nobody knows they're in "Acquaintances" rather than "Friends".

Acceptance criteria:
- [ ] `grantedRingId` is never returned to the requester, in any response.
- [ ] On the requester's side the connection appears, and the Ring's view becomes readable. On their Shared with me ([[Screen Index#s17|s17]]) I appear as a person ("Sam's card"), never with the Ring's name, colour or type ([[D-14 Shared with me lists people, never the Ring]]).

### S16 · Decline ([[Screen Index#s45|s45]])

**As a** receiver **I want** to decline **so that** the request goes away without a connection.

Acceptance criteria:
- [ ] Decline closes the request as **declined**; no connection, no membership.
- [ ] The requester **sees the decline**: the request shows as declined on their Sent list and on my card's button ([[D-13 The requester sees a declined request]], [[S-23 Connections Story|Connections · S8–S12]] S4).
- [ ] The requester can **ask again straight away**; a new request arrives in my inbox like any other ([[D-17 Requests expire after 30 days, optional note, ask again at once]]). If I don't want that, I block them ([[S-23 Connections Story|Connections · S25]]), which never reads as a decline.

### S17 · It shows up everywhere at once

**As a** receiver **I want** the new person to appear where I'd look **so that** I can find them again.

Acceptance criteria:
- [ ] They're on the Ring's People tab ([[Screen Index#s15|s15]]) and in the Ring's `memberCount` ([[S-03 Counts Story|Counts · S6–S10]]) on the next fetch.
- [ ] My connection count ([[S-03 Counts Story|Counts · S11]]) goes up by one.
- [ ] Accepting someone already in that Ring is treated as done (`E_RING_MEMBER_01`), not as an error.

### S18 · When adding them isn't allowed ([[Screen Index#s46|s46]])

**As a** receiver **I want** a clear, quiet failure **so that** I'm not shown something I can't act on.

Acceptance criteria:
- [ ] A Ring that's been deleted since the picker loaded, or isn't mine: 404 `E_RING_02`; the app refetches the picker.
- [ ] A user who can't be added because a block exists in either direction: 409 `E_RING_MEMBER_04`, "Cannot add this user", without saying why.
- [ ] A request already cancelled by the requester, or expired: the row leaves the inbox.

### S19 · My contacts, searchable (People from [[Screen Index#s38|s38]])

*From T-023 Connection detail and contacts list (status then: To do), merged 2026-10-27.*

**As a** user **I want** a list of everyone I'm connected with **so that** I find someone again without scanning them twice.

Acceptance criteria:
- [ ] `GET /connections` lists my connections, paged (`limit` ≤ 50, `meta.total`), sorted by display name.
- [ ] Each row has the person's `userId`, `displayName`, `pinName`, `avatarFileId` (shown once [[S-06 Files Upload Story|Files Upload · showing files]] ships) and when we connected.
- [ ] A search (`q`) matches name or Pin name, only within my own connections; it never finds strangers.
- [ ] Someone I removed from all my Rings but did not disconnect **is listed**, marked as having no access; I can add them to a Ring again without a new request.
- [ ] Someone I **disconnected**, or who blocked me, is not listed.

### S20 · Who they are and where they sit ([[Screen Index#s47|s47]])

**As a** Ring owner **I want** a detail screen for one connection **so that** I see which of my Rings they're in, until when, and what they therefore see.

Acceptance criteria:
- [ ] The detail returns the person, the date we connected, and **the list of my Rings they're in** (one or several) with each membership's `startsAt` / `expiresAt`; an empty list when they have no access.
- [ ] Only I see which of my Rings they're in; nothing of it reaches them ([[D-14 Shared with me lists people, never the Ring]]).
- [ ] From here, the actions that exist already: add to another of my Rings (`POST /rings/:ringId/members`), move to another Ring (`POST …/members/:userId/reassign`), change the window (`PATCH …/members/:userId`), remove (`DELETE …/members/:userId`). After each, the screen refetches.
- [ ] Removing them from the **last** of my Rings asks: *Remove from Rings* (they stay a connection with no access) or *Disconnect* (the connection ends and they leave my contacts; getting back in takes a new request). Not available yet: there is no disconnect endpoint.
- [ ] When they are in several of my Rings, they see the version from the Ring they were put in first.

### S21 · What they share with me ([[Screen Index#s47|s47]], [[Screen Index#s31|s31]])

**As a** user **I want** to open everything a connection shares with me **so that** I see their card the way they meant me to.

Acceptance criteria:
- [ ] Tapping a contact opens their perspectives through `GET /views/user/:userId/perspectives`, which exists, using the `userId` from S1.
- [ ] Empty perspectives (they share nothing with me, or access lapsed) read "Nothing shared with you right now".

### S22 · Names and faces on the People tab ([[Screen Index#s15|s15]])

**As a** Ring owner **I want** each member of my Ring shown by name, Pin name and photo **so that** the roster is people, not ids.

Acceptance criteria:
- [ ] Every member row (`GET /rings/:ringId/members`) carries the member's `displayName`, `pinName` and `avatarFileId`, or the app can get them for every member in one request, not one per row.
- [ ] A row opens that person's connection detail (S2).

### S23 · Picking people for a Ring (New Ring step 2, [[Screen Index#s19|s19]])

**As a** Ring owner **I want** to pick connections when I create a Ring **so that** it starts with the right people.

Acceptance criteria:
- [ ] Step 2 lists my connections from S1, including those with no access, searchable; the picked ones are added after the Ring is created (`POST /rings/:ringId/members`).

### S24 · What we have in common ([[Screen Index#s47|s47]])

**As a** user **I want** events in common and mutual connections **so that** I remember how I know this person.

Acceptance criteria:
- [ ] Events in common: may ship after the events features; until then the section is hidden, not empty.
- [ ] Mutual connections: only people who are connections of both of us, and only where a Ring's "members can see each other" is on (off by default, [[D-04 Ring settings at launch and their defaults]]); hidden otherwise. Not available yet: the setting does not exist.

### S25 · Block and unblock

*From T-024 (status then: To do), merged 2026-10-27.*

`POST/DELETE /blocks/:userId`. `UserBlock` is already enforced by `RingAccessService`. Blocking removes both directions of membership.

Screens: [[Screen Index#s47|s47]] Connection detail


### S26 · Introduce a connection to another

*From T-025 (status then: Needs a decision), merged 2026-10-27.*

Semantics unclear: does an introduction create a request on behalf of someone? Needs product input.

Screens: [[Screen Index#s47|s47]] Connection detail

## States and motion the design asks for

- State: no requests (empty), pending, accepted, declined, expired; *Requested*, *Declined*, *Expired* on the requester's button.
- Motion: accept = the person's card **slides into the chosen Ring** on the sheet (spatial confirmation); reassignment on s47 animates the move between Rings; reduced-motion fallback is a fade.
- State on s47: the Ring row is owner-only; mutual connections and events in common list only what the current user may see and never name a Ring of the other person.
- (Connections · S8–S12) s44: *Connect* → sending → *Requested*; *Declined* or *Expired* with *Connect* again; not available (404).
- (Connections · S8–S12) s45: Incoming / Sent segments with counts; a row per request, with its note; on Sent, the status of each row; empty ("No requests yet"); an incoming row leaves the list once answered, cancelled or expired.
- (Connections · S8–S12) Motion: none beyond the design's row exit.
- (Connections · S13–S18) s46: the Ring picker with one Ring selected (the design opens with a suggestion picked: [[S-89 Gemma AI Story|Gemma AI · S7]]); the request's note; optional access window; *Accept into <Ring>* → saving → done.
- (Connections · S13–S18) s45: a row leaves the list after accept or decline.
- (Connections · S13–S18) Motion: none beyond the row exit.
- (Connections · S19–S24) Contacts: list, search with no results ("No one by that name"), empty ("No connections yet. Scan someone to start"); a "No access" marker on a connection in none of my Rings.
- (Connections · S19–S24) s47: loading; the person; their Rings with windows; actions; the *Remove from Rings* / *Disconnect* choice at the last removal; refreshing after an action.
- (Connections · S19–S24) No avatars until Files Upload shows files (S7–S11): initials.
- (Connections · S19–S24) Motion: none asked for.

## Rules the backend already enforces

- A block is mutual and overrides membership in both directions ([[Ring Access Model]]); `POST /rings/:ringId/members` already refuses a blocked pair with 409 `E_RING_MEMBER_04`, so acceptance of a blocked requester must fail the same way, surfaced as the neutral 404 to the requester.
- Reassign and revoke on s47 exist today (`POST …/reassign`, `DELETE …/members/:userId`, [[BI-06 Ring Members Backend Integration]]) and take effect on the person's next request; both Rings must share an owner (400 `E_RING_07`).
- "Not shared", "blocked" and "no such pin" are one 404 (`E_RING_ACCESS_01`); Connections · S8–S12 extends the same body to sending a request.
- `ConnectionRequest.grantedRingId` is never exposed to the requester; `RingProfileViewEntity` has no `ringId`.
- The owner may add a member only to a Ring they own or administer at `MEMBER_MANAGER` level; the picker on s46 must list only those.
- (Connections · S8–S12) Views resolve through `RingAccessService` with one 404 for missing, not shared and blocked; the send must reuse that body.
- (Connections · S8–S12) `{ data, meta: { total } }` pagination with `limit` ≤ 50, as every list.
- (Connections · S8–S12) Membership and which Ring someone is in are private to the owner.
- (Connections · S13–S18) `POST /rings/:ringId/members` already grants a Ring's view to a user, and re-adding someone whose access lapsed reactivates their row; accept should reuse it inside the transaction.
- (Connections · S13–S18) Reassign (`POST …/members/:userId/reassign`) moves a member in one transaction, so they never see two perspectives at once; revoke marks the row `REMOVED`.
- (Connections · S13–S18) Only the owner or a delegated admin manages a Ring's members ([[S-31 Delegated Admins Story|Delegated Admins · S6]]).
- (Connections · S13–S18) Not available yet: `GET /rings/shared-with-me` still returns the Ring's name to members; hiding it is the change [[D-14 Shared with me lists people, never the Ring]] asks of [[F-11 Rings]].
- (Connections · S19–S24) Reassign moves a member in one transaction, so they never see two perspectives at once; revoke marks the row `REMOVED`, never deleted.
- (Connections · S19–S24) The roster is owner or delegated-admin only; a member never sees who else is in a Ring unless the Ring's "members can see each other" is on ([[D-04 Ring settings at launch and their defaults]], not available yet).
- (Connections · S19–S24) `GET /views/user/:userId/perspectives` returns only what is live and shared with the caller.
- (Connections · S19–S24) Blocks hide in both directions with the same 404 as views ([[S-23 Connections Story|Connections · S25]]).

## Open questions

- [[S-23 Connections Story|Connections · S26]] — semantics of *Introduce* on s47 (a request on someone's behalf, or a suggestion to Gemma); the button stays disabled until decided.
- [[ND-10 How Connect addresses the scanned person]] — open; blocks S1's addressing ([[S-23 Connections Story|Connections · S8–S12]]).
- Decided: [[D-13 The requester sees a declined request]], [[D-14 Shared with me lists people, never the Ring]] (a connection-granted membership lists as the person, never the Ring's name; not available yet), [[D-15 Several Rings per connection, remove or disconnect]], [[D-17 Requests expire after 30 days, optional note, ask again at once]].
- Mutual connections on s47 count only where a Ring's "members can see each other" is on (off by default, [[D-04 Ring settings at launch and their defaults]]); otherwise they are computed over the viewer's own connections only.
- The disconnect route, and whether the other person is told anything (D-15, *Still open*).
- [[S-89 Gemma AI Story|Gemma AI · S7]] — the suggested Ring on s46; the default Ring is the fallback.
- (Connections · S8–S12) **The receiver's id** ([[ND-10 How Connect addresses the scanned person]]). The view body has no user id. The app needs it from the scan ([[S-37 Badge & QR Story|Badge & QR · S13–S18]]) or from a `pinName` lookup; or the request accepts the scanned token or the `pinName` and resolves the person itself. This story stays Blocked · ND-10 until it is decided.
- (Connections · S8–S12) How long a declined or expired request stays on the Sent list, and whether the receiver is reminded before a request expires (left open by [[D-17 Requests expire after 30 days, optional note, ask again at once]]).
- (Connections · S13–S18) **Accept route.** `POST /connections/requests/:id/accept { ringId, startsAt?, expiresAt? }` and `…/decline`, or a status `PATCH`.
- (Connections · S13–S18) **The suggested Ring.** Whether the server suggests a Ring now (by last used, by event), or s46 opens with none picked until [[S-89 Gemma AI Story|Gemma AI · S7]].
- (Connections · S19–S24) **Member identity: on the roster or from contacts.** Add `displayName`, `pinName`, `avatarFileId` to `RingMemberEntity`, or have the app join the roster with `GET /connections`. On the roster is one request and works for members added without a connection.
- (Connections · S19–S24) **Disconnect.** Its route, and whether the other person is told anything (left open by [[D-15 Several Rings per connection, remove or disconnect]]).

