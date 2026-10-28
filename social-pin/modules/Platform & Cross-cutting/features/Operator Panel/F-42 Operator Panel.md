---
type: feature
id: operator-panel
name: "Operator Panel"
priority: high
release: later
module: platform
screens: []
depends: []
affects: []
related: ["F-30 Audit Log", "F-01 Account", "F-02 Auth & Sign-up", "F-16 Delegated Admins"]
created: 2026-10-26
updated: 2026-10-28
tags: [feature, module/platform, priority/high, release/later]
---

# Operator Panel

**Backend:** 🟡 In progress · **Priority:** High · **Release:** Later · **Deadline:** — · **Module:** [[M-08 Platform & Cross-cutting Module|Platform & Cross-cutting]]

**Layers:** [[S-117 Operator Panel Story|Story]] · [[Operator Panel Frontend Requirements|Frontend Requirements]] · [[Operator Panel Backend Delivery|Backend Delivery]] · [[Operator Panel Backend Integration|Backend Integration]] · [[Operator Panel Frontend Delivery|Frontend Delivery]] · [[Operator Panel QA Backend|QA Backend]] · [[Operator Panel QA Frontend|QA Frontend]]

How the team that runs Social Pin operates it: find an account, see its state,
suspend or reactivate it, say what an operator may do (the platform role and
the scoped grants in `user_roles`), read the seeded roles and permissions, read
the audit trail, and see the platform's totals. The audience is staff, not
users — nobody in the app ever reaches these routes.

Not a feature of the product spec: it is what the spec's `roles`,
`permissions`, `user_roles` and `audit_logs` tables were for, and the first API
over them ([[Spec Map]] §1).

## Design reference

_No prototype screen. The panel is an internal console; the mobile prototype
has no screens for it._ [[Screen Index#s26|s26]] and [[Screen Index#s27|s27]]
are ring-level access and permissions, which belong to [[F-16 Delegated Admins]].

## Product rules

- **An operator is not a viewer.** The panel reads account and moderation state
  and aggregate counts — never a profile's fields, a ring projection or a
  membership row. What a viewer may see stays with `RingAccessService`
  ([[Ring Access Model]], golden rule 8). An operator who must look at a
  reported profile is added to a ring and uses the normal view endpoints, where
  the access is attributable to a person.
- **Only a super admin can create an operator.** The platform role on an account
  and a GLOBAL-scoped role grant are both strings the guard matches, so an
  admin able to write either could promote itself.
- **No operator acts on its own account**, and none acts on an account at or
  above its own privilege.
- **Every mutation is recorded**, in the same transaction as the change, so the
  trail cannot claim something the database rolled back. The trail is
  append-only: no route deletes an entry at any role.
- **Suspension takes effect at once**, not when the access token expires.
- **The errors are coarse on purpose.** An admin endpoint must not become an
  oracle for *why* a target is off-limits.

## Work

One story per feature (since 2026-10-27): all of this feature's work is in [[S-117 Operator Panel Story]]. The tasks merged into it on 2026-10-27:

| Was | Title | Status then | Priority | Now in the story |
|---|---|---|---|---|
| T-068 | Account moderation and platform role | In progress | high | S3 |
| T-069 | Scoped role grants | In progress | high | S4 |
| T-070 | Roles and permissions catalogue | In progress | medium | S5 |
| T-071 | Audit-log read endpoints | In progress | high | S6 |
| T-072 | Platform stats | In progress | medium | S7 |

### Log of the merged tasks

- T-068 · 2026-10-26 · filed under [[F-42 Operator Panel]], after the code: the backend
- T-068 · 2026-10-26 · created as the backend half of T-068; the code sits on
- T-069 · 2026-10-26 · filed under [[F-42 Operator Panel]], after the code: the backend
- T-069 · 2026-10-26 · created as the backend half of T-069; the code sits on
- T-070 · 2026-10-26 · filed under [[F-42 Operator Panel]], after the code: the backend
- T-070 · 2026-10-26 · created as the backend half of T-070; the code sits on
- T-071 · 2026-10-26 · filed under [[F-42 Operator Panel]], after the code: the backend
- T-071 · 2026-10-26 · created as the backend half of T-071; the code sits on
- T-072 · 2026-10-26 · filed under [[F-42 Operator Panel]], after the code: the backend
- T-072 · 2026-10-26 · created as the backend half of T-072; the code sits on

## Decisions

- None raised. `release:` and `priority:` are first guesses for the owner to
  confirm; the panel has no agreed release, and it was built before any of these
  tickets existed.

## Related

- [[F-30 Audit Log]] — the panel writes the trail and reads it; the trail's other
  writers stay with [[S-74 Audit Log Story|Audit Log · S4]]
- [[F-01 Account]] — the same `users` rows, from the account holder's side
- [[F-02 Auth & Sign-up]] — the platform role on the JWT, and refresh-token
  revocation on suspension
- [[F-16 Delegated Admins]] — the ring-level namesake
  ([[S-31 Delegated Admins Story|Delegated Admins · S6]]): a ring owner delegating administration,
  not platform staff. Different routes, different rules.

Project context: [[Ring Access Model]] · [[Architecture]] · [[API Conventions]] · [[Spec Map]]
