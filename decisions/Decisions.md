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
| [[D-02 Base profile work fields]] | fulfilled (A, one main profile) | [[DR-02 One main profile every Ring starts from]] | [[Profiles & Pin Name]], [[Ring Projection]], [[Onboarding Imports]], [[Photo Library]] | s05, s06, s11, s23, s29 |
| [[D-03 Field library vs per-Ring copies]] | fulfilled (A, library, on/off per Ring) | [[DR-03 Links entered once, switched on or off per Ring]] | [[Ring Projection]], [[Widgets]] | s20, s24 |
| [[D-04 Ring settings]] | fulfilled (six at launch, private defaults) | [[DR-04 Ring settings at launch and their defaults]] | [[Rings]], [[Ring Members]], [[Ring Invitations & Join]], [[Delegated Admins]], [[Companies]], [[Ring Access Engine]] | s19, s22, s26, s27 |
| [[D-05 Copy or inherit]] | fulfilled (A, inherit per field, copy) | [[DR-05 Inherit per field, copy without members]] | [[Rings]], [[Ring Projection]], [[Photo Library]] | s18, s23, s28, s29 |
| [[D-06 Pin name rules]] | fulfilled (A, yearly rename) | [[DR-06 Yearly rename, old name freed, case-insensitive]] | [[Profiles & Pin Name]], [[Gemma AI]], [[Auth & Sign-up]] | s06 |
| [[D-07 Payment provider]] | fulfilled (1, Stripe for all four flows) | [[DR-07 Stripe for all four flows]] | [[Payments & Orders]], [[Subscription (Free vs Pro)]] | s51, s70 |
| [[D-10 How Connect addresses the scanned person]] | draft | — | [[Badge & QR]], [[Connections]] | s43, s44 |
| [[D-11 Get or rotate the badge token]] | draft | — | [[Badge & QR]] | s34 |
| [[D-12 What the badge QR encodes]] | draft | — | [[Badge & QR]] | s34, s43 |
| [[D-13 Whether the requester sees a declined request]] | fulfilled (3, shown as declined) | [[DR-13 The requester sees a declined request]] | [[Connections]] | s44, s45 |
| [[D-14 Connection-granted Ring on Shared with me]] | fulfilled (2, people, never the Ring) | [[DR-14 Shared with me lists people, never the Ring]] | [[Connections]], [[Rings]], [[Ring Members]] | s17, s46 |
| [[D-15 One Ring or several per connection]] | fulfilled (1, several; remove or disconnect) | [[DR-15 Several Rings per connection, remove or disconnect]] | [[Connections]], [[Ring Members]] | s15, s47 |
| [[D-16 Viewer access to file bytes]] | draft | — | [[Files Upload]] | s14, s29, s30, s31, s44 |
| [[D-17 Request expiry, note and asking again]] | fulfilled (1, 30 days, note, ask again) | [[DR-17 Requests expire after 30 days, optional note, ask again at once]] | [[Connections]] | s44, s45 |
| [[D-18 Company and invited Ring names shown to members]] | fulfilled (2, named when joined knowingly) | [[DR-18 Ring names shown when joined knowingly]] | [[Companies]], [[Ring Invitations & Join]], [[Rings]], [[Ring Members]] | s17, s72, s73, s74 |

```dataview
TABLE status, features FROM #decision
```
