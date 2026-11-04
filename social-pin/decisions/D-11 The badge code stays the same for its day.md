---
id: D-11
type: decision
status: decided
features: [badge-qr]
decision: ND-11
decidedBy: "Omar Fostok"
decidedAt: 2026-11-04
owner: "Omar Fostok"
affects: ["S-37 Badge & QR Story", "FR-18 Badge & QR Frontend Requirements", "BD-18 Badge & QR Backend Delivery"]
related: ["ND-11 Get or rotate the badge token", "D-10 Connect sends what the requester already has", "F-18 Badge & QR", "S-71 Subscription (Free vs Pro) Story", "S-23 Connections Story"]
created: 2026-11-04
updated: 2026-11-04
tags: [decision, decision/decided]
---

# ✅ D-11 · The badge code stays the same for its day

**Answers:** [[ND-11 Get or rotate the badge token]] · **Decided by:** Omar Fostok · **On:** 2026-11-04 · **Feature:** [[F-18 Badge & QR]]

> This card is the answer to [[ND-11 Get or rotate the badge token]]. The needs-decision card keeps the question, the facts and the options; this decision card says what was decided, why, and what it changes. `draft` while the answer is prepared; `decided` only by the PM or the owner, on the user's word, with `decidedBy` and `decidedAt`: then [[ND-11 Get or rotate the badge token]] shows Fulfilled by itself and the cards it blocked continue.

## What was decided

**Option 2: get while valid, rotate on expiry or on request.** `POST /rings/:ringId/qr` returns the Ring's current token while it is inside its 24-hour window, and issues a new one (revoking the old) only once the window has passed. Opening the badge again, or on a second phone, shows the same code. The owner can kill a code at any time with a reset (`{ reset: true }` or `POST …/qr/reset`, the backend chooses), for a code they think was copied; the reset revokes it and issues a new one. The response carries `issuedAt` and `expiresAt` from the server. This is the free account's 24-hour token only; the Pro permanent code and the 60-second event pass keep their own rules. It rules out rotating on every call (option 1) and a separate read route (option 3).

## Why

[[S-37 Badge & QR Story|Badge & QR]] already assumes a stable token (S2 reuses a valid one, S3 rotates after 24 h, S4 shows the last one offline). Rotating on every call would kill the code someone is about to scan whenever the badge is opened again. A stable code also makes [[D-10 Connect sends what the requester already has]] reliable: *Connect* sends the scanned token, and it keeps working for the rest of the token's day. Option 3 behaves the same as option 2 with one more route to build.

What was traded away: a code the owner shows stays valid until it expires or is reset, so a photo of it works for the rest of its day; the reset is the answer to that.

## What it changes

- [[S-37 Badge & QR Story]]: S7–S12 no longer wait on this; issue means "get the valid one, or a new one past its window", plus a reset (`/pm`).
- [[FR-18 Badge & QR Frontend Requirements]]: the badge calls the route whenever it opens and shows the countdown from `expiresAt`; a *Reset code* action (`/frontend`).
- [[BD-18 Badge & QR Backend Delivery]]: `POST /rings/:ringId/qr` returns the valid token or issues one past its window; the reset; `issuedAt` / `expiresAt` in the response (`/backend`).

## Still open

- Whether a Pro user can reset the permanent code, and what happens to it when Pro ends: no card yet ([[S-71 Subscription (Free vs Pro) Story]]).
- The reset's exact shape (a body flag or its own route) is the backend's to choose in [[BD-18 Badge & QR Backend Delivery]].

## Log

- 2026-11-04 · flagged [[S-37 Badge & QR Story]]: ND-11 decided, option 2: POST /rings/:ringId/qr returns the valid token inside its 24 h window and issues a new one only past it; the owner can reset a code. S7–S12 no longer wait on ND-11.
- 2026-11-04 · flagged [[FR-18 Badge & QR Frontend Requirements]]: ND-11 decided, option 2: the badge shows the same code all day (countdown from expiresAt) and offers a Reset code action.
- 2026-11-04 · flagged [[BD-18 Badge & QR Backend Delivery]]: ND-11 decided, option 2: the route returns the valid token or issues one past its window, plus a reset; issuedAt and expiresAt in the response.
