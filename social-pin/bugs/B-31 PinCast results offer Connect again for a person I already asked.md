---
id: B-31
type: bug
module: discovery
feature: pincast
status: todo
priority: high
effort: S
foundOn: "BD-20 PinCast & Nearby Backend Delivery"
screens: [s42]
depends: []
affects: ["BI-20 PinCast & Nearby Backend Integration", "FD-24 PinCast & Nearby Frontend Delivery"]
related: ["BD-20 PinCast & Nearby Backend Delivery", "S-45 PinCast & Nearby Story", "GET /pincasts/:id/results", "POST /connections/requests"]
pending: []
created: 2026-11-24
updated: 2026-11-24
tags: [bug, bug/todo, module/discovery, priority/high]
---

# ⬜ B-31 · PinCast results offer Connect again for a person I already asked

**Found against:** [[BD-20 PinCast & Nearby Backend Delivery]] · **Feature:** [[F-20 PinCast & Nearby]] · **Status:** To do · **Priority:** High · **Deadline:** — · **Effort:** S

**Found by:** [[QF-07 PinCast & Nearby QA Frontend]], the two-device run on the development API (2026-11-24), on `social_pin` `rings/F-11/honest-rings` against backend `main` `ecd93c0`.

## What

**What happens.** A asked B to connect from a PinCast (`POST /connections/requests { pincastToken }`, 201). A's results then show B with `state: NONE`, so s42 offers *Connect* again, as if A had never asked.

**What should happen.** A row for someone I already asked says so. `GET /pincasts/:id/results` should give a `REQUESTED` state, with that request's `requestId`, beside `NONE`, `REQUESTED_ME` and `CONNECTED`.

**Where.** [[Screen Index#s42|s42]], `GET /pincasts/:id/results`, the results' state for each row ([[BD-20 PinCast & Nearby Backend Delivery|BD-20]] *The lists*).

**On which build.** Backend `main` `ecd93c0`, on the development API.

The fix is the backend's work (`/backend`). Once it ships, [[BI-20 PinCast & Nearby Backend Integration|BI-20]] lists the new state and the frontend shows it on the row.

## Design

- [[Screen Index#s42|s42]]

## Impact

Output of `node scripts/build-tree.mjs --impact B-31` when the bug was filed:

- [[BD-20 PinCast & Nearby Backend Delivery]] — related →
- [[F-20 PinCast & Nearby]] — wikilink →

## Definition of done

- [ ] `GET /pincasts/:id/results` answers `REQUESTED` with `requestId` for a person I asked; BI-20 says so
- [ ] The QA row that found it re-run against the fix, on a named build
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-11-24 · filed from [[QF-07 PinCast & Nearby QA Frontend]], the two-device run on the development API (backend `main` `ecd93c0`): A asked B, and A's results showed B as `NONE` with *Connect* again · for `/backend`
