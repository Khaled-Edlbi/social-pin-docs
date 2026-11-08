---
id: FR-17
type: frontend-requirements
module: shared-rings
feature: ring-invitations
status: draft
scope: feature
screens: [s17, s74]
created: 2026-10-18
updated: 2026-10-29
tags: [frontend-requirements, frontend-requirements/draft, module/shared-rings, layer/frontend]
---

# Ring Invitations & Join · Frontend Requirements

> ⚠ Affected by [[D-36 Who it's for stays the owner's alone]] (2026-11-08): no purpose ("who it's for") on s74 or s72; only the owner's own screens show it

> ⚠ Affected by [[D-35 A join code can be shown as a QR]] (2026-11-08): Show as QR on each active join code; the scanner recognises a join QR and opens the s74 review with the code's rules and errors; a badge never offers a Ring

> ⚠ Affected by [[D-34 A member shows one of their own Rings]] (2026-11-08): a member picks one of their own Rings as their card in a Ring they joined; read and set the picked Ring, and the colleagues list only when members may see each other, without the picked Ring's name

> ⚠ Affected by [[D-33 Work email joining waits for real emails and Companies]] (2026-11-08): ND-33 decided "not now": no work-email rows in this version; work-email verification is listed as later (waits on Code Delivery S-78 and Companies S-29 S12)

