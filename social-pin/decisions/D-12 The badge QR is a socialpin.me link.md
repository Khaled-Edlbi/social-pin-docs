---
id: D-12
type: decision
status: decided
features: [badge-qr]
decision: ND-12
decidedBy: "Omar Fostok"
decidedAt: 2026-11-08
owner: "Omar Fostok"
affects: ["S-37 Badge & QR Story", "FR-18 Badge & QR Frontend Requirements", "BD-18 Badge & QR Backend Delivery", "FR-14 Connections Frontend Requirements", "S-71 Subscription (Free vs Pro) Story"]
related: ["ND-12 What the badge QR encodes", "F-18 Badge & QR", "D-11 The badge code stays the same for its day", "D-10 Connect sends what the requester already has", "D-22 The public page only says the Pin exists", "D-35 A join code can be shown as a QR", "F-28 Subscription (Free vs Pro)"]
created: 2026-11-08
updated: 2026-11-08
tags: [decision, decision/decided]
---

# ✅ D-12 · The badge QR is a socialpin.me link

**Answers:** [[ND-12 What the badge QR encodes]] · **Decided by:** Omar Fostok · **On:** 2026-11-08 · **Feature:** [[F-18 Badge & QR]]

> This card is the answer to [[ND-12 What the badge QR encodes]]. The needs-decision card keeps the question, the facts and the options; this decision card says what was decided, why, and what it changes. `draft` while the answer is prepared; `decided` only by the PM or the owner, on the user's word, with `decidedBy` and `decidedAt`: then [[ND-12 What the badge QR encodes]] shows Fulfilled by itself and the cards it blocked continue.

## What was decided

**Option 1: the badge QR is a link carrying the token, `https://socialpin.me/q/<token>`.**

- **The token stays opaque** inside the link: no Ring id, no user id.
- **The token response** (`POST /rings/:ringId/qr`, [[D-11 The badge code stays the same for its day]]) adds **`url`** next to `token`, `issuedAt` and `expiresAt`. The app draws the QR from `url`.
- **The app's scanner reads the link itself:** it recognises `https://socialpin.me/q/`, takes the token from the end and resolves it (`GET /views/qr/:token`). It never opens the link, so **in-app scanning works without the domain**.
- **Anything else is "Not a Social Pin code"**, checked on the phone without a request; a Ring's join QR (D-35) is told apart by its own form, which `/backend` writes in BD-17.
- **Later, when the domain is set up:**
  - the phone's own camera opens the app on the card (app links on iOS and Android, deep links);
  - without the app, the [[D-22 The public page only says the Pin exists|D-22]] web page answers (name and Pin name, nothing from any Ring).
- **Pro permanent codes and printed codes wait until the domain works.** A free account's code changes every 24 h, so nothing shown before then outlives the switch.

This rules out option 2 (the bare token) and option 3 (a `socialpin://` scheme).

## Why

- **It's the only form that can reach someone without the app**, and it shares `socialpin.me` and the app links with the D-22 Pin page.
- **Safe to print later:** codes never change format, so Pro and printed codes made once the domain works keep working.
- **Nothing waits on the domain today:** the app's own scanner only reads text, and free codes rotate daily.
- **Traded away, until the domain exists:** scanning a badge with the phone's camera does nothing useful.

## What it changes

- [[S-37 Badge & QR Story]] (`/pm`): S1/S7 draw the QR from `url`; S3/S15 recognise the link format on the phone ("Not a Social Pin code" for anything else, a join QR to the join review); S5/S20 (share link, the browser page) wait on the domain; the open question "What the QR encodes" is closed.
- [[FR-18 Badge & QR Frontend Requirements]] (`/frontend`): `url` in the token response; the scanner parses `https://socialpin.me/q/<token>`; deep links and the share link listed as later (the domain).
- [[BD-18 Badge & QR Backend Delivery]] (`/backend`): `url` on the token response, built from a configured base (`https://socialpin.me/q/`); later, the `/q/<token>` web route and the app-link files on the domain.
- [[FR-14 Connections Frontend Requirements]] (`/frontend`): "By scan" reads the token from the link before `GET /views/qr/:token`; Connect still sends `{ qrToken }` (D-10).
- [[S-71 Subscription (Free vs Pro) Story]] (`/pm`): the Pro permanent code waits until the domain works.

## Still open

- **The domain and app links:** registering `socialpin.me` and setting up app links on iOS and Android; nothing has a date yet.
- **Before the domain:** whether the badge hides *Share link* and *Save image* (they'd hand out a link that leads nowhere): S-37's rewrite says.

## Log

- 2026-11-08 · flagged [[S-37 Badge & QR Story]]: ND-12 decided, option 1: the badge QR is https://socialpin.me/q/<token> (opaque token); the token response adds url; the app's scanner reads the token from the link, so it works without the domain; the phone's camera, deep links and the D-22 page come with the domain; Pro and printed codes wait for it
- 2026-11-08 · flagged [[FR-18 Badge & QR Frontend Requirements]]: the same; url in the token response, the scanner parses the link, deep links later
- 2026-11-08 · flagged [[BD-18 Badge & QR Backend Delivery]]: the same; url on the token response from a configured base; the /q/ web route and app-link files later
- 2026-11-08 · flagged [[FR-14 Connections Frontend Requirements]]: "By scan" reads the token from the link before GET /views/qr/:token
- 2026-11-08 · flagged [[S-71 Subscription (Free vs Pro) Story]]: the Pro permanent code waits until socialpin.me works
