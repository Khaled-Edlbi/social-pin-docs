---
id: ND-39
type: needs-decision
status: open
features: [companies]
blocks: ["S-29 Companies Story"]
decider: "owner"
screens: [s72, s73]
owner: "Omar Fostok"
affects: []
related: ["F-15 Companies", "FR-15 Companies Frontend Requirements", "BD-15 Companies Backend Delivery", "FD-15 Ring Invitations & Join Frontend Delivery"]
created: 2026-11-12
updated: 2026-11-12
tags: [needs-decision, needs-decision/open]
---

# ✅ ND-39 · Whether the company domain and the title switch show in the MVP

**Status:** open · **Decider:** owner · **Raised:** 2026-11-12 · **Needed by:** [[S-29 Companies Story]] (P4, P6) · **Feature:** [[F-15 Companies]]

> The needs-decision card: `draft` while the question is written, `open` once it is ready for the decider; it shows **Fulfilled** by itself once its decision card (D-NN) is `decided`. The cards in `blocks` are **Blocked · ND-39** while this is `draft` or `open` and return to their own status once it is fulfilled. Nobody edits their `status:` for this, and nobody types `fulfilled` or `decided` here.

## What has to be decided

Whether two company items the story hides in the MVP stay visible, as the app shows them:
- the company subtitle "Verified · {domain}" on Company detail ([[Screen Index#s73|s73]]);
- the switch "Let {company} update my title" on My companies ([[Screen Index#s72|s72]]).

[[S-29 Companies Story]] P6 shows the domain without the word *Verified* in the MVP. P4 hides the switch in the MVP. The app shows both.

## Notes

- **The app** (social_pin `rings/F-11/honest-rings` @ `dbef63e`, demo data, with no company Ring API) still shows both. [[FD-15 Ring Invitations & Join Frontend Delivery]] reported this on 2026-11-11.
- **P6's reason:** the MVP only checks that the domain matches the business's website, which proves nothing about who owns it.
- **P4's reason:** nothing yet lets a company keep a member's title current.

## Options

1. **Keep both visible in the MVP.** What they stand for starts right after the MVP. P4 and P6 change.
2. **Hide both, as P4 and P6 say.** The app changes.

## Responsible

`decider` above: the owner (Omar Fostok).

## Decision

Fulfilled by [[D-39 The company domain and the title switch show in the MVP]] — decided 2026-11-11 by Omar Fostok: option 1
