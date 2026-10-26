---
type: backend-delivery
code: linked-accounts
scope: feature
feature: linked-accounts
module: platform
status: in-progress
screens: [s01, s04, s68]
created: 2026-10-18
updated: 2026-10-26
tags: [backend-delivery, backend-delivery/in-progress, module/platform, layer/backend]
---

# 🟡 Linked Accounts (OAuth) · Backend Delivery

**Feature:** [[Linked Accounts (OAuth)]] · **Status:** In progress · **Integration guide:** [[Linked Accounts (OAuth) Backend Integration]] · **Requirements:** [[Linked Accounts (OAuth) Frontend Requirements]] · **QA:** [[Linked Accounts (OAuth) QA Backend]]

What the backend shipped for this feature and how it works. The sum of this feature's task-level Backend Delivery notes (see the *Tasks* table below).

## Endpoints, tables and code

**Endpoints:** none yet.

**Tables / models:** `SocialIdentity`

**Code:** `prisma/schema/user.prisma`

### What exists

- `SocialIdentity` table.

### Gaps

- LinkedIn OAuth hand-off and callback.
- Link / unlink a provider from Me.
- Login with a linked provider (must return a session like `POST /auth/login/verify`; [[D-01 Passwordless login]] is decided).

## Tasks delivered

| Task | Delivery note | Status |
|---|---|---|
| — | — | — |

## Log

- 2026-10-18 · split out of [[Linked Accounts (OAuth)]] when the vault moved to layers
