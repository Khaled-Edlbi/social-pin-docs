---
id: B-29
type: bug
module: discovery
feature: discover-hub
status: done
resolution: fixed
priority: medium
effort: S
foundOn: "BI-19 Discover Hub & Search Backend Integration"
screens: [s68]
depends: []
affects: ["QB-18 Discover Hub & Search QA Backend"]
related: ["BI-19 Discover Hub & Search Backend Integration", "QB-18 Discover Hub & Search QA Backend", "BD-19 Discover Hub & Search Backend Delivery", "B-13 The string false is read as true on Ring filters and settings", "B-11 Projection switches read any string as true", "PATCH /users/me"]
pending: []
created: 2026-11-23
updated: 2026-11-23
tags: [bug, bug/done, module/discovery, priority/medium, resolution/fixed]
---

# ✅ B-29 · The find-me switch reads the string false as true

**Found against:** [[BI-19 Discover Hub & Search Backend Integration]] · **Feature:** [[F-19 Discover Hub & Search]] · **Status:** Done · **Priority:** Medium (`critical | high | medium | low`, from `docs.config.json`) · **Deadline:** — · **Effort:** S (S < 1 day, M 1–3 days, L > 3 days)

**Found by:** [[QB-18 Discover Hub & Search QA Backend]] row B61, on build backend `main @ c5bc838`.

## What

**What happens.** `PATCH /users/me` accepts a `findableByPinName` that is not a boolean, answers 200 and stores a value the sender did not ask for. Any non-empty string is read as true, `"false"` and `"no"` included, so a client that sends the string `"false"` to hide a person makes them findable:

| Before | Sent | Status | After |
|---|---|---|---|
| true | `"no"` | 200 | true |
| false | `"no"` | 200 | **true** |
| false | `"false"` | 200 | **true** |
| true | `0` | 200 | **false** |

**What should happen.** 400 with a validation body and the value unchanged: the field is a boolean ([[BI-19 Discover Hub & Search Backend Integration]], *Shapes that matter*: `findableByPinName: boolean`), and S-42 S5 makes it the person's own choice of who finds them. A real `true` or `false` is saved correctly (QB-18 B56, B60), so the app, which sends booleans, is not affected today.

**Where.** `PATCH /users/me` ([[Screen Index#s68|s68]] Me › Privacy). The same cause as [[B-13 The string false is read as true on Ring filters and settings]] and [[B-11 Projection switches read any string as true]]: the request body is converted before it is validated.

**On which build.** Backend `main @ c5bc838`, local, PostgreSQL 17.4, throwaway database, 2026-11-23.

The fix is the backend's: `/backend`. That agent sets `in-progress` when it starts and `ready` when the fix ships (status, tag, H1 and the Status segment only; the fix itself is recorded in its own delivery note, with a flag line here); QA re-tests a `ready` bug and closes it or reopens it.

## Design

- [[Screen Index#s68|s68]]

## Impact

Output of `node scripts/build-tree.mjs --impact B-29` when the bug was filed: the notes the fix touches and that must be updated or flagged when it ships.

- [[BI-19 Discover Hub & Search Backend Integration]] — related →
- [[F-19 Discover Hub & Search]] — wikilink →
- [[QB-18 Discover Hub & Search QA Backend]] — affects →: row B61 re-run

## Definition of done

- [x] `PATCH /users/me` with a `findableByPinName` that is not `true` or `false` answers 400 and changes nothing

- [x] The behaviour is fixed, or the notes are corrected, as the decision says (`resolution:` set, the tag `resolution/<id>` with it)
- [x] The QA row that found it re-run against the fix, on a named build
- [x] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [x] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-11-23 · filed with --scaffold bug, found against BI-19 Discover Hub & Search Backend Integration
- 2026-11-23 · backend `main @ e83682d` · re-test passed: [[QB-18 Discover Hub & Search QA Backend]] row B61, in a run of all 63 rows. `"no"`, `0`, `1`, `null` and `""` answer 400 "findableByPinName must be a boolean value" and leave the value as it was, from true and from false; `true`, `false`, `"true"` and `"false"` are saved as sent. The fix is recorded in [[BD-19 Discover Hub & Search Backend Delivery]] (backend branch `B-29/user/findable-switch-boolean`, `812d6a4`); its ready-for-re-test flag cleared. `ready` → `done`, `resolution: fixed`, on khaled's word
