---
type: needs-decision
id: ND-12
status: draft
features: [badge-qr]
blocks: ["T-007 Story", "T-010"]
decider: "owner"
screens: [s34, s43]
affects: []
related: ["Badge & QR"]
owner: "omar"
created: 2026-10-25
updated: 2026-10-26
tags: [needs-decision, needs-decision/draft]
---

# ❓ ND-12 · What the badge QR encodes

**Status:** draft · **Decider:** owner · **Raised:** 2026-10-25 · **Needed by:** [[T-007 Story]], [[T-010 Public browser page for viewers without the app]] · **Feature:** [[Badge & QR]]

> The needs-decision card: `draft` while the question is written, `open` once it is ready for the decider; it shows **Fulfilled** by itself once its decision card (D-NN) is `decided`. The cards in `blocks` are **Blocked · ND-12** while this is `draft` or `open` and return to their own status once it is fulfilled. Nobody edits their `status:` for this, and nobody types `fulfilled` or `decided` here.

## What has to be decided

What the QR on the badge ([[Screen Index#s34|s34]]) carries: the bare token, or a URL with the token in it. A bare token works only when the Social Pin app scans it ([[Screen Index#s43|s43]]); a phone's own camera shows it as text, and someone without the app gets nothing. A URL opens the app when it is installed and a browser page when it is not ([[T-010 Public browser page for viewers without the app]]). The choice fixes the format of every code ever shown or printed (Pro codes are permanent: [[T-049 Subscription endpoints and a single Pro gate]]), so it is hard to change later. Until it is chosen, [[T-007 Issue and rotate the QR token for a Ring]] cannot fix its response shape and the app cannot tell "a Social Pin code" from any other QR ([[T-008 Story]] S3).

## Notes

- [[T-007 Story]] open questions: the app asks for the URL form, for example `https://<domain>/q/<token>`, and for `url` on the response next to `token`, `issuedAt`, `expiresAt`.
- A URL needs a domain the product controls and app links set up on both platforms; the app recognises its own format on the phone without a request.
- [[T-010 Public browser page for viewers without the app]] still needs its own answer on which Ring an anonymous viewer sees; this card only decides whether the code can lead there.
- The token must stay opaque in either form: no Ring id, no user id ([[T-007 Story]] S1).

## Options

1. **A URL carrying the token** (`https://<domain>/q/<token>`): the app scans it, the phone's camera opens the app, and without the app the browser page can answer. Needs the domain and app links before the first code is shown.
2. **The bare token**: only the Social Pin app can use it; nothing outside the app works, and moving to a URL later changes every printed code.
3. **A custom scheme** (`socialpin://q/<token>`): opens the app from the phone's camera when it is installed, does nothing in a browser; no public page possible.

Recommendation: option 1, decided now, so codes printed on Pro cards and event badges never change format.

## Responsible

`decider` above: the owner, before [[T-007 Story]] is approved, after hearing from the frontend what app links need on both platforms and from the backend which domain serves `/q/`.

## Decision

— (answered on its decision card, never written here: the PM or the owner, on the user's word, runs `node scripts/build-tree.mjs --scaffold decision ND-12 "<the answer>"`, fills the decision card D-NN (what was decided, why, what it changes with every feature and task in its `affects`, what stays open) and sets it `decided` with `decidedBy` and `decidedAt`; this card then shows Fulfilled by itself; the H1 gets ✅, and this line is replaced by "Fulfilled by" and a wikilink to the decision card, then "decided <date> by <who>: option <n>"; then `--impact D-NN` and flag the notes it lists)
