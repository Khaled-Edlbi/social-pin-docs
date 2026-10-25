---
type: decision
id: D-11
status: draft
features: [badge-qr]
blocks: ["T-007 Story"]
decider: "owner"
screens: [s34]
affects: []
related: ["Badge & QR"]
owner: "khaled"
created: 2026-10-25
updated: 2026-10-25
tags: [decision, decision/draft]
---

# ❓ D-11 · Get or rotate the badge token

**Status:** draft · **Decider:** owner · **Raised:** 2026-10-25 · **Needed by:** [[T-007 Story]] · **Feature:** [[Badge & QR]]

> The needs-decision card: `draft` while the question is written, `open` once it is ready for the decider; it shows **Fulfilled** by itself once its decision card (DR-NN) is `decided`. The cards in `blocks` are **Blocked · D-11** while this is `draft` or `open` and return to their own status once it is fulfilled. Nobody edits their `status:` for this, and nobody types `fulfilled` or `decided` here.

## What has to be decided

Whether opening the badge ([[Screen Index#s34|s34]]) always issues a new token, or returns the one that is still valid. [[T-007 Issue and rotate the QR token for a Ring]] says `POST /rings/:ringId/qr` returns a token and revokes the previous one. If every call rotates, opening the badge twice, or on a second phone, kills the code someone is about to scan. If a call returns the current token while it is in its 24 h window, the code is stable for the day and rotation happens on time or on the owner's request. Until this is chosen, the backend cannot write the route and the app cannot decide when to call it.

## Notes

- [[T-007 Story]] already assumes a stable token: S2 reuses a Ring's token when the owner switches back to it while it is valid; S3 rotates it after 24 h and revokes the old one; S4 shows the last token offline with *Refreshing*.
- Each Ring has its own token; deleting a Ring revokes it (S5).
- The Pro permanent token ([[T-049 Subscription endpoints and a single Pro gate]]) and the 60 s event pass ([[T-037 Event pass with a 60 s rotating code]]) have their own rules; this card is about the free 24 h token.
- The app needs `issuedAt` / `expiresAt` from the server whichever option is chosen, so the countdown never trusts the phone's clock.

## Options

1. **Every call rotates** (the task as written): `POST /rings/:ringId/qr` issues a new token and revokes the previous one. Simplest; the code dies whenever the badge is opened again, on any device.
2. **Get while valid, rotate on expiry or on request**: `POST /rings/:ringId/qr` returns the current token while it is in its window and issues a new one only past it; a reset (`{ reset: true }` or `POST …/qr/reset`) revokes it on demand, for a code the owner thinks was copied.
3. **Two routes**: `GET /rings/:ringId/qr` reads the current token (issuing one if there is none or it has expired), `POST /rings/:ringId/qr` always rotates. The same behaviour as option 2, with the read and the rotate apart.

Recommendation: option 2. It is what the story's acceptance criteria already describe, keeps one route as the task names it, and gives the owner a way to kill a code.

## Responsible

`decider` above: the owner, before [[T-007 Story]] is approved, after hearing from the backend how tokens are stored and revoked and from the frontend how the badge refreshes offline.

## Decision

— (answered on its decision card, never written here: the PM or the owner, on the user's word, runs `node scripts/build-tree.mjs --scaffold record D-11 "<the answer>"`, fills the decision card DR-NN (what was decided, why, what it changes with every feature and task in its `affects`, what stays open) and sets it `decided` with `decidedBy` and `decidedAt`; this card then shows Fulfilled by itself; the H1 gets ✅, and this line is replaced by "Fulfilled by" and a wikilink to the decision card, then "decided <date> by <who>: option <n>"; then `--impact DR-NN` and flag the notes it lists)
