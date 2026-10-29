---
id: S-16
type: story
module: identity
feature: ring-members
status: approved
scope: feature
screens: [s15, s16, s35, s46, s47]
approvedBy: "Omar Fostok"
approvedAt: 2026-10-29
owner: "Omar Fostok"
related: ["D-04 Ring settings at launch and their defaults", "D-14 Shared with me lists people, never the Ring", "D-15 Several Rings per connection, remove or disconnect", "D-18 Ring names shown when joined knowingly", "S-18 Rings Story", "S-15 Ring Access Engine Story", "S-23 Connections Story", "S-33 Ring Invitations & Join Story"]
created: 2026-10-18
updated: 2026-10-29
tags: [story, story/approved, module/identity, layer/business]
---

# Ring Members · User Story

**Feature:** [[F-09 Ring Members]] · **Status:** Approved 2026-10-29 by Omar Fostok (first approved 2026-10-25 by khaled; reworked 2026-10-29 by the design review: S1, S3, S4, S5, S8 changed, S9 added) · **Frontend Requirements:** [[FR-09 Ring Members Frontend Requirements]] · **Backend Integration:** [[BI-06 Ring Members Backend Integration]]

A Ring owner manages who is in a Ring: sees the roster, adds someone, gives them a time-boxed window, moves them between Rings when the relationship changes, or removes them. Every change is live: the person's next request already reflects it. One person can be in several of the owner's Rings ([[D-15 Several Rings per connection, remove or disconnect]]). The roster is the owner's private view: a member sees the other members only when the Ring's "members can see each other" is on ([[D-04 Ring settings at launch and their defaults]]), and never learns which Ring they are in ([[D-14 Shared with me lists people, never the Ring]]) unless they joined it themselves; every membership records how it was created ([[D-18 Ring names shown when joined knowingly]]).

## Persona

