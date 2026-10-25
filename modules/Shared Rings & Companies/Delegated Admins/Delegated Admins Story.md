---
type: story
code: delegated-admins
scope: feature
feature: delegated-admins
module: shared-rings
status: approved
screens: [s26, s27]
approvedBy: "khaled"
approvedAt: 2026-10-25
created: 2026-10-18
updated: 2026-10-25
owner: "omar"
related: ["DR-04 Ring settings at launch and their defaults"]
tags: [story, story/approved, module/shared-rings, layer/business]
---

# Delegated Admins · User Story

**Feature:** [[Delegated Admins]] · **Status:** Approved 2026-10-25 by khaled · **Frontend Requirements:** [[Delegated Admins Frontend Requirements]] · **API Integration:** not yet (backend not built)

A company Ring is too big for one person to run. The owner hands parts of the job to colleagues at a permission level: one may edit what the Ring shows, another may manage who is in it. The owner stays the owner; admins act on the owner's Ring and the engine already honours them on every write. What is missing is any way to appoint, change or remove them.

## Persona

The **Ring owner** of a `CORPORATE` Ring (a business owner or the person who created the company Ring), editing the Ring's access settings (s26) and permissions (s27). Secondary: the **delegated admin**, a colleague who discovers that an owner's Ring now appears among the Rings they can edit.

## Stories

### S1 · See and add admins ([[Screen Index#s26|s26]])

**As a** Ring owner on Edit · access, **I want** a list of the people administering this Ring and a way to add one, **so that** I can share the work without sharing ownership.

Acceptance criteria:
- [ ] An *Admins* section lists each admin with name, Pin name, avatar placeholder and level; the owner is shown first, marked *Owner*, not editable.
- [ ] *Add admin* opens a picker over my connections (contacts list) and a level choice; the person must already be someone I am connected to.
- [ ] Adding is a single call; on success the row appears and the person receives a notification (when notifications exist).
- [ ] The section is visible to the owner only; a delegated admin opening s26 sees the Ring fields they may edit and no admin list.
- [ ] *Delete Ring* at the bottom stays an owner-only action.

### S2 · Change an admin's level ([[Screen Index#s27|s27]])

**As a** Ring owner on Edit · permissions, **I want** to change what each admin may do, **so that** a content editor does not also control membership.

Acceptance criteria:
- [ ] Each admin row shows the level with a short explanation of what it allows: at least *content* (edit the Ring and its projection) and *members* (also manage who is in it), using the backend's level names once T-006 publishes the enum.
- [ ] *Save* applies the change immediately: the admin's next request already runs under the new level; *Cancel* reverts the screen.
- [ ] The owner cannot lower their own rights and cannot appoint themselves.

### S3 · Remove an admin ([[Screen Index#s26|s26]])

**As a** Ring owner, **I want** to remove an admin, **so that** a colleague who left stops being able to change the Ring.

Acceptance criteria:
- [ ] Swipe or overflow on an admin row offers *Remove*; confirm first; the row disappears on success.
- [ ] Removal does not touch the person's membership of the Ring; if they were also a member, they still see the Ring.
- [ ] Removal takes effect on the person's next request; nothing in the client needs invalidating beyond this list.

### S4 · Acting as a delegated admin (journey, through [[Screen Index#s26|s26]])

**As a** delegated admin, **I want** the Rings I administer to be editable from my app, **so that** I can do the job I was given.

Acceptance criteria:
- [ ] A Ring I administer is reachable from the shared-Rings list with an *Edit* affordance; the edit screens are the same ones the owner uses, with owner-only parts hidden.
- [ ] At the content level I can change name, colour, expiry and the projection; at the members level I can also open the people screen and add, move or revoke members.
- [ ] I can change the Ring's settings (S5), as the owner can ([[DR-04 Ring settings at launch and their defaults]]); which level is needed is [[T-006 Delegated admin endpoints]]'s to define.
- [ ] I cannot delete the Ring, make it the default, or appoint other admins; those controls are absent, not disabled.

### S5 · The Ring's settings ([[Screen Index#s26|s26]], [[Screen Index#s27|s27]])

**As a** Ring owner or one of its admins, **I want** the Ring's settings on these screens with their defaults, **so that** I control who gets in and what members may do ([[DR-04 Ring settings at launch and their defaults]], [[Rings Story]] S9).

Acceptance criteria:
- [ ] At launch: who it's for, who can request to join (default: with a code or by invitation), approve each one (on), members can see each other (off), members can invite others (off), members can save attachments (off).
- [ ] Not shown at launch: required work email domain (with [[Companies]]), members can message me (with messaging), see when I'm at an event (with events).
- [ ] The owner and the Ring's admins can change them; a plain member never sees this screen.
- [ ] Not available yet: until the settings exist, they are rendered disabled with a single "coming soon" note and nothing is sent for them on *Save*; *Save* on s26 still sends the Ring fields that exist today (name, colour, expiry).

## States and motion the design asks for

- State: admins list with rows, owner only, empty ("Only you administer this Ring"), saving, saved.
- State for an admin: read-only owner parts hidden; a 403 on an action means "your level does not allow this": show it once, do not retry.
- Motion: the brief gives delegated admins no signature motion; use the Ring-edit transitions of [[Rings Backend Integration]], with a reduced-motion fallback.

## Rules the backend already enforces

- `assertCanAdminister` accepts the owner or a `RingAdmin` at the required level: `PATCH /rings/:id` needs `CONTENT_MANAGER` or above, every member write needs `MEMBER_MANAGER` or above (403 `E_RING_05` otherwise).
- `assertCanAdminister` ignores the Ring's expiry, so an admin keeps editing an expired Ring, which is what makes the keep / merge / delete choice possible.
- `GET /rings/:id` and `DELETE /rings/:id` are the owner's (404 `E_RING_02` for anyone else); the admin path is through `PATCH` and the member routes.
- Reassign requires both Rings to be administrable by the actor and to share an owner (400 `E_RING_07`).
- Membership stays private to the owner and admins; being an admin never exposes a Ring to its members.

## Open questions

- Decided: [[DR-04 Ring settings at launch and their defaults]] (S5, and admins may change the settings). Building the settings is not ticketed yet.
- Whether an admin may change every setting or only some, for example not "who it's for" (DR-04, *Still open*; until it is answered, all of them).
- [[T-006 Delegated admin endpoints]] — the full list of permission levels and whether an admin needs to be a connection or a member first; S1's picker assumes a connection.
- [[T-023 Connection detail and contacts list]] — the picker for S1 and the names on the admin rows.
