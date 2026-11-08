---
id: ND-31
type: needs-decision
status: open
features: [ring-invitations]
blocks: ["S-33 Ring Invitations & Join Story"]
decider: "owner"
screens: [s15, s17, s72, s74]
owner: "Omar Fostok"
affects: []
related: ["F-17 Ring Invitations & Join", "D-04 Ring settings at launch and their defaults", "D-18 Ring names shown when joined knowingly", "S-16 Ring Members Story", "S-29 Companies Story", "BD-09 Ring Members Backend Delivery"]
created: 2026-11-08
updated: 2026-11-08
tags: [needs-decision, needs-decision/open]
---

# ❓ ND-31 · What an invitation is

**Status:** open · **Decider:** owner · **Raised:** 2026-11-08 · **Needed by:** [[S-33 Ring Invitations & Join Story]] (S2, S6) · **Feature:** [[F-17 Ring Invitations & Join]]

> The needs-decision card: `draft` while the question is written, `open` once it is ready for the decider; it shows **Fulfilled** by itself once its decision card (D-NN) is `decided`. The cards in `blocks` are **Blocked · ND-31** while this is `draft` or `open` and return to their own status once it is fulfilled. Nobody edits their `status:` for this, and nobody types `fulfilled` or `decided` here.

## What has to be decided

What an invitation into a Ring is, and what it carries. The story needs it to say who can send one, who receives it, what the invitee sees before accepting (S2), when it stops being valid, and what the owner sees of the invitations they sent (S6). Decided one way, an invitation is a **membership waiting to be accepted**; the other way, it is **its own record** that becomes a membership when accepted. Each answer changes what the backend builds and how an invitation to a Ring that ended reads.

## Notes

- **What exists** (backend `main` @ `12172c6`): a membership (`RingMember`) has `status` `ACTIVE | REMOVED` (`EXPIRED` is never written), `startsAt`, `expiresAt`, `addedById`; it does **not** record how it was made, which is what lets a member see the Ring's name ([[D-18 Ring names shown when joined knowingly]]; `ringName` on Shared with me is `null` until then).
- The Ring settings exist: `joinPolicy` (default `CODE_OR_INVITATION`) and `membersCanInvite` (default off) are **saved but not enforced** until invitations ship ([[D-04 Ring settings at launch and their defaults]], [[BI-08 Rings Backend Integration]]).
- **Who may invite:** the owner; an admin at "can also manage who's in it" ([[S-31 Delegated Admins Story|Delegated Admins · A4]]); a member only when the Ring's "members can invite others" is on.
- **Who can be invited:** a connection (the only in-app source of another person's id, [[S-23 Connections Story|Connections · S5–S7]]) or anyone by Pin name; inviting by email address is not in the design.
- A member row shows on every roster read and answers the members routes; an invitation must never count as a member, open the Ring's card, or show on Shared with me as a person ([[S-16 Ring Members Story]]).
- [[S-29 Companies Story]] needs invitations to a company Ring **by company** on s72, and `valid: false` on one whose Ring ended (FR-15).

## Options

1. **Its own record** (`RingInvitation`: Ring, invitee, inviter, optional access window, `status` `PENDING | ACCEPTED | DECLINED | WITHDRAWN`, `createdAt`). Accepting creates the membership, recorded as **joined knowingly**, in one step. The roster, counts and Shared with me never see a pending invitation; the owner lists, withdraws and re-sends them; an invitation to a Ring that ended answers "no longer valid". Expires after 30 days, as connection requests do ([[D-17 Requests expire after 30 days, optional note, ask again at once]]).
2. **A membership in an `INVITED` state.** One table, but every read that lists or counts members (roster, `memberCount`, the access engine, Shared with me) must skip `INVITED` rows, and a decline has to delete or mark a membership the person never had.

Recommendation: option 1. An invitation is not access, so it should not live where access is computed; it also gives the owner a clean "Invited · N" list and makes "joined knowingly" a fact the accept writes.

## Responsible

`decider` above: the owner (Omar Fostok), before [[FR-17 Ring Invitations & Join Frontend Requirements]] is written. Hear `/backend` on the table and the accept transaction.

## Decision

— (answered on its decision card, never written here: the PM or the owner, on the user's word, runs `node scripts/build-tree.mjs --scaffold decision ND-31 "<the answer>"`, fills the decision card D-NN and sets it `decided` with `decidedBy` and `decidedAt`; this card then shows Fulfilled by itself.)
