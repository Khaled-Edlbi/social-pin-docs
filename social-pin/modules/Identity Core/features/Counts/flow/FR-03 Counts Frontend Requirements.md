---
id: FR-03
type: frontend-requirements
module: identity
feature: counts
status: approved
scope: feature
screens: [s11, s12, s14, s16, s17, s68]
approvedBy: "Omar Fostok"
approvedAt: 2026-11-24
owner: "Omar Fostok"
depends: []
affects: ["S-03 Counts Story"]
related: ["D-04 Ring settings at launch and their defaults", "D-14 Shared with me lists people, never the Ring", "F-11 Rings", "F-14 Connections", "S-23 Connections Story", "S-87 Error Contract Story", "BI-17 Ring Invitations & Join Backend Integration", "S-11 Photo Library Story", "GET /rings/shared-with-me", "GET /connections/count"]
created: 2026-10-18
updated: 2026-11-24
tags: [frontend-requirements, frontend-requirements/approved, module/identity, layer/frontend]
---

# Counts · Frontend Requirements

**Feature:** [[F-03 Counts]] · **Status:** Approved 2026-11-24 by Omar Fostok (first approved 2026-11-05 by khaled; reopened for the S-03 changes of 2026-11-12 and 2026-11-24) · **Story:** [[S-03 Counts Story]] · **API Integration:** not yet (backend not built)

What the client needs to show the numbers the design puts on Home, the Ring picker, My Rings, Shared with me, Ring data and Me, and which of them can be read today. The feature has no endpoints of its own; two of the numbers fall out of list envelopes that already exist, the rest wait on tasks. In the MVP since 2026-10-27.

The member counts are **owner-facing**, with one exception. A person sees how many people are in **their own** Rings. On Shared with me, a row shows how many are in someone else's Ring only when that Ring lets members see each other: the server sends `memberCount` on that row then, and `null` otherwise ([[S-03 Counts Story|Counts · S2, S10]], [[BI-17 Ring Invitations & Join Backend Integration]]). That setting is off by default ([[D-04 Ring settings at launch and their defaults]]), and a row is still a person, never a Ring ([[D-14 Shared with me lists people, never the Ring]]).

## Per screen

### [[Screen Index#s11|s11]] / [[Screen Index#s12|s12]] Home · Recent Rings

