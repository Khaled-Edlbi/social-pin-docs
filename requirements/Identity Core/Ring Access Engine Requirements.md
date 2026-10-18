---
type: requirements
id: ring-access
feature: ring-access
status: draft
domain: identity
screens: []
updated: 2026-10-18
tags: [requirements, requirements/draft, domain/identity]
---

# Ring Access Engine · Frontend Requirements

**Feature:** [[Ring Access Engine]] · **Status:** Draft · **Story:** [[Ring Access Engine Story]] · **API Integration:** [[Ring Access Engine Frontend]]

The engine exposes no endpoint. What the client needs from it is a set of guarantees that other endpoints carry: which Rings appear on Shared with me, what every `/views` route answers, and when an owner route says 403. This note lists those guarantees per surface and the client behaviour they require; the assumptions are spelled out in [[Ring Access Engine Frontend]] and [[Ring Access Model]].

## Per screen

### Any screen that renders another person ([[Screen Index#s44|s44]], perspective switcher, [[Screen Index#s17|s17]] cards)

- Needs: the server's answer to "may I see this, now"; one shape (`RingProfileViewEntity`) with no Ring or owner identifiers; one 404 for every refused case.
- Source today: `GET /views/pin/:pinName`, `GET /views/ring/:ringId`, `GET /views/user/:userId/perspectives`, `GET /rings/shared-with-me`.

### Any owner editing screen ([[Screen Index#s14|s14]], [[Screen Index#s15|s15]], [[Screen Index#s22|s22]] – [[Screen Index#s26|s26]])

- Needs: a 403 when the caller is below the required admin level; editing allowed on an expired Ring.
- Source today: `assertCanAdminister` behind `PATCH /rings/:id`, `/rings/:ringId/members/*`, `/rings/:ringId/projection/*`.

### Owner's View as ([[Screen Index#s31|s31]])

- Needs: the same code path a member gets; a distinguishable "expired" state for the owner only.
- Source today: `GET /views/ring/:ringId` with the owner's own Ring id; 404 `E_RING_ACCESS_02` when not live.

### Post-event ([[Screen Index#s62|s62]])

- Needs: the expired Ring still editable so the disposition can be chosen.
- Source today: `POST /rings/:id/disposition` passes through `assertCanAdminister`, which ignores expiry.

## Guarantees the client may rely on

| Guarantee | Where it shows | What the client does with it |
|---|---|---|
| Resolved per request against the server's `now` | every `/views` answer, Shared with me | no access cache to clear; refetch on focus |
| Both windows checked, expiry exclusive | a Ring or a membership lapsing | compute "expires in" for the owner only |
| Block is mutual and overrides membership | `/views` 404, empty `/perspectives` | one message; never say "blocked" |
| Owner always reads their live Rings, always edits them | View as, editing an expired Ring | View as only on live Rings; s62 edits without preview |
| Membership private to the owner | no `ringId` on a view, roster owner-only | no "you are in X" copy, switcher by position |
| Hidden rows excluded by the query | `links`, `infoBlocks`, `attachments` on a view | render what arrives; no `isVisible` to check |
| Sensitive fields gated in one place | `null` on a view | render "Not shared" |

## Endpoints required

| Need | Endpoint | Available | Task / decision |
|---|---|---|---|
| Which Rings I can read right now | `GET /rings/shared-with-me` | ✅ | — (listed under [[Rings]]; applies `ringLiveFilter` and `membershipLiveFilter`) |
| Render one person, default access | `GET /views/pin/:pinName` | ✅ | — (listed under [[View As & Pin Views]]) |
| Render one Ring, if readable | `GET /views/ring/:ringId` | ✅ | — (listed under [[View As & Pin Views]]) |
| Every perspective I hold of one person | `GET /views/user/:userId/perspectives` | ✅ | — (listed under [[View As & Pin Views]]) |
| 403 when below the admin level | all `/rings/:id` editing routes | ✅ | — |
| Create or remove a block | — | ❌ | [[T-024 Block and unblock]] |
| Grant or revoke a delegated admin level | — | ❌ | [[T-006 Delegated admin endpoints]] |
| "Members can see each other" and join rules | — | ❌ | [[D-04 Ring settings]] |
| Resolve a scanned QR token through the engine | — | ❌ | [[T-008 Resolve a scanned QR token]] |

## Behaviour expectations

- Refetch / realtime: there is nothing to invalidate server-side. Refetch any view of another person on screen focus; refetch Shared with me on focus; refetch the roster after every write. A reassign, a revoke or an expiry is reflected by the next request.
- Caching keys: views by `(viewerUserId, pinName)` or `(viewerUserId, ringId)`, never by the target alone; short TTL (seconds, not minutes). Owner lists by `userId`.
- Pagination / ordering: perspectives arrive default Ring first, then oldest, with no identifier; index by position. Shared with me is newest first.
- No second permission model: the client holds no "can this user see X" logic beyond reading the server's answer; the only client-side computation is "expired" / "lapsed" from timestamps on the **owner's** screens.
- Clock: trust the server. Show "expires in" from `expiresAt` for the owner, but never pre-empt a 404 for a viewer.
- 403 handling: hide the editing UI, keep the read path (if any) working; no error toast.
- 404 handling on `/views`: one message for every cause; no cause-specific retry, copy or styling.
- Privacy: never surface a Ring name, a Ring id or a membership row to a viewer; the switcher uses "View 1 / View 2" or the `themeConfig`.

## Error states the UI must handle

| Status | ErrorCode | Show |
|---|---|---|
| 404 | `E_RING_ACCESS_01` | "This profile isn't available to you" (no such Pin, not shared, or blocked) |
| 404 | `E_RING_ACCESS_02` | the same message to a viewer; "This Ring has expired" to the owner on View as |
| 403 | `E_RING_05` | hide the editing UI; the caller is a member or an admin below the level |
| 404 | `E_RING_02` | Ring not found or not administrable: treat as missing |
| 409 | `E_RING_MEMBER_04` | "Cannot add this user" (a block exists; do not say so) |

Until [[T-063 Put the ErrorCode on the error body]] ships, the body carries no `ErrorCode`: branch on status and endpoint. The `/views` 404 bodies are identical by design and by spec.

## Blocked by

- [[D-04 Ring settings]] — any UI that lets members see each other, or that shows join policy; all of it must wait for the engine to enforce it.
- [[T-024 Block and unblock]] — a block screen; the engine already honours blocks but none can be created.
- [[T-006 Delegated admin endpoints]] — admin management on s26 / s27; today only owners pass the level check.
