---
id: ND-33
type: needs-decision
status: open
features: [ring-invitations]
blocks: ["S-33 Ring Invitations & Join Story"]
decider: "owner"
screens: [s74, s73, s26]
owner: "Omar Fostok"
affects: []
related: ["F-17 Ring Invitations & Join", "F-15 Companies", "S-29 Companies Story", "D-04 Ring settings at launch and their defaults", "D-18 Ring names shown when joined knowingly", "S-78 Code Delivery Story"]
created: 2026-11-08
updated: 2026-11-08
tags: [needs-decision, needs-decision/open]
---

# ✅ ND-33 · When a work email is checked

**Status:** open · **Decider:** owner · **Raised:** 2026-11-08 · **Needed by:** [[S-33 Ring Invitations & Join Story]] (S4) · **Feature:** [[F-17 Ring Invitations & Join]]

> The needs-decision card: `draft` while the question is written, `open` once it is ready for the decider; it shows **Fulfilled** by itself once its decision card (D-NN) is `decided`. The cards in `blocks` are **Blocked · ND-33** while this is `draft` or `open` and return to their own status once it is fulfilled. Nobody edits their `status:` for this, and nobody types `fulfilled` or `decided` here.

## What has to be decided

When the work address someone joins with is checked, and what happens to their place when it stops being true. Joining a company Ring with a verified work email (S4) proves the address once; the story has to say whether that proof is checked **only at the moment of joining**, or **again later** (on a schedule, or when the company changes its domain), and whether the person leaves the Ring when it no longer holds. It also has to say whether the address is kept, and where it shows.

## Notes

- **What exists:** nothing. `requiredEmailDomain` is not on the Ring; [[S-29 Companies Story|Companies · S12]] adds it as a company Ring setting, which must be the business's website domain, changed by the owner and admins.
- **Code delivery is not wired**: no email is sent anywhere yet, sign-in codes ride in `devCode` ([[S-78 Code Delivery Story|Code Delivery · S6–S8]]). A work-email code would wait on the same delivery, or need the same stand-in.
- [[S-29 Companies Story]] shows the verified address on Company detail ("Verified email noor@acme.co", S-33 S4) and stops counting it when the person leaves the company (P5).
- People change jobs without telling the app: an address checked only once keeps a former employee in the employees Ring until the owner removes them.
- A domain the company changes (acme.co → acme.com) would strand everyone who joined with the old one if the check were repeated.

## Options

1. **Checked once, at joining.** A six-digit code to the address, entered on s74, then the review and *Join Ring*. The address is kept on that membership only (shown on Company detail, never on the profile); it is never re-checked. Leaving the company is the person's choice or the owner's removal. Changing the Ring's domain affects only new joins.
2. **Checked at joining and again every 12 months.** A reminder before the year ends; an unconfirmed address ends the membership silently. Former employees drop out by themselves, at the cost of a yearly chore for every current one and a sudden loss of access for anyone who misses the email.

Recommendation: option 1 for the MVP. It needs no scheduler and nothing that can quietly remove a current employee; the owner and admins already remove people.

## Responsible

`decider` above: the owner (Omar Fostok). Hear `/backend` (the code sender is the one [[S-78 Code Delivery Story]] builds).

## Decision

Fulfilled by [[D-33 Work email joining waits for real emails and Companies]] — decided 2026-11-08 by Omar Fostok: not now; a new card settles once vs yearly when Code Delivery and the work-email domain exist
