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
related: ["FR-03 Counts Frontend Requirements", "S-03 Counts Story", "BI-08 Rings Backend Integration", "D-14 Shared with me lists people, never the Ring", "S-23 Connections Story", "FD-04 Account Frontend Delivery", "BI-16 Connections Backend Integration", "BD-11 Rings Backend Delivery", "BI-17 Ring Invitations & Join Backend Integration", "GET /rings/shared-with-me", "GET /connections/count"]
pending: []
created: 2026-11-05
updated: 2026-11-24
tags: [frontend-delivery, frontend-delivery/done, module/identity, layer/frontend]
---

# ✅ Counts · Frontend Delivery

**Feature:** [[F-03 Counts]] · **Status:** Done · **Built from:** [[BI-14 Counts Backend Integration]] · **Against:** [[S-03 Counts Story]] · **Requirements:** [[FR-03 Counts Frontend Requirements]] · **QA:** [[QF-08 Counts QA Frontend]]

What the client shipped for the numbers on Home, the Ring picker, My Rings, Shared with me, Ring data and Me, on `social_pin` `main` @ `866240a` since 2026-11-24 (built on `rings/F-11/honest-rings`, first @ `f2c2ad5`, 2026-11-05, then fast-forwarded into `main`; the merge is local and not on `origin/main` yet). Every number comes from the API ([[BI-14 Counts Backend Integration]], backend `main` @ `f186ba1`; the connections count from [[BI-16 Connections Backend Integration]]); none is computed from a roster and none is a sample: since `dde0533` the app has no sample Rings at all, and before `GET /rings` answers it shows a loading state, an error with retry when it fails. The QA checklist is RG-10…RG-13 in the client's `docs/TEST_CASES_2026-10-18.md`.

## Screens shipped

