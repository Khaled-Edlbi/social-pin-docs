---
id: ND-34
type: needs-decision
status: open
features: [ring-invitations]
blocks: ["S-33 Ring Invitations & Join Story"]
decider: "owner"
screens: [s74, s17, s73]
owner: "Omar Fostok"
affects: []
related: ["F-17 Ring Invitations & Join", "D-04 Ring settings at launch and their defaults", "D-05 Inherit per field, copy without members", "S-16 Ring Members Story", "S-29 Companies Story", "BI-08 Rings Backend Integration"]
created: 2026-11-08
updated: 2026-11-08
tags: [needs-decision, needs-decision/open]
---

# ❓ ND-34 · What a member contributes to a shared Ring

**Status:** open · **Decider:** owner · **Raised:** 2026-11-08 · **Needed by:** [[S-33 Ring Invitations & Join Story]] (S10, S11) · **Feature:** [[F-17 Ring Invitations & Join]]

> The needs-decision card: `draft` while the question is written, `open` once it is ready for the decider; it shows **Fulfilled** by itself once its decision card (D-NN) is `decided`. The cards in `blocks` are **Blocked · ND-34** while this is `draft` or `open` and return to their own status once it is fulfilled. Nobody edits their `status:` for this, and nobody types `fulfilled` or `decided` here.

## What has to be decided

What the other members of a Ring see of **me** when that Ring lets members see each other. Joining a company Ring (S10) should not expose my whole profile, and the members section of someone else's Ring (S11, [[S-16 Ring Members Story|Ring Members · S8]]) needs a card for each member. Today a person's card always belongs to **one of their own Rings**; a member has nothing inside someone else's Ring. The story cannot say what a member chooses after *Join Ring*, or what their colleagues see, until it is decided.

## Notes

- **What exists** (backend `main` @ `12172c6`): `membersCanSeeEachOther` on the Ring, default off, **enforced**: while off, no member-facing roster or count exists anywhere; `memberCount` on Shared with me is `null` unless the row has a `ringName` and the Ring has it on ([[BI-08 Rings Backend Integration]]). There is no member-facing roster route yet, on or off.
- With it on, members see each other's **full cards**, not just names ([[D-04 Ring settings at launch and their defaults]]); [[S-16 Ring Members Story]] reads "each member's card for that Ring" as the natural reading and leaves it open.
- A card is a Ring's projection: what the owner switched on for that Ring, following the main profile per field ([[D-05 Inherit per field, copy without members]]). A projection belongs to the Ring's owner; a member owns none in someone else's Ring.
- [[S-29 Companies Story]]: the colleagues on Company detail (s73) are the members who share with me, shown by name; a richer card there needs this answer.
- Default must be safe: joining shows nothing more of me than I already chose to show someone.

## Options

1. **I pick one of my own Rings to show there.** After *Join Ring*, "Your card in Acme Team": one of my Rings (default: my default Ring, the card a stranger who scans me already sees), changeable later from the Ring's card on s17. Colleagues see that Ring's card; the Ring stays unnamed to them. Nothing new to edit: one pointer per membership.
2. **A card made for that Ring.** Fields and links I switch on inside the owner's Ring, a member-side projection: precise, but a second editor for every Ring I join, and a new table.
3. **Nothing to choose.** Colleagues see my default Ring's card, always.

Recommendation: option 1. It reuses the cards people already curate, defaults to what is already public to a stranger, and lets someone show their "Work" card to a company without building anything new to edit.

## Responsible

`decider` above: the owner (Omar Fostok). Hear `/backend` (one field on the membership, and the member-facing read) and the designer (the step after *Join Ring* is not drawn).

## Decision

— (answered on its decision card, never written here: the PM or the owner, on the user's word, runs `node scripts/build-tree.mjs --scaffold decision ND-34 "<the answer>"`, fills the decision card D-NN and sets it `decided` with `decidedBy` and `decidedAt`; this card then shows Fulfilled by itself.)
