---
type: needs-decision
id: ND-05
aliases: [ND-05]
status: open
features: [rings, ring-projection, photo-library]
screens: [s18, s23, s28, s29]
created: 2026-10-15
updated: 2026-10-26
tags: [needs-decision, needs-decision/open]
---

# ✅ ND-05 · Copy or inherit

**Status:** decided (2026-10-25, option A) · **Decider:** product + backend lead · **Raised:** 2026-10-15

## Where the design and the backend disagree

Copy a Ring when creating one (s18) and copy another Ring's bio (s28) have no endpoints. "Inherit, stays in sync with your Pin" (s23) needs the base profile bio and photo from ND-02.

## Facts

- Copy is a one-off service method (`POST /rings` with `copyFromRingId`, and `POST …/projection/copy-bio`).
- Inherit is a read-time fallback: null on the Ring means use the base profile.

## Options

- **A. Both.** Copy for one-offs, inherit as default.
- **B. Copy only.**

## Recommendation

A, after ND-02 lands.

## Affects

- [[Rings]]
- [[Ring Projection]]
- [[Photo Library]]

Screens: [[Screen Index#s18|s18]], [[Screen Index#s23|s23]], [[Screen Index#s28|s28]], [[Screen Index#s29|s29]]

## Tasks waiting on this

- [[T-060 Decide copy or inherit]]

## Decision

Fulfilled by [[D-05 Inherit per field, copy without members]], decided 2026-10-25 by molham: option A.
