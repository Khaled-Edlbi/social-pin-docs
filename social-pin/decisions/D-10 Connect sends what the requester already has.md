---
id: D-10
type: decision
status: decided
features: [badge-qr, connections]
decision: ND-10
decidedBy: "Omar Fostok"
decidedAt: 2026-11-04
owner: "Omar Fostok"
affects: ["S-23 Connections Story", "S-37 Badge & QR Story", "FR-14 Connections Frontend Requirements", "FR-18 Badge & QR Frontend Requirements", "BD-14 Connections Backend Delivery", "BD-18 Badge & QR Backend Delivery"]
related: ["ND-10 How Connect addresses the scanned person", "ND-11 Get or rotate the badge token", "F-14 Connections", "F-18 Badge & QR", "BI-09 View As & Pin Views Backend Integration"]
created: 2026-11-04
updated: 2026-11-04
tags: [decision, decision/decided]
---

# ✅ D-10 · Connect sends what the requester already has

**Answers:** [[ND-10 How Connect addresses the scanned person]] · **Decided by:** Omar Fostok · **On:** 2026-11-04 · **Feature:** [[F-18 Badge & QR]], [[F-14 Connections]]

> This card is the answer to [[ND-10 How Connect addresses the scanned person]]. The needs-decision card keeps the question, the facts and the options; this decision card says what was decided, why, and what it changes. `draft` while the answer is prepared; `decided` only by the PM or the owner, on the user's word, with `decidedBy` and `decidedAt`: then [[ND-10 How Connect addresses the scanned person]] shows Fulfilled by itself and the cards it blocked continue.

## What was decided

**Option 3: *Connect* sends what the requester already has.** After a scan, `POST /connections/requests` carries the scanned token, `{ qrToken }`; after a Pin-name lookup, it carries the Pin name, `{ pinName }`. The server finds the person from that, with the same access checks the QR resolve and `GET /views/pin/:pinName` already run, and a blocked pair, a token that has expired or been revoked, or a Pin name that no longer leads anywhere all fail with the same neutral 404 as the card. The view the scanner gets stays as it is: no user id, no Ring id. This rules out handing the scanner the person's user id (option 1) and a separate short-lived handle (option 2).

## Why

The product's promise is that a scan shows what a Ring shares and nothing more ([[BI-09 View As & Pin Views Backend Integration]]: `RingProfileViewEntity` carries no user id, on purpose). Option 1 would give every scanner a stable id for the person, which cannot be taken back once handed out. Option 3 exposes nothing new and adds no new thing to issue and expire, unlike option 2: the token and the Pin name are what the app already holds, and the server already knows how to resolve both.

What was traded away: a *Connect* tapped after a free badge's token has expired fails with the neutral 404, and the requester finds the person again by Pin name or a new scan. How long a token stays valid is [[ND-11 Get or rotate the badge token]]; a Pro account's permanent code does not expire.

## What it changes

- [[S-23 Connections Story]]: S2's *Connect* no longer waits on this; the request body is `{ qrToken }` or `{ pinName }`, plus the optional note. The story already describes this option (`/pm`).
- [[S-37 Badge & QR Story]]: the QR resolve keeps returning the view without a user id; the scanned token is what *Connect* sends (`/pm`).
- [[FR-14 Connections Frontend Requirements]]: the app keeps the token or the Pin name it opened the card with and sends it with *Connect*; *Requested* is kept per card opened, not per user id (`/frontend`).
- [[FR-18 Badge & QR Frontend Requirements]]: the scanner hands the token it resolved on to the card (`/frontend`).
- [[BD-14 Connections Backend Delivery]]: `POST /connections/requests` accepts `{ qrToken }` or `{ pinName }`, resolves the person through the access engine, and answers the views' 404 on every failure (`/backend`).
- [[BD-18 Badge & QR Backend Delivery]]: the resolve route stays without a user id; the token's lookup is shared with the request route (`/backend`).

## Still open

- When a free badge's token changes: [[ND-11 Get or rotate the badge token]].
- Whether a Pro user can reset the permanent code, and what happens to it when Pro ends: no card yet ([[S-71 Subscription (Free vs Pro) Story]]).
- How the app keeps *Requested* when the same person is opened again by a different token or by Pin name: the frontend proposes it in [[FR-14 Connections Frontend Requirements]].

## Log

- 2026-11-04 · flagged [[S-23 Connections Story]]: ND-10 decided, option 3: Connect sends { qrToken } after a scan or { pinName } after a lookup; S2 no longer waits on ND-10.
- 2026-11-04 · flagged [[S-37 Badge & QR Story]]: ND-10 decided, option 3: the QR resolve keeps returning the view without a user id; Connect sends the scanned token.
- 2026-11-04 · flagged [[FR-14 Connections Frontend Requirements]]: ND-10 decided, option 3: the app keeps the token or Pin name it opened the card with and sends it with Connect; Requested is kept per card opened.
- 2026-11-04 · flagged [[FR-18 Badge & QR Frontend Requirements]]: ND-10 decided, option 3: the scanner hands the token it resolved on to the card, for Connect.
- 2026-11-04 · flagged [[BD-14 Connections Backend Delivery]]: ND-10 decided, option 3: POST /connections/requests accepts { qrToken } or { pinName }, resolves the person through the access engine, and answers the views' 404 on every failure.
- 2026-11-04 · flagged [[BD-18 Badge & QR Backend Delivery]]: ND-10 decided, option 3: the resolve stays without a user id; the token lookup is shared with the connection request route.
