---
type: decision
id: D-06
status: open
features: [profiles, gemma]
screens: [s06]
created: 2026-10-15
tags: [decision, decision/open]
---

# ❓ D-06 · Pin name rules

**Status:** open · **Decider:** product + backend lead · **Raised:** 2026-10-15

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

## Outcome

_Not decided yet. When decided: set `status: decided` above, write the choice here, move the waiting tasks out of ❓._
