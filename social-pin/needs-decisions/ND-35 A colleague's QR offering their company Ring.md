---
id: ND-35
type: needs-decision
status: open
features: [ring-invitations]
blocks: ["S-33 Ring Invitations & Join Story"]
decider: "owner"
screens: [s34, s43, s44, s74]
owner: "Omar Fostok"
affects: []
related: ["F-17 Ring Invitations & Join", "F-18 Badge & QR", "S-37 Badge & QR Story", "D-11 The badge code stays the same for its day", "D-14 Shared with me lists people, never the Ring", "D-28 Scan someone in is not in the MVP", "S-29 Companies Story"]
created: 2026-11-08
updated: 2026-11-08
tags: [needs-decision, needs-decision/open]
---

# ✅ ND-35 · A colleague's QR offering their company Ring

**Status:** open · **Decider:** owner · **Raised:** 2026-11-08 · **Needed by:** [[S-33 Ring Invitations & Join Story]] (S9) · **Feature:** [[F-17 Ring Invitations & Join]]

> The needs-decision card: `draft` while the question is written, `open` once it is ready for the decider; it shows **Fulfilled** by itself once its decision card (D-NN) is `decided`. The cards in `blocks` are **Blocked · ND-35** while this is `draft` or `open` and return to their own status once it is fulfilled. Nobody edits their `status:` for this, and nobody types `fulfilled` or `decided` here.

## What has to be decided

Whether scanning a QR can offer to join a company Ring, and **which QR**. The design's s74 lists "a QR from a colleague" as a way in, and [[S-29 Companies Story|Companies · S1]] repeats it ("Invite code, work email or a QR from a colleague"). A personal badge resolves to the Ring the colleague chose to show ([[S-37 Badge & QR Story|Badge & QR · S13]]); if it also offered "join Acme Team", the scan would tell a stranger which company Ring the colleague is in, which no screen may do ([[D-14 Shared with me lists people, never the Ring]]). The story cannot draw S9 until this is decided.

## Notes

- **What exists:** nothing. The badge code (`RingQrToken`) is per Ring, rotates daily ([[D-11 The badge code stays the same for its day]]), and has no route yet ([[S-37 Badge & QR Story|Badge & QR · S13–S18]]); the app's reader is a timer that shows a sample card.
- A join offer must never be read from someone's memberships: only from a code issued **for joining**.
- Scanning someone **into** your own Ring is not in the MVP ([[D-28 Scan someone in is not in the MVP]]); this is the other direction, joining someone else's.
- A join QR is a join code in another form ([[ND-32 How a Ring's join code works]]): the same `joinPolicy` and "approve each one" apply.

## Options

1. **Not in the MVP.** s74 offers a code and a work email; "a QR from a colleague" is removed from s74 and s72 until later.
2. **The Ring's join QR, shown by the owner or an admin.** *Joining and permissions* shows the Ring's join code also as a QR ("Show to join"); scanning it with the app's scanner opens the s74 review for that Ring. A colleague's personal badge never offers a Ring.
3. **A member's badge carries a join offer** when the Ring lets members invite others: a second code the member chooses to show. Reveals that member's company Ring to whoever scans, by the member's choice.

Recommendation: option 2, once the join code (ND-32) is decided; option 1 if that slips past the MVP. It keeps "one scan at the desk" for a new hire without any badge saying which Ring its holder is in.

## Responsible

`decider` above: the owner (Omar Fostok). Hear `/backend` (one more code kind on the resolve route) and the designer (s74 and s72 copy).

## Decision

Fulfilled by [[D-35 A join code can be shown as a QR]] — decided 2026-11-08 by Omar Fostok: option 2
