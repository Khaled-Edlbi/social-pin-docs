---
id: P-28
type: project
layer: business
depends: ["Project Overview"]
affects: ["F-32 Code Delivery", "F-35 Error Contract", "D-16 Files load from signed links that expire in 15 minutes", "F-18 Badge & QR", "F-14 Connections", "F-03 Counts", "S-14 Profiles & Pin Name Story", "S-18 Rings Story", "F-06 Photo Library", "F-13 Widgets", "F-17 Ring Invitations & Join", "F-15 Companies", "F-16 Delegated Admins", "F-33 Devices & NFC", "F-39 Notifications", "F-28 Subscription (Free vs Pro)", "F-37 Interests", "F-38 Linked Accounts (OAuth)", "F-05 Onboarding Imports"]
related: ["Project Overview", "Feature Tree", "ND-10 How Connect addresses the scanned person", "ND-12 What the badge QR encodes", "S-23 Connections Story"]
created: 2026-11-01
updated: 2026-11-01
tags: [project, layer/business]
---

# MVP Order

The owner's order for the MVP, as set on 2026-11-01.

## What the MVP is

The MVP is every feature set **critical · mvp** (`priority: critical`, `release: mvp` on the feature card), without Events, Discover, PinCast and Gemma. Those four areas are not in the MVP: the Events module ([[M-05 Events Module]]), [[F-19 Discover Hub & Search]], [[F-20 PinCast & Nearby]] and [[F-36 Gemma AI]]. No feature in them is set critical · mvp today.

## Backend order

The backend works through these steps in this order. A step that waits on a card does not start until that card is done.

| # | What | Cards | Waits on |
|---|---|---|---|
| 1 | Code Delivery and Error Contract | [[F-32 Code Delivery]], [[F-35 Error Contract]] | — |
| 2 | Signed links for photos and files | [[D-16 Files load from signed links that expire in 15 minutes]] | — |
| 3 | QR token: issue and resolve | [[F-18 Badge & QR]] | [[ND-12 What the badge QR encodes]] decided |
| 4 | Connections | [[F-14 Connections]] | [[S-23 Connections Story]] approved and [[ND-10 How Connect addresses the scanned person]] decided |
| 5 | Counts | [[F-03 Counts]] | — |
| 6 | Main profile fields | [[S-14 Profiles & Pin Name Story\|S-14 · S9–S11]] | — |
| 7 | Ring settings | [[S-18 Rings Story\|S-18 · S9]] | — |
| 8 | File lists and widget writes | [[F-06 Photo Library]], [[F-13 Widgets]] | — |
| 9 | Invitations and join, companies, admins | [[F-17 Ring Invitations & Join]], [[F-15 Companies]], [[F-16 Delegated Admins]] | — |
| 10 | Devices, notifications, subscription, interests, linked accounts, imports | [[F-33 Devices & NFC]], [[F-39 Notifications]], [[F-28 Subscription (Free vs Pro)]], [[F-37 Interests]], [[F-38 Linked Accounts (OAuth)]], [[F-05 Onboarding Imports]] | — |

## Where the waits stand today

- [[ND-12 What the badge QR encodes]] and [[ND-10 How Connect addresses the scanned person]] are **draft**. The owner decides both.
- [[S-23 Connections Story]] is **draft**, and it stays blocked until ND-10 is decided.
- [[S-14 Profiles & Pin Name Story]] is approved but shows **Blocked · ND-22** in the tree, until [[ND-22 Public web page by Pin name]] (open, owner decides) is decided.

## The MVP features outside the order

The other critical · mvp features have no backend step left in this order. Their backend reads *Done* on the card: [[F-01 Account]], [[F-02 Auth & Sign-up]], [[F-04 Files Upload]], [[F-08 Ring Access Engine]], [[F-09 Ring Members]], [[F-10 Ring Projection]], [[F-12 View As & Pin Views]]. [[F-07 Profiles & Pin Name]] and [[F-11 Rings]] read *Done* too, and their remaining parts are steps 6 and 7. [[F-29 App Shell & Onboarding Narrative]] is frontend only.

Related: [[Project Overview]] · [[Feature Tree]]
