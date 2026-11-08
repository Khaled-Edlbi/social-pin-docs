---
id: D-35
type: decision
status: decided
features: [ring-invitations]
decision: ND-35
decidedBy: "Omar Fostok"
decidedAt: 2026-11-08
owner: "Omar Fostok"
affects: ["S-33 Ring Invitations & Join Story", "FR-17 Ring Invitations & Join Frontend Requirements", "BD-17 Ring Invitations & Join Backend Delivery", "S-29 Companies Story", "S-37 Badge & QR Story"]
related: ["ND-35 A colleague's QR offering their company Ring", "F-17 Ring Invitations & Join", "D-32 Several join codes per Ring", "D-14 Shared with me lists people, never the Ring", "D-11 The badge code stays the same for its day", "D-28 Scan someone in is not in the MVP", "D-18 Ring names shown when joined knowingly", "D-04 Ring settings at launch and their defaults"]
created: 2026-11-08
updated: 2026-11-08
tags: [decision, decision/decided]
---

# ✅ D-35 · A join code can be shown as a QR

**Answers:** [[ND-35 A colleague's QR offering their company Ring]] · **Decided by:** Omar Fostok · **On:** 2026-11-08 · **Feature:** [[F-17 Ring Invitations & Join]]

> This card is the answer to [[ND-35 A colleague's QR offering their company Ring]]. The needs-decision card keeps the question, the facts and the options; this decision card says what was decided, why, and what it changes. `draft` while the answer is prepared; `decided` only by the PM or the owner, on the user's word, with `decidedBy` and `decidedAt`: then [[ND-35 A colleague's QR offering their company Ring]] shows Fulfilled by itself and the cards it blocked continue.

## What was decided

**Option 2: each of the Ring's join codes can be shown as a QR; a personal badge never offers a Ring.**

- **Where:** Edit Ring → Joining → Join codes ([[D-32 Several join codes per Ring]]): each active code has **Show as QR**, a full-screen QR of that code, with the code's text under it ("K7QM-4RXT") for those who type it.
- **Who shows it:** whoever manages the codes (the owner; later admins who manage who's in it). A member can't show one.
- **Scanning it** with the app's scanner opens the same review as typing that code (s74, "Join Acme Team?"). Everything that applies to the code applies to its QR: `joinPolicy` must allow codes, "approve each one", the code's end date and use limit, the try limit, and the one neutral message for a wrong, turned-off, ended or used-up code.
- **Turning the code off** stops its QR at once; there is no separate QR to manage.
- **A personal badge** (`RingQrToken`) **never offers a Ring to join**, and nothing about a person's memberships is ever read from a scan ([[D-14 Shared with me lists people, never the Ring]]).
- **"A QR from a colleague"** in the copy on s74 and s72 becomes "a join QR" (shown by the company, not read from a colleague's badge).

This rules out option 1 (no QR joining in the MVP) and option 3 (a member's badge carrying a join offer).

## Why

- **One scan at the welcome desk** for a new hire, with nothing new to explain: the QR *is* a join code.
- **Nobody's badge says which company Ring they're in.** A join offer only ever comes from a code made for joining.
- **Small:** the backend resolves one more kind of code (or the code text inside the QR) to the existing join review; the app draws a QR and routes a scan to s74.

## What it changes

- [[S-33 Ring Invitations & Join Story]] (`/pm`): S9 is "Join with a join QR": Show as QR on each code under Joining → Join codes, the scan opens S2's review with the code's rules; a personal badge never offers a Ring. s74's list of ways in reads invitation, code, join QR.
- [[FR-17 Ring Invitations & Join Frontend Requirements]] (`/frontend`): Show as QR per active code; the scanner recognises a join QR and opens the s74 review for it; the code's errors are shown for a scanned QR too.
- [[BD-17 Ring Invitations & Join Backend Delivery]] (`/backend`): a join QR carries the join code (or a token for it) and resolves through the same check as a typed code (policy, approval, end date, use limit, try limit, one neutral error); the badge resolve route never returns a join offer.
- [[S-29 Companies Story]] (`/pm`): S1's "Invite code, work email or a QR from a colleague" becomes "Invitation, code or a join QR" (work email waits, [[D-33 Work email joining waits for real emails and Companies]]).
- [[S-37 Badge & QR Story]] (`/pm`): the scanner tells a join QR from a badge; a badge only ever opens a person's card, never a Ring to join.

## Still open

- **How a join QR is told apart from a badge** (a prefix in the payload, a different route): `/backend` writes it in BD-17.
- **The Show as QR screen isn't drawn:** a designer, or the app's own badge style until then.

## Log

- 2026-11-08 · flagged [[S-33 Ring Invitations & Join Story]]: ND-35 decided, option 2: each join code can be shown as a QR (Show as QR under Joining → Join codes), scanning it opens the s74 review with the code's rules; a personal badge never offers a Ring
- 2026-11-08 · flagged [[FR-17 Ring Invitations & Join Frontend Requirements]]: the same; Show as QR per code, the scanner opens s74 for a join QR
- 2026-11-08 · flagged [[BD-17 Ring Invitations & Join Backend Delivery]]: the same; a join QR resolves through the typed code's checks, the badge route never returns a join offer
- 2026-11-08 · flagged [[S-29 Companies Story]]: S1's ways in read invitation, code or a join QR
- 2026-11-08 · flagged [[S-37 Badge & QR Story]]: the scanner tells a join QR from a badge; a badge never offers a Ring
