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
related: ["Ring Members", "View As & Pin Views"]
pending: []
approvedBy: ""
approvedAt: ""
owner: "omar"
updated: 2026-10-25
tags: [story, story/draft, module/connections, layer/business]
task: T-023
---

# T-023 · Connection detail and contacts list · User Story

> ⚠ Affected by [[DR-04 Ring settings at launch and their defaults]] (2026-10-25): D-04 decided, six Ring settings at launch with private defaults (join with a code or invite, approve each one, members can't see each other, invite or save attachments); the owner and the Ring's admins change them; members who may see each other see full cards.

> ⚠ Affected by [[DR-14 Shared with me lists people, never the Ring]] (2026-10-25): D-14 decided, option 2: Shared with me lists the people who share with me and never shows a Ring's name, colour or type to a member.

> ⚠ Affected by [[DR-15 Several Rings per connection, remove or disconnect]] (2026-10-25): D-15 decided, one person can be in several of my Rings and sees the oldest version first; removing them from my last Ring offers Remove from Rings or Disconnect. S1's "removed from every Ring … is not listed" becomes "disconnected", and the open question *Connected without a Ring* is answered.

**Task:** [[T-023 Connection detail and contacts list]] · **Feature:** [[Connections]] · **Feature-level note:** [[Connections Story]] · **Status:** Draft (awaiting product sign-off) · **Frontend Requirements:** [[T-023 Frontend Requirements]] · **Backend Integration:** [[T-023 Backend Integration]] · **Verified by:** [[T-023 QA Backend]], [[T-023 QA Frontend]]

> Derived from the task [[T-023 Connection detail and contacts list]]; **not approved by product yet**. The feature-level story is [[Connections Story]]; this note says what the user gets from this task in particular. `approved` when product signs off (`approvedBy`, `approvedAt`); `verified` when both QA notes are `passing`.

Owner-side detail shows which Ring (owner only), events in common, mutual connections. `GET /connections` searchable.

## Persona

A Ring owner after a few weeks of scanning and accepting, with people spread across Clients, Family and an event Ring, who wants to find someone again, see who they are, and check what that person can see of them. Also the same owner on a Ring's People tab, wanting names and faces, not ids. Requests and accepting are [[T-021 Connect request send, inbox, cancel]] and [[T-022 Accept into a Ring (sets grantedRingId)]].

## Stories

### S1 · My contacts, searchable (People from [[Screen Index#s38|s38]])

**As a** user **I want** a list of everyone I'm connected with **so that** I find someone again without scanning them twice.

Acceptance criteria:
- [ ] `GET /connections` lists my connections, paged (`limit` ≤ 50, `meta.total`), sorted by display name.
- [ ] Each row has the person's `userId`, `displayName`, `pinName`, `avatarFileId` (shown once [[T-062 Serve uploaded file bytes by id]] ships) and when we connected.
- [ ] A search (`q`) matches name or Pin name, only within my own connections; it never finds strangers.
- [ ] Someone I removed from every Ring, or who blocked me, is not listed.

### S2 · Who they are and where they sit ([[Screen Index#s47|s47]])

**As a** Ring owner **I want** a detail screen for one connection **so that** I see which of my Rings they're in, until when, and what they therefore see.

Acceptance criteria:
- [ ] The detail returns the person, the date we connected, and **the Rings of mine they're in** with each membership's `startsAt` / `expiresAt`.
- [ ] Only I see which of my Rings they're in; nothing of it reaches them.
- [ ] From here, the actions that exist already: move to another Ring (`POST …/members/:userId/reassign`), change the window (`PATCH …/members/:userId`), remove (`DELETE …/members/:userId`). After each, the screen refetches.

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
- [ ] Step 2 lists my connections from S1, searchable; the picked ones are added after the Ring is created (`POST /rings/:ringId/members`).

### S6 · What we have in common ([[Screen Index#s47|s47]])

**As a** user **I want** events in common and mutual connections **so that** I remember how I know this person.

Acceptance criteria:
- [ ] Events in common: may ship after the events features; until then the section is hidden, not empty.
- [ ] Mutual connections: only people who are connections of both of us, and only if [[D-04 Ring settings]] lets members see each other; hidden otherwise.

## States and motion the design asks for

- Contacts: list, search with no results ("No one by that name"), empty ("No connections yet. Scan someone to start").
- s47: loading; the person; their Rings with windows; actions; refreshing after an action.
- No avatars until T-062: initials.
- Motion: none asked for.

## Rules the backend already enforces

- Reassign moves a member in one transaction, so they never see two perspectives at once; revoke marks the row `REMOVED`, never deleted.
- The roster is owner or delegated-admin only; a member never sees who else is in a Ring unless [[D-04 Ring settings]] says so.
- `GET /views/user/:userId/perspectives` returns only what is live and shared with the caller.
- Blocks hide in both directions with the same 404 as views ([[T-024 Block and unblock]]).

## Open questions

- **One Ring or several.** T-022 accepts someone into one Ring, but the design's s47 lets a connection sit in more than one, and the API allows it (that's what `/perspectives` is for). Is s47 a list of Rings, or one?
- **Member identity: on the roster or from contacts.** Add `displayName`, `pinName`, `avatarFileId` to `RingMemberEntity`, or have the app join the roster with `GET /connections`. On the roster is one request and works for members added without a connection.
- **Connected without a Ring.** After being removed from every Ring, is the person still a connection (listed, no access) or gone from contacts?
