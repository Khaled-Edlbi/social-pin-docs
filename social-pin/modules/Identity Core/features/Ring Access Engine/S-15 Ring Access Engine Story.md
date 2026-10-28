---
type: story
code: ring-access
scope: feature
feature: ring-access
module: identity
status: approved
screens: []
approvedBy: "khaled"
approvedAt: 2026-10-25
created: 2026-10-18
updated: 2026-10-28
owner: "omar"
related: ["D-04 Ring settings at launch and their defaults", "D-14 Shared with me lists people, never the Ring", "D-15 Several Rings per connection, remove or disconnect", "D-18 Ring names shown when joined knowingly"]
tags: [story, story/approved, module/identity, layer/business]
---

# Ring Access Engine · User Story

**Feature:** [[F-08 Ring Access Engine]] · **Status:** Approved 2026-10-25 by khaled · **Frontend Requirements:** [[FR-08 Ring Access Engine Frontend Requirements]] · **Backend Integration:** [[BI-05 Ring Access Engine Backend Integration]]

The engine has no screen of its own; it is the answer to the product's one question, *what is this viewer allowed to see about this person, in this context, at this moment?* These stories are the promises the app makes because of it: access is live, expiry is real, a block is mutual, and a viewer never learns which Ring they are in. They are written from the two sides, the Ring owner and the viewer, so every screen that renders another person can be tested against them.

## Persona

