---
type: map
updated: 2026-10-15
tags: [map]
---

# Decisions

Where the design and the backend disagree. Each needs a product decision before the related tasks can be built without rework. One note per decision, ADR-style: problem, facts, options, recommendation, outcome.

| Decision | Status | Affects | Screens |
|---|---|---|---|
| [[D-01 Passwordless login]] | decided (A, code-only) | [[Auth & Sign-up]], [[Linked Accounts (OAuth)]] | s01, s02 |
| [[D-02 Base profile work fields]] | open | [[Profiles & Pin Name]], [[Ring Projection]], [[Onboarding Imports]], [[Photo Library]] | s05, s06, s11, s23, s29 |
| [[D-03 Field library vs per-Ring copies]] | open | [[Ring Projection]], [[Widgets]] | s20, s24 |
| [[D-04 Ring settings]] | open | [[Rings]], [[Ring Members]], [[Ring Invitations & Join]], [[Delegated Admins]], [[Companies]] | s19, s22, s26, s27 |
| [[D-05 Copy or inherit]] | open | [[Rings]], [[Ring Projection]], [[Photo Library]] | s18, s23, s28, s29 |
| [[D-06 Pin name rules]] | open | [[Profiles & Pin Name]], [[Gemma AI]] | s06 |

```dataview
TABLE status, features FROM #decision
```
