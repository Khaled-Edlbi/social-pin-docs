---
id: D-34
type: decision
status: decided
features: [ring-invitations]
decision: ND-34
decidedBy: "Omar Fostok"
decidedAt: 2026-11-08
owner: "Omar Fostok"
affects: ["S-33 Ring Invitations & Join Story", "FR-17 Ring Invitations & Join Frontend Requirements", "BD-17 Ring Invitations & Join Backend Delivery", "S-16 Ring Members Story", "S-29 Companies Story"]
related: ["ND-34 What a member contributes to a shared Ring", "F-17 Ring Invitations & Join", "D-04 Ring settings at launch and their defaults", "D-05 Inherit per field, copy without members", "D-14 Shared with me lists people, never the Ring", "D-18 Ring names shown when joined knowingly", "D-31 An invitation is its own record", "D-32 Several join codes per Ring", "BI-08 Rings Backend Integration"]
created: 2026-11-08
updated: 2026-11-08
tags: [decision, decision/decided]
---

# ✅ D-34 · A member shows one of their own Rings

**Answers:** [[ND-34 What a member contributes to a shared Ring]] · **Decided by:** Omar Fostok · **On:** 2026-11-08 · **Feature:** [[F-17 Ring Invitations & Join]]

> This card is the answer to [[ND-34 What a member contributes to a shared Ring]]. The needs-decision card keeps the question, the facts and the options; this decision card says what was decided, why, and what it changes. `draft` while the answer is prepared; `decided` only by the PM or the owner, on the user's word, with `decidedBy` and `decidedAt`: then [[ND-34 What a member contributes to a shared Ring]] shows Fulfilled by itself and the cards it blocked continue.

## What was decided

**Option 1: the member picks one of their own Rings to show in a Ring they joined.**

- **After *Join Ring*,** one step: **"Your card in Acme Team"**, a choice among the member's own Rings, pre-set to their **default Ring** (the card a stranger who scans them already sees).
- **Changeable later** from that Ring's row on Shared with me (s17).
- **Colleagues see that Ring's card** (what the member switched on for it, as it is now) **only when the Ring lets members see each other** (`membersCanSeeEachOther`, off by default, [[D-04 Ring settings at launch and their defaults]]). While it's off, the choice is saved and nobody sees anything.
- **Never shown to colleagues:** the picked Ring's **name**, or that the member has other Rings.
- **If the picked Ring is deleted,** the card falls back to the member's **default Ring**, and they can pick again.
- **The choice ends with the membership** (leaving, removal, the Ring ending).
- **One pointer per membership:** no member-side editor and no new kind of card. The owner's projection of their own Ring is untouched.

This rules out option 2 (a card made for that Ring, a member-side editor) and option 3 (always the default Ring, nothing to choose).

## Why

- **It reuses the cards people already curate.** Someone shows their "Work" card to their company with one tap, instead of rebuilding it with switches for every Ring they join.
- **The default is safe:** the card already public to a stranger, so joining exposes nothing new.
- **It's small:** one field on the membership, one step after joining, one read for colleagues.
- **Traded away:** a member can't show a company something different from every one of their own Rings. If that's ever needed, a member-side card (option 2) can come later on top of this pointer.

## What it changes

- [[S-33 Ring Invitations & Join Story]] (`/pm`):
  - S10: after *Join Ring*, the "Your card in <Ring>" step with the default pre-set.
  - The Ring's row on Shared with me offers "Your card here: <Ring> ›" to change it.
  - S11: inside the Ring, colleagues' cards are each one's picked Ring, shown only when members may see each other.
  - The ND-34 line under *Open questions* points here.
- [[FR-17 Ring Invitations & Join Frontend Requirements]] (`/frontend`):
  - read and set the picked Ring on my membership in someone else's Ring;
  - the colleagues list with each card, only when `membersCanSeeEachOther` is on;
  - no Ring name or id of the picked Ring in what colleagues receive.
- [[BD-17 Ring Invitations & Join Backend Delivery]] (`/backend`):
  - a `shownRingId` (or similar) on the membership, which must be one of the member's own live Rings, falling back to their default when that Ring is deleted;
  - a member-facing read of colleagues' cards, gated by `membersCanSeeEachOther`, each rendered from the colleague's picked Ring through the access engine, without its name or id.
- [[S-16 Ring Members Story]] (`/pm`): S8, "each member's card for that Ring", is the member's picked Ring.
- [[S-29 Companies Story]] (`/pm`): colleagues on Company detail (s73) can open each one's card: the Ring they picked for that company Ring.

## Still open

- **The step after *Join Ring* isn't drawn:** a designer, or the app's own style until then.
- **A colleague who is also a connection** may see two cards (the one they share with me, and the one they show in the company Ring): the PM writes which one opens where in S-33 S11.

## Log

- 2026-11-08 · flagged [[S-33 Ring Invitations & Join Story]]: ND-34 decided, option 1: a member picks one of their own Rings as their card in a Ring they joined (default: their default Ring), changeable from Shared with me; colleagues see it only when members may see each other, never its name; falls back to the default if deleted; ends with the membership
- 2026-11-08 · flagged [[FR-17 Ring Invitations & Join Frontend Requirements]]: the same; read and set the picked Ring, the colleagues list when allowed
- 2026-11-08 · flagged [[BD-17 Ring Invitations & Join Backend Delivery]]: the same; a picked-Ring pointer on the membership and a member-facing read gated by membersCanSeeEachOther
- 2026-11-08 · flagged [[S-16 Ring Members Story]]: "each member's card for that Ring" is the member's picked Ring
- 2026-11-08 · flagged [[S-29 Companies Story]]: colleagues on s73 open each one's picked Ring
