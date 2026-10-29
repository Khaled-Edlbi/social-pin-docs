---
type: frontend-requirements
code: rings
scope: feature
feature: rings
module: identity
status: draft
screens: [s08, s09, s16, s17, s18, s19, s20, s21, s22, s26, s27, s62]
depends: ["S-18 Rings Story"]
affects: ["BD-11 Rings Backend Delivery"]
related: ["D-04 Ring settings at launch and their defaults", "D-14 Shared with me lists people, never the Ring", "D-15 Several Rings per connection, remove or disconnect", "D-18 Ring names shown when joined knowingly", "S-15 Ring Access Engine Story", "FR-08 Ring Access Engine Frontend Requirements", "GET /rings/shared-with-me", "PATCH /rings/:id", "POST /rings"]
created: 2026-10-18
updated: 2026-10-29
owner: "Omar Fostok"
tags: [frontend-requirements, frontend-requirements/draft, module/identity, layer/frontend]
---

# Rings · Frontend Requirements

> ⚠ Affected by [[S-18 Rings Story]] (2026-10-29): design review. S1: s08 templates pre-fill s09; s09 asks name, colour, what it shows, expiry. S4: step 1 "Start from" (Blank, Copy, Event Ring with dates), no type picker, name 1–24 in the app; step 2 people from my connections (with "in any of my Rings"); step 4 three settings and a summary. S6 / S7: "Make this my default Ring" on s26; a temporary Ring can't be the default (new small ask). Copy a Ring needs a copy endpoint (the "❌ ND-05" row). Gemma chips hidden. Screens: s27.

> ⚠ Affected by [[D-05 Inherit per field, copy without members]] (2026-10-25): ND-05 decided, a Ring inherits the main profile field by field until it changes that field; copying a Ring copies fields, bio, photo, colour and settings, never members.

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

- **One row per person who shares with me**, live right now ([[D-14 Shared with me lists people, never the Ring]], [[S-15 Ring Access Engine Story|Ring Access Engine · S1]]):
  - a Ring the owner **placed** me in (my connection request accepted into it, or added by the owner or an admin): the row is **the person**: their name, Pin name and photo from the card they share with me; **no Ring name, colour or type**;
  - a Ring I **joined knowingly** (an invitation I accepted, a code, a verified work email): the row may also carry **the Ring's name and who shared it** ("Acme Team · Shared by Acme Studio") ([[D-18 Ring names shown when joined knowingly]]);
  - one person through several Rings: one row, the Ring I was placed in first ([[D-15 Several Rings per connection, remove or disconnect]]).
- **Member count** ("· N people") only on a named-Ring row, and only when that Ring's "members can see each other" is on; never on a person row.
- Needs, per row: the owner's card (name, Pin name, photo), the `ringId` to open the view, `expiresAt`; **only for a Ring joined knowingly**: its `name` and who shared it (a person or a company); **only when its members can see each other**: the member count. No `colorHex`, no type, no Ring name otherwise.
- **Until memberships record how they were made:** every row is shown as the person, with no Ring name and no count.
- Tap: opens the person's card (`GET /views/ring/:ringId`), never the owner's Ring data (s14).
- Also on the screen: invite review and join with a code ([[S-33 Ring Invitations & Join Story]]); an invitation names its Ring (D-18).
- Source today: `GET /rings/shared-with-me` returns Rings with their `name` to every member, and no owner card or count; then `GET /views/ring/:id`. Invites and join: not yet.

### [[Screen Index#s18|s18]] – [[Screen Index#s21|s21]] New Ring wizard

- Needs: create with `name`, `type`, `colorHex`, `style`, `isTemporary`, `startsAt`, `expiresAt`, `profileId?`, `parentRingId?`; copy from another Ring; audience settings; projection editing in steps 3 and 4.
- Source today: `POST /rings`; projection routes ([[FR-10 Ring Projection Frontend Requirements]]). Copy and audience settings: not yet.

### [[Screen Index#s22|s22]] Edit · name & purpose · [[Screen Index#s26|s26]] Edit · access

- Needs: edit name, colour, style, window, temporary flag; delete; the Ring settings (below); delegated admins.
- Source today: `PATCH /rings/:id`, `DELETE /rings/:id`. Settings and admins: not yet.

