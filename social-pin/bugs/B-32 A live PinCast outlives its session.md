---
id: B-32
type: bug
module: discovery
feature: pincast
status: todo
priority: high
effort: S
foundOn: "BD-20 PinCast & Nearby Backend Delivery"
screens: [s40]
depends: []
affects: ["BI-20 PinCast & Nearby Backend Integration"]
related: ["BD-20 PinCast & Nearby Backend Delivery", "FD-24 PinCast & Nearby Frontend Delivery", "S-45 PinCast & Nearby Story", "POST /pincasts/current/stop"]
pending: []
created: 2026-11-24
updated: 2026-11-24
tags: [bug, bug/todo, module/discovery, priority/high]
---

# ⬜ B-32 · A live PinCast outlives its session

**Found against:** [[BD-20 PinCast & Nearby Backend Delivery]] · **Feature:** [[F-20 PinCast & Nearby]] · **Status:** To do · **Priority:** High · **Deadline:** — · **Effort:** S

**Found by:** [[QF-07 PinCast & Nearby QA Frontend]] row PC-23 (sign out while live), on `social_pin` `rings/F-11/honest-rings` @ `4989db2` against backend `main` `ecd93c0`.

## What

**What happens.** A PinCast stays `ACTIVE` on the server until its `endsAt`, whatever happens to the session that started it. The app stops it before it signs out (PC-23: `POST /pincasts/current/stop` goes before `POST /auth/logout`). But when the session has expired or been revoked, the app can't make that call. In that case the person stays findable, and keeps being added to other people's lists, after leaving the account.

**What should happen.** The server ends the user's `ACTIVE` PinCast (`ENDED`, `endedAt = now`, as *Stop* does) on:
- logout;
- logout everywhere;
- a suspended account;
- a deleted account.

Nobody finds a person who is no longer signed in or whose account is gone.

**Where.** The auth routes (logout, logout everywhere) and the account's suspend and delete paths; the PinCast service's stop ([[BD-20 PinCast & Nearby Backend Delivery|BD-20]] *One live PinCast per user*).

**On which build.** Backend `main` `ecd93c0`.

The fix is the backend's work (`/backend`). The app's stop before sign-out stays, and needs no change.

## Design

- [[Screen Index#s40|s40]]

## Impact

Output of `node scripts/build-tree.mjs --impact B-32` when the bug was filed:

- [[BD-20 PinCast & Nearby Backend Delivery]] — related →
- [[F-20 PinCast & Nearby]] — wikilink →

## Definition of done

- [ ] Logout, logout everywhere, suspending and deleting an account end the user's `ACTIVE` PinCast; BD-20 and BI-20 say so
- [ ] Re-run on a named build: after each, the person is no longer in another broadcaster's people list
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-11-24 · filed from [[QF-07 PinCast & Nearby QA Frontend]] PC-23: the app stops a live PinCast before signing out, but an expired or revoked session can't, and the server keeps the PinCast `ACTIVE` until `endsAt` · for `/backend`
