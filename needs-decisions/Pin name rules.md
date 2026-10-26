---
type: needs-decision
id: ND-06
aliases: [ND-06]
status: open
features: [profiles, gemma]
screens: [s06]
created: 2026-10-15
updated: 2026-10-26
tags: [needs-decision, needs-decision/open]
---

# ✅ ND-06 · Pin name rules

**Status:** decided (2026-10-25, option A) · **Decider:** product + backend lead · **Raised:** 2026-10-15

## Where the design and the backend disagree

s06 says "You can change it once a year" and shows suggested names. The backend has no limit on renames and deliberately returns no suggestions, so the availability check cannot reveal who holds a taken name.

## Facts

- Suggestions can be generated **without** probing other users: derive candidates from the user's own name and check availability one by one.
- A rename limit needs `pinNameChangedAt` on `Profile`.

## Options

- **A. Yearly limit + private suggestions.**
- **B. No limit; drop the copy from s06.**

## Recommendation

A. Add `pinNameChangedAt`, reject a rename within 365 days with a domain error, generate suggestions server-side from the user's own input.

## Affects

- [[Profiles & Pin Name]]
- [[Gemma AI]]

Screens: [[Screen Index#s06|s06]]

## Tasks waiting on this

- [[T-061 Decide Pin name rules]]

## Decision

Fulfilled by [[D-06 Yearly rename, old name freed, case-insensitive]], decided 2026-10-25 by molham: option A.