### Ring settings: [[Screen Index#s19|s19]] (wizard step 2), [[Screen Index#s22|s22]] (purpose), [[Screen Index#s26|s26]] (access), [[Screen Index#s27|s27]] (permissions) ([[S-18 Rings Story|Rings · S9]])

- **The six launch settings** ([[D-04 Ring settings at launch and their defaults]]), each saved and read on a Ring, with these defaults on a new Ring:

  | Setting | Values | Default |
  |---|---|---|
  | Who it's for (purpose) | a label ("Clients", "Investors") | empty |
  | Who can request to join | **anyone who scans**, **only with a code**, **only invited** | only with a code or by invitation |
  | Approve each one | on / off (off = auto-accept) | on |
  | Members can see each other | on / off | off |
  | Members can invite others | on / off | off |
  | Members can save attachments | on / off | off |

- **Who may change them:** the Ring's owner and the Ring's admins ([[S-31 Delegated Admins Story]]); a member cannot (403 `E_RING_05`).
- **Read back:** each Ring's settings come with the Ring (`GET /rings/:id`, and on the list where a screen needs them, e.g. s15's footnote and s17's count read "members can see each other").
- **Not in v1, not asked:** "Contacts of members" as a join choice; the three later settings (members can message me, see when I'm at an event, required work email domain), each with its feature.
- s26's summary shows the chosen values in the same words ("Only with a code"); "Permissions · N set" counts only the settings shown.
- The engine enforces them ([[S-15 Ring Access Engine Story|Ring Access Engine · S8]], [[FR-08 Ring Access Engine Frontend Requirements|FR-08]]).
- Source today: none of the settings exist on a Ring.

### [[Screen Index#s62|s62]] Post-event summary

- Needs: detect an undecided lapsed temporary Ring; choose KEEP / MERGE / AUTO_DELETE; a picker of my other Rings for MERGE.
- Source today: `GET /rings` (filter `isTemporary=true`), `POST /rings/:id/disposition`.

## Endpoints required

| Need | Endpoint | Available | Task / decision |
|---|---|---|---|
| List my Rings, default first | `GET /rings` | ✅ | — |
| List Rings shared with me, live now | `GET /rings/shared-with-me` | ✅ | — |
| Shared with me **per person**: the owner's card per row; a Ring's name and who shared it **only when joined knowingly**; a member count **only when members can see each other**; no colour or type | `GET /rings/shared-with-me` | ❌ | [[S-15 Ring Access Engine Story\|Ring Access Engine · S1]] (D-14, D-18, D-15) |
| Create a Ring | `POST /rings` | ✅ | — |
| Read one Ring | `GET /rings/:id` | ✅ | — |
| Edit name, colour, style, window, temporary flag | `PATCH /rings/:id` | ✅ | — |
| Make default | `POST /rings/:id/default` | ✅ | — |
| Keep / merge / let it go | `POST /rings/:id/disposition` | ✅ | — |
| Delete | `DELETE /rings/:id` | ✅ | — |
| Open a shared Ring's projection | `GET /views/ring/:ringId` | ✅ | — (listed under [[F-12 View As & Pin Views]]) |
| "N people" on list and detail | — | ❌ | [[S-03 Counts Story|Counts · S6–S10]] |
| **The six launch settings** (who it's for, who can request to join, approve each one, members can see each other, members can invite, members can save attachments): save and read each on a Ring, D-04's defaults on a new Ring, owner and admins may change them (s19, s22, s26, s27) | `POST /rings`, `PATCH /rings/:id`, `GET /rings/:id` | ❌ | [[S-18 Rings Story\|Rings · S9]] ([[D-04 Ring settings at launch and their defaults]]) |
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
- **Shared with me rows:** never use a Ring's `name` as the row title unless the API marks it as joined knowingly; never show "· N people" unless the API sends a count; never show a Ring's colour or type.
- **Settings:** never show a switch the backend doesn't save; the three later settings stay hidden; a new Ring gets D-04's defaults from the server, not from the client.

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

- [[S-18 Rings Story|Rings · S9]] — the six settings: step 2 of the wizard (s19), Purpose on s22, Access on s26, Permissions on s27.
- [[S-15 Ring Access Engine Story|Ring Access Engine · S1]] — Shared with me per person (the owner's card, the Ring's name only when joined knowingly, the count only when members can see each other).
- [[ND-05 Copy or inherit]] — "Copy a Ring" on s18.
- [[S-03 Counts Story|Counts · S6–S10]] — "N people" on every row.