> ⚠ Affected by [[D-32 Several join codes per Ring]] (2026-11-08): ND-32 decided 2026-11-08 by Omar Fostok, option 2: several join codes per Ring (up to 10 active), each 8 characters without look-alikes (K7QM-4RXT) with a required owner-only label, an optional end date and an optional use limit; Turn off per code, Make a new code adds one; one neutral message for a wrong, off, ended or used-up code, tries limited per person; with approve-each-one on a code makes a join request showing which code was used; managed under Edit Ring → Joining → Join codes by the owner (later admins who manage who's in it)

> ⚠ Affected by [[D-31 An invitation is its own record]] (2026-11-08): ND-31 decided 2026-11-08 by Omar Fostok, option 1: an invitation is its own record (Ring, invitee, inviter, optional window, PENDING/ACCEPTED/DECLINED/WITHDRAWN), never a membership while pending; accept creates the membership recorded as joined knowingly; decline, withdraw, 30-day expiry, valid:false on an ended Ring

> ⚠ Affected by [[S-33 Ring Invitations & Join Story]] (2026-11-08): S-33 was rewritten (2026-11-08) as one set of parts S1-S12 against backend main 12172c6: invitations on s17 (by company for s72), review (s74), code, work email, my join requests (cancel, dismiss), the owner's Invite and Invited list, the join code on Joining and permissions, Waiting on you on s15, QR join, what a member shows, inside the Ring, notifications; six questions open as ND-31 to ND-36. The old S7-S9 (T-026 to T-028) are folded in

> ⚠ Affected by [[FR-15 Companies Frontend Requirements]] (2026-11-05): FR-15 (Companies) asks FR-17 for: business { id, name, logoFileId } on each pending invitation to a company Ring, my join requests GET /rings/join-requests/mine (id, status PENDING | DECLINED, createdAt, business, ringName), cancel and dismiss DELETE /rings/join-requests/:id, and valid: false on an invitation whose Ring ended. Add these rows (S-29 S3).

> ⚠ Affected by [[S-23 Connections Story]] (2026-11-04): S-23 was rewritten as one set of parts, so the part numbers moved: Connections · S8–S12 (send, blocked pair, inbox, sent, notify) → S2–S4; S13–S18 (accept, window, Ring kept private, decline, errors) → S5–S7; S19–S24 (contacts, detail, shares, roster names, wizard, in common) → S8–S12; S25 (block) → S13; S26 (introduce) → S9 and Open questions. Repoint the links that name the old parts.

> ⚠ Affected by [[D-18 Ring names shown when joined knowingly]] (2026-10-25): an invitation names its Ring on s17 and s74, and a Ring joined by invitation, code or work email keeps showing its name; never its colour or type.

> ⚠ Affected by [[D-04 Ring settings at launch and their defaults]] (2026-10-25): ND-04 decided, six Ring settings at launch with private defaults (join with a code or invite, approve each one, members can't see each other, invite or save attachments); the owner and the Ring's admins change them; members who may see each other see full cards.

**Feature:** [[F-17 Ring Invitations & Join]] · **Status:** Draft · **Story:** [[S-33 Ring Invitations & Join Story]] · **API Integration:** not yet (backend not built)

What the client needs from the backend to build the screens in [[S-33 Ring Invitations & Join Story]], and whether each need is met today. The shared-Rings list is done; every invitation and join action waits on Ring settings.

## Per screen

### [[Screen Index#s17|s17]] Shared with me

- Needs: live shared Rings (done); pending invitations with invitation id, Ring name and colour, owner display name and Pin name, inviter, sent-at, optional window; the two entry actions.
- Source today: `GET /rings/shared-with-me` for the list; it returns `RingEntity` rows (`id`, `name`, `colorHex`, `type`, `ownerUserId`, `expiresAt`), not the owner's name. Invitations: not yet.

### [[Screen Index#s74|s74]] Join a company Ring

- Needs: one invitation to review (the fields above plus purpose), accept, decline; a code field that resolves to a reviewable Ring; a work-email verification step; the "no longer valid" state.
- Source today: not yet, for all of it. The owner's projection for the preview: `GET /views/ring/:ringId` after joining only (before joining the viewer is not a member and gets the neutral 404).

### After joining (s17, then the Ring)

- Needs: the Ring in the list and its projection.
- Source today: `GET /rings/shared-with-me` and `GET /views/ring/:ringId` ✅.

## Endpoints required

| Need | Endpoint | Available | Task / decision |
|---|---|---|---|
| Rings I am a live member of | `GET /rings/shared-with-me` | ✅ | — |
| The owner's projection of a Ring I am in | `GET /views/ring/:ringId` | ✅ | — |
| Pending invitations for me | — | ❌ | [[S-33 Ring Invitations & Join Story|Ring Invitations & Join · S7]] |
| Accept an invitation | — | ❌ | [[S-33 Ring Invitations & Join Story|Ring Invitations & Join · S7]] |
| Decline an invitation | — | ❌ | [[S-33 Ring Invitations & Join Story|Ring Invitations & Join · S7]] |
| Owner sends an invitation (from s15) | — | ❌ | [[S-33 Ring Invitations & Join Story|Ring Invitations & Join · S7]] |
| Resolve a join code to a reviewable Ring, then join | — | ❌ | [[S-33 Ring Invitations & Join Story|Ring Invitations & Join · S8]] |
| Verify a work email against the Ring's domain, then join | — | ❌ | [[S-33 Ring Invitations & Join Story|Ring Invitations & Join · S8]] |
| Join policy, join code, required domain on the Ring | — | ❌ | [[ND-04 Ring settings]] |
| Owner's display name on an invitation row | — | ❌ | [[S-23 Connections Story|Connections · S19–S24]] |
| What I contribute to a shared Ring | — | ❌ | [[S-33 Ring Invitations & Join Story|Ring Invitations & Join · S9]] |
| Notification on invite | — | ❌ | [[S-96 Notifications Story|Notifications · S7]] |
| Join offer carried by a scanned token | — | ❌ | [[S-37 Badge & QR Story|Badge & QR · S13–S18]] |

## Behaviour expectations

- Refetch / realtime: s17 refetches both the live list and the invitations on screen focus; the live list changes without any action of the viewer (owner reassigns, Ring expires). After accept or decline, refetch both. Until notifications exist, no polling.
- Caching keys: shared Rings by (signed-in user); invitations by (signed-in user); a Ring's projection by (viewer, ring id). Invalidate the shared-Rings cache on accept.
- Pagination / ordering: `{ data, meta: { total } }`; shared Rings newest first (server); invitations newest first; `limit` ≤ 50.
- Code entry: trim and uppercase client-side only if Ring Invitations & Join · S8 defines the format; do not validate the shape locally beyond non-empty, so the UI never leaks the expected pattern.
- One neutral message for every join failure (wrong code, wrong domain, revoked, Ring gone); never branch the copy on cause.

## Error states the UI must handle

| Status | ErrorCode | Show |
|---|---|---|
| 404 | `E_RING_ACCESS_02` | the Ring I just joined is not live: "This Ring has expired"; drop it on next refetch |
| 404 | `E_RING_ACCESS_01` | not a member any more or blocked: the same neutral message as any view |
| 401 | `E_AUTH_04` | sign in again |
| 400 | — | validation on the code or email field: inline, generic |
| — | invitation / join codes | to be defined by Ring Invitations & Join · S7 / Ring Invitations & Join · S8; the UI maps all join failures to one message; branch on `statusCode` until [[S-87 Error Contract Story|Error Contract · S4–S8]] |

## Blocked by

- [[ND-04 Ring settings]] — join policy, code and domain: the code and email rows, and the review step's "approval required" variant.
- [[S-33 Ring Invitations & Join Story|Ring Invitations & Join · S7]] — the invitation object; every invitation row above.
- [[S-33 Ring Invitations & Join Story|Ring Invitations & Join · S8]] — both self-service join rows.
- [[S-33 Ring Invitations & Join Story|Ring Invitations & Join · S9]] — the optional step after joining.
- [[S-87 Error Contract Story|Error Contract · S4–S8]] — the error table is by status until then.
