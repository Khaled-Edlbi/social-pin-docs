---
type: feature
id: account
name: "Account"
status: done
priority: P0
domain: identity
screens: [s68]
updated: 2026-10-15
tags: [feature, status/done, domain/identity, priority/P0]
---

# ✅ Account

**Status:** Done · **Priority:** P0 · **Domain:** [[Feature Tree#Identity Core|Identity Core]]

The authenticated account: read it, change email or phone, soft-delete it.

## Design reference

| Screen | Name | Note |
|---|---|---|
| [[Screen Index#s68|s68]] | Me / Account |  |

Wireframe brief sections: [[Wireframe Brief#Account, subscription & settings|§12 Account, subscription & settings]]

Prototype: `socialPin-design/.proto2.json` (screen ids above), click-through map in [[Navigation Map]], see [[Design Reference]].

## Backend state

**Endpoints**

- `GET /users/me`
- `PATCH /users/me`
- `DELETE /users/me`

**Tables / models:** `User`

**Code:** `src/modules/user/`

### What exists

- `PATCH /users/me` changes email or phone and clears the matching verified flag.
- `DELETE /users/me` soft-deletes and revokes every session.
- There is deliberately no `GET /users/:id` and no user search: another person is reachable only through a Ring projection.

### Gaps

- The Me screen (s68) shows connection counts and linked accounts, both missing. See [[Counts]] and [[Linked Accounts (OAuth)]].

## Tasks

_No open tasks._

```dataview
TABLE status, priority, effort FROM #task WHERE feature = "account" SORT priority ASC
```

## Related

- [[Auth & Sign-up]]
- [[Counts]]
- [[Linked Accounts (OAuth)]]
- [[Devices & NFC]]
- [[Subscription (Free vs Pro)]]

Project context: [[Ring Access Model]] · [[Architecture]] · [[API Conventions]] · [[SPEC_MAP]]