- Needs: "N people" under each of the Rings listed (the client lists the first three of the person's own Rings, default first); "All N" on the section header, N being how many Rings the person owns.
- Source today: "All N" from `meta.total` of `GET /rings` ✅. Per-Ring "N people": not yet ([[S-03 Counts Story|Counts · S6–S10]]).

### Home · the Ring picker (the "My badge" card on s11 / s12; a sheet, no screen id)

- Needs: "N people" beside each of the person's own Rings in the sheet that picks which Ring the badge and "go visible" are for.
- Source today: the list from `GET /rings` ✅; the count: not yet (Counts · S6–S10).

### [[Screen Index#s14|s14]] Ring data

- Needs: "N in Ring" in the header and "People · N" on the people tab, for this Ring, live members only; the tab still leads to the roster (s15) without a number.
- Source today: not yet. `GET /rings/:ringId/members?status=ACTIVE` returns `meta.total`, but that counts `ACTIVE` rows including lapsed windows and costs a roster call per Ring; it is not the number the design asks for.

### [[Screen Index#s16|s16]] My Rings

- Needs: "My Rings · N" on the tab; "N people" under each Ring (with "· expires 16 Mar" when the Ring has an end date).
- Source today: the tab from `meta.total` of `GET /rings` ✅. Per-row "N people": not yet (Counts · S6–S10).

### [[Screen Index#s17|s17]] Shared with me

- Needs: "Shared with me · N", N being **how many people** share a Ring with the person right now (one per person, since the list shows people, not Rings: [[D-14 Shared with me lists people, never the Ring]]).
- **"· N people" on a row only when the Ring lets members see each other.** A row is a person, never a Ring. When the row's `memberCount` is set (a Ring I joined knowingly, with `ringName`, whose "members can see each other" is on), the row shows "· N people"; when it is `null`, which includes every Ring I was placed in, the row shows no number, never "0" or a sample.
- Source today: the chip from `GET /rings/shared-with-me/count` → `people` ✅ ([[BI-14 Counts Backend Integration]]); the row's count from `GET /rings/shared-with-me` → `data[].memberCount` ✅, set or `null` as above ([[BI-17 Ring Invitations & Join Backend Integration]]).

### [[Screen Index#s68|s68]] Me / Account

- Needs: under the name, the profile card's three tiles, **Rings · Connections · Photos** (app `776e6ca`, [[S-03 Counts Story|Counts · S4]]), each a number over its label that opens its list: My Rings ([[Screen Index#s16|s16]]), Contacts, the Photo library.
- A tile whose count isn't read yet shows "–": never 0 and never a sample. Once read, 0 is a real zero and shows "0".
- Source today: Rings from `meta.total` of `GET /rings` ✅; Connections from `GET /connections/count` → `connections` ✅ ([[S-03 Counts Story|Counts · S11]]); Photos from `meta.total` of `GET /files?kind=image` ✅ ([[S-11 Photo Library Story]], not a Counts number).

## Endpoints required

| Need | Endpoint | Available | Task / decision |
|---|---|---|---|
| Number of Rings I own (Home "All N", My Rings tab, Me) | `GET /rings` → `meta.total` | ✅ | — (listed under [[F-11 Rings]]) |
| Live member count per owned Ring, on the list and the detail | `GET /rings` → `data[].memberCount`, `GET /rings/:id` → `memberCount` | ✅ | [[S-03 Counts Story|Counts · S6–S10]] ([[BI-14 Counts Backend Integration]]) |
| Number of **people** sharing a Ring with me, live now | `GET /rings/shared-with-me/count` → `people` | ✅ | [[S-03 Counts Story|Counts · S2]] ([[BI-14 Counts Backend Integration]]); not `meta.total` of `GET /rings/shared-with-me`, which counts Rings |
| Member count on a Shared with me row, only when the Ring lets members see each other | `GET /rings/shared-with-me` → `data[].memberCount` (`null` otherwise) | ✅ | [[S-03 Counts Story|Counts · S2, S10]] ([[BI-17 Ring Invitations & Join Backend Integration]]) |
| Connection count on Me, the Connections tile (Me only, no count on Home: [[S-03 Counts Story|Counts · S4]]) | `GET /connections/count` → `connections` (or `meta.total` of `GET /connections`) | ✅ | [[S-03 Counts Story|Counts · S11]] ([[BD-14 Connections Backend Delivery]], backend `main` `1c460b0`) |

The Photos tile on Me is `meta.total` of `GET /files?kind=image`, the Photo Library's number ([[S-11 Photo Library Story]]); it is not asked here.

## Behaviour expectations

- **One number per Ring, from the backend.** When Counts · S6–S10 ships, the client shows `memberCount` as sent and never counts a roster itself, so the figure matches what the access engine lets people see: live members only (window open, not removed, Ring not expired).
- **The count rides on the Ring.** The client prefers `memberCount` on the Ring as `GET /rings` and `GET /rings/:id` return it, so My Rings, Home and the picker need no extra call per Ring.
- **Refetch:** with their lists (screen focus; after create, delete, a disposition); member counts also after every add, reassign or revoke on s15 / s47.
- **Caching:** counts are not cached on their own; they live on the list response (`rings:<userId>`, `rings-shared:<userId>`) and expire with it.
- **Paging:** `meta.total` is the unpaginated count, so a tab or "All N" is right even when the list is paged (`limit` ≤ 50).
- **No made-up numbers:** where the backend has no number, show none ("— people", "People"; "–" in a Me tile), never "0 people", "0" or a sample value.

## Error states the UI must handle

| Status | ErrorCode | Show |
|---|---|---|
| 404 | `E_RING_02` | the Ring is gone, or it isn't yours: `GET /rings/:id` answers the same for both and never says which. Hide the number, drop the card and refetch the list |
| 400 | — (validation; `limit` above 50) | client bug; keep `limit` ≤ 50 |

No code of its own exists yet; the rows above are the codes of the list endpoints the counts depend on. Until [[S-87 Error Contract Story|Error Contract · S4–S8]] ships, branch on status and endpoint.

## Blocked by

- [[S-03 Counts Story|Counts · S6–S10]] — every "N people" on Home, the Ring picker, Ring data and My Rings.
- [[S-03 Counts Story|Counts · S11]] — "N connections" on Me; itself waiting on [[S-23 Connections Story|Connections · S2–S7]].
- The people count on Shared with me has no task yet.

## Log

- 2026-11-24 · `tickets/frontend/M-01-identity/F-03-counts/FR-03-s-03-flags` · back to `draft` for review. Cleared [[S-03 Counts Story]]'s 2026-11-12 flag: s17 shows "· N people" on a row only when `memberCount` is set (the Ring lets members see each other, [[BI-17 Ring Invitations & Join Backend Integration]]); "Not asked, by decision" and the owner-only line replaced, endpoint row added. Cleared its 2026-11-24 flag: s68 is the profile card's three tiles, Rings · Connections · Photos (app `776e6ca`), "–" until read
