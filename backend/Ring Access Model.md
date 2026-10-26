---
type: project
created: 2026-10-15
updated: 2026-10-26
tags: [project, core]
layer: backend
---

# Ring Access Model

> ⚠ Affected by [[D-04 Ring settings at launch and their defaults]] (2026-10-25): ND-04 decided, six Ring settings at launch with private defaults (join with a code or invite, approve each one, members can't see each other, invite or save attachments); the owner and the Ring's admins change them; members who may see each other see full cards.

The part of the codebase most likely to be broken by a well-meaning change. Read before touching any read path, and before building any TODO feature: events, meetings, PinCast, chat, posts and Gemma all route through it.

## The rule

**`RingAccessService` is the only place that decides whether a viewer may see something.** Do not query `rings` or `ring_members` to answer an access question anywhere else. (Golden rule 8, `CLAUDE.md`.)

## How it decides

- **Resolved on every request, against `now`.** Nothing is cached. That is what makes re-assignment live and expiry a real boundary, not a UI hint.
- **Both windows are checked**: the Ring's `startsAt` / `expiresAt` and the membership's. Either lapsing ends access. Expiry is exclusive (`gt`): a Ring is dead at its `expiresAt` instant.
- **A block is mutual and overrides membership**, in both directions.
- **Owner editing paths use `assertCanAdminister`**, which deliberately ignores Ring expiry: an expired Ring is unreadable by viewers but must stay editable, or the keep / merge / delete choice could never be made.

## What the viewer never learns

- **Which Ring they are in.** `RingProfileViewEntity` has no `ringId`. `RingMemberEntity` is owner / admin only; there is no route where a member reads their own row. `ConnectionRequest.grantedRingId` is never exposed to the requester.
- **Whether a profile exists.** "Not shared with you", "blocked" and "no such pin name" return the **same 404 body**. Specs assert this; keep them passing.
- **Hidden rows.** Excluded by the query (`selectRingProfileProjection`), never read into a response object.
- **Sensitive fields** unless the Ring's `show*` flag is on. Gated in exactly one place: `RingProfileService.toView`.

## What this means for each TODO feature

| Feature | The access question it must ask the engine |
|---|---|
| [[Connections]] | A request to a blocked user, or from one, gets the same 404 as views. Accepting adds a member; the engine then answers everything else. |
| [[Badge & QR]] | Resolving a token renders `GET /views/ring/:ringId` through the engine; the token never reveals the ring id. |
| [[PinCast & Nearby]] | "Nearby by Ring" lists only people whose Ring the viewer is a live member of. Coordinates never reach a recipient. |
| [[Events During]] | Exhibitor lists, the floor map and the catalogue are scoped by Event Ring membership. |
| [[Meetings]] | The meeting Ring makes both parties visible to each other for the meeting window only. |
| [[Gemma AI]] | Every suggestion is computed over what the asking user may see, nothing more. |
| [[Ring Invitations & Join]], [[ND-04 Ring settings]] | "Members can see each other" is a new, default-off setting that must be enforced **inside** the engine, not in a members endpoint. |

## Open decision that touches the engine

[[ND-04 Ring settings]]: join policy, members visible to each other, members can invite. All of them are access rules and belong where the engine can read them.

Code: `src/modules/ring-access/`. Related: [[Ring Access Engine]] (feature note) · [[Architecture]]
