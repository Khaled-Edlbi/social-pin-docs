---
type: feature
id: auth
name: "Auth & Sign-up"
priority: critical
module: identity
screens: [s01, s02, s06, s08, s68]
updated: 2026-10-19
tags: [feature, module/identity, priority/critical]
---

# Auth & Sign-up

**Backend:** Done · **Priority:** Critical · **Module:** [[Identity Core Module|Identity Core]]

**Layers:** [[Auth & Sign-up Story|Story]] · [[Auth & Sign-up Frontend Requirements|Frontend Requirements]] · [[Auth & Sign-up Backend Delivery|Backend Delivery]] · [[Auth & Sign-up Backend Integration|Backend Integration]] · [[Auth & Sign-up Frontend Delivery|Frontend Delivery]] · [[Auth & Sign-up QA Backend|QA Backend]] · [[Auth & Sign-up QA Frontend|QA Frontend]]

Sign up with email or phone, verify the one-time code, finish registration with a Pin name, sign in with a one-time code, refresh, log out, log out everywhere. **Passwordless** since 2026-10-15 ([[D-01 Passwordless login]]); client changes in [[Frontend Passwordless Migration]].

## Design reference

| Screen | Name | Note |
|---|---|---|
| [[Screen Index#s01|s01]] | Welcome | "No password to remember" — implemented (D-01) |
| [[Screen Index#s02|s02]] | Verify | Resend timer, expired code |
| [[Screen Index#s06|s06]] | Claim your Pin | Availability check done; yearly rename + suggestions → D-06 |
| [[Screen Index#s08|s08]] | First Ring | Default Ring is created by complete-registration |
| [[Screen Index#s68|s68]] | Me / Account |  |

Wireframe brief sections: [[Wireframe Brief#Onboarding flow|§3.1 Onboarding flow]], [[Wireframe Brief#The three login/signup methods|§3.2 The three login/signup methods]], [[Wireframe Brief#Account, subscription & settings|§12 Account, subscription & settings]]

Prototype: `socialPin-design/.proto2.json` (screen ids above), click-through map in [[Navigation Map]], see [[Design Reference]].

## Tasks

| Task | Status | Priority | Effort |
|---|---|---|---|
| [[T-056 Decide passwordless login]] | ✅ Done | Critical | S |

```dataview
TABLE status, priority, effort FROM #task WHERE feature = "auth" SORT priority ASC
```

## Decisions

- [[D-01 Passwordless login]] — decided, code-only login

## Related

- [[Account]]
- [[Profiles & Pin Name]]
- [[Rings]]
- [[Code Delivery]]
- [[Linked Accounts (OAuth)]]

Project context: [[Ring Access Model]] · [[Architecture]] · [[API Conventions]] · [[Spec Map]]
