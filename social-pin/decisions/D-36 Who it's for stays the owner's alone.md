---
id: D-36
type: decision
status: decided
features: [ring-invitations]
decision: ND-36
decidedBy: "Omar Fostok"
decidedAt: 2026-11-08
owner: "Omar Fostok"
affects: ["S-33 Ring Invitations & Join Story", "FR-17 Ring Invitations & Join Frontend Requirements", "BD-17 Ring Invitations & Join Backend Delivery", "S-29 Companies Story"]
related: ["ND-36 Whether an invitee sees who a Ring is for", "F-17 Ring Invitations & Join", "D-18 Ring names shown when joined knowingly", "D-04 Ring settings at launch and their defaults", "D-31 An invitation is its own record", "BI-08 Rings Backend Integration", "S-18 Rings Story"]
created: 2026-11-08
updated: 2026-11-08
tags: [decision, decision/decided]
---

# ✅ D-36 · Who it's for stays the owner's alone

**Answers:** [[ND-36 Whether an invitee sees who a Ring is for]] · **Decided by:** Omar Fostok · **On:** 2026-11-08 · **Feature:** [[F-17 Ring Invitations & Join]]

> This card is the answer to [[ND-36 Whether an invitee sees who a Ring is for]]. The needs-decision card keeps the question, the facts and the options; this decision card says what was decided, why, and what it changes. `draft` while the answer is prepared; `decided` only by the PM or the owner, on the user's word, with `decidedBy` and `decidedAt`: then [[ND-36 Whether an invitee sees who a Ring is for]] shows Fulfilled by itself and the cards it blocked continue.

## What was decided

**Option 1: "Who it's for" (`purpose`) is the owner's alone, as built.**

- **Never shown** to an invitee, to someone joining with a code or a join QR, or to a member: not on s74, not on s72, not in a notification.
- **The review (s74) shows** the Ring's name ([[D-18 Ring names shown when joined knowingly]]), the owner, and who invited me (for an invitation).
- **A company that wants to say what the Ring is for** writes it in the Ring's **bio**, which members see once they join.
- **Edit Ring keeps its promise:** "Only you see this."

This rules out option 2 (a separate public line for invitations) and option 3 (showing `purpose` to invitees).

## Why

- **It keeps the promise the app already makes,** and every purpose written so far stays private.
- **Owners write purposes for themselves** ("Sees work identity only"); showing them would tell people how the owner sorts them.
- **Nothing to build:** the bio already exists for what members should read.
- **Traded away:** an invitee doesn't learn what a Ring is for before joining, beyond its name and who invited them.

## What it changes

- [[S-33 Ring Invitations & Join Story]] (`/pm`): S2's review shows the Ring's name, the owner and the inviter, never "who it's for"; the old wording ("and its 'who it's for' label if the owner wrote one") goes.
- [[FR-17 Ring Invitations & Join Frontend Requirements]] (`/frontend`): s74 and s72 show no purpose; nothing reads it outside the owner's own screens.
- [[BD-17 Ring Invitations & Join Backend Delivery]] (`/backend`): the invitation, code and join-request reads never include `purpose` (no change to the rule in [[BI-08 Rings Backend Integration]]).
- [[S-29 Companies Story]] (`/pm`): the invitation on s72 doesn't say what the Ring is for ("brand kit, directory, support line" comes from the bio, after joining).

## Still open

- Nothing.

## Log

- 2026-11-08 · flagged [[S-33 Ring Invitations & Join Story]]: ND-36 decided, option 1: "who it's for" (purpose) stays the owner's alone; s74 shows the Ring's name, the owner and the inviter, never the purpose; a company explains its Ring in the bio
- 2026-11-08 · flagged [[FR-17 Ring Invitations & Join Frontend Requirements]]: the same; no purpose on s74 or s72
- 2026-11-08 · flagged [[BD-17 Ring Invitations & Join Backend Delivery]]: the same; invitation, code and join-request reads never include purpose
- 2026-11-08 · flagged [[S-29 Companies Story]]: the s72 invitation doesn't show what the Ring is for; the bio does, after joining
