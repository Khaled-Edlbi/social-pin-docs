---
type: frontend-requirements
code: ring-access
scope: feature
feature: ring-access
module: identity
status: draft
screens: [s15, s16, s17, s26, s27, s31, s44, s47, s62]
depends: ["S-15 Ring Access Engine Story"]
affects: ["BD-08 Ring Access Engine Backend Delivery"]
related: ["BI-05 Ring Access Engine Backend Integration", "Ring Access Model", "D-04 Ring settings at launch and their defaults", "D-14 Shared with me lists people, never the Ring", "D-15 Several Rings per connection, remove or disconnect", "D-18 Ring names shown when joined knowingly", "ND-23 Mutual connections and events in common", "FR-11 Rings Frontend Requirements", "FR-12 View As & Pin Views Frontend Requirements", "S-18 Rings Story", "S-16 Ring Members Story", "S-23 Connections Story", "S-31 Delegated Admins Story", "S-87 Error Contract Story", "GET /rings/shared-with-me", "GET /views/pin/:pinName", "GET /views/ring/:ringId", "GET /views/user/:userId/perspectives", E_RING_05, E_RING_02]
created: 2026-10-18
updated: 2026-10-29
owner: "Omar Fostok"
tags: [frontend-requirements, frontend-requirements/draft, module/identity, layer/frontend]
---

# Ring Access Engine · Frontend Requirements

**Feature:** [[F-08 Ring Access Engine]] · **Status:** Draft · **Story:** [[S-15 Ring Access Engine Story]] · **Backend Integration:** [[BI-05 Ring Access Engine Backend Integration]]

The engine exposes no endpoint. What the client needs from it is a set of guarantees that other endpoints carry: which rows appear on Shared with me and what each may say, what every `/views` route answers, and when an owner route says 403. This note lists those guarantees per surface and the client behaviour they require; the assumptions are spelled out in [[BI-05 Ring Access Engine Backend Integration]] and [[Ring Access Model]]. The screens themselves belong to other features ([[F-11 Rings]], [[F-09 Ring Members]], [[F-12 View As & Pin Views]], [[F-14 Connections]]); each section here is only what the engine decides on it.

## Per screen

### [[Screen Index#s17|s17]] Shared with me (S1)

- **One row per person** ([[D-14 Shared with me lists people, never the Ring]]):
  - a Ring the owner **placed** me in (connection accepted into it, added by the owner or an admin): the row is **the person**, their name and photo from the card they share with me; **no Ring name, colour or type**;
  - a Ring I **joined knowingly** (an invitation I accepted, a code, a verified work email): the row may carry **the Ring's name and who shared it** ("Acme Team · Shared by Acme Studio") ([[D-18 Ring names shown when joined knowingly]]);
  - one person who shares with me through several Rings: **one row**, rendering the Ring I was placed in first ([[D-15 Several Rings per connection, remove or disconnect]]).
- **A member count** ("· N people") only on a named-Ring row, and only when that Ring's "members can see each other" is on; never on a person row.
- **Until the backend records how a membership was made:** every row is shown as **the person**, with no Ring name and no count.
- Tap: opens that person's card for me (`GET /views/ring/:ringId`), never the owner's Ring data (s14).
- Source today: `GET /rings/shared-with-me` returns Rings, **with their names, to every member**, and no owner card or count: ❌ (the shape is asked in [[FR-11 Rings Frontend Requirements|FR-11]], since the endpoint is listed under [[F-11 Rings]]).

### Any screen that renders another person ([[Screen Index#s44|s44]], [[Screen Index#s31|s31]] for a member, the perspective switcher, s17's cards)

- Needs: the server's answer to "may I see this, now"; one shape (`RingProfileViewEntity`) with no Ring or owner identifiers; one 404 for every refused case.
- Source today: `GET /views/pin/:pinName`, `GET /views/ring/:ringId`, `GET /views/user/:userId/perspectives`.

### Any owner editing screen ([[Screen Index#s14|s14]], [[Screen Index#s15|s15]], [[Screen Index#s22|s22]] – [[Screen Index#s27|s27]])

