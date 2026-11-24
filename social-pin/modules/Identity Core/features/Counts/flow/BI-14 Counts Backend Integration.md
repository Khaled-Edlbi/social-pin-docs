---
id: BI-14
type: backend-integration
module: identity
feature: counts
status: current
scope: feature
screens: [s11, s12, s14, s16, s17, s68]
depends: ["BD-03 Counts Backend Delivery"]
affects: ["FR-03 Counts Frontend Requirements"]
related: ["S-03 Counts Story", "BI-08 Rings Backend Integration", "D-14 Shared with me lists people, never the Ring", "D-04 Ring settings at launch and their defaults", "GET /rings", "GET /rings/:id", "GET /rings/shared-with-me", "GET /rings/shared-with-me/count", "GET /connections/count", "BI-16 Connections Backend Integration", E_RING_02, "BI-17 Ring Invitations & Join Backend Integration", "BD-35 Error Contract Backend Delivery", "S-87 Error Contract Story"]
pending: []
created: 2026-11-05
updated: 2026-11-24
tags: [backend-integration, backend-integration/current, module/identity, layer/backend]
---

# 🔌 Counts · Backend Integration

> Blocked by default until [[BD-03 Counts Backend Delivery]] is `done` (the hand-off order in `docs.config.json`); `blockedBy: []` opts out, `blockedBy: [...]` names other blockers.

**Feature:** [[F-03 Counts]] · **Backend:** [[BD-03 Counts Backend Delivery]] · **Read first:** [[Frontend Contract]], [[Frontend API Guide]]

Written by the **backend** team for the frontend: how to call what was delivered. `status: current` once it matches the code on `main`.

**On `main` since 2026-11-05 (`f186ba1`):** `memberCount` on `GET /rings` and `GET /rings/:id`, and `GET /rings/shared-with-me/count`. Calls to the Rings endpoints themselves are in [[BI-08 Rings Backend Integration]]; this note covers only the counts. **On `main` since 2026-11-08 (`1c460b0`, with F-14):** `GET /connections/count`, the connection count on Me; the Connections routes themselves are in [[BI-16 Connections Backend Integration]].

## Screens → calls

