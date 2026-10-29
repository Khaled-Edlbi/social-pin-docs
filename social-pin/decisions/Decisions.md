---
type: map
updated: 2026-10-28
tags: [map]
---

# Decisions

Where the design and the backend disagree, and every other decision a card needs before it can continue. A **needs-decision card** is created from the card that needs it (`node scripts/build-tree.mjs --scaffold needs-decision "<card>" "<title>"`); its `blocks:` names that card, which shows **Blocked · ND-NN** until it is `decided` ([[Agent Rules#4 · Statuses, blocking and sign-off]]). Each needs a decision before the related tasks can be built without rework. Two cards per decision: the needs-decision card `ND-NN` (on the page `ND-NN · NEEDS DECISION`) holds the question (problem, facts, options, recommendation), is `draft` while it is written and `open` once it is ready for the decider, and shows **Fulfilled** by itself once its answer is decided; the **decision card** `D-NN` (`D-NN · DECISION`) holds the answer (what was decided, why, what it changes, what stays open), is written with `node scripts/build-tree.mjs --scaffold decision ND-NN "<the answer>"` (`draft`) and set `decided` by the PM or the owner on the user's word, and hangs under its needs-decision card in the tree.

| Needs decision (ND-NN) | Status | Decision (D-NN) | Affects | Screens |
|---|---|---|---|---|
| [[ND-01 Passwordless login]] | fulfilled (A, code-only) | [[D-01 Code-only login]] | [[F-02 Auth & Sign-up]], [[F-38 Linked Accounts (OAuth)]] | s01, s02 |
| [[ND-02 Base profile work fields]] | fulfilled (A, one main profile) | [[D-02 One main profile every Ring starts from]] | [[F-07 Profiles & Pin Name]], [[F-10 Ring Projection]], [[F-05 Onboarding Imports]], [[F-06 Photo Library]] | s05, s06, s11, s23, s29 |
| [[ND-03 Field library vs per-Ring copies]] | fulfilled (A, library, on/off per Ring) | [[D-03 Links entered once, switched on or off per Ring]] | [[F-10 Ring Projection]], [[F-13 Widgets]] | s20, s24 |
| [[ND-04 Ring settings]] | fulfilled (six at launch, private defaults) | [[D-04 Ring settings at launch and their defaults]] | [[F-11 Rings]], [[F-09 Ring Members]], [[F-17 Ring Invitations & Join]], [[F-16 Delegated Admins]], [[F-15 Companies]], [[F-08 Ring Access Engine]] | s19, s22, s26, s27 |
| [[ND-05 Copy or inherit]] | fulfilled (A, inherit per field, copy) | [[D-05 Inherit per field, copy without members]] | [[F-11 Rings]], [[F-10 Ring Projection]], [[F-06 Photo Library]] | s18, s23, s28, s29 |
| [[ND-06 Pin name rules]] | fulfilled (A, yearly rename) | [[D-06 Yearly rename, old name freed, case-insensitive]] | [[F-07 Profiles & Pin Name]], [[F-36 Gemma AI]], [[F-02 Auth & Sign-up]] | s06 |
| [[ND-07 Payment provider]] | fulfilled (1, Stripe for all four flows) | [[D-07 Stripe for all four flows]] | [[F-27 Payments & Orders]], [[F-28 Subscription (Free vs Pro)]] | s51, s70 |
| [[ND-10 How Connect addresses the scanned person]] | draft | — | [[F-18 Badge & QR]], [[F-14 Connections]] | s43, s44 |
| [[ND-11 Get or rotate the badge token]] | draft | — | [[F-18 Badge & QR]] | s34 |
| [[ND-12 What the badge QR encodes]] | draft | — | [[F-18 Badge & QR]] | s34, s43 |
| [[ND-13 Whether the requester sees a declined request]] | fulfilled (3, shown as declined) | [[D-13 The requester sees a declined request]] | [[F-14 Connections]] | s44, s45 |
| [[ND-14 Connection-granted Ring on Shared with me]] | fulfilled (2, people, never the Ring) | [[D-14 Shared with me lists people, never the Ring]] | [[F-14 Connections]], [[F-11 Rings]], [[F-09 Ring Members]] | s17, s46 |
| [[ND-15 One Ring or several per connection]] | fulfilled (1, several; remove or disconnect) | [[D-15 Several Rings per connection, remove or disconnect]] | [[F-14 Connections]], [[F-09 Ring Members]] | s15, s47 |
| [[ND-16 Viewer access to file bytes]] | draft | — | [[F-04 Files Upload]] | s14, s29, s30, s31, s44 |
| [[ND-17 Request expiry, note and asking again]] | fulfilled (1, 30 days, note, ask again) | [[D-17 Requests expire after 30 days, optional note, ask again at once]] | [[F-14 Connections]] | s44, s45 |
| [[ND-18 Company and invited Ring names shown to members]] | fulfilled (2, named when joined knowingly) | [[D-18 Ring names shown when joined knowingly]] | [[F-15 Companies]], [[F-17 Ring Invitations & Join]], [[F-11 Rings]], [[F-09 Ring Members]] | s17, s72, s73, s74 |
| [[ND-19 Where a ticket's layer notes live]] | fulfilled (1, the parent task) | [[D-19 A ticket's layer notes live on the parent task]] | [[F-35 Error Contract]] | — |
| [[ND-20 Whether an unverified new address may sign in]] | fulfilled (2, it signs in, the words are corrected) | [[D-20 The changed address still signs in, the words are corrected]] | [[F-01 Account]] | s68 |
| [[ND-21 How a business card and a portfolio page are read]] | open | — | [[F-05 Onboarding Imports]] | s03a, s03b |
| [[ND-22 Public web page by Pin name]] | open | — | [[F-07 Profiles & Pin Name]] | s06, s44 |
| [[ND-23 Mutual connections and events in common]] | open | — | [[F-14 Connections]] | s47 |

```dataview
TABLE status, features FROM #needs-decision
```
