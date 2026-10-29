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

**Feature:** [[F-11 Rings]] · **Status:** Draft · **Story:** [[S-18 Rings Story]] · **Backend Integration:** [[BI-08 Rings Backend Integration]]

What the client needs from the backend to build the Ring lists, the create wizard, the edit screens and the post-event choice, and whether each need is met today. Field rules, enums and the disposition semantics are in [[BI-08 Rings Backend Integration]].

## Per screen

### [[Screen Index#s08|s08]] First Ring · [[Screen Index#s09|s09]] Create first Ring (S1)

- s08: the default Ring ("Public": everyone who scans me sees it) from `GET /rings`; three **templates** (Work, Events, Personal) that only pre-fill s09 in the app (nothing sent); "Take me to the app" creates nothing.
- s09: **name** (1–24 in the app, chips), **colour** (swatches, pre-selected), **what this Ring exposes** (the s24 rows, [[FR-10 Ring Projection Frontend Requirements|FR-10]]), **expiry** (optional; on for Events). "Only you see this name, unless someone joins it with an invitation or a code."
- "Create Ring": `POST /rings { name, colorHex, isTemporary?, startsAt?, expiresAt? }`, then the projection writes for what was ticked, then s10.
- Source today: `GET /rings`, `POST /rings`, the projection routes ✅. Nothing new for the backend.

### [[Screen Index#s16|s16]] My Rings (S2)

- Needs: the owned list with `id`, `name`, `type`, `colorHex`, `style`, `isDefault`, `isTemporary`, `startsAt`, `expiresAt`, `status`, `disposition`; `meta.total`; the purpose for the row's short line; "N people".
- A row: name, colour, the purpose or what it shows in a few words, "DEFAULT" on the default, "EVENT" and "expires <date>" on a temporary Ring, "expired" chip; "**N people**" (not "connections") once counts exist.
- **No make-default or delete on the list** (both on s26).
- States: list, empty, expired chip, temporary badge, default mark.
- Source today: `GET /rings`. Member count: not yet. Purpose: not yet (S9).

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

### [[Screen Index#s18|s18]] – [[Screen Index#s21|s21]] New Ring wizard (S4)

