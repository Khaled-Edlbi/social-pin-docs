---
type: map
updated: 2026-11-08
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
| [[ND-10 How Connect addresses the scanned person]] | fulfilled (3, sends what the requester already has) | [[D-10 Connect sends what the requester already has]] | [[F-18 Badge & QR]], [[F-14 Connections]] | s43, s44 |
| [[ND-11 Get or rotate the badge token]] | fulfilled (2, same code for its day, reset on request) | [[D-11 The badge code stays the same for its day]] | [[F-18 Badge & QR]] | s34 |
| [[ND-12 What the badge QR encodes]] | fulfilled (1, a socialpin.me link) | [[D-12 The badge QR is a socialpin.me link]] | [[F-18 Badge & QR]] | s34, s43 |
| [[ND-13 Whether the requester sees a declined request]] | fulfilled (3, shown as declined) | [[D-13 The requester sees a declined request]] | [[F-14 Connections]] | s44, s45 |
| [[ND-14 Connection-granted Ring on Shared with me]] | fulfilled (2, people, never the Ring) | [[D-14 Shared with me lists people, never the Ring]] | [[F-14 Connections]], [[F-11 Rings]], [[F-09 Ring Members]] | s17, s46 |
| [[ND-15 One Ring or several per connection]] | fulfilled (1, several; remove or disconnect) | [[D-15 Several Rings per connection, remove or disconnect]] | [[F-14 Connections]], [[F-09 Ring Members]] | s15, s47 |
| [[ND-16 Viewer access to file bytes]] | fulfilled (3, signed links, 15 minutes) | [[D-16 Files load from signed links that expire in 15 minutes]] | [[F-04 Files Upload]], [[F-06 Photo Library]], [[F-10 Ring Projection]], [[F-12 View As & Pin Views]] | s14, s29, s30, s31, s44 |
| [[ND-17 Request expiry, note and asking again]] | fulfilled (1, 30 days, note, ask again) | [[D-17 Requests expire after 30 days, optional note, ask again at once]] | [[F-14 Connections]] | s44, s45 |
| [[ND-18 Company and invited Ring names shown to members]] | fulfilled (2, named when joined knowingly) | [[D-18 Ring names shown when joined knowingly]] | [[F-15 Companies]], [[F-17 Ring Invitations & Join]], [[F-11 Rings]], [[F-09 Ring Members]] | s17, s72, s73, s74 |
| [[ND-19 Where a ticket's layer notes live]] | fulfilled (1, the parent task) | [[D-19 A ticket's layer notes live on the parent task]] | [[F-35 Error Contract]] | — |
| [[ND-20 Whether an unverified new address may sign in]] | fulfilled (2, it signs in, the words are corrected) | [[D-20 The changed address still signs in, the words are corrected]] | [[F-01 Account]] | s68 |
| [[ND-21 How a business card and a portfolio page are read]] | open | — | [[F-05 Onboarding Imports]] | s03a, s03b |
| [[ND-22 Public web page by Pin name]] | fulfilled (2, the page only says the Pin exists; D-06 kept) | [[D-22 The public page only says the Pin exists]] | [[F-07 Profiles & Pin Name]] | s06, s44 |
| [[ND-23 Mutual connections and events in common]] | fulfilled (2 and 2, a count only, events where both were visible) | [[D-23 A count of mutual connections, events where both were visible]] | [[F-14 Connections]] | s47 |
| [[ND-24 Both people ask each other]] | fulfilled (1, one pending request per pair) | [[D-24 One pending request per pair]] | [[F-14 Connections]] | s44, s45, s46 |
| [[ND-25 What deleting an account does to its connections]] | fulfilled (1, all end silently) | [[D-25 A deleted account's connections, requests and blocks end silently]] | [[F-14 Connections]] | s17, s45, s47, s68 |
| [[ND-26 Whether a disconnect is announced]] | fulfilled (1, not told) | [[D-26 A disconnect is not announced]] | [[F-14 Connections]] | s47 |
| [[ND-27 How long declined and expired requests stay on Sent]] | fulfilled (1, 30 days, no reminder) | [[D-27 Sent keeps declined and expired requests for 30 days]] | [[F-14 Connections]] | s45 |
| [[ND-28 Scanning someone straight into a Ring]] | fulfilled (1, not in the MVP) | [[D-28 Scan someone in is not in the MVP]] | [[F-14 Connections]] | s15 |
| [[ND-29 Connection detail for a member who is not a connection]] | fulfilled (1, s47 opens them) | [[D-29 Connection detail opens a member who is not a connection]] | [[F-14 Connections]] | s15, s47 |
| [[ND-31 What an invitation is]] | fulfilled (1, its own record) | [[D-31 An invitation is its own record]] | [[F-17 Ring Invitations & Join]] | s15, s17, s72, s74 |
| [[ND-32 How a Ring's join code works]] | fulfilled (2, several labelled codes) | [[D-32 Several join codes per Ring]] | [[F-17 Ring Invitations & Join]] | s26, s72, s74 |
| [[ND-33 When a work email is checked]] | fulfilled (not now, waits for real emails and the domain) | [[D-33 Work email joining waits for real emails and Companies]] | [[F-17 Ring Invitations & Join]], [[F-15 Companies]] | s26, s73, s74 |
| [[ND-34 What a member contributes to a shared Ring]] | fulfilled (1, one of my own Rings) | [[D-34 A member shows one of their own Rings]] | [[F-17 Ring Invitations & Join]], [[F-09 Ring Members]] | s17, s73, s74 |
| [[ND-35 A colleague's QR offering their company Ring]] | fulfilled (2, a join code shown as a QR) | [[D-35 A join code can be shown as a QR]] | [[F-17 Ring Invitations & Join]], [[F-18 Badge & QR]] | s34, s43, s44, s74 |
| [[ND-36 Whether an invitee sees who a Ring is for]] | fulfilled (1, owner-only as built) | [[D-36 Who it's for stays the owner's alone]] | [[F-17 Ring Invitations & Join]], [[F-11 Rings]] | s22, s72, s74 |

```dataview
TABLE status, features FROM #needs-decision
```
