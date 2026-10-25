---
type: decision
id: D-14
status: draft
features: [connections]
blocks: ["T-022 Story"]
decider: "owner"
screens: [s17, s46]
affects: []
related: ["Connections", "Rings", "View As & Pin Views"]
owner: "omar"
created: 2026-10-25
updated: 2026-10-25
tags: [decision, decision/draft]
---

# ❓ D-14 · Connection-granted Ring on Shared with me

**Status:** draft · **Decider:** owner · **Raised:** 2026-10-25 · **Needed by:** [[T-022 Story]] · **Feature:** [[Connections]]

> The needs-decision card: `draft` while the question is written, `open` once it is ready for the decider; it shows **Fulfilled** by itself once its decision card (DR-NN) is `decided`. The cards in `blocks` are **Blocked · D-14** while this is `draft` or `open` and return to their own status once it is fulfilled. Nobody edits their `status:` for this, and nobody types `fulfilled` or `decided` here.

## What has to be decided

How the Ring a receiver accepts someone into ([[Screen Index#s46|s46]]) appears on that person's Shared with me ([[Screen Index#s17|s17]]). [[T-022 Story]] S3 says the requester must never learn which Ring they were put in, but `GET /rings/shared-with-me` lists every live membership with the Ring's own row, name included, so a requester accepted into "Acquaintances" would read that name. Until this is chosen, [[T-022 Accept into a Ring (sets grantedRingId)]] cannot keep its privacy promise, and the s17 list cannot be specified.

## Notes

- `GET /rings/shared-with-me` returns the Ring row (name, colour, type, owner id, expiry), not the owner's projection; the person is shown through `GET /views/ring/:id` ([[Rings Backend Integration]]). The view itself never names the Ring ([[View As & Pin Views Backend Integration]]).
- The same is true today for anyone the owner adds with `POST /rings/:ringId/members`: every member can read the name of the Ring they are in. The answer here may apply to all members, not only connection-granted ones.
- `grantedRingId` is never returned to the requester ([[T-022 Story]] S3), but the Ring row on s17 gives the same information away.
- [[T-023 Connection detail and contacts list]] adds a contacts list from which a person's perspectives open (`GET /views/user/:userId/perspectives`); that is another way to reach someone without s17.
- [[D-04 Ring settings]] is open on what members may see of a Ring; this card is about the Ring's name and identity only.

## Options

1. **Listed as now, with the Ring's name**: no backend change; owners learn that a Ring's name is visible to its members and name Rings accordingly. Breaks [[T-022 Story]] S3 as written.
2. **Listed without the Ring's identity**: for a member, each row shows the person ("Sam's card", from the projection) and no Ring name, colour or type; the owner still sees everything on their own Rings. Changes the `shared-with-me` row for every member.
3. **Not listed at all**: a connection-granted Ring is reached through contacts ([[T-023 Connection detail and contacts list]]) and perspectives; s17 keeps only Rings joined some other way (invites, events).

Recommendation: option 2, for every member, so the rule "the view never names the Ring" holds on s17 too.

## Responsible

`decider` above: the owner, before [[T-022 Story]] is approved, after hearing from the backend what the `shared-with-me` row can drop and from the frontend what s17 needs to show a person instead of a Ring.

## Decision

— (answered on its decision card, never written here: the PM or the owner, on the user's word, runs `node scripts/build-tree.mjs --scaffold record D-14 "<the answer>"`, fills the decision card DR-NN (what was decided, why, what it changes with every feature and task in its `affects`, what stays open) and sets it `decided` with `decidedBy` and `decidedAt`; this card then shows Fulfilled by itself; the H1 gets ✅, and this line is replaced by "Fulfilled by" and a wikilink to the decision card, then "decided <date> by <who>: option <n>"; then `--impact DR-NN` and flag the notes it lists)
