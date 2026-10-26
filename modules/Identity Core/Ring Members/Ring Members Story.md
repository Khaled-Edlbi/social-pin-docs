---
type: story
code: ring-members
scope: feature
feature: ring-members
module: identity
status: approved
screens: [s15, s47]
approvedBy: "khaled"
approvedAt: 2026-10-25
created: 2026-10-18
updated: 2026-10-26
owner: "omar"
related: ["D-04 Ring settings at launch and their defaults", "D-14 Shared with me lists people, never the Ring", "D-15 Several Rings per connection, remove or disconnect", "D-18 Ring names shown when joined knowingly"]
tags: [story, story/approved, module/identity, layer/business]
---

# Ring Members · User Story

**Feature:** [[Ring Members]] · **Status:** Approved 2026-10-25 by khaled · **Frontend Requirements:** [[Ring Members Frontend Requirements]] · **Backend Integration:** [[Ring Members Backend Integration]]

A Ring owner manages who is in a Ring: sees the roster, adds someone, gives them a time-boxed window, moves them to another Ring when the relationship changes, or revokes them. Every change is live: the person's next request already reflects it. One person can be in several of the owner's Rings ([[D-15 Several Rings per connection, remove or disconnect]]). The roster is the owner's private view: a member sees the other members only when the Ring's "members can see each other" is on ([[D-04 Ring settings at launch and their defaults]]), and never learns which Ring they are in ([[D-14 Shared with me lists people, never the Ring]]) unless they joined it themselves; every membership records how it was created ([[D-18 Ring names shown when joined knowingly]]).

## Persona

