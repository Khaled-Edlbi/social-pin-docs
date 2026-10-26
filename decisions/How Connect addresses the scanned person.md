---
type: decision
id: ND-10
aliases: [ND-10]
status: draft
features: [badge-qr, connections]
blocks: ["T-008 Story", "T-021 Story"]
decider: "owner"
screens: [s43, s44]
affects: []
related: ["View As & Pin Views", "Connections"]
owner: "omar"
created: 2026-10-25
updated: 2026-10-26
tags: [decision, decision/draft]
---

# ❓ ND-10 · How Connect addresses the scanned person

**Status:** draft · **Decider:** owner · **Raised:** 2026-10-25 · **Needed by:** [[T-008 Story]], [[T-021 Story]] · **Feature:** [[Badge & QR]], [[Connections]]

> The needs-decision card: `draft` while the question is written, `open` once it is ready for the decider; it shows **Fulfilled** by itself once its decision card (D-NN) is `decided`. The cards in `blocks` are **Blocked · ND-10** while this is `draft` or `open` and return to their own status once it is fulfilled. Nobody edits their `status:` for this, and nobody types `fulfilled` or `decided` here.

## What has to be decided

What *Connect* on a scanned or looked-up card ([[Screen Index#s44|s44]]) sends so that the request reaches the right person. The view body the scanner gets has no user id, so today the app has nothing to address the request with. Until this is chosen, [[T-008 Resolve a scanned QR token]] cannot fix its response shape and [[T-021 Connect request send, inbox, cancel]] cannot fix the body of `POST /connections/requests`. Giving the scanner a user id is the simplest call but hands a stable id to anyone who scans; keeping the id on the server means the request carries what the scanner already has, and lives only as long as that does.

## Notes

- `RingProfileViewEntity` (`GET /views/ring/:ringId`, `GET /views/pin/:pinName`) has no user id, on purpose ([[View As & Pin Views Backend Integration]]). The Ring id is not shown to viewers either.
- `GET /views/user/:userId/perspectives` already takes a user id; today a client only gets one from its own data, never from a stranger's view.
- The task's *What* says "target by user id from a resolved view", which the view cannot supply; the T-021 Story's acceptance criteria say the id comes from the scan or the lookup, never from the view ([[T-021 Story]], [[T-008 Story]] open questions).
- There are two ways in: a scan (a token, [[T-008 Resolve a scanned QR token]]) and a Pin-name lookup (`/views/pin/:pinName`). The answer has to cover both.
- A blocked pair must fail with the same 404 as the views ([[T-021 Story]] S2), whatever is sent.

## Options

1. **The resolve and the lookup return the person's user id**; *Connect* sends `{ userId }`. One shape for every source; the app can cache "Requested" by user id. Any scanner learns a stable id for the presenter.
2. **The resolve and the lookup return an opaque, short-lived handle**; *Connect* sends `{ handle }`. No stable id leaves the server; one more thing to issue, expire and test.
3. ***Connect* sends what the requester already has**: `{ qrToken }` after a scan, `{ pinName }` after a lookup; the server resolves the person. Nothing new is exposed; a Connect tapped after the token rotated fails with the neutral 404, which depends on the get-or-rotate question raised from [[T-007 Story]].

Recommendation: option 3. It adds no identifier to the view contract and reuses the access checks the token and the Pin-name route already run. Option 1 if the owner prefers one request shape over keeping user ids private.

## Responsible

`decider` above: the owner, before [[T-008 Story]] and [[T-021 Story]] are approved, after hearing from the backend what the resolve can return and from the frontend how *Requested* is kept across navigation.

## Decision

— (answered on its decision card, never written here: the PM or the owner, on the user's word, runs `node scripts/build-tree.mjs --scaffold record ND-10 "<the answer>"`, fills the decision card D-NN (what was decided, why, what it changes with every feature and task in its `affects`, what stays open) and sets it `decided` with `decidedBy` and `decidedAt`; this card then shows Fulfilled by itself; the H1 gets ✅, and this line is replaced by "Fulfilled by" and a wikilink to the decision card, then "decided <date> by <who>: option <n>"; then `--impact D-NN` and flag the notes it lists)
