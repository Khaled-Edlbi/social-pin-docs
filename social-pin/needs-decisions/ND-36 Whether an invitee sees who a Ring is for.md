---
id: ND-36
type: needs-decision
status: open
features: [ring-invitations]
blocks: ["S-33 Ring Invitations & Join Story"]
decider: "owner"
screens: [s74, s72, s22]
owner: "Omar Fostok"
affects: []
related: ["F-17 Ring Invitations & Join", "BI-08 Rings Backend Integration", "D-04 Ring settings at launch and their defaults", "D-18 Ring names shown when joined knowingly", "S-18 Rings Story", "S-29 Companies Story"]
created: 2026-11-08
updated: 2026-11-08
tags: [needs-decision, needs-decision/open]
---

# ❓ ND-36 · Whether an invitee sees who a Ring is for

**Status:** open · **Decider:** owner · **Raised:** 2026-11-08 · **Needed by:** [[S-33 Ring Invitations & Join Story]] (S2) · **Feature:** [[F-17 Ring Invitations & Join]]

> The needs-decision card: `draft` while the question is written, `open` once it is ready for the decider; it shows **Fulfilled** by itself once its decision card (D-NN) is `decided`. The cards in `blocks` are **Blocked · ND-36** while this is `draft` or `open` and return to their own status once it is fulfilled. Nobody edits their `status:` for this, and nobody types `fulfilled` or `decided` here.

## What has to be decided

Whether the Ring's "who it's for" line (`purpose`) may be shown to someone reviewing an invitation, or joining with a code or a work email. The old S-33 said yes ("shows the Ring's name, and its 'who it's for' label if the owner wrote one"); the backend and the app say it is **the owner's alone**. The story cannot say what the review screen (s74) shows until one of them gives way.

## Notes

- **What exists** (backend `main` @ `12172c6`): `purpose`, 1–140 characters or `null`, is "an **owner-only label, never shown to a member**" ([[BI-08 Rings Backend Integration]]); the app's Edit Ring says "**Only you see this.** My Rings shows it under the Ring's name."
- [[D-18 Ring names shown when joined knowingly]] names the **Ring** to someone who joins knowingly; it says nothing about the purpose. The old S-33 called the purpose "D-18's natural reading", but that was written before the setting existed with its owner-only copy.
- Owners write purposes for themselves: "People who hire or brief me. Sees work identity only." ([[S-18 Rings Story|Rings · S5]]). Showing that to the people in the Ring would expose how the owner sorts them.
- [[S-29 Companies Story]] wants the invitation on s72 to say what the Ring is for ("Company Ring · brand kit, directory, support line").

## Options

1. **Owner-only, as built.** s74 shows the Ring's name, the owner and who invited me; no purpose. A company that wants to explain the Ring writes it in the Ring's **bio**, which the invitee sees once they join (and on the review, if the review shows the card).
2. **A separate, public line for invitations.** A new optional setting, "What people see when invited" (≤ 140), shown on s74 and s72; `purpose` stays private. One more field on Edit Ring.
3. **Show `purpose` to invitees.** Changes the copy on Edit Ring ("People you invite see this") and the backend's rule; every purpose written so far becomes visible.

Recommendation: option 1. It keeps the promise the app already makes on Edit Ring, and the Ring's bio already exists for what the members should read.

## Responsible

`decider` above: the owner (Omar Fostok). Hear `/backend` only if option 2 or 3 is chosen.

## Decision

— (answered on its decision card, never written here: the PM or the owner, on the user's word, runs `node scripts/build-tree.mjs --scaffold decision ND-36 "<the answer>"`, fills the decision card D-NN and sets it `decided` with `decidedBy` and `decidedAt`; this card then shows Fulfilled by itself.)