Two people: a Ring owner who moves, revokes and lets access expire, and a viewer (a member of one of the owner's Rings, or a stranger) who opens the owner's Pin, scans their badge or lists Shared with me. Neither ever sees the engine; both must be able to trust it.

## Stories

### S1 · A member sees exactly one perspective (journey, [[Screen Index#s17|s17]] → [[Screen Index#s44|s44]])

**As a** viewer **I want** to open a person and get the Ring I am in **so that** I see what they chose for me and nothing else.

Acceptance criteria:
- [ ] Shared with me lists only access that is live right now, one row per person, never a Ring's colour or type ([[D-14 Shared with me lists people, never the Ring]]); tapping one renders `GET /views/ring/:ringId`.
- [ ] The engine decides, per membership, whether the Ring's **name** may be shown to that member: yes when the membership was created by an invitation they accepted, a code or a verified work email; never when the owner placed them (connection accept, owner or admin add, reassign) ([[D-18 Ring names shown when joined knowingly]]). No other service makes that call.
- [ ] Not available yet: the list returns the Ring's name to every member today, and a membership does not record how it was created.
- [ ] When the owner has me in several of their Rings, I get the version from the Ring I was put in first ([[D-15 Several Rings per connection, remove or disconnect]]). Not available yet: the engine renders the owner's default first, then the oldest.
- [ ] The rendered view carries no `ringId`, no owner user id and no membership row; the UI never labels it "you are in her Clients Ring".
- [ ] A `null` field reads "Not shared", never "none".

### S2 · Access ends at the instant of expiry (journey, no prototype screen)

**As a** Ring owner **I want** a temporary Ring to stop resolving when its window closes **so that** an event audience does not keep my event-time profile for ever.

Acceptance criteria:
- [ ] At `expiresAt` the Ring disappears from the member's Shared with me on the next fetch and `GET /views/ring/:ringId` returns 404 `E_RING_ACCESS_02`.
- [ ] The same happens when the membership's own `expiresAt` passes, even if the Ring is permanent.
- [ ] The client computes "expires in" from `expiresAt` for the owner but trusts the server's answer for the viewer; a Ring that looks live on the device may already 404.

### S3 · Moving someone is live (journey, [[Screen Index#s47|s47]])

**As a** Ring owner **I want** a reassign to change what the person sees on their very next request **so that** "what they see just changed" is true, not a promise.

Acceptance criteria:
- [ ] After `POST …/members/:userId/reassign` the owner's "View as" of the target Ring is what the member now sees; no cache on the member's side survives a screen focus.
- [ ] The move animates between Rings on the owner's side ([[Wireframe Brief#Connection motion & states|§5.2]]); copy reinforces that what they see just changed.

### S4 · A block cuts both ways (journey, no prototype screen)

**As a** user **I want** a block to hide us from each other whatever Rings we share **so that** I do not have to clean every Ring by hand.

Acceptance criteria:
- [ ] A blocked pair gets the not-shared 404 on every `/views` route and an empty `/perspectives` list, in both directions.
- [ ] Adding a blocked user to a Ring is refused (409 `E_RING_MEMBER_04`) with "Cannot add this user", never "blocked".
- [ ] Nothing can create a block yet; the rule is enforced but unreachable until [[S-23 Connections Story|Connections · S25]].

### S5 · An expired Ring stays editable by its owner ([[Screen Index#s62|s62]])

**As a** Ring owner **I want** to open my expired Event Ring and decide keep / merge / delete **so that** expiry does not lock me out of my own data.

Acceptance criteria:
- [ ] My Rings still lists the expired Ring with an "expired" chip computed from `expiresAt`; its editing routes (`PATCH /rings/:id`, projection, members) still answer.
- [ ] "View as" on it is a 404 `E_RING_ACCESS_02` even for the owner; s62 must not use the view route to preview an expired Ring.

### S6 · A delegated admin below the level is refused (journey, [[Screen Index#s26|s26]])

**As a** delegated admin **I want** the app to hide what I cannot do **so that** I am not shown buttons that return 403.

Acceptance criteria:
- [ ] A 403 `E_RING_05` on `/rings/:id`, `/members` or `/projection` hides the editing UI quietly; it is not an error toast.
- [ ] Levels: `MEMBER_MANAGER` for the roster, `CONTENT_MANAGER` for Ring edits and the projection, `FULL` above both. No endpoint grants them yet ([[S-31 Delegated Admins Story|Delegated Admins · S6]]), so only owners pass today.

### S7 · One 404 for three causes ([[Screen Index#s44|s44]])

**As a** product **I want** "no such Pin", "not shared with you" and "blocked" to be indistinguishable **so that** the app cannot be used to probe who exists or who blocked whom.

Acceptance criteria:
- [ ] One message, "This profile isn't available to you", for every `E_RING_ACCESS_01`; no retry hint that differs by cause; no timing-based inference.
- [ ] The same message to a viewer for `E_RING_ACCESS_02`; "This Ring has expired" only to the owner on their own View as.

### S8 · The Ring's settings are access rules (journey, [[Screen Index#s27|s27]])

**As a** Ring owner **I want** the settings I choose to be enforced wherever a member could act **so that** a switch on the settings screen is a promise, not decoration ([[D-04 Ring settings at launch and their defaults]]).

Acceptance criteria:
- [ ] "Members can see each other" (off by default): only when on can a member read the other members, with full cards; while off, every member-facing route behaves as if the roster did not exist.
- [ ] "Members can invite others" and "members can save attachments" (both off by default) are checked in the engine before an invite or a download, with the same quiet refusal as S6.
- [ ] "Who can request to join" and "approve each one" decide whether a request or a code creates a live membership at once or waits for the owner ([[S-33 Ring Invitations & Join Story]]).
- [ ] The owner and the Ring's admins may change the settings; the change applies on the next request.
- [ ] Not available yet: none of the settings exist; the engine enforces the owner-only roster today.

## States and motion the design asks for

- State: live, lapsed (owner-computed), expired (owner-computed), not available (viewer, one message), read-only (403).
- Motion: live re-assignment animates the move between Rings; nothing else. The engine itself has no screen.

## Rules the backend already enforces

- `RingAccessService` resolves on every request against `now`; nothing is cached. Both windows (Ring and membership) are checked; expiry is exclusive (`gt`), so a Ring is dead at its `expiresAt` instant.
- `resolveDefaultAccess` returns the owner's own Rings to the owner, otherwise, after the mutual-block check, the owner's live Rings the viewer is a live member of (default first, then oldest); the first is rendered or the not-shared 404 is thrown from one helper.
- `assertRingReadable`: Ring must be live (404 `E_RING_ACCESS_02`), the owner passes, a block or no live membership gives the not-shared 404 (`E_RING_ACCESS_01`).
- `assertCanAdminister` finds the Ring **without** the live filter; owner passes, otherwise a `RingAdmin` row at or above the level, else 403 `E_RING_05`.
- `RingService`, `RingMemberService` and `RingProfileService` never query `rings` or `ring_members` to decide access themselves; every future domain must add its checks here (golden rule 8).

## Open questions

- Decided: [[D-04 Ring settings at launch and their defaults]] (S8), [[D-14 Shared with me lists people, never the Ring]], [[D-15 Several Rings per connection, remove or disconnect]] and [[D-18 Ring names shown when joined knowingly]] (S1). Until the settings are built, no screen may imply members see one another. Building them is not ticketed yet.
- Whether an admin may change every setting or only some (D-04, *Still open*).
