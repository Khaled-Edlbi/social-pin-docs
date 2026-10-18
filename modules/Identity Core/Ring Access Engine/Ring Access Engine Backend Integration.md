---
type: backend-integration
code: ring-access
scope: feature
feature: ring-access
module: identity
status: current
screens: []
updated: 2026-10-18
tags: [backend-integration, backend-integration/current, module/identity, layer/backend]
---

# 🔌 Ring Access Engine · Backend Integration

**Feature:** [[Ring Access Engine]] · **Backend:** ✅ Done · **Read first:** [[Ring Access Model]], [[Frontend Contract]]

The engine has no endpoints of its own; it is what decides every `/views` answer, every `/rings/shared-with-me` row and every 403 on an owner route. This note is what the client must **assume** because of it.

## What the client can rely on

- **Access is resolved on every request, against the server's `now`.** There is no state to refresh, no token to renew, no "access cache" to clear. Moving someone between Rings, revoking them, or a Ring expiring changes the next response.
- **Both windows count.** A viewer loses access when the Ring's `expiresAt` passes **or** the membership's does, and gains it only when both `startsAt` have passed. Expiry is exclusive: at the instant of `expiresAt` the Ring is already closed.
- **A block is mutual.** Neither party sees the other, whatever Rings they still share. (Nothing can create a block yet: [[T-024 Block and unblock]].)
- **The owner always sees their own Rings** on `/views/ring/:ringId` while they are live, and always edits them, live or not.

## What the client must do

| Situation | Do |
|---|---|
| Rendering another person | refetch on screen focus; keep any cache short-lived and keyed by (viewer, target) |
| A `/views` 404 | show one message; never infer "blocked" or "exists" |
| A 403 `E_RING_05` on `/rings/:id`, `/members`, `/projection` | the user is a member, not the owner or an admin at the needed level; hide the editing UI |
| Showing "expired" on an owner's Ring | compute from `expiresAt`; the backend never sets `RING_STATUS.EXPIRED` |
| Showing "lapsed" on a member row | compute from the row's `expiresAt`; `RING_MEMBER_STATUS.EXPIRED` is never set |
| Clock skew | trust the server: a Ring that looks live on the device may already 404 |

## Admin levels

Delegated admins (`RingAdmin`, [[Delegated Admins]]) are checked per route: `MEMBER_MANAGER` for the roster, `CONTENT_MANAGER` for Ring edits and the projection, `FULL` above both. There are no endpoints to grant these yet ([[T-006 Delegated admin endpoints]]); until then only owners pass.

## What the client must never do

- Build a second permission model: no local "can this user see X" logic beyond reading the server's answer.
- Surface which Ring a viewer is in, or that a membership row exists.
- Distinguish the three 404 causes on `/views`.

## Related frontend notes

[[View As & Pin Views Backend Integration]] · [[Rings Backend Integration]] · [[Ring Members Backend Integration]] · [[Ring Projection Backend Integration]]