| Screen | The user does | Calls |
|---|---|---|
| [[Screen Index#s11|s11]] / [[Screen Index#s12|s12]] Home · Recent Rings | sees "N people" under each Ring, "All N" on the header | `GET /rings` → `data[].memberCount`, `meta.total` |
| Home · the Ring picker (sheet) | sees "N people" beside each of their own Rings | the same `GET /rings` response; no extra call |
| [[Screen Index#s14|s14]] Ring data | sees "N in Ring" in the header and "People · N" on the people tab | `GET /rings/:id` → `memberCount` |
| [[Screen Index#s16|s16]] My Rings | sees "My Rings · N" and "N people" per row | `GET /rings` → `meta.total`, `data[].memberCount` |
| [[Screen Index#s16|s16]] / [[Screen Index#s17|s17]] tab chips | reads "Shared with me · N", N people | `GET /rings/shared-with-me/count` → `people` |
| [[Screen Index#s17|s17]] Shared with me | sees the people; "· N people" on a row whose Ring lets members see each other, no number otherwise | `GET /rings/shared-with-me` → `data[].memberCount`, set only then, `null` otherwise ([[BI-17 Ring Invitations & Join Backend Integration]]) |
| [[Screen Index#s68|s68]] Me | sees the profile card's three tiles, Rings · Connections · Photos: Rings is `meta.total` of `GET /rings`, Connections is `connections` from the count route; Photos is the Photo Library's (`meta.total` of `GET /files?kind=image`), not a Counts call | `GET /rings`, `GET /connections/count` (unchanged) |

## Flow

1. Home, the picker and My Rings read `GET /rings` once (`limit` ≤ 50); each Ring in `data` carries its own `memberCount`. Never call the roster or `GET /rings/:id` per card to get a number.
2. Ring data (s14) reads `GET /rings/:id`; its `memberCount` drives the header, the switcher chip of that Ring and the People row. The People row still leads to the roster (s15) with no number of its own.
3. The "Shared with me · N" chip reads `GET /rings/shared-with-me/count` when s16 or s17 gains focus. Since backend `main` `12172c6` the list's `meta.total` counts people too and always equals it ([[BI-08 Rings Backend Integration]]); the count route stays the one to call when the list is not on screen. A list row's own `memberCount` is set only on a row whose Ring lets members see each other, `null` otherwise (since backend `main` `1c460b0`, [[BI-17 Ring Invitations & Join Backend Integration]]).
4. After an add, remove, reassign or revoke on s15 / s47, refetch `GET /rings/:id` (and the list if it is on screen): the count moves on the next fetch, never before.

## Shapes that matter

`GET /rings` (each item is the Ring as [[BI-08 Rings Backend Integration]] describes it, plus `memberCount`; every field as `main` sends it):

```json
{
  "data": [
    {
      "id": "6f1c2a9e-3b7d-4c1a-9e2f-1a2b3c4d5e6f",
      "ownerUserId": "0b8e7d6c-5a4f-4e3d-8c2b-1a0f9e8d7c6b",
      "name": "Family",
      "type": "PERSONAL",
      "parentRingId": null,
      "profileId": "9a8b7c6d-5e4f-4a3b-8c2d-1e0f9a8b7c6d",
      "isDefault": true,
      "isTemporary": false,
      "startsAt": null,
      "expiresAt": null,
      "status": "ACTIVE",
      "disposition": "UNDECIDED",
      "mergedIntoRingId": null,
      "colorHex": "#1E88E5",
      "style": null,
      "createdAt": "2026-11-05T09:41:22.104Z",
      "updatedAt": "2026-11-05T09:41:22.104Z",
      "memberCount": 148
    }
  ],
  "meta": { "total": 5 }
}
```

`GET /rings/:id`: the same Ring object, `memberCount` included, not wrapped in `data`. `GET /rings/shared-with-me`: one row per person ([[BI-08 Rings Backend Integration]], [[BI-17 Ring Invitations & Join Backend Integration]]); a row's `memberCount` is an integer only when the Ring is named on the row (`ringName`, a Ring I joined knowingly) and lets members see each other, `null` otherwise, which includes every Ring I was placed in.

`memberCount` is an integer ≥ 0, always present on the owner's two routes. `0` is a real zero.

`GET /rings/shared-with-me/count`:

```json
{ "people": 2 }
```

`people` is an integer ≥ 0: how many people share at least one Ring with me right now, one per person. `0` is a real zero ("No Rings shared with you yet"). It is the only field; the body names no Ring.

`GET /connections/count`:

```json
{ "connections": 12 }
```

`connections` is an integer ≥ 0: my accepted connections, each person once. A contact with *No access* (in none of my Rings) counts; disconnected, blocked and deleted people and every request (pending, declined, expired) do not. It always equals `meta.total` of `GET /connections`. `0` is a real zero now that connections exist ("No connections yet").

## State to keep on the client

- No cache of its own: the count lives on the list response (`rings:<userId>`) and on the Ring detail, and expires with them.
- Refetch on screen focus, after create, delete or a disposition, and after any membership change on s15 / s47.

## Errors to handle

| Status | ErrorCode | Meaning | Show |
|---|---|---|---|
| 404 | `E_RING_02` (not on the wire yet) | `GET /rings/:id`: the Ring is gone, or it is not yours; the body is the same for both | hide the number, drop the card, refetch `GET /rings` |
| 400 | — (validation) | `limit` above 50 or an unknown query field | client bug; keep `limit` ≤ 50 |

**The 404 carries no `ErrorCode` today.** On backend `main` the body is `statusCode`, `message`, `error: "HttpException"`, `path`, `timestamp` ([[QB-07 Counts QA Backend]]): the code is dropped on the wire, a known Error Contract gap ([[BD-35 Error Contract Backend Delivery]]). Until [[S-87 Error Contract Story|Error Contract · S4–S8]] ships, the client branches on the status and the endpoint: a 404 from `GET /rings/:id` is the row above.

`memberCount` adds no error of its own; `GET /rings/shared-with-me/count` takes no parameters and answers only 200 (or 401 without a valid session, like every route).

## Rules the UI must respect

- **Show the number as sent.** It counts only people who can see the Ring right now: membership active and inside its window, the Ring itself live (an expired, archived or deleted Ring is 0), and no block between them and you. Never compute it from the roster: `meta.total` of `GET /rings/:ringId/members?status=ACTIVE` still counts members whose window has lapsed.
- **People, not Rings, on Shared with me.** The chip is `people` from the count route: a person sharing two Rings is one; access that lapsed, or a block between us, does not count. It can change without anything I do, so refetch on focus.
- **A member count on Shared with me only when the Ring allows it.** A row is a person, never a Ring ([[D-14 Shared with me lists people, never the Ring]]). The server sends `memberCount` on a row only when its Ring lets members see each other (a setting, off by default: [[D-04 Ring settings at launch and their defaults]]); then show "· N people", otherwise no number. Never compute it from anything else.
- **No made-up numbers.** While loading, or if a number is absent: "— people", "— in Ring", "People", never "0".
- **The Shared with me list and the chip agree.** Both follow the same rule on the server (live Ring, live membership, no block either way), so a person in the chip always has at least one row in the list.

## Not available yet

- "N added today" on Home → an open question of [[S-03 Counts Story]].

## Checklist

- [ ] Each owned Ring on Home, the picker and My Rings shows `memberCount` from one `GET /rings` call.
- [ ] s14 shows `memberCount` from `GET /rings/:id` in the header, the chip and the People row.
- [ ] `0` shows as "0 people"; an absent field shows "—", never "0".
- [ ] A Shared with me row shows "· N people" only when its `memberCount` is set (the Ring lets members see each other); a `null` row shows no number.
- [ ] "Shared with me · N" comes from `GET /rings/shared-with-me/count`, never from the list's `meta.total`.
- [ ] A 404 on `GET /rings/:id` drops the card and refetches the list, branched on the status and the endpoint (no `ErrorCode` in the body until Error Contract · S4–S8).
- [ ] The count refetches after add, remove, reassign or revoke.
- [ ] Me's Rings and Connections tiles read `GET /rings` and `GET /connections/count`.

## Log

- 2026-11-24 · vault branch `docs/backend/M-01-identity/F-03-counts/BI-14-s-03-flags` · cleared three flags. [[S-03 Counts Story]] 2026-11-24: s68 is the profile card's three tiles, Rings · Connections · Photos; the endpoints are unchanged. [[S-03 Counts Story]] 2026-11-12: Shared with me shows "· N people" on a row whose Ring lets members see each other (`memberCount` set, since `1c460b0`), none otherwise; the "Owner-only" rule and the "no member count anywhere" checklist line replaced, the shape and Flow step 3 corrected. [[QB-07 Counts QA Backend]] 2026-11-05: the 404 on `GET /rings/:id` carries no `ErrorCode` ([[BD-35 Error Contract Backend Delivery]]); the client branches on 404 + endpoint until [[S-87 Error Contract Story|Error Contract · S4–S8]] ships · flagged nothing
