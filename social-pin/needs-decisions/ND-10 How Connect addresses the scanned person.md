---
id: ND-10
type: needs-decision
status: draft
features: [badge-qr, connections]
blocks: ["S-37 Badge & QR Story", "S-23 Connections Story"]
decider: "owner"
screens: [s43, s44]
owner: "omar"
affects: []
related: ["F-12 View As & Pin Views", "F-14 Connections"]
created: 2026-10-25
updated: 2026-10-29
tags: [needs-decision, needs-decision/draft]
---

# ❓ ND-10 · How Connect addresses the scanned person

**Status:** draft · **Decider:** owner · **Raised:** 2026-10-25 · **Needed by:** [[S-37 Badge & QR Story|Badge & QR · S13–S18]], [[S-23 Connections Story|Connections · S8–S12]] · **Feature:** [[F-18 Badge & QR]], [[F-14 Connections]]

> The needs-decision card: `draft` while the question is written, `open` once it is ready for the decider; it shows **Fulfilled** by itself once its decision card (D-NN) is `decided`. The cards in `blocks` are **Blocked · ND-10** while this is `draft` or `open` and return to their own status once it is fulfilled. Nobody edits their `status:` for this, and nobody types `fulfilled` or `decided` here.

## What has to be decided

What *Connect* on a scanned or looked-up card ([[Screen Index#s44|s44]]) sends so that the request reaches the right person. The view body the scanner gets has no user id, so today the app has nothing to address the request with. Until this is chosen, [[S-37 Badge & QR Story|Badge & QR · S13–S18]] cannot fix its response shape and [[S-23 Connections Story|Connections · S8–S12]] cannot fix the body of `POST /connections/requests`. Giving the scanner a user id is the simplest call but hands a stable id to anyone who scans; keeping the id on the server means the request carries what the scanner already has, and lives only as long as that does.

## Notes

- `RingProfileViewEntity` (`GET /views/ring/:ringId`, `GET /views/pin/:pinName`) has no user id, on purpose ([[BI-09 View As & Pin Views Backend Integration]]). The Ring id is not shown to viewers either.
- `GET /views/user/:userId/perspectives` already takes a user id; today a client only gets one from its own data, never from a stranger's view.
- The task's *What* says "target by user id from a resolved view", which the view cannot supply; the Connections · S8–S12 Story's acceptance criteria say the id comes from the scan or the lookup, never from the view ([[S-23 Connections Story|Connections · S8–S12]], [[S-37 Badge & QR Story|Badge & QR · S13–S18]] open questions).
- There are two ways in: a scan (a token, [[S-37 Badge & QR Story|Badge & QR · S13–S18]]) and a Pin-name lookup (`/views/pin/:pinName`). The answer has to cover both.
- A blocked pair must fail with the same 404 as the views ([[S-23 Connections Story|Connections · S8–S12]] S2), whatever is sent.

## Options

1. **The resolve and the lookup return the person's user id**; *Connect* sends `{ userId }`. One shape for every source; the app can cache "Requested" by user id. Any scanner learns a stable id for the presenter.
2. **The resolve and the lookup return an opaque, short-lived handle**; *Connect* sends `{ handle }`. No stable id leaves the server; one more thing to issue, expire and test.
3. ***Connect* sends what the requester already has**: `{ qrToken }` after a scan, `{ pinName }` after a lookup; the server resolves the person. Nothing new is exposed; a Connect tapped after the token rotated fails with the neutral 404, which depends on the get-or-rotate question raised from [[S-37 Badge & QR Story|Badge & QR · S7–S12]].

Recommendation: option 3. It adds no identifier to the view contract and reuses the access checks the token and the Pin-name route already run. Option 1 if the owner prefers one request shape over keeping user ids private.

## Responsible

`decider` above: the owner, before [[S-37 Badge & QR Story|Badge & QR · S13–S18]] and [[S-23 Connections Story|Connections · S8–S12]] are approved, after hearing from the backend what the resolve can return and from the frontend how *Requested* is kept across navigation.

## Decision

— (answered on its decision card, never written here: the PM or the owner, on the user's word, runs `node scripts/build-tree.mjs --scaffold decision ND-10 "<the answer>"`, fills the decision card D-NN (what was decided, why, what it changes with every feature and task in its `affects`, what stays open) and sets it `decided` with `decidedBy` and `decidedAt`; this card then shows Fulfilled by itself; the H1 gets ✅, and this line is replaced by "Fulfilled by" and a wikilink to the decision card, then "decided <date> by <who>: option <n>"; then `--impact D-NN` and flag the notes it lists)
