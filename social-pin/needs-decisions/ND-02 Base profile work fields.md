---
type: needs-decision
id: ND-02
status: open
features: [profiles, ring-projection, onboarding-imports, photo-library]
screens: [s05, s06, s11, s23, s29]
created: 2026-10-15
updated: 2026-10-27
tags: [needs-decision, needs-decision/open]
---

# ✅ ND-02 · Base profile work fields

**Status:** decided (2026-10-25, option A) · **Decider:** product + backend lead · **Raised:** 2026-10-15

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

- [[Onboarding Imports Story|Onboarding Imports · S7]]
- [[Onboarding Imports Story|Onboarding Imports · S8]]
- [[Profiles & Pin Name Story|Profiles & Pin Name · Decide base profile work fields]]
- [[Ring Projection Story|Ring Projection · Decide copy or inherit]]

## Decision

Fulfilled by [[D-02 One main profile every Ring starts from]], decided 2026-10-25 by molham: option A.
