---
id: BI-14
type: backend-integration
module: identity
feature: counts
status: draft
scope: feature
screens: [s11, s12, s14, s16, s17, s68]
depends: ["BD-03 Counts Backend Delivery"]
affects: ["FR-03 Counts Frontend Requirements"]
related: ["S-03 Counts Story", "BI-08 Rings Backend Integration", "D-14 Shared with me lists people, never the Ring", "D-04 Ring settings at launch and their defaults", "GET /rings", "GET /rings/:id", "GET /rings/shared-with-me", E_RING_02]
pending: []
created: 2026-11-05
updated: 2026-11-05
tags: [backend-integration, backend-integration/draft, module/identity, layer/backend]
---

# 🔌 Counts · Backend Integration

> Blocked by default until [[BD-03 Counts Backend Delivery]] is `done` (the hand-off order in `docs.config.json`); `blockedBy: []` opts out, `blockedBy: [...]` names other blockers.

**Feature:** [[F-03 Counts]] · **Backend:** [[BD-03 Counts Backend Delivery]] · **Read first:** [[Frontend Contract]], [[Frontend API Guide]]

Written by the **backend** team for the frontend: how to call what was delivered. `status: current` once it matches the code on `main`.

**Draft: not on `main` yet.** `memberCount` is built on the backend branch `FR-03/ring/member-count` and waits on its merge. Until then `GET /rings` and `GET /rings/:id` do not send it: keep showing "— people" / "People" with no number, exactly as today. Calls to the Rings endpoints themselves are in [[BI-08 Rings Backend Integration]]; this note covers only the counts.

## Screens → calls

| Screen | The user does | Calls |
|---|---|---|
| [[Screen Index#s11|s11]] / [[Screen Index#s12|s12]] Home · Recent Rings | sees "N people" under each Ring, "All N" on the header | `GET /rings` → `data[].memberCount`, `meta.total` |
| Home · the Ring picker (sheet) | sees "N people" beside each of their own Rings | the same `GET /rings` response; no extra call |
| [[Screen Index#s14|s14]] Ring data | sees "N in Ring" in the header and "People · N" on the people tab | `GET /rings/:id` → `memberCount` |
| [[Screen Index#s16|s16]] My Rings | sees "My Rings · N" and "N people" per row | `GET /rings` → `meta.total`, `data[].memberCount` |
| [[Screen Index#s17|s17]] Shared with me | sees the list; **no member count on any row** | `GET /rings/shared-with-me` (no `memberCount`) |
| [[Screen Index#s68|s68]] Me | "N Rings": `meta.total` of `GET /rings`; the connections part stays hidden | `GET /rings` |

## Flow

1. Home, the picker and My Rings read `GET /rings` once (`limit` ≤ 50); each Ring in `data` carries its own `memberCount`. Never call the roster or `GET /rings/:id` per card to get a number.
2. Ring data (s14) reads `GET /rings/:id`; its `memberCount` drives the header, the switcher chip of that Ring and the People row. The People row still leads to the roster (s15) with no number of its own.
3. After an add, remove, reassign or revoke on s15 / s47, refetch `GET /rings/:id` (and the list if it is on screen): the count moves on the next fetch, never before.

## Shapes that matter

`GET /rings` (each item is the Ring as [[BI-08 Rings Backend Integration]] describes it, plus one field):

```json
{
  "data": [
    {
      "id": "6f1c…",
      "name": "Family",
      "isDefault": true,
      "expiresAt": null,
      "status": "ACTIVE",
      "memberCount": 148
    }
  ],
  "meta": { "total": 5 }
}
```

`GET /rings/:id`: the same Ring object, `memberCount` included. `GET /rings/shared-with-me`: the Ring object **without** `memberCount`.

`memberCount` is an integer ≥ 0, always present on the owner's two routes. `0` is a real zero.

## State to keep on the client

- No cache of its own: the count lives on the list response (`rings:<userId>`) and on the Ring detail, and expires with them.
- Refetch on screen focus, after create, delete or a disposition, and after any membership change on s15 / s47.

## Errors to handle

| Status | ErrorCode | Meaning | Show |
|---|---|---|---|
| 404 | `E_RING_02` | `GET /rings/:id`: the Ring is gone, or it is not yours; the body is the same for both | hide the number, drop the card, refetch `GET /rings` |
| 400 | — (validation) | `limit` above 50 or an unknown query field | client bug; keep `limit` ≤ 50 |

`memberCount` adds no error of its own.

## Rules the UI must respect

- **Show the number as sent.** It counts only people who can see the Ring right now: membership active and inside its window, the Ring itself live (an expired, archived or deleted Ring is 0), and no block between them and you. Never compute it from the roster: `meta.total` of `GET /rings/:ringId/members?status=ACTIVE` still counts members whose window has lapsed.
- **Owner-only.** A Ring shared with you never shows a member count ([[D-14 Shared with me lists people, never the Ring]]); `GET /rings/shared-with-me` does not send one.
- **No made-up numbers.** Before the merge, while loading, or if the field is absent: "— people", "— in Ring", "People", never "0".

## Not available yet

- `memberCount` itself until `FR-03/ring/member-count` is merged to `main` → [[S-03 Counts Story|Counts · S6–S10]].
- "N connections" on Me → [[S-03 Counts Story|Counts · S11]] (waits on connections).
- "Shared with me · N" as a count of **people** → no story part yet; `meta.total` of `GET /rings/shared-with-me` counts Rings.
- "N added today" on Home → an open question of [[S-03 Counts Story]].

## Checklist

- [ ] Each owned Ring on Home, the picker and My Rings shows `memberCount` from one `GET /rings` call.
- [ ] s14 shows `memberCount` from `GET /rings/:id` in the header, the chip and the People row.
- [ ] `0` shows as "0 people"; an absent field shows "—", never "0".
- [ ] Shared with me shows no member count anywhere.
- [ ] A 404 `E_RING_02` on `GET /rings/:id` drops the card and refetches the list.
- [ ] The count refetches after add, remove, reassign or revoke.
