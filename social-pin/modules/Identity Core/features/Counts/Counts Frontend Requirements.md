---
type: frontend-requirements
code: counts
scope: feature
feature: counts
module: identity
status: draft
screens: [s11, s12, s14, s16, s17, s68]
created: 2026-10-18
updated: 2026-10-26
tags: [frontend-requirements, frontend-requirements/draft, module/identity, layer/frontend]
---

# Counts · Frontend Requirements

> ⚠ Affected by [[D-04 Ring settings at launch and their defaults]] (2026-10-25): ND-04 decided, six Ring settings at launch with private defaults (join with a code or invite, approve each one, members can't see each other, invite or save attachments); the owner and the Ring's admins change them; members who may see each other see full cards.

**Feature:** [[Counts]] · **Status:** Draft · **Story:** [[Counts Story]] · **API Integration:** not yet (backend not built)

What the client needs to show the numbers the design puts on Home, My Rings, Shared with me, Ring data and Me, and which of them can be read today. The feature has no endpoints of its own; two of the numbers fall out of list envelopes that already exist, the rest wait on tasks.

## Per screen

### [[Screen Index#s11|s11]] / [[Screen Index#s12|s12]] Home

- Needs: "N people" per owned Ring card; "All N" on the carousel header.
- Source today: "All N" from `meta.total` of `GET /rings`. Per-Ring member count: not yet.

### [[Screen Index#s14|s14]] Ring data

- Needs: "People · N" for this Ring, live members only.
- Source today: not yet. `GET /rings/:ringId/members?status=ACTIVE` returns `meta.total`, but that counts `ACTIVE` rows including lapsed windows and costs a roster call per Ring; it is not the number the design asks for.

### [[Screen Index#s16|s16]] My Rings

- Needs: "My Rings · N" chip; "N people" per row.
- Source today: the chip from `meta.total` of `GET /rings`. Per-row member count: not yet.

### [[Screen Index#s17|s17]] Shared with me

- Needs: "Shared with me · N" chip. No member count on shared rows.
- Source today: `meta.total` of `GET /rings/shared-with-me`.

### [[Screen Index#s68|s68]] Me / Account

- Needs: "N connections".
- Source today: not yet; connections do not exist.

## Endpoints required

| Need | Endpoint | Available | Task / decision |
|---|---|---|---|
| Number of Rings I own | `GET /rings` → `meta.total` | ✅ | — (listed under [[Rings]]) |
| Number of Rings shared with me, live now | `GET /rings/shared-with-me` → `meta.total` | ✅ | — (listed under [[Rings]]) |
| Live member count per owned Ring (list and detail) | — | ❌ | [[T-004 Member count per Ring on list and detail]] |
| Connection count on Me and Home | — | ❌ | [[T-005 Connection count on Me and Home]] (blocked by [[T-021 Connect request send, inbox, cancel]]) |
| Member count on a Ring shared with me | — | ❌ | [[ND-04 Ring settings]] |

## Behaviour expectations

- Refetch / realtime: the chips refetch with their lists (screen focus; after create, delete, disposition). Member counts, once they exist, refetch after every write on s15 / s47 and on focus of s11, s14, s16.
- Caching keys: counts are not cached separately; they live on the list response (`rings:<userId>`, `rings-shared:<userId>`) and expire with it.
- Pagination / ordering: `meta.total` is the unpaginated count, so a chip is correct even when the list is paged (`limit` ≤ 50).
- Placeholders: no number is shown where the backend has none. Never render "0 people" or "0 connections" for an unknown value.
- Consistency: when T-004 ships, the client uses the backend's number and does not compute a count from the roster, so the figure matches what the access engine lets people see.

## Error states the UI must handle

| Status | ErrorCode | Show |
|---|---|---|
| 404 | `E_RING_02` | the Ring is gone: drop the card and refetch the list |
| 403 | `E_RING_05` | a member tried to read an owner-only count: hide the number |
| 400 | — (validation; `limit` above 50) | client bug; keep `limit` ≤ 50 |

No code of its own exists yet; the rows above are the codes of the list endpoints the chips depend on. Until [[T-063 Put the ErrorCode on the error body]] ships, branch on status and endpoint.

## Blocked by

- [[T-004 Member count per Ring on list and detail]] — every "N people" on s11, s12, s14 and s16.
- [[T-005 Connection count on Me and Home]] — "N connections" on s68 and s11; itself blocked by connections.
- [[ND-04 Ring settings]] — any count shown on a shared Ring.
