---
id: ND-27
type: needs-decision
status: open
features: [connections]
blocks: ["S-23 Connections Story"]
decider: "owner"
screens: [s45]
owner: "Omar Fostok"
affects: []
related: ["F-14 Connections", "D-13 The requester sees a declined request", "D-17 Requests expire after 30 days, optional note, ask again at once", "D-27 Sent keeps declined and expired requests for 30 days"]
created: 2026-11-04
updated: 2026-11-04
tags: [needs-decision, needs-decision/open]
---

# ✅ ND-27 · How long declined and expired requests stay on Sent

**Status:** open · **Decider:** owner · **Raised:** 2026-11-04 · **Needed by:** [[S-23 Connections Story]] (S4) · **Feature:** [[F-14 Connections]]

> The needs-decision card: `draft` while the question is written, `open` once it is ready for the decider; it shows **Fulfilled** by itself once its decision card (D-NN) is `decided`. The cards in `blocks` are **Blocked · ND-27** while this is `draft` or `open` and return to their own status once it is fulfilled. Nobody edits their `status:` for this, and nobody types `fulfilled` or `decided` here.

## What has to be decided

How long a declined or an expired request stays on my Sent list ([[S-23 Connections Story|Connections · S4]]), and whether the receiver is reminded before a request expires. [[D-17 Requests expire after 30 days, optional note, ask again at once]] left both in its *Still open*.

## Notes

- The requester sees a decline ([[D-13 The requester sees a declined request]]) and may ask again at once ([[D-17 Requests expire after 30 days, optional note, ask again at once]]).
- A pending request expires after 30 days.

## Options

1. **30 days**, no reminder before a request expires.
2. **7 days**, no reminder.
3. **Until I remove it**, no reminder.

Recommendation: option 1. It matches the 30-day expiry, and a reminder needs notifications, which come later.

## Responsible

`decider` above: the owner.

## Decision

Fulfilled by [[D-27 Sent keeps declined and expired requests for 30 days]] — decided 2026-11-04 by Omar Fostok: option 1.