- Needs: a 403 when the caller is below the required admin level; editing allowed on an expired Ring.
- Source today: `assertCanAdminister` behind `PATCH /rings/:id`, `/rings/:ringId/members/*`, `/rings/:ringId/projection/*`.

### [[Screen Index#s26|s26]], [[Screen Index#s27|s27]] Ring settings: what the engine enforces (S8)

- The six launch settings ([[D-04 Ring settings at launch and their defaults]]) are **built and saved** in [[S-18 Rings Story|Rings · S9]] (asked in [[FR-11 Rings Frontend Requirements|FR-11]]); this section is what the engine does with them.
- "Members can see each other" off (the default): no member-facing route shows the roster, **the member count included**. On: members see each other's full cards.
- "Members can invite others", "members can save attachments": checked before an invite or a download; a refusal is quiet (as a 403, S6).
- "Who can request to join" has **three choices**: anyone who scans, only with a code (default, with invitation), only invited. Not "Contacts of members". With "approve each one", it decides whether a request or a code creates a live membership at once.
- **Not shown in v1:** members can message me, see when I'm at an event, required work email domain (each with its feature).
- Source today: none of the settings exist; every Ring behaves as all-off.

### [[Screen Index#s15|s15]] Ring people: the roster footnote (S8)

- Needs: the Ring's "members can see each other" value, to choose the footnote: off → "Members never see who else is in this Ring — only you do."; on → "Members of this Ring can see each other." ([[S-16 Ring Members Story]]).
- Source today: the setting doesn't exist; the "off" sentence is the true one.

### [[Screen Index#s47|s47]] Connection detail: what we share (S-15 Open questions)

- "Mutual connections" and "events in common" are **not shown** until [[ND-23 Mutual connections and events in common]] is decided; the engine enforces the answer.

### Owner's View as ([[Screen Index#s31|s31]])

- Needs: the same code path a member gets; a distinguishable "expired" state for the owner only.
- Source today: `GET /views/ring/:ringId` with the owner's own Ring id; 404 `E_RING_ACCESS_02` when not live.

### [[Screen Index#s16|s16]] My Rings, [[Screen Index#s62|s62]] Post-event (S2, S5)

- s16: "expires 16 Mar" and the "expired" chip are computed from `expiresAt` on the owner's side.
- s62: the expired Ring is still editable so the disposition can be chosen; it is never previewed with the view route.
- Source today: `POST /rings/:id/disposition` passes through `assertCanAdminister`, which ignores expiry.

## Guarantees the client may rely on

| Guarantee | Where it shows | What the client does with it |
|---|---|---|
| Resolved per request against the server's `now` | every `/views` answer, Shared with me | no access cache to clear; refetch on focus |
| Both windows checked, expiry exclusive | a Ring or a membership lapsing | compute "expires in" for the owner only |
| Block is mutual and overrides membership | `/views` 404, empty `/perspectives` | one message; never say "blocked" |
| Owner always reads their live Rings, always edits them | View as, editing an expired Ring | View as only on live Rings; s62 edits without preview |
| Membership private to the owner | no `ringId` on a view, roster owner-only, no Ring name on a placed membership | no "you are in X" copy, switcher by position, s17 rows by person |
| Hidden rows excluded by the query | `links`, `infoBlocks`, `attachments` on a view | render what arrives; no `isVisible` to check |
| Sensitive fields gated in one place | `null` on a view | render "Not shared" |

## Endpoints required

