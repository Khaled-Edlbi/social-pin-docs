---
type: story
code: T-023
scope: task
feature: connections
module: connections
status: draft
screens: [s47]
depends: []
affects: []
related: ["Ring Members", "View As & Pin Views", "DR-04 Ring settings at launch and their defaults", "DR-14 Shared with me lists people, never the Ring", "DR-15 Several Rings per connection, remove or disconnect"]
pending: []
approvedBy: ""
approvedAt: ""
owner: "omar"
created: 2026-10-18
updated: 2026-10-25
tags: [story, story/draft, module/connections, layer/business]
task: T-023
---

# T-023 · Connection detail and contacts list · User Story

**Task:** [[T-023 Connection detail and contacts list]] · **Feature:** [[Connections]] · **Feature-level note:** [[Connections Story]] · **Status:** Draft (awaiting product sign-off) · **Frontend Requirements:** [[T-023 Frontend Requirements]] · **Backend Integration:** [[T-023 Backend Integration]] · **Verified by:** [[T-023 QA Backend]], [[T-023 QA Frontend]]

> Derived from the task [[T-023 Connection detail and contacts list]]; **not approved by product yet**. The feature-level story is [[Connections Story]]; this note says what the user gets from this task in particular. `approved` when product signs off (`approvedBy`, `approvedAt`); `verified` when both QA notes are `passing`.

Owner-side detail shows which Rings (owner only), events in common, mutual connections. `GET /connections` searchable. A connection can sit in several of my Rings and outlives access unless I disconnect ([[DR-15 Several Rings per connection, remove or disconnect]]).

## Persona

A Ring owner after a few weeks of scanning and accepting, with people spread across Clients, Family and an event Ring, who wants to find someone again, see who they are, and check what that person can see of them. Also the same owner on a Ring's People tab, wanting names and faces, not ids. Requests and accepting are [[T-021 Connect request send, inbox, cancel]] and [[T-022 Accept into a Ring (sets grantedRingId)]].

## Stories

### S1 · My contacts, searchable (People from [[Screen Index#s38|s38]])

**As a** user **I want** a list of everyone I'm connected with **so that** I find someone again without scanning them twice.

Acceptance criteria:
- [ ] `GET /connections` lists my connections, paged (`limit` ≤ 50, `meta.total`), sorted by display name.
- [ ] Each row has the person's `userId`, `displayName`, `pinName`, `avatarFileId` (shown once [[T-062 Serve uploaded file bytes by id]] ships) and when we connected.
- [ ] A search (`q`) matches name or Pin name, only within my own connections; it never finds strangers.
- [ ] Someone I removed from all my Rings but did not disconnect **is listed**, marked as having no access; I can add them to a Ring again without a new request.
- [ ] Someone I **disconnected**, or who blocked me, is not listed.

### S2 · Who they are and where they sit ([[Screen Index#s47|s47]])

**As a** Ring owner **I want** a detail screen for one connection **so that** I see which of my Rings they're in, until when, and what they therefore see.

Acceptance criteria:
- [ ] The detail returns the person, the date we connected, and **the list of my Rings they're in** (one or several) with each membership's `startsAt` / `expiresAt`; an empty list when they have no access.
- [ ] Only I see which of my Rings they're in; nothing of it reaches them ([[DR-14 Shared with me lists people, never the Ring]]).
- [ ] From here, the actions that exist already: add to another of my Rings (`POST /rings/:ringId/members`), move to another Ring (`POST …/members/:userId/reassign`), change the window (`PATCH …/members/:userId`), remove (`DELETE …/members/:userId`). After each, the screen refetches.
- [ ] Removing them from the **last** of my Rings asks: *Remove from Rings* (they stay a connection with no access) or *Disconnect* (the connection ends and they leave my contacts; getting back in takes a new request). Not available yet: there is no disconnect endpoint.
- [ ] When they are in several of my Rings, they see the version from the Ring they were put in first.

### S3 · What they share with me ([[Screen Index#s47|s47]], [[Screen Index#s31|s31]])

**As a** user **I want** to open everything a connection shares with me **so that** I see their card the way they meant me to.

Acceptance criteria:
- [ ] Tapping a contact opens their perspectives through `GET /views/user/:userId/perspectives`, which exists, using the `userId` from S1.
- [ ] Empty perspectives (they share nothing with me, or access lapsed) read "Nothing shared with you right now".

### S4 · Names and faces on the People tab ([[Screen Index#s15|s15]])

**As a** Ring owner **I want** each member of my Ring shown by name, Pin name and photo **so that** the roster is people, not ids.

Acceptance criteria:
- [ ] Every member row (`GET /rings/:ringId/members`) carries the member's `displayName`, `pinName` and `avatarFileId`, or the app can get them for every member in one request, not one per row.
- [ ] A row opens that person's connection detail (S2).

### S5 · Picking people for a Ring (New Ring step 2, [[Screen Index#s19|s19]])

**As a** Ring owner **I want** to pick connections when I create a Ring **so that** it starts with the right people.

Acceptance criteria:
- [ ] Step 2 lists my connections from S1, including those with no access, searchable; the picked ones are added after the Ring is created (`POST /rings/:ringId/members`).

### S6 · What we have in common ([[Screen Index#s47|s47]])

**As a** user **I want** events in common and mutual connections **so that** I remember how I know this person.

Acceptance criteria:
- [ ] Events in common: may ship after the events features; until then the section is hidden, not empty.
- [ ] Mutual connections: only people who are connections of both of us, and only where a Ring's "members can see each other" is on (off by default, [[DR-04 Ring settings at launch and their defaults]]); hidden otherwise. Not available yet: the setting does not exist.

## States and motion the design asks for

- Contacts: list, search with no results ("No one by that name"), empty ("No connections yet. Scan someone to start"); a "No access" marker on a connection in none of my Rings.
- s47: loading; the person; their Rings with windows; actions; the *Remove from Rings* / *Disconnect* choice at the last removal; refreshing after an action.
- No avatars until T-062: initials.
- Motion: none asked for.

## Rules the backend already enforces

- Reassign moves a member in one transaction, so they never see two perspectives at once; revoke marks the row `REMOVED`, never deleted.
- The roster is owner or delegated-admin only; a member never sees who else is in a Ring unless the Ring's "members can see each other" is on ([[DR-04 Ring settings at launch and their defaults]], not available yet).
- `GET /views/user/:userId/perspectives` returns only what is live and shared with the caller.
- Blocks hide in both directions with the same 404 as views ([[T-024 Block and unblock]]).

## Open questions

- **Member identity: on the roster or from contacts.** Add `displayName`, `pinName`, `avatarFileId` to `RingMemberEntity`, or have the app join the roster with `GET /connections`. On the roster is one request and works for members added without a connection.
- **Disconnect.** Its route, and whether the other person is told anything (left open by [[DR-15 Several Rings per connection, remove or disconnect]]).