- **Step 1 · Name it (s18):** name (1–24 in the app; the server allows 80), suggestion chips ("Gemma: suggest" hidden); **colour & icon** (`colorHex`, the icon in `style`); **who is it for** (the purpose, S9); **Start from**: Blank Ring · **Copy an existing Ring** (❌ until a copy endpoint exists; shown "coming soon") · **Event Ring** (temporary: start / end pickers, end required). **No type picker**: always `PERSONAL` (or `type` left out). "Next" calls `POST /rings { name, colorHex, style?, isTemporary?, startsAt?, expiresAt? }`.
- **Step 2 · Who is in it (s19):** search **my connections**, chips, filters **All** and **No Ring yet**; each picked person added with `POST /rings/:ringId/members { userId }` ✅. Needs: my connections, searchable, each with whether they're in any of my Rings ❌ ([[S-23 Connections Story|Connections · S19–S24]]); until then only "You can create the Ring empty and add people later" and Next. "Met this month" and Gemma's suggestions hidden; "Invite" is [[S-33 Ring Invitations & Join Story]]'s.
- **Step 3 · What it shows (s20):** [[FR-10 Ring Projection Frontend Requirements|FR-10]].
- **Step 4 · How you appear (s21):** photo and bio ([[FR-10 Ring Projection Frontend Requirements|FR-10]]); **Access**: Expiry, Who can request to join, Members see each other (S9's settings); **Summary**: people added, what it exposes, photo & bio inherited or own. "Create Ring" → s14.
- Cancel deletes the Ring created in step 1.
- Source today: `POST /rings`, `POST …/members`, projection routes ✅. Copy, my connections and the settings: not yet.

### [[Screen Index#s22|s22]] Edit · name & purpose · [[Screen Index#s26|s26]] Edit · access (S5, S6, S7)

- s22: name (1–24), "Only you see this name, unless someone joins it with an invitation or a code.", **who this Ring is for** as a short description ("Gemma: rewrite" hidden), colour; `PATCH /rings/:id { name?, colorHex?, style? }`.
- s26: window (`PATCH /rings/:id { startsAt?, expiresAt?, isTemporary? }`), the settings (below), delegated admins, Delete Ring.
- s26, **default**: on a Ring that isn't the default, "**Make this my default Ring**" with "This is what someone sees when they scan you and they're in no other Ring of yours.", a confirmation, then `POST /rings/:id/default`; on the default, "**This is your default Ring**" and no action, and Delete disabled ("Choose another default first"). **A temporary Ring can't be the default** (the row disabled: "A temporary Ring can't be your default.").
- Source today: `PATCH /rings/:id`, `POST /rings/:id/default`, `DELETE /rings/:id` ✅. Settings and admins: not yet. Refusing a temporary default on the server: not yet.

### Ring settings: [[Screen Index#s21|s21]] (wizard step 4), [[Screen Index#s22|s22]] (purpose), [[Screen Index#s26|s26]] (access), [[Screen Index#s27|s27]] (permissions) ([[S-18 Rings Story|Rings · S9]])

- **The six launch settings** ([[D-04 Ring settings at launch and their defaults]]), each saved and read on a Ring, with these defaults on a new Ring:

  | Setting | Values | Default |
  |---|---|---|
  | Who it's for (purpose) | a short description, a few words or a sentence | empty |
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
| **Copy a Ring** (s18 "Copy an existing Ring"): a new Ring with the source's settings, what it shows (the same library items switched on, [[S-17 Ring Projection Story\|Ring Projection · S9]]), bio, photo and colour, **never its members**, in one call | — | ❌ | [[S-18 Rings Story\|Rings · S4]] ([[D-05 Inherit per field, copy without members]]) |
| **Refuse a temporary Ring as the default** (`POST /rings/:id/default` on an `isTemporary` Ring) | `POST /rings/:id/default` | ❌ | [[S-18 Rings Story\|Rings · S7]] |
| **My connections**, searchable, each with whether they're in any of my Rings (s19, "No Ring yet") | — | ❌ | [[S-18 Rings Story\|Rings · S4]] ([[S-23 Connections Story\|Connections · S19–S24]]) |
| Add a picked person to the new Ring | `POST /rings/:ringId/members` | ✅ | [[S-18 Rings Story\|Rings · S4]] (listed under [[F-09 Ring Members]]) |
| Review / decline an invite, join with a code (s17) | — | ❌ | [[S-33 Ring Invitations & Join Story|Ring Invitations & Join · S7]], [[S-33 Ring Invitations & Join Story|Ring Invitations & Join · S8]] |
| Delegated admins (s26, s27) | — | ❌ | [[S-31 Delegated Admins Story|Delegated Admins · S6]] |
| Purge of AUTO_DELETE Rings | — | ❌ | [[S-76 Cleanup Jobs Story|Cleanup Jobs · S4]] |

## Behaviour expectations

- Refetch / realtime: refetch `GET /rings` after create, edit, default, delete and disposition; refetch `GET /rings/shared-with-me` on every screen focus (it changes without the viewer acting). No push.
- Caching keys: `rings:<userId>` and `rings-shared:<userId>`, separate; `ring:<id>` for detail. Invalidate `ring:<id>` and `projection:<id>` on any edit.
- Pagination / ordering: owned list default first then newest; shared list newest first; `limit` ≤ 50 (a 400 above it); `meta.total` unpaginated; filters `name`, `type`, `status`, `isTemporary` (send `false` deliberately).
- Expired and lapsed: compute from `expiresAt`; `status` stays `ACTIVE` on an expired Ring. Show the disposition sheet when `isTemporary && disposition === "UNDECIDED" && expiresAt < now`.
- No type picker: every Ring the app creates is `PERSONAL` (an Event Ring is `PERSONAL` with `isTemporary`); never send `EVENT`, `MINI_EVENT`, `MEETING`; `CORPORATE` Rings come from [[F-15 Companies]].
- Names: 1–24 characters in the app (the counter reads /24); the server's limit is 80.
- Wizard: create the Ring on step 1 so steps 2–4 have a Ring to write to; on Cancel delete it. `profileId` defaults server-side to the default profile. s08's templates live in the app.
- Default: changed on s26 only; never flip `isDefault` locally; refetch after `POST …/default`. Disable "Make this my default Ring" on a temporary Ring; Delete is disabled on the default.
- Gemma: "Gemma: suggest" (s18), "Gemma: rewrite" (s22) and "Suggested by Gemma" (s19) are hidden until [[S-89 Gemma AI Story]] ships.
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

- [[S-18 Rings Story|Rings · S9]] — the six settings: step 4 of the wizard (s21), Purpose on s22, Access on s26, Permissions on s27.
- [[S-15 Ring Access Engine Story|Ring Access Engine · S1]] — Shared with me per person (the owner's card, the Ring's name only when joined knowingly, the count only when members can see each other).
- [[S-18 Rings Story|Rings · S4]] — "Copy an existing Ring" on s18 (a copy endpoint, D-05).
- [[S-23 Connections Story|Connections · S19–S24]] — my connections for the wizard's step 2 (s19).
- [[S-03 Counts Story|Counts · S6–S10]] — "N people" on every row.
