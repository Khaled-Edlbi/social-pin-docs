---
id: ND-14
type: needs-decision
status: open
features: [connections]
blocks: ["S-23 Connections Story"]
decider: "owner"
screens: [s17, s46]
owner: "omar"
affects: []
related: ["F-14 Connections", "F-11 Rings", "F-12 View As & Pin Views"]
created: 2026-10-25
updated: 2026-10-29
tags: [needs-decision, needs-decision/open]
---

# ✅ ND-14 · Connection-granted Ring on Shared with me

**Status:** open · **Decider:** owner · **Raised:** 2026-10-25 · **Needed by:** [[S-23 Connections Story|Connections · S13–S18]] · **Feature:** [[F-14 Connections]]

> The needs-decision card: `draft` while the question is written, `open` once it is ready for the decider; it shows **Fulfilled** by itself once its decision card (D-NN) is `decided`. The cards in `blocks` are **Blocked · ND-14** while this is `draft` or `open` and return to their own status once it is fulfilled. Nobody edits their `status:` for this, and nobody types `fulfilled` or `decided` here.

## What has to be decided

How the Ring a receiver accepts someone into ([[Screen Index#s46|s46]]) appears on that person's Shared with me ([[Screen Index#s17|s17]]). [[S-23 Connections Story|Connections · S13–S18]] S3 says the requester must never learn which Ring they were put in, but `GET /rings/shared-with-me` lists every live membership with the Ring's own row, name included, so a requester accepted into "Acquaintances" would read that name. Until this is chosen, [[S-23 Connections Story|Connections · S13–S18]] cannot keep its privacy promise, and the s17 list cannot be specified.

## Notes

- `GET /rings/shared-with-me` returns the Ring row (name, colour, type, owner id, expiry), not the owner's projection; the person is shown through `GET /views/ring/:id` ([[BI-08 Rings Backend Integration]]). The view itself never names the Ring ([[BI-09 View As & Pin Views Backend Integration]]).
- The same is true today for anyone the owner adds with `POST /rings/:ringId/members`: every member can read the name of the Ring they are in. The answer here may apply to all members, not only connection-granted ones.
- `grantedRingId` is never returned to the requester ([[S-23 Connections Story|Connections · S13–S18]] S3), but the Ring row on s17 gives the same information away.
- [[S-23 Connections Story|Connections · S19–S24]] adds a contacts list from which a person's perspectives open (`GET /views/user/:userId/perspectives`); that is another way to reach someone without s17.
- [[ND-04 Ring settings]] is open on what members may see of a Ring; this card is about the Ring's name and identity only.

## Options

1. **Listed as now, with the Ring's name**: no backend change; owners learn that a Ring's name is visible to its members and name Rings accordingly. Breaks [[S-23 Connections Story|Connections · S13–S18]] S3 as written.
2. **Listed without the Ring's identity**: for a member, each row shows the person ("Sam's card", from the projection) and no Ring name, colour or type; the owner still sees everything on their own Rings. Changes the `shared-with-me` row for every member.
3. **Not listed at all**: a connection-granted Ring is reached through contacts ([[S-23 Connections Story|Connections · S19–S24]]) and perspectives; s17 keeps only Rings joined some other way (invites, events).

Recommendation: option 2, for every member, so the rule "the view never names the Ring" holds on s17 too.

## Responsible

`decider` above: the owner, before [[S-23 Connections Story|Connections · S13–S18]] is approved, after hearing from the backend what the `shared-with-me` row can drop and from the frontend what s17 needs to show a person instead of a Ring.

## Decision

Fulfilled by [[D-14 Shared with me lists people, never the Ring]], decided 2026-10-25 by molham: option 2, for every member.
