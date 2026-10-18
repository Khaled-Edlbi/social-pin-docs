---
type: feature
id: linked-accounts
name: "Linked Accounts (OAuth)"
status: partial
priority: P1
domain: platform
screens: [s01, s04, s68]
updated: 2026-10-18
tags: [feature, status/partial, domain/platform, priority/P1]
---

# 🟡 Linked Accounts (OAuth)

**Status:** Partial (needs more) · **Priority:** P1 · **Domain:** [[Feature Tree#Platform & Cross-cutting|Platform & Cross-cutting]] · **Story:** [[Linked Accounts (OAuth) Story]] · **Requirements:** [[Linked Accounts (OAuth) Requirements]]

Social providers for login and import (s68 linked accounts, s01 "Continue with LinkedIn"). `SocialIdentity` exists; there is no OAuth.

## Design reference

| Screen | Name | Note |
|---|---|---|
| [[Screen Index#s01|s01]] | Welcome | Promises no password → D-01 |
| [[Screen Index#s04|s04]] | Importing |  |
| [[Screen Index#s68|s68]] | Me / Account |  |

Wireframe brief sections: [[Wireframe Brief#The three login/signup methods|§3.2 The three login/signup methods]], [[Wireframe Brief#LinkedIn profile import|§3.3 LinkedIn profile import]], [[Wireframe Brief#Account, subscription & settings|§12 Account, subscription & settings]]

Prototype: `socialPin-design/.proto2.json` (screen ids above), click-through map in [[Navigation Map]], see [[Design Reference]].

## Backend state

**Endpoints:** none yet.

**Tables / models:** `SocialIdentity`

**Code:** `prisma/schema/user.prisma`

### What exists

- `SocialIdentity` table.

### Gaps

- LinkedIn OAuth hand-off and callback.
- Link / unlink a provider from Me.
- Login with a linked provider (ties into [[D-01 Passwordless login]]).

## Tasks

| Task | Status | Priority | Effort |
|---|---|---|---|
| [[T-019 LinkedIn OAuth link, unlink, login]] | ❓ Needs a decision / info | P1 | L |

```dataview
TABLE status, priority, effort FROM #task WHERE feature = "linked-accounts" SORT priority ASC
```

## Open decisions

- [[D-01 Passwordless login]]

## Related

- [[Auth & Sign-up]]
- [[Onboarding Imports]]
- [[Account]]

Project context: [[Ring Access Model]] · [[Architecture]] · [[API Conventions]] · [[SPEC_MAP]]
