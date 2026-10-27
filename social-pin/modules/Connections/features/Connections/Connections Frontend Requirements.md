---
type: frontend-requirements
code: connections
scope: feature
feature: connections
module: connections
status: draft
screens: [s44, s45, s46, s47, s62]
created: 2026-10-18
updated: 2026-10-27
tags: [frontend-requirements, frontend-requirements/draft, module/connections, layer/frontend]
---

# Connections · Frontend Requirements

> ⚠ Affected by [[D-04 Ring settings at launch and their defaults]] (2026-10-25): ND-04 decided, six Ring settings at launch with private defaults (join with a code or invite, approve each one, members can't see each other, invite or save attachments); the owner and the Ring's admins change them; members who may see each other see full cards.

> ⚠ Affected by [[D-13 The requester sees a declined request]] (2026-10-25): ND-13 decided, option 3: the requester sees a declined request as declined.

> ⚠ Affected by [[D-14 Shared with me lists people, never the Ring]] (2026-10-25): ND-14 decided, option 2: Shared with me lists the people who share with me and never shows a Ring's name, colour or type to a member.

> ⚠ Affected by [[D-15 Several Rings per connection, remove or disconnect]] (2026-10-25): ND-15 decided, one person can be in several of my Rings and sees the oldest version first; removing them from my last Ring offers Remove from Rings or Disconnect.

> ⚠ Affected by [[D-17 Requests expire after 30 days, optional note, ask again at once]] (2026-10-25): a connection request expires after 30 days, may carry an optional note of up to 200 characters, and can be asked again straight away after a decline.

**Feature:** [[Connections]] · **Status:** Draft · **Story:** [[Connections Story]] · **API Integration:** not yet (backend not built)

What the client needs from the backend to build the screens in [[Connections Story]], and whether each need is met today. Rendering the other person is done (`/views`); moving and revoking a member is done; everything that creates, lists or closes a request is not.

## Per screen

### [[Screen Index#s44|s44]] Scanned Pin

- Needs: the resolved view (done), the person's **user id** to address the request, a *Connect* action, a *Requested* state that survives navigation, the neutral failure message.
- Source today: `GET /views/ring/:ringId` or `GET /views/pin/:pinName` for the view; the user id is **not in the view entity** and no endpoint hands it out, so the scan payload or the request endpoint must carry it. Send: not yet.

### [[Screen Index#s45|s45]] Requests

- Needs: incoming and sent lists with the other person's `displayName`, `pinName`, `avatarFileId`, `createdAt`, `status`; counts for the segment labels; cancel on sent; accept / decline on incoming.
- Source today: not yet.

### [[Screen Index#s46|s46]] Accept · pick a Ring

- Needs: the owner's live Rings for the picker (done), a suggested Ring, an atomic accept with `ringId` and optional `startsAt` / `expiresAt`, a decline.
- Source today: `GET /rings` for the picker (filter out `EVENT` / `MEETING` types unless the request came from that event). Accept, decline, suggestion: not yet.

### [[Screen Index#s47|s47]] Connection detail

- Needs: the connection (person, connected since), the Ring they are in with its window (owner only), reassign, revoke, block, events in common, mutual connections, request meeting, introduce.
- Source today: reassign `POST /rings/:ringId/members/:userId/reassign`, window `PATCH …/members/:userId`, revoke `DELETE …/members/:userId`. Detail, block, events in common, mutual connections: not yet.

### [[Screen Index#s62|s62]] Post-event summary

- Needs: the count of pending incoming requests created within the event window; the same accept sheet as s46.
- Source today: disposition of the Event Ring is done (`POST /rings/:id/disposition`); the request count is not yet.

### Contacts list (People from [[Screen Index#s38|s38]])

- Needs: a paginated, searchable list of my connections with user id, name, Pin name, avatar id.
- Source today: not yet.

## Endpoints required

| Need | Endpoint | Available | Task / decision |
|---|---|---|---|
| Render the scanned or looked-up person | `GET /views/ring/:ringId`, `GET /views/pin/:pinName` | ✅ | — |
| Everything the person shares with me, for s45 / s47 rows | `GET /views/user/:userId/perspectives` | ✅ | — |
| Send a request to a user id | — | ❌ | [[T-021 Connect request send, inbox, cancel]] |
| Incoming and sent lists, cancel | — | ❌ | [[T-021 Connect request send, inbox, cancel]] |
| Accept into a Ring in one transaction, decline | — | ❌ | [[T-022 Accept into a Ring (sets grantedRingId)]] |
| Rings for the picker | `GET /rings` | ✅ | — |
| Suggested Ring on accept | — | ❌ | [[T-051 Gemma assistant sheet and suggestions]] |
| Connection detail, contacts list, events in common, mutual | — | ❌ | [[T-023 Connection detail and contacts list]] |
| Move to another Ring | `POST /rings/:ringId/members/:userId/reassign` | ✅ | — |
| Change the access window | `PATCH /rings/:ringId/members/:userId` | ✅ | — |
| Revoke access | `DELETE /rings/:ringId/members/:userId` | ✅ | — |
| Block, unblock, blocked list | — | ❌ | [[T-024 Block and unblock]] |
| Introduce | — | ❌ | [[T-025 Introduce a connection to another]] |
| Connection count on Me and Home | — | ❌ | [[Counts Story|Counts · S11]] |
| Push or inbox notification on request and accept | — | ❌ | [[T-045 NotificationService.emit and the inbox]] |
| Avatar bytes on every row | — | ❌ | [[Files Upload Story|Files Upload · showing files]] |

## Behaviour expectations

- Refetch / realtime: the inbox (s45) refetches on screen focus and after each write; until push lands, a badge count on the People tile polls no more often than once a minute while the app is foregrounded. s47 refetches after reassign, revoke and block; never patch "what they see" locally.
- Caching keys: requests by (signed-in user, direction); a connection by (signed-in user, other user id); the other person's view by (viewer, target) as in [[View As & Pin Views Backend Integration]]. Invalidate all three on block.
- Pagination / ordering: `{ data, meta: { total } }`, `limit` ≤ 50; inbox newest first; contacts by display name with a `q` filter applied server-side to the caller's own connections only.
- Optimistic UI: allowed for *Cancel* on a sent request; not for accept (three writes in one transaction, show the result).
- Identity: the user id needed to send comes from the scan or the request row; never derive it from a view.

## Error states the UI must handle

| Status | ErrorCode | Show |
|---|---|---|
| 404 | `E_RING_ACCESS_01` (views; T-021 reuses the body for send) | one message: "This profile isn't available to you" — never "blocked" |
| 404 | `E_RING_ACCESS_02` | same message to a viewer |
| 403 | `E_RING_05` | hide owner-only parts of s47 (the caller is not owner / admin of that Ring) |
| 404 | `E_RING_02` | the Ring on s46 / s47 is gone: refetch the picker |
| 409 | `E_RING_MEMBER_04` | "Cannot add this user" on accept; do not say why |
| 409 | `E_RING_MEMBER_01` | already in that Ring: treat the accept as done, refresh |
| 404 | `E_RING_MEMBER_02` | membership row missing on reassign / revoke: refresh s47 |
| 400 | `E_RING_07` | reassign target is not the same owner's Ring: validation |
| 401 | `E_AUTH_04` | sign in again |
| — | request-specific codes | to be defined by T-021 / T-022 / T-024; branch on `statusCode` until [[Error Contract Story|Error Contract · S4–S8]] |

## Blocked by

- [[T-025 Introduce a connection to another]] — the *Introduce* row on s47 (needs product input).
- [[ND-04 Ring settings]] — mutual connections on s47 if "members can see each other" is ever on.
- [[T-022 Accept into a Ring (sets grantedRingId)]] — whether a connection-granted Ring is listed by name on `GET /rings/shared-with-me` (the open question in the story); the s17 list depends on the answer.
- [[Error Contract Story|Error Contract · S4–S8]] — the error table above is by status until then.
