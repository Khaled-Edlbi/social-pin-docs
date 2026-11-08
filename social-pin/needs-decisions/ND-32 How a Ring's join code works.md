---
id: ND-32
type: needs-decision
status: open
features: [ring-invitations]
blocks: ["S-33 Ring Invitations & Join Story"]
decider: "owner"
screens: [s26, s74, s72]
owner: "Omar Fostok"
affects: []
related: ["F-17 Ring Invitations & Join", "D-04 Ring settings at launch and their defaults", "D-18 Ring names shown when joined knowingly", "S-31 Delegated Admins Story", "S-29 Companies Story", "BI-08 Rings Backend Integration"]
created: 2026-11-08
updated: 2026-11-08
tags: [needs-decision, needs-decision/open]
---

# ✅ ND-32 · How a Ring's join code works

**Status:** open · **Decider:** owner · **Raised:** 2026-11-08 · **Needed by:** [[S-33 Ring Invitations & Join Story]] (S3, S7) · **Feature:** [[F-17 Ring Invitations & Join]]

> The needs-decision card: `draft` while the question is written, `open` once it is ready for the decider; it shows **Fulfilled** by itself once its decision card (D-NN) is `decided`. The cards in `blocks` are **Blocked · ND-32** while this is `draft` or `open` and return to their own status once it is fulfilled. Nobody edits their `status:` for this, and nobody types `fulfilled` or `decided` here.

## What has to be decided

What a join code is: how many a Ring has, what it looks like, whether it ends, and who can make, share and revoke it. The story needs it for the person typing a code on s74 (S3) and for the owner managing it under Edit Ring's *Joining and permissions* (S7). Until it is decided neither part can name a field, a length, an expiry or a revoke.

## Notes

- **What exists** (backend `main` @ `12172c6`): `joinPolicy` on the Ring, `ANYONE_WHO_SCANS | CODE_OR_INVITATION | INVITATION_ONLY`, default `CODE_OR_INVITATION`, and `requireApproval`, default on, are **saved, not enforced**; there is no code anywhere ([[BI-08 Rings Backend Integration]]).
- A code works only where `joinPolicy` allows it: `ANYONE_WHO_SCANS` or `CODE_OR_INVITATION`, never `INVITATION_ONLY` ([[D-04 Ring settings at launch and their defaults]]).
- With "approve each one" on, a code makes a **join request** the owner approves on s15 ([[S-16 Ring Members Story|Ring Members · S9]]); off, it joins at once after the review. Either way the member is recorded as **joined knowingly** and sees the Ring's name ([[D-18 Ring names shown when joined knowingly]]).
- A code is typed by hand at a desk or pasted from a message: it has to be short enough to read aloud and hard enough to guess that a wrong code never reveals a Ring.
- Who manages it: the owner and admins at "can also manage who's in it", who change the joining settings ([[S-31 Delegated Admins Story|Delegated Admins · A4]]).
- The design shows a code field on s74 and nothing on the owner's side.

## Options

1. **One code per Ring, at a time.** 8 characters, letters and digits without look-alikes (no 0/O, 1/I), shown grouped ("K7QM-4RXT"); no end date; **Make a new code** replaces it at once (the old one stops working); **Turn off** removes it. Shown and shared from *Joining and permissions*; offered only when `joinPolicy` allows codes. Wrong, old or turned-off codes get one message, and tries are limited per person.
2. **Several codes per Ring**, each with a label, an optional end date and a use limit ("Onboarding week · 20 uses"). More control for events and cohorts, more screens to design and more to explain.

Recommendation: option 1 for the MVP. One code per Ring covers a company handing it to new hires; labelled, limited codes can come later without changing what a member types.

## Responsible

`decider` above: the owner (Omar Fostok). Hear `/backend` (code generation, the try limit) and the designer (the owner side is not drawn).

## Decision

Fulfilled by [[D-32 Several join codes per Ring]] — decided 2026-11-08 by Omar Fostok: option 2
