---
type: decision-record
id: DR-09
decision: D-09
status: decided
decidedBy: "khaled"
decidedAt: 2026-10-25
features: [pay-for-an-order]
affects: ["Pay for an order", "Payments & Orders", "Events Before", "T-034 Tickets, packages, levels, sold-out"]
related: ["D-09 How long an unpaid order holds its tickets", "DR-08 Stripe card checkout only", "Pay for an order Story"]
owner: "khaled"
created: 2026-10-25
updated: 2026-10-25
tags: [decision-record, decision-record/decided]
---

# ⚖️ DR-09 · 30-minute hold tied to the Stripe checkout

**Answers:** [[D-09 How long an unpaid order holds its tickets]] · **Decided by:** khaled · **On:** 2026-10-25 · **Feature:** [[Pay for an order]]

> This card is the answer to [[D-09 How long an unpaid order holds its tickets]]. The needs-decision card keeps the question, the facts and the options; this decision card says what was decided, why, and what it changes. It is written when the decision is taken, by the PM or the owner on the user's word, never before; the needs-decision card is `decided` once this card exists.

## What was decided

**Option 2 on D-09: a 30-minute hold tied to the Stripe checkout.** Creating an order on [[Screen Index#s50|s50]] holds its tickets, packages and sub-events against sold-out for 30 minutes. The Stripe checkout opened for that order on [[Screen Index#s51|s51]] expires at the same moment, 30 minutes being the shortest lifetime Stripe allows. A failed payment keeps the hold until it ends, so "Try again" works on the same order; when the hold ends unpaid, the order is abandoned and its items count as free again. Option 1 (no hold) and option 3 (a hold for the checkout's full life, up to 24 hours) are ruled out.

## Why

- A declined card is the common failure; with no hold, a buyer retrying could lose the last ticket to someone faster, which the product rules of [[Pay for an order]] do not allow for a retry.
- 30 minutes is the shortest window Stripe's hosted checkout supports ([[DR-08 Stripe card checkout only]]), so the hold and the checkout end together: there is never a checkout that can still be paid for an order whose tickets were released.
- A 24-hour hold would lock out other buyers of a sold-out event for a day.
- Traded away: a release has to run when the hold ends (a job or a check at read time), and the sold-out count of [[T-034 Tickets, packages, levels, sold-out]] counts held items as taken.

## What it changes

- [[Pay for an order]]: no longer has D-09 open; its story ([[Pay for an order Story]]) is no longer Blocked · D-09. S2's failed state can say "Your tickets are held for N minutes" and "Try again" reuses the same order until the hold ends; flagged on the story.
- [[Payments & Orders]]: an order carries a hold that ends 30 minutes after it is created; an abandoned order is one whose hold ended unpaid. Its story's open question on holding is answered: flagged.
- [[Events Before]]: s50 counts held items as taken when it shows remaining capacity and "Sold out".
- [[T-034 Tickets, packages, levels, sold-out]]: capacity minus paid and held items; the release when a hold ends belongs to the gateway's first task, not to T-034.

## Still open

Whether the buyer can extend a hold (a new checkout on the same order before it ends), and what the organizer sees of held items, on a new needs-decision card when a card needs it.
