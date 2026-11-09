---
id: P-16
type: project
layer: backend
created: 2026-10-15
updated: 2026-11-08
tags: [project, core]
---

# Ring Access Model

The part of the codebase most likely to be broken by a well-meaning change. Read before touching any read path, and before building any TODO feature: events, meetings, PinCast, chat, posts and Gemma all route through it.

## The rule

**`RingAccessService` is the only place that decides whether a viewer may see something.** Do not query `rings` or `ring_members` to answer an access question anywhere else. (Golden rule 8, `CLAUDE.md`.)

## How it decides

- **Resolved on every request, against `now`.** Nothing is cached. That is what makes re-assignment live and expiry a real boundary, not a UI hint.
- **Both windows are checked**: the Ring's `startsAt` / `expiresAt` and the membership's. Either lapsing ends access. Expiry is exclusive (`gt`): a Ring is dead at its `expiresAt` instant.
- **A block is mutual and overrides membership**, in both directions.
- **Owner editing paths use `assertCanAdminister`**, which deliberately ignores Ring expiry: an expired Ring is unreadable by viewers but must stay editable, or the keep / merge / delete choice could never be made.

## What the viewer never learns

- **Which Ring they are in.** `RingProfileViewEntity` has no `ringId`. `RingMemberEntity` is owner / admin only; there is no route where a member reads their own row. `ConnectionRequest.grantedRingId` is never exposed to the requester. Shared with me lists **people**, one row each (`resolvePeopleSharingWith`, [[D-14 Shared with me lists people, never the Ring]]): the row's `ringId` only opens the card, and it takes no filter on a Ring, which would be a membership oracle. A Ring's name and member count appear only where `isRingNamedToMember` allows ([[D-18 Ring names shown when joined knowingly]]): when `RingMember.origin` is not `PLACED`, i.e. the member accepted an invitation, joined with a code or had a join request approved (since `main` `1c460b0`). An owner or admin add, a connection accept and a reassign are `PLACED`, so those Rings are never named. When a person shares several Rings, the row opens the one the viewer was put in first, however it was made (D-15, `FIRST_MEMBERSHIP_ORDER`, since `main` `d8267d3`), and it is named only when that one was joined knowingly. An invitee, a code holder or a requester sees the Ring's **name** and nothing else about it: never its id before joining, its colour, type, `purpose` or settings.
- **Whether a profile exists.** "Not shared with you", "blocked" and "no such pin name" return the **same 404 body**. Specs assert this; keep them passing.
- **Hidden rows.** Excluded by the query (`selectRingProfileProjection`), never read into a response object.
- **Sensitive fields** unless the Ring's `show*` flag is on. Gated in exactly one place: `RingProfileService.toView`.

## What this means for each TODO feature

| Feature | The access question it must ask the engine |
|---|---|
| [[F-14 Connections]] | A request to a blocked user, or from one, gets the same 404 as views. Accepting adds a member; the engine then answers everything else. |
| [[F-18 Badge & QR]] | **Shipped** (main `1c460b0`): `GET /views/qr/:token` asks `assertRingPresented`, since a valid badge code is its owner presenting that Ring: live Ring and no block either way, membership neither asked nor made ([[D-28 Scan someone in is not in the MVP\|D-28]]). Every refusal is the one `E_RING_ACCESS_01` body; the token never reveals the Ring id ([[BD-18 Badge & QR Backend Delivery]]). |
| [[F-20 PinCast & Nearby]] | "Nearby by Ring" lists only people whose Ring the viewer is a live member of. Coordinates never reach a recipient. |
| [[F-23 Events During]] | Exhibitor lists, the floor map and the catalogue are scoped by Event Ring membership. |
| [[F-26 Meetings]] | The meeting Ring makes both parties visible to each other for the meeting window only. |
| [[F-36 Gemma AI]] | Every suggestion is computed over what the asking user may see, nothing more. |
| [[F-17 Ring Invitations & Join]] | **Shipped** (main `1c460b0`, [[BD-17 Ring Invitations & Join Backend Delivery]]). Who may invite is `assertCanInvite` (the owner, an admin at `MEMBER_MANAGER` or above, a live member while `membersCanInvite`); whether a code may join is `joinPolicyAllowsCodes` (never under `INVITATION_ONLY`) and `requireApproval` decides join-at-once or a request; "no longer valid" is `ringOpenFilter` / `isRingOpen` (active, not deleted, not past its end); invitations from a blocked owner are hidden through `ownerNotBlockedWithFilter`. A pending invitation or request grants nothing: only the membership `RingMemberService.admitKnowingly` writes does. Every refused code answers one body. |
| [[F-09 Ring Members]] | A membership records how it was made (`RingMember.origin`, since main `1c460b0`), so `isRingNamedToMember` answers yes for a Ring joined knowingly (D-18). The member-facing roster (since main `14c6916`, [[BD-17 Ring Invitations & Join Backend Delivery]]) is `resolveColleagues`: any live member, never the owner, only while `membersCanSeeEachOther`; nobody in a block with the viewer or the owner; each colleague rendered from the Ring they picked (`resolveShownRings`, D-34: their own live pick, else their default), never its id or name. A member's own side (`my-card`, `leave`) is `assertKnowingMember`: a membership joined knowingly only. Every refusal is `E_RING_ACCESS_01`. |

## The Ring's settings ([[D-04 Ring settings at launch and their defaults]])

Six columns on the Ring since backend `main` `12172c6`, every default the private one: `purpose`, `joinPolicy` (`CODE_OR_INVITATION`), `requireApproval` (on), `membersCanSeeEachOther`, `membersCanInvite`, `membersCanSaveAttachments` (off). They are access rules, so the engine is where they are read. Enforced today: `membersCanSeeEachOther` (off: no member-facing roster or count anywhere), and since `main` `1c460b0` `joinPolicy`, `requireApproval` and `membersCanInvite` ([[F-17 Ring Invitations & Join]]). Stored until its flow exists: `membersCanSaveAttachments` ([[BD-11 Rings Backend Delivery]]).

Code: `src/modules/ring-access/`. Related: [[F-08 Ring Access Engine]] (feature note) · [[Architecture]]
