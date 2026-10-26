---
type: decision
id: ND-03
aliases: [ND-03]
status: open
features: [ring-projection, widgets]
screens: [s20, s24]
created: 2026-10-15
updated: 2026-10-26
tags: [decision, decision/open]
---

# ✅ ND-03 · Field library vs per-Ring copies

**Status:** decided (2026-10-25, option A) · **Decider:** product + backend lead · **Raised:** 2026-10-15

## Where the design and the backend disagree

s20 and s24 ("4 of 7 on") assume one library of fields (links, info blocks, files) that each Ring turns on or off. The backend stores a separate copy of each link and info block per Ring. Without a change, editing your work email means editing it in every Ring.

## Facts

- Hidden rows are already excluded by the query. A library model would make `isVisible` a join-row flag instead of a column on the copy.
- A library needs a migration: `ProfileLink` / `ProfileInfoBlock` owned by the profile, plus `RingProfileLink` becoming a reference with `isVisible`.

## Options

- **A. Library model.** One row per field on the profile, a visibility row per Ring. Matches the design; migration plus a rewrite of the projection service.
- **B. Copies with a 'apply to all Rings' action.** Cheaper, but the "4 of 7 on" UI cannot be built honestly.

## Recommendation

A, before more projection features (widgets) are built on the copy model.

## Affects

- [[Ring Projection]]
- [[Widgets]]

Screens: [[Screen Index#s20|s20]], [[Screen Index#s24|s24]]

## Tasks waiting on this

- [[T-018 Widget CRUD on the projection]]
- [[T-058 Decide field library vs per-Ring copies]]

## Decision

Fulfilled by [[D-03 Links entered once, switched on or off per Ring]], decided 2026-10-25 by molham: option A.
