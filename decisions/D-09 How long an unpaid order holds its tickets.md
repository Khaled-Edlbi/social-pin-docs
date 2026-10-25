---
type: decision
id: D-09
status: open
features: [pay-for-an-order]
blocks: ["Pay for an order Story"]
decider: "owner"
screens: [s50, s51]
affects: ["Pay for an order", "Events Before", "Payments & Orders"]
related: ["T-034 Tickets, packages, levels, sold-out", "Payments & Orders", "Events Before", "DR-08 Stripe card checkout only"]
decidedBy: ""
decidedAt: ""
owner: "khaled"
created: 2026-10-25
updated: 2026-10-25
tags: [decision, decision/open]
---

# ❓ D-09 · How long an unpaid order holds its tickets

**Status:** open · **Decider:** owner · **Raised:** 2026-10-25 · **Needed by:** [[Pay for an order Story]] · **Feature:** [[Pay for an order]] · **Module:** [[Payments Gateway Module]]

> The cards in `blocks` are **Blocked · D-09** while this is `open` and return to their own status on the build after it is `decided`. Nobody edits their `status:` for this.

## What has to be decided

Whether an order that is not paid yet (pending on Stripe, failed, or abandoned on the card page) keeps its chosen tickets, packages and sub-events out of the count that makes them sold out, and for how long. The [[Pay for an order Story]] cannot write S2's failed and abandoned state, nor the copy around "Try again", without it: decided as "no hold", a buyer who retries may find the ticket sold out; decided as a hold, the buyer is told how long the tickets are kept and stock is released when the hold ends. The answer also shapes the sold-out count of [[T-034 Tickets, packages, levels, sold-out]] on [[Screen Index#s50|s50]].

## Notes

- The product rules of [[Pay for an order]] say a failed or abandoned payment leaves the order unpaid and the buyer free to try again from s50; what happens to the chosen tickets meanwhile is not written anywhere.
- [[Payments & Orders Story]] S1 says a sold-out item at order time fails the whole order, and lists "whether cash and bank orders hold capacity while pending" as open; with card only ([[DR-08 Stripe card checkout only]]) the pending window is Stripe's confirmation, usually seconds, but an abandoned card page can stay open much longer.
- Stripe's hosted checkout sessions expire on their own (24 hours by default, 30 minutes at the shortest), which gives a natural end to a hold if one is chosen.
- A hold needs a release when it ends: a job or a check at read time; no job of this kind exists in the backend today.
- Sold-out is not built: [[T-034 Tickets, packages, levels, sold-out]] is to do and holds no capacity count yet.

## Options

1. **No hold** — tickets count as taken only once the order is paid. Simplest, no release job; a buyer who fails or abandons can lose the last ticket to someone faster, and two buyers can both reach Stripe for the last ticket (the second is refused or refunded at settlement).
2. **A short timed hold (recommended: 30 minutes, the shortest checkout Stripe allows)** — creating the order holds its tickets; the Stripe checkout expires with the hold; a failed payment keeps the hold until it ends, so "Try again" works; s51 shows "Your tickets are held for N minutes". Needs a release at expiry and a hold count in T-034's sold-out.
3. **Hold until the order is abandoned explicitly or Stripe's session expires** — the buyer keeps the tickets as long as the checkout lives (up to 24 hours). Fair to the buyer, but can lock out others for a sold-out event for a day.

PM's recommendation: option 2, the shortest hold that lets a failed card be retried without losing the seat.

## Responsible

`decider` above: the owner, before the [[Pay for an order Story]] is approved, after hearing from the backend what a release job costs next to [[T-034 Tickets, packages, levels, sold-out]].

## Decision

— (taken on its own card, never written here: the PM or the owner, on the user's word, runs `node scripts/build-tree.mjs --scaffold record D-09 "<the answer>"` and fills the record DR-NN (what was decided, why, what it changes with every feature and task in its `affects`, what stays open); then signs this card off: `status: decided`, `decidedBy`, `decidedAt` as on the record, the tag `decision/decided`, ✅ in the H1, and this line replaced by one that says when, by whom, which option, and links the record; then `--impact DR-NN` and flag the notes it lists)