| Need | Endpoint | Available | Story part / decision |
|---|---|---|---|
| Shared with me, one row per person: the owner's card; a Ring's name and who shared it **only when joined knowingly**; a member count **only when members can see each other** | `GET /rings/shared-with-me` | ❌ | S-15 S1 (D-14, D-18, D-15); listed under [[F-11 Rings]], asked in [[FR-11 Rings Frontend Requirements\|FR-11]] |
| How each membership was made (invitation, code, work email, placed) | — (server-side) | ❌ | S-15 S1 ([[F-09 Ring Members]] records it) |
| Render one person, default access | `GET /views/pin/:pinName` | ✅ | — (listed under [[F-12 View As & Pin Views]]) |
| Render one Ring, if readable | `GET /views/ring/:ringId` | ✅ | — (listed under [[F-12 View As & Pin Views]]) |
| Every perspective I hold of one person | `GET /views/user/:userId/perspectives` | ✅ | — (listed under [[F-12 View As & Pin Views]]) |
| 403 when below the admin level | all `/rings/:id` editing routes | ✅ | — |
| The six launch settings, saved and enforced | — | ❌ | built in [[S-18 Rings Story\|Rings · S9]] (asked in FR-11); enforced per S-15 S8 |
| Create or remove a block | — | ❌ | [[S-23 Connections Story\|Connections · S25]] |
| Grant or revoke a delegated admin level | — | ❌ | [[S-31 Delegated Admins Story\|Delegated Admins · S6]] |
| Mutual connections and events in common | — | ❌ | [[ND-23 Mutual connections and events in common]] |
| Resolve a scanned QR token through the engine | — | ❌ | [[S-37 Badge & QR Story\|Badge & QR · S13–S18]] |

## Behaviour expectations

- Refetch / realtime: there is nothing to invalidate server-side. Refetch any view of another person on screen focus; refetch Shared with me on focus; refetch the roster after every write. A reassign, a revoke or an expiry is reflected by the next request.
- Caching keys: views by `(viewerUserId, pinName)` or `(viewerUserId, ringId)`, never by the target alone; short TTL (seconds, not minutes). Owner lists by `userId`.
- Pagination / ordering: perspectives arrive default Ring first, then oldest, with no identifier; index by position. Shared with me is newest first.
- No second permission model: the client holds no "can this user see X" logic beyond reading the server's answer; the only client-side computation is "expired" / "lapsed" from timestamps on the **owner's** screens.
- **Shared with me rows:** never use a Ring's name as the row title unless the API marks the Ring as joined knowingly; never show "· N people" unless the API sends a count.
- **Settings screens:** never show a switch the backend doesn't save; the three later settings stay hidden.
- Clock: trust the server. Show "expires in" from `expiresAt` for the owner, but never pre-empt a 404 for a viewer.
- 403 handling: hide the editing UI, keep the read path (if any) working; no error toast.
- 404 handling on `/views`: one message for every cause; no cause-specific retry, copy or styling.
- Privacy: never surface a Ring name (except on a Ring joined knowingly, D-18), a Ring id or a membership row to a viewer; the switcher uses "View 1 / View 2" or the `themeConfig`.

## Error states the UI must handle

| Status | ErrorCode | Show |
|---|---|---|
| 404 | `E_RING_ACCESS_01` | "This profile isn't available to you" (no such Pin, not shared, or blocked) |
| 404 | `E_RING_ACCESS_02` | the same message to a viewer; "This Ring has expired" to the owner on View as |
| 403 | `E_RING_05` | hide the editing UI; the caller is a member or an admin below the level |
| 404 | `E_RING_02` | Ring not found or not administrable: treat as missing |
| 409 | `E_RING_MEMBER_04` | "Cannot add this user" (a block exists; do not say so) |

Until [[S-87 Error Contract Story|Error Contract · S4–S8]] ships, the body carries no `ErrorCode`: branch on status and endpoint. The `/views` 404 bodies are identical by design and by spec.

## Blocked by

- [[S-18 Rings Story|Rings · S9]]: the six settings, saved; until then every Ring is all-off and no screen implies members see one another.
- S-15 S1's membership origin: Ring names on Shared with me for Rings joined knowingly; until then every row is the person.
- [[S-23 Connections Story|Connections · S25]]: a block screen; the engine already honours blocks but none can be created.
- [[S-31 Delegated Admins Story|Delegated Admins · S6]]: admin management on s26 / s27; today only owners pass the level check.
- [[ND-23 Mutual connections and events in common]]: the two rows on s47.