A Ring owner (or, later, a delegated admin at `MEMBER_MANAGER` level) on Ring people ([[Screen Index#s15|s15]]) or on a Connection detail ([[Screen Index#s47|s47]]), deciding who belongs to which audience, often right after an event.

## Stories

### S1 · Ring people roster ([[Screen Index#s15|s15]])

**As a** Ring owner **I want** to see who is in this Ring **so that** I know which audience my Ring reaches.

Acceptance criteria:
- [ ] The list comes from `GET /rings/:ringId/members?status=ACTIVE`, newest first, paginated (`limit` ≤ 50) with `meta.total` as the header count.
- [ ] A row shows the person, their window ("until 12 Nov", "until removed") and a "lapsed" chip computed from `expiresAt` in the past.
- [ ] Today a row carries `userId` only; the UI shows a placeholder identity ("Member") until names exist ([[T-023 Connection detail and contacts list]]).
- [ ] A 403 hides the screen quietly: the current user is a member looking at someone else's Ring.
- [ ] Empty state: "Nobody in this Ring yet", with Add and Scan someone in.

### S2 · Add someone ([[Screen Index#s15|s15]])

**As a** Ring owner **I want** to add a person with an optional window **so that** they see this Ring from now, or from a date, until a date.

Acceptance criteria:
- [ ] `POST /rings/:ringId/members { userId, startsAt?, expiresAt? }`; on 201 the roster refetches and the new row appears first.
- [ ] Adding yourself reads "You are the owner of this Ring" (400); an already-active member is a no-op with a refresh (409 `E_RING_MEMBER_01`); a pair with a block reads "Cannot add this user" (409 `E_RING_MEMBER_04`).
- [ ] Re-adding someone who was removed or lapsed reactivates them with the new window.
- [ ] Adding someone who is already in another of my Rings is allowed: they are then in several of my Rings and see the version from the Ring they were put in first ([[D-15 Several Rings per connection, remove or disconnect]]).
- [ ] The source of a `userId` is the connect flow or a scan, neither of which exists yet; the Add button leads to s46 only when that flow ships.

### S3 · Set or change the access window ([[Screen Index#s47|s47]])

**As a** Ring owner **I want** to set when a person's access starts and ends **so that** a contractor sees my Company Ring for the length of the contract.

Acceptance criteria:
- [ ] Date-time pickers for `startsAt` and `expiresAt`; "Until removed" clears a bound by sending `null`.
- [ ] `PATCH /rings/:ringId/members/:userId`; the row re-renders from the response.
- [ ] The copy explains that the Ring's own window also applies: whichever closes first ends access.

### S4 · Move to another Ring ([[Screen Index#s47|s47]], "Move from a Ring" on [[Screen Index#s15|s15]])

**As a** Ring owner **I want** to move a person from Clients to Investors in one step **so that** what they see changes at once.

Acceptance criteria:
- [ ] A picker of the owner's other Rings; `POST …/members/:userId/reassign { toRingId }`.
- [ ] The move animates as the card sliding from the source Ring into the target ([[Wireframe Brief#Connection motion & states|§5.2]]), with the copy "What they see just changed".
- [ ] The window travels with the person; both rosters refetch; a cross-owner target is refused (400 `E_RING_07`), which the picker prevents.

### S5 · Revoke access ([[Screen Index#s47|s47]])

**As a** Ring owner **I want** to remove a person from a Ring **so that** they stop seeing this perspective immediately.

Acceptance criteria:
- [ ] "Revoke access" behind a confirmation; `DELETE /rings/:ringId/members/:userId` → 200; back to s15 with the row gone.
- [ ] The row is kept server-side as `REMOVED`; with no `status` filter it still appears, so the roster always filters `ACTIVE`.
- [ ] The person's next `/views` call already fails; the client does not need to tell them.
- [ ] Removing someone from the **last** of my Rings asks: **Remove from Rings** (they stay a connection with no access, and I can add them to a Ring again without a new request) or **Disconnect** (the connection ends; getting back in takes a new request) ([[D-15 Several Rings per connection, remove or disconnect]]). Removing from a Ring that is not the last asks nothing. Not available yet: there is no disconnect endpoint.

### S6 · Lapsed, not expired (journey, [[Screen Index#s15|s15]])

**As a** Ring owner **I want** to see who has lapsed **so that** I can extend or clean up.

Acceptance criteria:
- [ ] "Lapsed" is computed from `expiresAt < now` on an `ACTIVE` row; the backend never writes `EXPIRED`.
- [ ] Extending sets a new `expiresAt` through S3; no re-add is needed.

### S7 · The member side shows nothing (journey, no prototype screen)

**As a** member **I want** the app never to tell me which of someone's Rings I am in **so that** the owner's grouping stays theirs.

Acceptance criteria:
- [ ] No screen on the member's side reads a membership row; there is no route for it.
- [ ] Shared with me shows the person who shares and their projection, never the Ring's colour or type, never the roster or the member's own row ([[D-14 Shared with me lists people, never the Ring]], [[Rings Story]] S3).
- [ ] The Ring's **name** is shown only to a member who joined it by invitation, code or work email; a member the owner added, accepted from a request, or reassigned into the Ring is never told its name ([[D-18 Ring names shown when joined knowingly]]). Adding (S2) and moving (S4) record the membership as placed by the owner.
- [ ] Not available yet: the endpoint returns the Ring's name to every member today, and a membership does not record how it was created.

### S8 · Members who may see each other (journey, [[Screen Index#s15|s15]])

**As a** member of a Ring whose owner turned on "members can see each other" **I want** to see who else is in it **so that** a team or a community knows itself.

Acceptance criteria:
- [ ] Only when the Ring's "members can see each other" is on (off by default) does a member see the other members, with their **full cards** ([[D-04 Ring settings at launch and their defaults]]).
- [ ] The list still never names the Ring to the member, and never shows windows, lapsed rows or anything else of the owner's roster.
- [ ] Not available yet: the setting does not exist and there is no member-facing route.

## States and motion the design asks for

- State: roster, empty, lapsed chip, window editor, confirmation for revoke, read-only (403), placeholder identity until names exist.
- Motion: accept = a card slides into the chosen Ring; live re-assignment animates the move between Rings; revoke collapses the row out. Reduced motion: fades.

## Rules the backend already enforces

- Every method is owner-or-admin through `assertCanAdminister(…, 'MEMBER_MANAGER')`; no member-facing read path exists because the row names the Ring.
- `POST` refuses the owner (400 `E_RING_MEMBER_03`), a blocked pair (409 `E_RING_MEMBER_04`), an active member (409 `E_RING_MEMBER_01`), and upserts on `(ring, user)` so a removed or lapsed member is reactivated with the new window.
- `reassign` requires both Rings to share an owner (400 `E_RING_07`) and runs the remove and the upsert in one transaction; there is no instant where the person sees both or neither.
- `DELETE` marks `REMOVED`; `RING_MEMBER_STATUS.EXPIRED` is never written; the engine evaluates windows live.
- `GET` lists newest first with an optional `status` filter.

## Open questions

- Decided: [[D-04 Ring settings at launch and their defaults]] (S8), [[D-14 Shared with me lists people, never the Ring]] and [[D-18 Ring names shown when joined knowingly]] (S7), [[D-15 Several Rings per connection, remove or disconnect]] (S2, S5). Building them is not ticketed yet.
- A member reassigned from a Ring they joined knowingly: D-18 reads the move as the owner placing them, so the new Ring is not named (D-18, *Still open*).
- **Whose card a member sees** when members can see each other: the card each member shares with that Ring is the natural reading (D-04, *Still open*).
- The disconnect route, and whether the other person is told anything (D-15, *Still open*; see [[T-023 Story]]).
