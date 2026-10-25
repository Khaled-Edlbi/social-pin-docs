---
type: map
updated: 2026-10-25
tags: [map]
---

# Decisions

Where the design and the backend disagree, and every other decision a card needs before it can continue. A **needs-decision card** is created from the card that needs it (`node scripts/build-tree.mjs --scaffold decision "<card>" "<title>"`); its `blocks:` names that card, which shows **Blocked · D-NN** until it is `decided` ([[Agent Rules#4 · Statuses, blocking and sign-off]]). Each needs a decision before the related tasks can be built without rework. Two cards per decision: the needs-decision card `D-NN` (on the page `D-NN · NEEDS DECISION`) holds the question (problem, facts, options, recommendation), is `draft` while it is written and `open` once it is ready for the decider, and shows **Fulfilled** by itself once its answer is decided; the **decision card** `DR-NN` (`DR-NN · DECISION`) holds the answer (what was decided, why, what it changes, what stays open), is written with `node scripts/build-tree.mjs --scaffold record D-NN "<the answer>"` (`draft`) and set `decided` by the PM or the owner on the user's word, and hangs under its needs-decision card in the tree.

| Needs decision (D-NN) | Status | Decision (DR-NN) | Affects | Screens |
|---|---|---|---|---|
| [[D-01 Passwordless login]] | fulfilled (A, code-only) | [[DR-01 Code-only login]] | [[Auth & Sign-up]], [[Linked Accounts (OAuth)]] | s01, s02 |
| [[D-02 Base profile work fields]] | open | — | [[Profiles & Pin Name]], [[Ring Projection]], [[Onboarding Imports]], [[Photo Library]] | s05, s06, s11, s23, s29 |
| [[D-03 Field library vs per-Ring copies]] | open | — | [[Ring Projection]], [[Widgets]] | s20, s24 |
| [[D-04 Ring settings]] | open | — | [[Rings]], [[Ring Members]], [[Ring Invitations & Join]], [[Delegated Admins]], [[Companies]] | s19, s22, s26, s27 |
| [[D-05 Copy or inherit]] | open | — | [[Rings]], [[Ring Projection]], [[Photo Library]] | s18, s23, s28, s29 |
| [[D-06 Pin name rules]] | open | — | [[Profiles & Pin Name]], [[Gemma AI]] | s06 |
| [[D-07 Payment provider]] | fulfilled (1, Stripe for all four flows) | [[DR-07 Stripe for all four flows]] | [[Payments Gateway Module]], [[Payments & Orders]], [[Subscription (Free vs Pro)]] | s51, s70 |
| [[D-08 Payment methods and gateways on s51]] | fulfilled (1, Stripe card checkout only) | [[DR-08 Stripe card checkout only]] | [[Pay for an order]], [[Payments & Orders]], [[Events Before]], [[Payments Gateway Module]] | s51 |
| [[D-09 How long an unpaid order holds its tickets]] | fulfilled (2, 30-minute hold tied to the Stripe checkout) | [[DR-09 30-minute hold tied to the Stripe checkout]] | [[Pay for an order]], [[Events Before]], [[Payments & Orders]] | s50, s51 |

```dataview
TABLE status, features FROM #decision
```
