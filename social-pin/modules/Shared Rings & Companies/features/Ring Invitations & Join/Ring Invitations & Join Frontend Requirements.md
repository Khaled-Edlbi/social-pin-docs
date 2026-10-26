---
type: frontend-requirements
code: ring-invitations
scope: feature
feature: ring-invitations
module: shared-rings
status: draft
screens: [s17, s74]
created: 2026-10-18
updated: 2026-10-26
tags: [frontend-requirements, frontend-requirements/draft, module/shared-rings, layer/frontend]
---

# Ring Invitations & Join · Frontend Requirements

> ⚠ Affected by [[D-18 Ring names shown when joined knowingly]] (2026-10-25): an invitation names its Ring on s17 and s74, and a Ring joined by invitation, code or work email keeps showing its name; never its colour or type.

> ⚠ Affected by [[D-04 Ring settings at launch and their defaults]] (2026-10-25): ND-04 decided, six Ring settings at launch with private defaults (join with a code or invite, approve each one, members can't see each other, invite or save attachments); the owner and the Ring's admins change them; members who may see each other see full cards.

**Feature:** [[Ring Invitations & Join]] · **Status:** Draft · **Story:** [[Ring Invitations & Join Story]] · **API Integration:** not yet (backend not built)

What the client needs from the backend to build the screens in [[Ring Invitations & Join Story]], and whether each need is met today. The shared-Rings list is done; every invitation and join action waits on Ring settings.

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
| Pending invitations for me | — | ❌ | [[T-026 Ring invitations invite, review, decline]] |
| Accept an invitation | — | ❌ | [[T-026 Ring invitations invite, review, decline]] |
| Decline an invitation | — | ❌ | [[T-026 Ring invitations invite, review, decline]] |
| Owner sends an invitation (from s15) | — | ❌ | [[T-026 Ring invitations invite, review, decline]] |
| Resolve a join code to a reviewable Ring, then join | — | ❌ | [[T-027 Join a Ring with a code or verified work email]] |
| Verify a work email against the Ring's domain, then join | — | ❌ | [[T-027 Join a Ring with a code or verified work email]] |
| Join policy, join code, required domain on the Ring | — | ❌ | [[ND-04 Ring settings]] |
| Owner's display name on an invitation row | — | ❌ | [[T-023 Connection detail and contacts list]] |
| What I contribute to a shared Ring | — | ❌ | [[T-028 What you contribute to a shared Ring]] |
| Notification on invite | — | ❌ | [[T-045 NotificationService.emit and the inbox]] |
| Join offer carried by a scanned token | — | ❌ | [[T-008 Resolve a scanned QR token]] |

## Behaviour expectations

- Refetch / realtime: s17 refetches both the live list and the invitations on screen focus; the live list changes without any action of the viewer (owner reassigns, Ring expires). After accept or decline, refetch both. Until notifications exist, no polling.
- Caching keys: shared Rings by (signed-in user); invitations by (signed-in user); a Ring's projection by (viewer, ring id). Invalidate the shared-Rings cache on accept.
- Pagination / ordering: `{ data, meta: { total } }`; shared Rings newest first (server); invitations newest first; `limit` ≤ 50.
- Code entry: trim and uppercase client-side only if T-027 defines the format; do not validate the shape locally beyond non-empty, so the UI never leaks the expected pattern.
- One neutral message for every join failure (wrong code, wrong domain, revoked, Ring gone); never branch the copy on cause.

## Error states the UI must handle

| Status | ErrorCode | Show |
|---|---|---|
| 404 | `E_RING_ACCESS_02` | the Ring I just joined is not live: "This Ring has expired"; drop it on next refetch |
| 404 | `E_RING_ACCESS_01` | not a member any more or blocked: the same neutral message as any view |
| 401 | `E_AUTH_04` | sign in again |
| 400 | — | validation on the code or email field: inline, generic |
| — | invitation / join codes | to be defined by T-026 / T-027; the UI maps all join failures to one message; branch on `statusCode` until [[T-063 Put the ErrorCode on the error body]] |

## Blocked by

- [[ND-04 Ring settings]] — join policy, code and domain: the code and email rows, and the review step's "approval required" variant.
- [[T-026 Ring invitations invite, review, decline]] — the invitation object; every invitation row above.
- [[T-027 Join a Ring with a code or verified work email]] — both self-service join rows.
- [[T-028 What you contribute to a shared Ring]] — the optional step after joining.
- [[T-063 Put the ErrorCode on the error body]] — the error table is by status until then.
