---
id: D-31
type: decision
status: decided
features: [ring-invitations]
decision: ND-31
decidedBy: "Omar Fostok"
decidedAt: 2026-11-08
owner: "Omar Fostok"
affects: ["S-33 Ring Invitations & Join Story", "FR-17 Ring Invitations & Join Frontend Requirements", "BD-17 Ring Invitations & Join Backend Delivery", "S-16 Ring Members Story", "S-29 Companies Story"]
related: ["ND-31 What an invitation is", "F-17 Ring Invitations & Join", "D-04 Ring settings at launch and their defaults", "D-17 Requests expire after 30 days, optional note, ask again at once", "D-18 Ring names shown when joined knowingly", "S-31 Delegated Admins Story", "FR-15 Companies Frontend Requirements"]
created: 2026-11-08
updated: 2026-11-08
tags: [decision, decision/decided]
---

# ✅ D-31 · An invitation is its own record

**Answers:** [[ND-31 What an invitation is]] · **Decided by:** Omar Fostok · **On:** 2026-11-08 · **Feature:** [[F-17 Ring Invitations & Join]]

> This card is the answer to [[ND-31 What an invitation is]]. The needs-decision card keeps the question, the facts and the options; this decision card says what was decided, why, and what it changes. `draft` while the answer is prepared; `decided` only by the PM or the owner, on the user's word, with `decidedBy` and `decidedAt`: then [[ND-31 What an invitation is]] shows Fulfilled by itself and the cards it blocked continue.

## What was decided

**Option 1: an invitation is its own record, not a membership.** It holds the Ring, the person invited, who invited them, an optional access window, when it was sent, and a status: `PENDING`, `ACCEPTED`, `DECLINED` or `WITHDRAWN`. While it is pending the person is **not** a member: no access to the Ring's card, not on the roster, not in any count, not on anyone's Shared with me.

- **Accept** creates the membership in the same step, with the invitation's window, recorded as **joined knowingly**, so the Ring keeps its name for them ([[D-18 Ring names shown when joined knowingly]]).
- **Decline** closes it; the owner may invite again. **Withdraw** (the owner, or whoever sent it) closes it too.
- A pending invitation **expires after 30 days**, as a connection request does ([[D-17 Requests expire after 30 days, optional note, ask again at once]]).
- An invitation to a Ring that ended or was deleted reads "no longer valid" (`valid: false`); only *Dismiss* remains.
- Who may send one stays as the story says: the owner, an admin at "can also manage who's in it", a member only when the Ring lets members invite others ([[D-04 Ring settings at launch and their defaults]]).

This rules out option 2, a membership in an `INVITED` state.

## Why

- An invitation is a promise of access, not access. Kept apart from memberships, nothing that decides access or counts members can ever see it by mistake.
- The member list, the counts, the access engine and Shared with me stay exactly as they are; only accepting touches them.
- "Joined knowingly" becomes a fact the accept writes, which is what lets the Ring be named to that member.
- The owner gets a clean "Invited · N" list with Withdraw, separate from the members.

## What it changes

- [[S-33 Ring Invitations & Join Story]]: S1, S2 and S6 can be written to this; the "Waits on ND-31" marks come out (`/pm`).
- [[FR-17 Ring Invitations & Join Frontend Requirements]]: the invitation rows on s17 and s72 (with `business` and `valid`), the review on s74, accept, decline, dismiss; the owner's Invited list with Withdraw (`/frontend`).
- [[BD-17 Ring Invitations & Join Backend Delivery]]: a `RingInvitation` table; send, list mine, accept (one transaction creating the membership recorded as joined knowingly), decline, withdraw, the owner's list, the 30-day expiry; enforced against `joinPolicy` and `membersCanInvite` (`/backend`).
- [[S-16 Ring Members Story]]: s15 gains "Invited · N" beside "Waiting on you · N"; invitations are never members (`/pm`).
- [[S-29 Companies Story]]: invitations to a company Ring are listed by company on s72 from this record (`/pm`).

## Still open

- What the invitation says in its notification, and whether it carries a note from the inviter (S-33 S12).
- Inviting someone who isn't on Social Pin yet (by email or phone) is not part of this; invitations go to a connection or a Pin name.

## Log

- 2026-11-08 · flagged [[S-33 Ring Invitations & Join Story]]: ND-31 decided 2026-11-08 by Omar Fostok, option 1: an invitation is its own record (Ring, invitee, inviter, optional window, PENDING/ACCEPTED/DECLINED/WITHDRAWN), never a membership while pending; accept creates the membership recorded as joined knowingly; decline, withdraw, 30-day expiry, valid:false on an ended Ring
- 2026-11-08 · flagged [[FR-17 Ring Invitations & Join Frontend Requirements]]: ND-31 decided 2026-11-08 by Omar Fostok, option 1: an invitation is its own record (Ring, invitee, inviter, optional window, PENDING/ACCEPTED/DECLINED/WITHDRAWN), never a membership while pending; accept creates the membership recorded as joined knowingly; decline, withdraw, 30-day expiry, valid:false on an ended Ring
- 2026-11-08 · flagged [[BD-17 Ring Invitations & Join Backend Delivery]]: ND-31 decided 2026-11-08 by Omar Fostok, option 1: an invitation is its own record (Ring, invitee, inviter, optional window, PENDING/ACCEPTED/DECLINED/WITHDRAWN), never a membership while pending; accept creates the membership recorded as joined knowingly; decline, withdraw, 30-day expiry, valid:false on an ended Ring
- 2026-11-08 · flagged [[S-16 Ring Members Story]]: ND-31 decided 2026-11-08 by Omar Fostok, option 1: an invitation is its own record (Ring, invitee, inviter, optional window, PENDING/ACCEPTED/DECLINED/WITHDRAWN), never a membership while pending; accept creates the membership recorded as joined knowingly; decline, withdraw, 30-day expiry, valid:false on an ended Ring
- 2026-11-08 · flagged [[S-29 Companies Story]]: ND-31 decided 2026-11-08 by Omar Fostok, option 1: an invitation is its own record (Ring, invitee, inviter, optional window, PENDING/ACCEPTED/DECLINED/WITHDRAWN), never a membership while pending; accept creates the membership recorded as joined knowingly; decline, withdraw, 30-day expiry, valid:false on an ended Ring
