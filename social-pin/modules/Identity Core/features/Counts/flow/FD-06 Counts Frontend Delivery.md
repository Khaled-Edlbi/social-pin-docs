---
id: FD-06
type: frontend-delivery
module: identity
feature: counts
status: done
scope: feature
deployedTo: []
screens: [s11, s12, s14, s16, s17, s68]
owner: "Omar Fostok"
depends: ["BI-14 Counts Backend Integration"]
affects: []
related: ["FR-03 Counts Frontend Requirements", "S-03 Counts Story", "BI-08 Rings Backend Integration", "D-14 Shared with me lists people, never the Ring", "S-23 Connections Story", "FD-04 Account Frontend Delivery"]
pending: []
created: 2026-11-05
updated: 2026-11-05
tags: [frontend-delivery, frontend-delivery/done, module/identity, layer/frontend]
---

# ✅ Counts · Frontend Delivery

> ⚠ Affected by [[BD-11 Rings Backend Delivery]] (2026-11-05): backend main 12172c6: meta.total of GET /rings/shared-with-me now counts people and equals GET /rings/shared-with-me/count; the row saying it counts Rings is stale (/frontend)

**Feature:** [[F-03 Counts]] · **Status:** Done · **Built from:** [[BI-14 Counts Backend Integration]] · **Against:** [[S-03 Counts Story]] · **Requirements:** [[FR-03 Counts Frontend Requirements]] · **QA:** [[Counts QA Frontend]]

What the client shipped for the numbers on Home, the Ring picker, My Rings, Shared with me, Ring data and Me, on `social_pin` `rings/F-11/honest-rings` @ `f2c2ad5` (2026-11-05), not on `main` yet. Every number comes from the API ([[BI-14 Counts Backend Integration]], backend `main` @ `f186ba1`); none is computed from a roster and none is a sample. The QA checklist is RG-10…RG-13 in the client's `docs/TEST_CASES_2026-10-18.md`.

## Screens shipped

| Screen | State | Note |
|---|---|---|
| [[Screen Index#s11\|s11]] / [[Screen Index#s12\|s12]] Home · Recent Rings | ✅ | "N people" under each Ring from its `memberCount`; "All N" on the header is your real number of Rings, hidden until they load. |
| Home · the Ring picker (sheet) | ✅ | "N people" beside each of your Rings, from the same list. |
| [[Screen Index#s14\|s14]] Ring data | ✅ | "N in Ring" and "People · N" from `GET /rings/:id`, read each time Ring data opens. A Ring that is gone, or not yours, says "This Ring no longer exists." and the screen leaves. |
| [[Screen Index#s16\|s16]] My Rings | ✅ | "My Rings · N" from the API's total (every page is loaded) and "N people" per row. |
| [[Screen Index#s16\|s16]] / [[Screen Index#s17\|s17]] tab chip | ✅ | "Shared with me · N" from `GET /rings/shared-with-me/count`, on both tabs. |
| [[Screen Index#s17\|s17]] Shared with me | ✅ | People, never a member count on any row ([[D-14 Shared with me lists people, never the Ring]]). |
| [[Screen Index#s68\|s68]] Me | 🟡 | "· N Rings" on the profile card; no connections count until the API has one (see *Not done yet*). |

## Calls made

| Endpoint | Where | Notes (retries, cache keys, optimistic updates) |
|---|---|---|
| `GET /rings` | Home, the picker, My Rings, Me | One list for all of them, every page loaded (`limit` ≤ 50), each Ring with its `memberCount`; `meta.total` is "N Rings". No call per Ring. Reloaded at startup and after creating, editing or deleting a Ring. |
| `GET /rings/:id` | s14, on open | Updates the open Ring and its count in the shared list. 404 `E_RING_02` → "This Ring no longer exists.", the Ring list reloads, which drops it, and the screen leaves. Not asked for the public Ring, the sample event Ring or the samples shown before your Rings load. |
| `GET /rings/shared-with-me/count` | s16 / s17 chip | `people`, one per person; never the list's `meta.total`, which counts Rings. |

## State kept on the client

- No cache of its own: the count lives on each Ring in the one list of your Rings and goes with it.
- A missing number shows "—", never "0"; `0` from the API shows as "0 people". Arabic gets its own plural forms ("All N", "N people").

## Deviations from the story or the integration note

- **The count does not refetch on its own after a member change on [[Screen Index#s15\|s15]] or [[Screen Index#s47\|s47]]** ([[BI-14 Counts Backend Integration#Flow]] step 4, [[S-03 Counts Story|Counts · S5]]): it moves the next time Ring data opens, or when your Rings reload (startup, create, edit, delete). The client calls no member route yet (adding, removing or revoking on s15 is not wired to the API, [[F-09 Ring Members]]), so nothing changes the count from the client today; the refetch comes with that work.

## Not done yet

- "N connections" on Me (s68) → [[S-03 Counts Story|Counts · S11]], waiting on connections themselves ([[S-23 Connections Story|Connections · S2–S7]]); the card shows no connections count meanwhile ([[FD-04 Account Frontend Delivery]]).
- "N added today" on Home → an open question of [[S-03 Counts Story]].
- On `main` with `rings/F-11/honest-rings`.

## Log

- 2026-11-05 · `rings/F-11/honest-rings` @ `f2c2ad5` (social_pin, not on `main` yet) · s11, s12, the Ring picker, s14, s16, s17, s68: every count from the API (`memberCount`, `GET /rings/shared-with-me/count`, `GET /rings/:id`); RG-10…RG-13 · flagged nothing
