---
id: D-32
type: decision
status: decided
features: [ring-invitations]
decision: ND-32
decidedBy: "Omar Fostok"
decidedAt: 2026-11-08
owner: "Omar Fostok"
affects: ["S-33 Ring Invitations & Join Story", "FR-17 Ring Invitations & Join Frontend Requirements", "BD-17 Ring Invitations & Join Backend Delivery", "S-16 Ring Members Story", "S-31 Delegated Admins Story"]
related: ["ND-32 How a Ring's join code works", "F-17 Ring Invitations & Join", "D-04 Ring settings at launch and their defaults", "D-18 Ring names shown when joined knowingly", "D-31 An invitation is its own record", "BI-08 Rings Backend Integration", "S-29 Companies Story"]
created: 2026-11-08
updated: 2026-11-08
tags: [decision, decision/decided]
---

# ✅ D-32 · Several join codes per Ring

**Answers:** [[ND-32 How a Ring's join code works]] · **Decided by:** Omar Fostok · **On:** 2026-11-08 · **Feature:** [[F-17 Ring Invitations & Join]]

> This card is the answer to [[ND-32 How a Ring's join code works]]. The needs-decision card keeps the question, the facts and the options; this decision card says what was decided, why, and what it changes. `draft` while the answer is prepared; `decided` only by the PM or the owner, on the user's word, with `decidedBy` and `decidedAt`: then [[ND-32 How a Ring's join code works]] shows Fulfilled by itself and the cards it blocked continue.

## What was decided

**Option 2: several join codes per Ring**, managed by the owner under Edit Ring → *Joining* → **Join codes**.

- **Up to 10 active codes** per Ring at a time.
- **What a code is:** 8 characters, letters and digits without look-alikes (no 0/O, 1/I), shown grouped as **K7QM-4RXT**; the same form for every code.
- **Each code has:**
  - a **label**, required, up to 40 characters ("Onboarding week", "Speakers 2026"), seen only by the owner;
  - an optional **end date**, after which it stops working;
  - an optional **use limit**. One use is one person who joined or asked to join with it; when the limit is reached the code stops working.
- **Turn off** works per code: it stops at once and stays in the list as *Off*. **Make a new code** adds a code; nothing is replaced on its own.
- **A code that doesn't work** (wrong, off, ended or used up) gets **one neutral message**, never the reason and never a hint that a Ring exists. Tries are limited per person.
- **A code works only where `joinPolicy` allows it** (`ANYONE_WHO_SCANS` or `CODE_OR_INVITATION`, never `INVITATION_ONLY`, [[D-04 Ring settings at launch and their defaults]]).
  - With **approve each one** on (the default), a code makes a **join request** the owner approves on s15, and the request shows **which code was used** ("asked with *Onboarding week*").
  - With it off, the person joins after the review.
  - Either way they are recorded as **joined knowingly** and see the Ring's name ([[D-18 Ring names shown when joined knowingly]]).
- **Who manages the codes:** the owner, and later the Ring's admins at "can also manage who's in it" ([[S-31 Delegated Admins Story]]).

This rules out option 1, one code per Ring with *Make a new code* replacing it.

## Why

- **One Ring often serves several groups at once:** new hires, a cohort, the speakers at one event. A label per code tells the owner where each person came from, and turning one code off doesn't break the others.
- **An end date and a use limit** let a code be handed out widely (an email, a slide) without staying open forever.
- **What the person types stays the same** whatever the option: an 8-character code. So the member's side is as simple as option 1; the extra work is on the owner's side.
- **Traded away:** more to design and build than one code per Ring: a list of codes on Edit Ring and a sheet to add one, neither of which is drawn yet; on the backend, a table of codes with label, end date, use count and on/off.

## What it changes

- [[S-33 Ring Invitations & Join Story]] (`/pm`):
  - S3 *Join with a code*: the field takes the 8-character code, and every failure is one neutral message.
  - The owner side: the *Join codes* list (label, "12 of 20" uses, end date, on/off), *Make a new code* with label, end date and limit, *Turn off*, and a line saying people who join this way will see the Ring's name.
  - The join request shows the code's label.
- [[FR-17 Ring Invitations & Join Frontend Requirements]] (`/frontend`):
  - resolve a code to a reviewable Ring, then join or request;
  - the owner's codes list, create, turn off;
  - which code a request came with;
  - the neutral failure and the try limit.
- [[BD-17 Ring Invitations & Join Backend Delivery]] (`/backend`):
  - a join-code table per Ring (code, label, end date, use limit, uses, on/off, created by), up to 10 active;
  - generation without look-alikes;
  - resolve, join or request, enforced against `joinPolicy` and `requireApproval`;
  - a use counted per person;
  - a per-person try limit;
  - the code a request came with, recorded on it.
- [[S-16 Ring Members Story]] (`/pm`): the join requests on s15 ("Waiting on you · N") show which code each person used.
- [[S-31 Delegated Admins Story]] (`/pm`): managing join codes is part of "can also manage who's in it".

## Still open

- **The try limit's numbers** (how many wrong tries, for how long): `/backend` proposes them.
- **The owner side isn't drawn:** the *Join codes* list and the add sheet need a designer, or the app's own style until then.
- **Whether a code can be shared as a link or a QR** as well as typed: not part of this; [[S-37 Badge & QR Story]] if it's wanted.

## Log

- 2026-11-08 · flagged [[S-33 Ring Invitations & Join Story]]: ND-32 decided, option 2: several join codes per Ring (up to 10), label, end date, use limit, turn off per code, one neutral failure, the code shown on a join request
- 2026-11-08 · flagged [[FR-17 Ring Invitations & Join Frontend Requirements]]: the same
- 2026-11-08 · flagged [[BD-17 Ring Invitations & Join Backend Delivery]]: the same
- 2026-11-08 · flagged [[S-16 Ring Members Story]]: a join request on s15 shows which code was used
- 2026-11-08 · flagged [[S-31 Delegated Admins Story]]: managing join codes is part of "can also manage who's in it"
