---
type: needs-decision
id: ND-22
status: open
features: [profiles]
blocks: ["S-14 Profiles & Pin Name Story"]
decider: "owner"
screens: [s06, s44]
affects: []
related: ["F-07 Profiles & Pin Name", "F-18 Badge & QR", "F-12 View As & Pin Views", "ND-12 What the badge QR encodes", "D-06 Yearly rename, old name freed, case-insensitive", "S-19 View As & Pin Views Story"]
owner: "Omar Fostok"
created: 2026-10-29
updated: 2026-10-29
tags: [needs-decision, needs-decision/open]
---

# ❓ ND-22 · Public web page by Pin name

**Status:** open · **Decider:** owner · **Raised:** 2026-10-29 · **Needed by:** [[S-14 Profiles & Pin Name Story]] (S1, the "socialpin.me/<handle>" line) · **Feature:** [[F-07 Profiles & Pin Name]]

> The needs-decision card: `draft` while the question is written, `open` once it is ready for the decider; it shows **Fulfilled** by itself once its decision card (D-NN) is `decided`. The cards in `blocks` are **Blocked · ND-22** while this is `draft` or `open` and return to their own status once it is fulfilled. Nobody edits their `status:` for this, and nobody types `fulfilled` or `decided` here.

## What has to be decided

Whether `socialpin.me/<pinName>` is a real public web page, and if so what it shows and how it behaves. s06 (Claim your Pin) shows "Available — socialpin.me/<handle>", and the design review of 2026-10-29 chose to keep that line and build the page ([[S-14 Profiles & Pin Name Story]] S1). Until this is decided the line is shown as text, not as a link, and nothing answers at the address. Only the part that opens the page waits on this; the rest of S-14 does not.

## Notes

- **A browser visitor is in none of the owner's Rings.** Today's rule is "anyone who looks you up gets the Ring they are in, or nothing" (`GET /views/pin/:pinName`, [[S-19 View As & Pin Views Story]]); s08 tells a new user "Right now everyone who scans you sees your Public Ring". A web page needs its own answer to who it shows.
- **Pin names are given away on rename.** [[D-06 Yearly rename, old name freed, case-insensitive]] frees the old name for anyone at once, with no redirect. A printed or shared `socialpin.me/<old name>` may later lead to a stranger who claimed it.
- **This is not [[ND-12 What the badge QR encodes]].** ND-12 decides what the badge QR carries: a link with a secret, rotating token (`…/q/<token>`), never the Pin name. This page is looked up **by name**. Both need a domain the product controls and app links on both platforms, so they should share the set-up.
- **Nothing exists today:** no web page, no domain set up, no app links; a web page is outside the app and the API as they are.

## Options

1. **A page that shows the Public Ring**: the name, the Pin name and whatever the Public Ring shows, with "Open in Social Pin" (or "Get the app"). Old names stop answering at the rename, as D-06 says.
2. **A page that only says the Pin exists**: the name and the Pin name, nothing from any Ring, and "Open in Social Pin" to see more; seeing anything takes the app.
3. **No page**: the address only opens the app when it's installed (app links), and otherwise shows a store link; s06 keeps the line as text.

Also to settle, whichever option:
- **After a rename**: keep D-06 (the old name answers for its new holder at once), hold the old name for a period, or show "this Pin was renamed" for a while.
- **Who builds it**: which layer owns a web page, and on which domain.

Recommendation (PM): option 2 for v1. It makes the address real and shareable, reveals nothing a Ring hasn't been chosen to show, and keeps the rename risk small (a stranger's page shows only their own name). It shares the domain and app links with ND-12 option 1.

## Responsible

`decider` above: the owner, before S-14 S1's link is built, after hearing from the backend (what a public look-up by name may return, the domain) and the frontend (app links, how the app opens the address).

## Decision

— (answered on its decision card, never written here: the PM or the owner, on the user's word, runs `node scripts/build-tree.mjs --scaffold decision ND-22 "<the answer>"`, fills the decision card D-NN (what was decided, why, what it changes with every feature and card in its `affects`, what stays open) and sets it `decided` with `decidedBy` and `decidedAt`; this card then shows Fulfilled by itself; the H1 gets ✅, and this line is replaced by "Fulfilled by" and a wikilink to the decision card, then "decided <date> by <who>: option <n>"; then `--impact D-NN` and flag the notes it lists)
