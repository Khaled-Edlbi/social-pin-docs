---
type: frontend-requirements
code: counts
scope: feature
feature: counts
module: identity
status: ready
screens: [s11, s12, s14, s16, s17, s68]
depends: []
affects: ["S-03 Counts Story"]
related: ["D-04 Ring settings at launch and their defaults", "D-14 Shared with me lists people, never the Ring", "F-11 Rings", "F-14 Connections", "S-23 Connections Story", "S-87 Error Contract Story"]
created: 2026-10-18
updated: 2026-10-28
owner: "Omar Fostok"
tags: [frontend-requirements, frontend-requirements/ready, module/identity, layer/frontend]
---

# Counts · Frontend Requirements

**Feature:** [[F-03 Counts]] · **Status:** Ready (waiting for the backend) · **Story:** [[S-03 Counts Story]] · **API Integration:** not yet (backend not built)

What the client needs to show the numbers the design puts on Home, the Ring picker, My Rings, Shared with me, Ring data and Me, and which of them can be read today. The feature has no endpoints of its own; two of the numbers fall out of list envelopes that already exist, the rest wait on tasks. In the MVP since 2026-10-27.

Every count here is **owner-facing**: a person only ever sees how many people are in **their own** Rings. A Ring shared with them never shows a member count ([[D-14 Shared with me lists people, never the Ring]]), and members don't see each other while the Ring's "members can see each other" setting is off, which is the default ([[D-04 Ring settings at launch and their defaults]]).

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
- **No member count on a row.** A row is a person, never a Ring; how many are in someone else's Ring is never shown.
- Source today: `meta.total` of `GET /rings/shared-with-me` counts live **Rings**, so a person sharing two Rings counts twice: not the number asked for.

### [[Screen Index#s68|s68]] Me / Account

- Needs: "N Rings · N connections" under the name on the profile card. The Rings part from `meta.total` of `GET /rings` ✅; the connections part **hidden, not zero,** until connections exist.
- Source today: connections: not yet ([[S-03 Counts Story|Counts · S11]], which waits on connections themselves, [[S-23 Connections Story|Connections · S8–S12]]).

## Endpoints required

| Need | Endpoint | Available | Task / decision |
|---|---|---|---|
| Number of Rings I own (Home "All N", My Rings tab, Me) | `GET /rings` → `meta.total` | ✅ | — (listed under [[F-11 Rings]]) |
| Live member count per owned Ring, on the list and the detail | — | ❌ | [[S-03 Counts Story|Counts · S6–S10]] |
| Number of **people** sharing a Ring with me, live now | — | ❌ | no task yet: asked here. `GET /rings/shared-with-me` → `meta.total` counts Rings today |
| Connection count on Me (and Home, if the story keeps it) | — | ❌ | [[S-03 Counts Story|Counts · S11]] (waits on [[S-23 Connections Story|Connections · S8–S12]]) |

Not asked, by decision: a member count on a Ring shared with me ([[D-14 Shared with me lists people, never the Ring]]).

## Behaviour expectations

- **One number per Ring, from the backend.** When Counts · S6–S10 ships, the client shows `memberCount` as sent and never counts a roster itself, so the figure matches what the access engine lets people see: live members only (window open, not removed, Ring not expired).
- **The count rides on the Ring.** The client prefers `memberCount` on the Ring as `GET /rings` and `GET /rings/:id` return it, so My Rings, Home and the picker need no extra call per Ring.
- **Refetch:** with their lists (screen focus; after create, delete, a disposition); member counts also after every add, reassign or revoke on s15 / s47.
- **Caching:** counts are not cached on their own; they live on the list response (`rings:<userId>`, `rings-shared:<userId>`) and expire with it.
- **Paging:** `meta.total` is the unpaginated count, so a tab or "All N" is right even when the list is paged (`limit` ≤ 50).
- **No made-up numbers:** where the backend has no number, show none ("— people", "People"), never "0 people", "0 connections" or a sample value.

## Error states the UI must handle

| Status | ErrorCode | Show |
|---|---|---|
| 404 | `E_RING_02` | the Ring is gone: drop the card and refetch the list |
| 403 | `E_RING_05` | an owner-only count asked for a Ring the person doesn't own: hide the number |
| 400 | — (validation; `limit` above 50) | client bug; keep `limit` ≤ 50 |

No code of its own exists yet; the rows above are the codes of the list endpoints the counts depend on. Until [[S-87 Error Contract Story|Error Contract · S4–S8]] ships, branch on status and endpoint.

## Blocked by

- [[S-03 Counts Story|Counts · S6–S10]] — every "N people" on Home, the Ring picker, Ring data and My Rings.
- [[S-03 Counts Story|Counts · S11]] — "N connections" on Me; itself waiting on [[S-23 Connections Story|Connections · S8–S12]].
- The people count on Shared with me has no task yet.
