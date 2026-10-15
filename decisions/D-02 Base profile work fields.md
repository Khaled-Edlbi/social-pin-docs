---
type: decision
id: D-02
status: open
features: [profiles, ring-projection, onboarding-imports, photo-library]
screens: [s05, s06, s11, s23, s29]
created: 2026-10-15
tags: [decision, decision/open]
---

# ❓ D-02 · Base profile work fields

**Status:** open · **Decider:** product + backend lead · **Raised:** 2026-10-15

## Where the design and the backend disagree

Every screen shows headline, role, company, location, a profile photo and a base bio ("Product design lead · Acme Studio"). `Profile` has only fullName, nickname, birthdate, gender and marital status. Photo and bio exist only per Ring.

## Facts

- Imports (s05) and "Inherit, stays in sync with your Pin" (s23) both assume a base profile that feeds Rings.
- Entity drift guard: adding columns to `Profile` breaks `ProfileEntity` until someone decides what is public, which is the intended review point.

## Options

- **A. Add base fields to `Profile`** (headline, company, location, avatarFileId, bio) and let each `RingProfile` override or inherit (null = inherit).
- **B. Keep everything per Ring** and have the client copy values on create.

## Recommendation

A. It unblocks imports, inherit and "Reset to Pin". Sensitive-field gating stays unchanged.

## Affects

- [[Profiles & Pin Name]]
- [[Ring Projection]]
- [[Onboarding Imports]]
- [[Photo Library]]

Screens: [[Screen Index#s05|s05]], [[Screen Index#s06|s06]], [[Screen Index#s11|s11]], [[Screen Index#s23|s23]], [[Screen Index#s29|s29]]

## Tasks waiting on this

- [[T-020 LinkedIn import → review → base profile]]
- [[T-020b Business card scan and portfolio URL import]]
- [[T-057 Decide base profile work fields]]
- [[T-060 Decide copy or inherit]]

## Outcome

_Not decided yet. When decided: set `status: decided` above, write the choice here, move the waiting tasks out of ❓._