A Ring owner (or, later, a delegated admin at `MEMBER_MANAGER` level) on Ring people ([[Screen Index#s15|s15]]) or on a Connection detail ([[Screen Index#s47|s47]]), deciding who belongs to which audience, often right after an event.

## Stories

### S1 · Ring people roster ([[Screen Index#s15|s15]])

**As a** Ring owner **I want** to see who is in this Ring **so that** I know which audience my Ring reaches.

Acceptance criteria:
- [ ] The list comes from `GET /rings/:ringId/members?status=ACTIVE`, newest first, paginated (`limit` ≤ 50) with `meta.total` as the header count. The header reads "**N people**" (members aren't always connections; the design's "148 connections" is out of date).
- [ ] A row shows, **always**: the person's **name** and **headline** (from what they share with me, [[S-23 Connections Story|Connections · S19–S24]]) and **when they were added** ("Today", "2 days", from `createdAt`); **only when set**: the window ("until 12 Nov"; "until removed" is the default and isn't printed); **only when passed**: a "**lapsed**" chip (S6).
- [ ] Until names exist, a row shows a placeholder identity ("Member") with the added date and the window.
- [ ] **Search** "Search N people": by name and Pin name, over the **whole** roster, done by the backend, so it works with paging; "No one here matches that search." when nothing matches. Not available yet: the members list has no name filter, and names don't exist yet.
- [ ] **Filters: All · Pending · N.** All is every active member; Pending is the people waiting to join this Ring (S9). Pending is hidden while nobody is waiting, and the filter row is hidden until join requests exist. The design's "Recent" and "Never met" are later (Open questions).
- [ ] A 403 hides the screen quietly: the current user is a member looking at someone else's Ring.
- [ ] Empty state: "Nobody in this Ring yet", with Add and Scan someone in ([[Screen Index#s35|s35]]).
- [ ] The footnote follows the Ring's "members can see each other": off (the default, and every Ring until the setting exists) "Members never see who else is in this Ring — only you do."; on "Members of this Ring can see each other." ([[S-15 Ring Access Engine Story|Ring Access Engine · S8]]).

### S2 · Add someone ([[Screen Index#s15|s15]])

**As a** Ring owner **I want** to add a person with an optional window **so that** they see this Ring from now, or from a date, until a date.

Acceptance criteria:
- [ ] `POST /rings/:ringId/members { userId, startsAt?, expiresAt? }`; on 201 the roster refetches and the new row appears first.
- [ ] Adding yourself reads "You are the owner of this Ring" (400); an already-active member is a no-op with a refresh (409 `E_RING_MEMBER_01`); a pair with a block reads "Cannot add this user" (409 `E_RING_MEMBER_04`).
- [ ] Re-adding someone who was removed or lapsed reactivates them with the new window.
- [ ] Adding someone who is already in another of my Rings is allowed: they are then in several of my Rings and see the version from the Ring they were put in first ([[D-15 Several Rings per connection, remove or disconnect]]).
- [ ] The source of a `userId` is the connect flow (Add → [[Screen Index#s46|s46]]) or a scan ([[Screen Index#s35|s35]]), neither of which exists yet; the buttons lead there only when those flows ship.

### S3 · Set or change the access window ([[Screen Index#s47|s47]])

**As a** Ring owner **I want** to set when a person's access starts and ends **so that** a contractor sees my Company Ring for the length of the contract.

Acceptance criteria:
- [ ] Under each **ticked** Ring on s47 (S5), one line: "**Until removed ›**" (the default), "**Until 12 Nov ›**", "**From 3 Nov ›**", "**3 Nov – 12 Nov ›**"; a lapsed one reads "**Lapsed** 12 Nov ›". The window is **per Ring**.
- [ ] Tapping it opens start and end date-time pickers, each with "No start" / "Until removed" to clear it (sent as `null`); saved with `PATCH /rings/:ringId/members/:userId { startsAt?, expiresAt? }`; the line re-renders from the response.
- [ ] The copy explains that the Ring's own window also applies: "The Ring's own end date also applies: whichever comes first ends access."; the Ring's `expiresAt`, when it has one, is shown next to the pickers.
- [ ] **For the designer:** the line, its lapsed variant and the pickers are not drawn.

### S4 · Bring people in from another Ring ("Move from a Ring" on [[Screen Index#s15|s15]])

**As a** Ring owner **I want** to move several people from another of my Rings into this one in one go **so that** what they see changes at once.

Acceptance criteria:
- [ ] "Move from a Ring" on s15 opens: (1) a list of my other Rings (like My Rings, [[Screen Index#s16|s16]], without this one); (2) that Ring's roster, where I tick several people (with search); (3) "Move N people to <Ring>".
- [ ] Each is moved with `POST /rings/<other>/members/:userId/reassign { toRingId: <this> }`: in one step they **leave the other Ring and join this one**, keeping their window; both rosters refetch; "What they see just changed".
- [ ] Someone already in this Ring is shown ticked and can't be picked. A cross-owner target is refused (400 `E_RING_07`), which the picker prevents.
- [ ] It's a **move, not a copy**: to have someone in both Rings, tick the second Ring on s47 (S5).
- [ ] The move animates as the cards sliding into this Ring ([[Wireframe Brief#Connection motion & states|§5.2]]).
- [ ] **For the designer:** the two steps after the button and the confirmation are not drawn (the prototype links to s16).

### S5 · Which of my Rings someone is in ([[Screen Index#s47|s47]])

**As a** Ring owner **I want** to tick the Rings a person belongs to **so that** I add, remove or move them in one place.

Acceptance criteria:
- [ ] "IN RING — VISIBLE TO YOU ONLY" on s47 is a **checklist** of my Rings, with the ones this person is in ticked. Not available yet: no call returns, for one person, which of my Rings they're in (today that means reading every Ring's roster).
- [ ] **Tick a Ring:** they're added to it at once (`POST /rings/:ringId/members { userId }`), "until removed" (S3), recorded as **placed by me**, so they never see that Ring's name (D-18).
- [ ] **Untick a Ring:** after "Remove <name> from <Ring>?", they're removed from it (`DELETE /rings/:ringId/members/:userId` → `REMOVED`; the roster always filters `ACTIVE`).
- [ ] **Untick the last Ring:** asks **Remove from Rings** (they stay a connection with no access, and I can tick a Ring again without a new request) or **Disconnect** (the connection ends; getting back in takes a new request) ([[D-15 Several Rings per connection, remove or disconnect]]). Not available yet: there is no disconnect endpoint ([[S-23 Connections Story]]).
- [ ] **Moving** someone = tick the new Ring, then untick the old. The app always **adds first**, so there's no moment with no access. With several Rings, they see the version from the Ring they were put in first; after a move, the one they're left in.
- [ ] **"Revoke access"** at the bottom = remove them from **all** my Rings: the same as unticking every Ring, ending with the last-Ring question; then back to s15.
- [ ] Each change is live with "What they see just changed"; the person's next `/views` call already reflects it; the client doesn't need to tell them. If a call fails, the tick goes back and the list refetches.
- [ ] **For the designer:** the untick confirmation and the last-Ring question are not drawn.

### S6 · Lapsed, not expired (journey, [[Screen Index#s15|s15]])

**As a** Ring owner **I want** to see who has lapsed **so that** I can extend or clean up.

Acceptance criteria:
- [ ] "Lapsed" is computed from `expiresAt < now` on an `ACTIVE` row; the backend never writes `EXPIRED`.
- [ ] Extending sets a new `expiresAt` through S3; no re-add is needed.

### S7 · The member side shows nothing (journey, no prototype screen)

**As a** member **I want** the app never to tell me which of someone's Rings I am in **so that** the owner's grouping stays theirs.

Acceptance criteria:
- [ ] No screen on the member's side reads a membership row; there is no route for it.
- [ ] Shared with me shows the person who shares and their projection, never the Ring's colour or type, never the roster or the member's own row ([[D-14 Shared with me lists people, never the Ring]], [[S-15 Ring Access Engine Story|Ring Access Engine · S1]]).
- [ ] The Ring's **name** is shown only to a member who joined it by invitation, code or work email; a member the owner added, accepted from a request, ticked on s47 or moved into the Ring is never told its name ([[D-18 Ring names shown when joined knowingly]]). Adding (S2, S5) and moving (S4) record the membership as placed by the owner; approving a join request (S9) records it as joined knowingly.
- [ ] Not available yet: the endpoint returns the Ring's name to every member today, and a membership does not record how it was created.

### S8 · Members who may see each other (journey, a person's card opened from [[Screen Index#s17|s17]])

**As a** member of a Ring whose owner turned on "members can see each other" **I want** to see who else is in it **so that** a team or a community knows itself.

Acceptance criteria:
- [ ] **Only when** the Ring I'm in has "members can see each other" **on** (off by default, [[D-04 Ring settings at launch and their defaults]]), the person's card I open from Shared with me has a section "**Members · N**": the other members, newest first, with search past a screenful.
- [ ] Each entry is that member's **full card**: the card each member shares with that Ring (D-04's natural reading, Open questions); tapping one opens it.
- [ ] Never shown to a member: the Ring's name (unless joined knowingly, D-18), anyone's window or lapsed state, people waiting to join, the owner's actions. The owner isn't listed (they're the card I opened). A blocked pair never appears in each other's list.
- [ ] Off: no section, no count, nothing that hints there's a list ([[S-15 Ring Access Engine Story|Ring Access Engine · S8]]).
- [ ] **For the designer:** the section is not drawn.
- [ ] Not available yet: the setting does not exist ([[S-18 Rings Story|Rings · S9]] builds it) and there is no member-facing route; until then every Ring is off and nothing shows.

### S9 · Approve people who asked to join this Ring ([[Screen Index#s15|s15]])

**As a** Ring owner **I want** to see and approve the people waiting to join this Ring **so that** a Ring that approves each request stays mine to fill.

Acceptance criteria:
- [ ] "**Waiting on you · N**" on s15 lists the people who **asked to join this Ring** and wait for my approval, which happens when the Ring's "approve each one" is on (the default, D-04). How a request is made is [[S-33 Ring Invitations & Join Story]].
- [ ] Each row: the person (name, headline), how they asked ("Asked to join with your code", "Asked to join from your public card"), how long ago, **Add** and **Decline**.
- [ ] **Add** makes them a member of this Ring at once, recorded as **joined knowingly** (they may see the Ring's name, D-18); **Decline** removes the request.
- [ ] **Not here:** people who only scanned my badge. A scan isn't asking to join; it belongs to [[F-18 Badge & QR]], and a connection request goes to Requests ([[Screen Index#s45|s45]]), where accepting picks a Ring (s46).
- [ ] Hidden while nobody is waiting; the "Pending" filter (S1) follows it.
- [ ] **For the designer:** s15's waiting rows get a Decline next to Add, and the "Scanned your badge" example becomes a join request.
- [ ] Not available yet: nothing creates join requests ([[S-33 Ring Invitations & Join Story]]).

## States and motion the design asks for

- State: roster, empty, search with no match, row with a window, lapsed chip, waiting requests, checklist ticked / unticked, untick confirmation, the last-Ring question, window line and pickers, read-only (403), placeholder identity until names exist, the members section (only when the setting is on).
- Motion: accept = a card slides into the chosen Ring; a move animates between Rings; a removal collapses the row out. Reduced motion: fades.

## Rules the backend already enforces

- Every method is owner-or-admin through `assertCanAdminister(…, 'MEMBER_MANAGER')`; no member-facing read path exists because the row names the Ring.
- `POST` refuses the owner (400 `E_RING_MEMBER_03`), a blocked pair (409 `E_RING_MEMBER_04`), an active member (409 `E_RING_MEMBER_01`), and upserts on `(ring, user)` so a removed or lapsed member is reactivated with the new window.
- `reassign` requires both Rings to share an owner (400 `E_RING_07`) and runs the remove and the upsert in one transaction; there is no instant where the person sees both or neither.
- `DELETE` marks `REMOVED`; `RING_MEMBER_STATUS.EXPIRED` is never written; the engine evaluates windows live.
- `GET` lists newest first with an optional `status` filter.

## Open questions

- Decided: [[D-04 Ring settings at launch and their defaults]] (S8, S9), [[D-14 Shared with me lists people, never the Ring]] and [[D-18 Ring names shown when joined knowingly]] (S7), [[D-15 Several Rings per connection, remove or disconnect]] (S2, S5). The "members can see each other" and "approve each one" settings are built in [[S-18 Rings Story|Rings · S9]]; the disconnect route is [[S-23 Connections Story]]'s; join requests are [[S-33 Ring Invitations & Join Story]]'s.
- A member reassigned from a Ring they joined knowingly: D-18 reads the move as the owner placing them, so the new Ring is not named (D-18, *Still open*).
- **Whose card a member sees** when members can see each other: the card each member shares with that Ring is the natural reading (D-04, *Still open*); S8 uses it.
- The disconnect route, and whether the other person is told anything (D-15, *Still open*; see [[S-23 Connections Story|Connections · S19–S24]]).
- Later, not in v1: the "**Recent**" and "**Never met**" filters on s15; they need a "last met" date that meetings or scans would record.