| Screen | State | Note |
|---|---|---|
| [[Screen Index#s11\|s11]] / [[Screen Index#s12\|s12]] Home · Recent Rings | ✅ | "N people" under each Ring from its `memberCount`; "All N" on the header is your real number of Rings, hidden until they load. Real Rings only: loading, then the list, or an error with retry; never a sample Ring or a sample number (`dde0533`). |
| Home · the Ring picker (sheet) | ✅ | "N people" beside each of your Rings, from the same list; real Rings only, same loading and error states. |
| [[Screen Index#s14\|s14]] Ring data | ✅ | "N in Ring" and "People · N" from `GET /rings/:id`, read each time Ring data opens and after an add, approve, move or remove on the roster. A Ring that is gone, or not yours, says "This Ring no longer exists." and the screen leaves. |
| [[Screen Index#s16\|s16]] My Rings | ✅ | "My Rings · N" from the API's total (every page is loaded) and "N people" per row; real Rings only (`dde0533`). |
| [[Screen Index#s16\|s16]] / [[Screen Index#s17\|s17]] tab chip | ✅ | "Shared with me · N" from `GET /rings/shared-with-me/count`, on both tabs; on every focus of Shared with me the list is read again too, so the chip and the rows agree (`866240a`, [[S-03 Counts Story\|Counts · S2]]). |
| [[Screen Index#s17\|s17]] Shared with me | ✅ | A row is a person, never a Ring ([[D-14 Shared with me lists people, never the Ring]]). It shows "· N people" when the server sends `memberCount` on the row, which it does only when the Ring lets members see each other ([[BI-17 Ring Invitations & Join Backend Integration]]); when `memberCount` is `null` the row shows no number. |
| [[Screen Index#s68\|s68]] Me | ✅ | The profile card's three tiles, **Rings · Connections · Photos** (`776e6ca`, [[S-03 Counts Story\|Counts · S4]]), each a count over its label that opens its list (My Rings, Contacts, the Photo library). Rings from `GET /rings`, Connections from `GET /connections/count`, Photos from `meta.total` of `GET /files?kind=image`. A tile whose count isn't read yet shows "–", never "0" or a sample. Connections is read again each time Me's tab comes back in front (it stays mounted) and after an accept, disconnect, block or unblock (`dde0533`, [[S-03 Counts Story\|Counts · S11]]). |

## Calls made

| Endpoint | Where | Notes (retries, cache keys, optimistic updates) |
|---|---|---|
| `GET /rings` | Home, the picker, My Rings, Me | One list for all of them, every page loaded (`limit` ≤ 50), each Ring with its `memberCount`; `meta.total` is "N Rings". No call per Ring. Reloaded at startup and after creating, editing or deleting a Ring. |
| `GET /rings/:id` | s14, on open; after a roster change | Updates the open Ring and its count in the shared list; after a move both Rings are read again. 404 `E_RING_02` → "This Ring no longer exists.", the Ring list reloads, which drops it, and the screen leaves. Not asked for the public Ring or the event Ring. |
| `GET /rings/shared-with-me/count` | s16 / s17 chip | `people`, one per person. Since backend `12172c6` the list's `meta.total` counts people too and equals it ([[BD-11 Rings Backend Delivery]]); the client still reads the count route. |
| `GET /rings/shared-with-me` | s17 | Read again on every focus of the tab, with the count, so the rows and the chip agree (`866240a`); each row's `memberCount` shown as "· N people" when set. |
| `GET /connections/count` | s68 Me | On every build of Me, when its tab is shown again, and after a connection changes; a failure keeps what is shown; dropped at sign-out. |

## State kept on the client

- No cache of its own: the count lives on each Ring in the one list of your Rings and goes with it; the connections count is one value for the session, null until read.
- A missing number shows "—", never "0"; `0` from the API shows as "0 people". Arabic gets its own plural forms ("All N", "N people").

## Deviations from the story or the integration note

- None open. The earlier one (no member change in the app yet, so no refetch after one on [[Screen Index#s15\|s15]] / [[Screen Index#s47\|s47]], [[BI-14 Counts Backend Integration#Flow]] step 4, [[S-03 Counts Story|Counts · S5]]) is gone: moving a member on s15 and disconnecting on s47 both move the counts; an add, approve, move or remove reads the Ring again (both Rings on a move; `b646053`, `f801aaa`).

## Not done yet

- "N added today" on Home → an open question of [[S-03 Counts Story]].

## Log

- 2026-11-05 · `rings/F-11/honest-rings` @ `f2c2ad5` (social_pin, on `main` since 2026-11-24) · s11, s12, the Ring picker, s14, s16, s17, s68: every count from the API (`memberCount`, `GET /rings/shared-with-me/count`, `GET /rings/:id`); RG-10…RG-13 · flagged nothing
- 2026-11-09 · app branch `rings/F-11/honest-rings` @ `dde0533`, `f801aaa`, `0005f00` (with `f70c791`, `b646053`; on `main` since 2026-11-24) · S1, S1b, S2, S3, S5, S11 · s11, s12, the Ring picker, s14, s16, s68: no sample Rings or sample numbers anywhere (loading and error states instead); Me shows "N connections" from `GET /connections/count` and re-reads it on focus and on connection changes; Ring data re-reads its count after a roster change; the shared-with-me row corrected for backend `12172c6` (cleared the [[BD-11 Rings Backend Delivery]] flag); [[FR-03 Counts Frontend Requirements]] s68 source updated · flagged nothing
- 2026-11-24 · `social_pin` `main` @ `866240a` (`rings/F-11/honest-rings` fast-forwarded into `main`, not pushed to `origin` yet) · S2 · s16, s17: Shared with me reads its list again on every focus of the tab, not only the count, so the chip and the rows agree. Cleared [[S-03 Counts Story]]'s two flags: s17 shows "· N people" on a row when `memberCount` is sent (2026-11-12); s68 is the three tiles, Rings · Connections · Photos (`776e6ca`), "–" until read (2026-11-24). The member-change deviation is gone (a move on s15 and a disconnect on s47 move the counts) · flagged nothing
