---
id: F-38
type: feature
module: platform
feature: linked-accounts
priority: high
release: v1
screens: [s01, s04, s68]
created: 2026-10-15
updated: 2026-10-29
tags: [feature, module/platform, priority/high, release/v1]
---

# Linked Accounts (OAuth)

**Backend:** Partial (needs more) · **Priority:** High · **Release:** v1 · **Module:** [[M-08 Platform & Cross-cutting Module|Platform & Cross-cutting]]

**Layers:** [[S-94 Linked Accounts (OAuth) Story|Story]] · [[FR-38 Linked Accounts (OAuth) Frontend Requirements|Frontend Requirements]] · [[BD-38 Linked Accounts (OAuth) Backend Delivery|Backend Delivery]] · [[Linked Accounts (OAuth) Backend Integration|Backend Integration]] · [[Linked Accounts (OAuth) Frontend Delivery|Frontend Delivery]] · [[Linked Accounts (OAuth) QA Backend|QA Backend]] · [[Linked Accounts (OAuth) QA Frontend|QA Frontend]]

Social providers for login and import (s68 linked accounts, s01 "Continue with LinkedIn"). `SocialIdentity` exists; there is no OAuth.

## Design reference

| Screen | Name | Note |
|---|---|---|
| [[Screen Index#s01|s01]] | Welcome | Passwordless (ND-01 decided); provider login is the second sign-in method |
| [[Screen Index#s04|s04]] | Importing |  |
| [[Screen Index#s68|s68]] | Me / Account |  |

Wireframe brief sections: [[Wireframe Brief#The three login/signup methods|§3.2 The three login/signup methods]], [[Wireframe Brief#LinkedIn profile import|§3.3 LinkedIn profile import]], [[Wireframe Brief#Account, subscription & settings|§12 Account, subscription & settings]]

Prototype: `socialPin-design/.proto2.json` (screen ids above), click-through map in [[Navigation Map]], see [[Design Reference]].

## Work

One story per feature (since 2026-10-27): all of this feature's work is in [[S-94 Linked Accounts (OAuth) Story]]. The tasks merged into it on 2026-10-27:

| Was | Title | Status then | Priority | Now in the story |
|---|---|---|---|---|
| T-019 | LinkedIn OAuth link, unlink, login | To do | high | S7 |

### Log of the merged tasks

- T-019 · 2026-10-15 · created from the backend vs design comparison ([[Status Report 2026-10-15]])
- T-019 · 2026-10-18 · created as the backend half of T-019
- T-019 · 2026-10-18 · created as the frontend half of T-019

## Open decisions

- [[ND-01 Passwordless login]]

## Related

- [[F-02 Auth & Sign-up]]
- [[F-05 Onboarding Imports]]
- [[F-01 Account]]

Project context: [[Ring Access Model]] · [[Architecture]] · [[API Conventions]] · [[Spec Map]]
