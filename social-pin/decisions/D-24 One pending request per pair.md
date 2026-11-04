---
id: D-24
type: decision
status: decided
features: [connections]
decision: ND-24
decidedBy: "Omar Fostok"
decidedAt: 2026-11-04
owner: "Omar Fostok"
affects: ["S-23 Connections Story", "FR-14 Connections Frontend Requirements", "BD-14 Connections Backend Delivery"]
related: ["ND-24 Both people ask each other", "F-14 Connections"]
created: 2026-11-04
updated: 2026-11-04
tags: [decision, decision/decided]
---

# ✅ D-24 · One pending request per pair

**Answers:** [[ND-24 Both people ask each other]] · **Decided by:** Omar Fostok · **On:** 2026-11-04 · **Feature:** [[F-14 Connections]]

> This card is the answer to [[ND-24 Both people ask each other]]. The needs-decision card keeps the question, the facts and the options; this decision card says what was decided, why, and what it changes. `draft` while the answer is prepared; `decided` only by the PM or the owner, on the user's word, with `decidedBy` and `decidedAt`: then [[ND-24 Both people ask each other]] shows Fulfilled by itself and the cards it blocked continue.

## What was decided

**Option 1: one pending request per pair.** Between two people there is never more than one pending request, whichever way it goes. When A asks B while B's request to A is pending, the server refuses A's request with a 409 carrying B's request id, and the app opens the accept sheet (s46) for it, so A chooses a Ring for B. This rules out accepting both automatically (option 2) and keeping two crossing requests (option 3).

## Why

An automatic accept would put each person in a Ring neither of them picked; the product's rule is that the receiver chooses the Ring ([[S-23 Connections Story|Connections · S5]]). Two pending requests between the same pair would show each person a request to answer and a request waiting, for one relationship. The app already shows *Accept* when the other person asked first, so the refusal is only reached when both tap at the same moment.

## What it changes

- [[S-23 Connections Story]]: S2's "what the server does if both send at the same moment" is answered; the open question closes (`/pm`).
- [[FR-14 Connections Frontend Requirements]]: the 409 with the other request's id (proposed `E_CONNECTION_REQUEST_03`) opens s46 for it (`/frontend`).
- [[BD-14 Connections Backend Delivery]]: `POST /connections/requests` checks for a pending request in either direction and answers the 409 with its id (`/backend`).

## Still open

- The error code's name is the backend's to keep or rename ([[FR-14 Connections Frontend Requirements]] proposes `E_CONNECTION_REQUEST_03`).
