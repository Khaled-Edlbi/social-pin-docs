---
type: frontend-requirements
code: rings
scope: feature
feature: rings
module: identity
status: draft
screens: [s08, s09, s16, s17, s18, s19, s20, s21, s22, s26, s62]
created: 2026-10-18
updated: 2026-10-28
tags: [frontend-requirements, frontend-requirements/draft, module/identity, layer/frontend]
---

# Rings · Frontend Requirements

> ⚠ Affected by [[S-15 Ring Access Engine Story]] (2026-10-29): the settings row "Purpose, join policy, members visible, email domain ❌ ND-04" points at a decided question; it should ask for **the six launch settings** (save and read each on a Ring, D-04's defaults, owner and admins may change them) → [[S-18 Rings Story|Rings · S9]], without the email domain (later). Shared with me (`GET /rings/shared-with-me`) needs per row the person (the owner's card) and, only for a Ring joined knowingly, its name and who shared it, and a member count only when its members can see each other (S-15 S1). Then this note goes `ready`.

> ⚠ Affected by [[D-04 Ring settings at launch and their defaults]] (2026-10-25): ND-04 decided, six Ring settings at launch with private defaults (join with a code or invite, approve each one, members can't see each other, invite or save attachments); the owner and the Ring's admins change them; members who may see each other see full cards.

> ⚠ Affected by [[D-05 Inherit per field, copy without members]] (2026-10-25): ND-05 decided, a Ring inherits the main profile field by field until it changes that field; copying a Ring copies fields, bio, photo, colour and settings, never members.

> ⚠ Affected by [[D-14 Shared with me lists people, never the Ring]] (2026-10-25): ND-14 decided, option 2: Shared with me lists the people who share with me and never shows a Ring's name, colour or type to a member.

**Feature:** [[F-11 Rings]] · **Status:** Draft · **Story:** [[S-18 Rings Story]] · **Backend Integration:** [[BI-08 Rings Backend Integration]]

What the client needs from the backend to build the Ring lists, the create wizard, the edit screens and the post-event choice, and whether each need is met today. Field rules, enums and the disposition semantics are in [[BI-08 Rings Backend Integration]].

## Per screen

### [[Screen Index#s08|s08]] First Ring · [[Screen Index#s09|s09]] Create first Ring

- Needs: the default Ring by name and colour; create a second Ring with a name and colour.
- Source today: `GET /rings`, `POST /rings`.

### [[Screen Index#s16|s16]] My Rings

- Needs: the owned list with `id`, `name`, `type`, `colorHex`, `style`, `isDefault`, `isTemporary`, `startsAt`, `expiresAt`, `status`, `disposition`; `meta.total`; make default; delete; "N people".
- States: list, empty, expired chip, temporary badge, default star, delete disabled on the default.
- Source today: `GET /rings`, `POST /rings/:id/default`, `DELETE /rings/:id`. Member count: not yet.

### [[Screen Index#s17|s17]] Shared with me

- Needs: Rings I can read right now with `name`, `colorHex`, `ownerUserId`, `expiresAt`; a way to open the owner's projection; invite review; join with a code.
- Source today: `GET /rings/shared-with-me`, then `GET /views/ring/:id`. Invites and join: not yet.

### [[Screen Index#s18|s18]] – [[Screen Index#s21|s21]] New Ring wizard

- Needs: create with `name`, `type`, `colorHex`, `style`, `isTemporary`, `startsAt`, `expiresAt`, `profileId?`, `parentRingId?`; copy from another Ring; audience settings; projection editing in steps 3 and 4.
- Source today: `POST /rings`; projection routes ([[FR-10 Ring Projection Frontend Requirements]]). Copy and audience settings: not yet.

### [[Screen Index#s22|s22]] Edit · name & purpose · [[Screen Index#s26|s26]] Edit · access

- Needs: edit name, colour, style, window, temporary flag; delete; purpose, join policy, permissions, delegated admins.
- Source today: `PATCH /rings/:id`, `DELETE /rings/:id`. Settings and admins: not yet.

### [[Screen Index#s62|s62]] Post-event summary

- Needs: detect an undecided lapsed temporary Ring; choose KEEP / MERGE / AUTO_DELETE; a picker of my other Rings for MERGE.
- Source today: `GET /rings` (filter `isTemporary=true`), `POST /rings/:id/disposition`.

## Endpoints required

| Need | Endpoint | Available | Task / decision |
|---|---|---|---|
| List my Rings, default first | `GET /rings` | ✅ | — |
| List Rings shared with me, live now | `GET /rings/shared-with-me` | ✅ | — |
| Create a Ring | `POST /rings` | ✅ | — |
| Read one Ring | `GET /rings/:id` | ✅ | — |
| Edit name, colour, style, window, temporary flag | `PATCH /rings/:id` | ✅ | — |
| Make default | `POST /rings/:id/default` | ✅ | — |
| Keep / merge / let it go | `POST /rings/:id/disposition` | ✅ | — |
| Delete | `DELETE /rings/:id` | ✅ | — |
| Open a shared Ring's projection | `GET /views/ring/:ringId` | ✅ | — (listed under [[F-12 View As & Pin Views]]) |
| "N people" on list and detail | — | ❌ | [[S-03 Counts Story|Counts · S6–S10]] |
| Purpose, join policy, members visible, email domain (s19, s22, s26, s27) | — | ❌ | [[ND-04 Ring settings]] |
| Copy a Ring when creating (s18) | — | ❌ | [[ND-05 Copy or inherit]] |
| Review / decline an invite, join with a code (s17) | — | ❌ | [[S-33 Ring Invitations & Join Story|Ring Invitations & Join · S7]], [[S-33 Ring Invitations & Join Story|Ring Invitations & Join · S8]] |
| Delegated admins (s26, s27) | — | ❌ | [[S-31 Delegated Admins Story|Delegated Admins · S6]] |
| Purge of AUTO_DELETE Rings | — | ❌ | [[S-76 Cleanup Jobs Story|Cleanup Jobs · S4]] |

## Behaviour expectations

- Refetch / realtime: refetch `GET /rings` after create, edit, default, delete and disposition; refetch `GET /rings/shared-with-me` on every screen focus (it changes without the viewer acting). No push.
- Caching keys: `rings:<userId>` and `rings-shared:<userId>`, separate; `ring:<id>` for detail. Invalidate `ring:<id>` and `projection:<id>` on any edit.
- Pagination / ordering: owned list default first then newest; shared list newest first; `limit` ≤ 50 (a 400 above it); `meta.total` unpaginated; filters `name`, `type`, `status`, `isTemporary` (send `false` deliberately).
- Expired and lapsed: compute from `expiresAt`; `status` stays `ACTIVE` on an expired Ring. Show the disposition sheet when `isTemporary && disposition === "UNDECIDED" && expiresAt < now`.
- Type picker: `PERSONAL` and `CORPORATE` only; never offer `EVENT`, `MINI_EVENT`, `MEETING`.
- Wizard: create the Ring on step 1 so steps 3 and 4 have a projection; on Cancel delete it. `profileId` defaults server-side to the default profile.
- Default: never flip `isDefault` locally; refetch after `POST …/default`. Hide delete on the default row.
- MERGE picker: my own Rings excluding the source; the backend refuses anything else with 400 `E_RING_07`.
- Expired Rings: list them on My Rings with the chip; keep edit routes available; do not call `GET /views/ring/:id` on them.

## Error states the UI must handle

| Status | ErrorCode | Show |
|---|---|---|
| 409 | `E_RING_01` | "You already have a Ring with this name", inline |
| 400 | `E_RING_01` | type not allowed on create: client bug, do not offer those types |
| 404 | `E_RING_02` | not my Ring or deleted: back to the list |
| 403 | `E_RING_05` | delegated admin below the level: read-only |
| 400 | `E_RING_06` / `E_RING_08` | parent Ring or profile is not mine: validation |
| 400 | `E_RING_07` | MERGE without a Ring of mine: ask for a target |
| 409 | `E_RING_04` | deleting the default: "Choose another default first" |
| 400 | — (validation; `message` is a string array) | inline (name length, `#RRGGBB`, ISO dates, `limit` > 50) |

Until [[S-87 Error Contract Story|Error Contract · S4–S8]] ships, branch on status and endpoint.

## Blocked by

- [[ND-04 Ring settings]] — step 2 of the wizard (s19), Purpose on s22, Access on s26, Permissions on s27.
- [[ND-05 Copy or inherit]] — "Copy a Ring" on s18.
- [[S-03 Counts Story|Counts · S6–S10]] — "N people" on every row.
