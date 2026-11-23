---
id: B-28
type: bug
module: discovery
feature: discover-hub
status: in-progress
priority: high
effort: S
foundOn: "BI-19 Discover Hub & Search Backend Integration"
screens: [s38, s44]
depends: []
affects: ["QB-18 Discover Hub & Search QA Backend"]
related: ["BI-19 Discover Hub & Search Backend Integration", "QB-18 Discover Hub & Search QA Backend", "BD-19 Discover Hub & Search Backend Delivery", "BI-09 View As & Pin Views Backend Integration", "D-25 A deleted account's connections, requests and blocks end silently", "GET /views/pin/:pinName", "DELETE /users/me"]
pending: []
created: 2026-11-23
updated: 2026-11-23
tags: [bug, bug/in-progress, module/discovery, priority/high]
---

# 🟡 B-28 · A deleted account's card still opens for a member of its Ring

**Found against:** [[BI-19 Discover Hub & Search Backend Integration]] · **Feature:** [[F-19 Discover Hub & Search]] · **Status:** In progress · **Priority:** High (`critical | high | medium | low`, from `docs.config.json`) · **Deadline:** — · **Effort:** S (S < 1 day, M 1–3 days, L > 3 days)

**Found by:** [[QB-18 Discover Hub & Search QA Backend]] rows B7 and B14, on build backend `main @ c5bc838`.

## What

**What happens.** A person deletes their account, and someone who was in one of their Rings can still open their card by Pin name. `GoneQb18` signed up and put Omar in their default Ring; the account was then set `DELETED`. Omar's `GET /views/pin/goneqb18` answered **200** with the view (`pinName` "GoneQb18", `displayName` "Gone Person", …). The same with the API's own delete: `GoneTwoQb18`, Omar in its Ring, `DELETE /users/me` → 200 (`status` `DELETED`, `deleted_at` set), and Omar's `GET /views/pin/gonetwoqb18` still answered **200** with the view. The search does hide a deleted account (QB-18 B50): only the resolve still shows it.

**What should happen.** 404 `E_RING_ACCESS_01` "This profile is not shared with you", the same body as a Pin name nobody has. [[BI-19 Discover Hub & Search Backend Integration]] (*Flow* 7) and [[BD-19 Discover Hub & Search Backend Delivery]] (*What exists*) both say that unknown, deleted, not shared and blocked answer the same 404; [[D-25 A deleted account's connections, requests and blocks end silently|D-25]] ends a deleted account's connections. With a 200 for a deleted person the resolve also tells a deleted account from a name that never existed.

**Where.** `GET /views/pin/:pinName` ([[Screen Index#s44|s44]], opened from [[Screen Index#s38|s38]] and from a recent search). The route is View As & Pin Views' ([[BI-09 View As & Pin Views Backend Integration]]); the decision is the Ring access engine's. Whether the other `/views/*` routes and the Ring rosters show a deleted owner the same way was not checked in this run.

**On which build.** Backend `main @ c5bc838`, local, PostgreSQL 17.4, throwaway database, 2026-11-23.

The fix is the backend's: `/backend`. That agent sets `in-progress` when it starts and `ready` when the fix ships (status, tag, H1 and the Status segment only; the fix itself is recorded in its own delivery note, with a flag line here); QA re-tests a `ready` bug and closes it or reopens it.

## Design

- [[Screen Index#s38|s38]]
- [[Screen Index#s44|s44]]

## Impact

Output of `node scripts/build-tree.mjs --impact B-28` when the bug was filed: the notes the fix touches and that must be updated or flagged when it ships.

- [[BI-19 Discover Hub & Search Backend Integration]] — related →
- [[F-19 Discover Hub & Search]] — wikilink →
- [[QB-18 Discover Hub & Search QA Backend]] — affects →: rows B7 and B14 re-run
- [[BI-09 View As & Pin Views Backend Integration]], [[BD-19 Discover Hub & Search Backend Delivery]] — related →: they describe the route

## Definition of done

- [ ] A deleted account's Pin name answers 404 `E_RING_ACCESS_01` to everyone, a member of its Rings included, whether it was deleted by `DELETE /users/me` or set `DELETED`
- [ ] The behaviour is fixed, or the notes are corrected, as the decision says (`resolution:` set, the tag `resolution/<id>` with it)
- [ ] QB-18 rows B7 and B14 re-run against the fix, on a named build
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-11-23 · filed with --scaffold bug, found against BI-19 Discover Hub & Search Backend Integration
