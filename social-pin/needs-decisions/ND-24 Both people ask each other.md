---
id: ND-24
type: needs-decision
status: open
features: [connections]
blocks: ["S-23 Connections Story"]
decider: "owner"
screens: [s44, s45, s46]
owner: "Omar Fostok"
affects: []
related: ["F-14 Connections", "D-17 Requests expire after 30 days, optional note, ask again at once", "D-24 One pending request per pair"]
created: 2026-11-04
updated: 2026-11-04
tags: [needs-decision, needs-decision/open]
---

# ✅ ND-24 · Both people ask each other

**Status:** open · **Decider:** owner · **Raised:** 2026-11-04 · **Needed by:** [[S-23 Connections Story]] (S2) · **Feature:** [[F-14 Connections]]

> The needs-decision card: `draft` while the question is written, `open` once it is ready for the decider; it shows **Fulfilled** by itself once its decision card (D-NN) is `decided`. The cards in `blocks` are **Blocked · ND-24** while this is `draft` or `open` and return to their own status once it is fulfilled. Nobody edits their `status:` for this, and nobody types `fulfilled` or `decided` here.

## What has to be decided

What the server does when A sends a request to B while B's request to A is still pending. The app shows *Accept* instead of *Connect* when the other person asked first ([[S-23 Connections Story|Connections · S2]]), so this only happens when both tap at the same moment, or from an app that hasn't refetched. Until it's decided, the backend can't write `POST /connections/requests` for that case and [[FR-14 Connections Frontend Requirements]] can't fix the error it handles.

## Notes

- A pending request already has a rule against duplicates from the same requester: the same request comes back ([[S-23 Connections Story|Connections · S2]]).
- Accepting is the receiver's choice of a Ring ([[S-23 Connections Story|Connections · S5]]); an automatic accept would put someone in a Ring nobody picked.
- [[FR-14 Connections Frontend Requirements]] proposes a 409 with the other request's id, so the app opens the accept sheet for it.

## Options

1. **One pending request per pair**: the second request is refused with a 409 carrying the first one's id; the app opens the accept sheet (s46) for it.
2. **Accept automatically**: two crossing requests make a connection, into each person's default Ring.
3. **Keep both**: two pending requests, each answered on its own.

Recommendation: option 1. No one is put into a Ring they didn't choose, and the app already shows *Accept* in the usual case.

## Responsible

`decider` above: the owner, before [[BD-14 Connections Backend Delivery]] writes the request route.

## Decision

Fulfilled by [[D-24 One pending request per pair]] — decided 2026-11-04 by Omar Fostok: option 1.
