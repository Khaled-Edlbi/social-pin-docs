---
id: F-01
type: feature
module: identity
feature: account
name: "Account"
priority: critical
release: mvp
screens: [s68]
created: 2026-10-18
updated: 2026-10-29
tags: [feature, module/identity, priority/critical, release/mvp]
---

# Account

**Backend:** Done · **Priority:** Critical · **Release:** MVP · **Module:** [[M-01 Identity Core Module|Identity Core]]

**Layers:** [[S-01 Account Story|Story]] · [[FR-01 Account Frontend Requirements|Frontend Requirements]] · [[BD-01 Account Backend Delivery|Backend Delivery]] · [[BI-01 Account Backend Integration|Backend Integration]] · [[FD-04 Account Frontend Delivery|Frontend Delivery]] · [[QB-04 Account QA Backend|QA Backend]] · [[QF-04 Account QA Frontend|QA Frontend]]

The authenticated account: read it, change email or phone, soft-delete it.

## Design reference

| Screen | Name | Note |
|---|---|---|
| [[Screen Index#s68|s68]] | Me / Account |  |

Wireframe brief sections: [[Wireframe Brief#Account, subscription & settings|§12 Account, subscription & settings]]

Prototype: `socialPin-design/.proto2.json` (screen ids above), click-through map in [[Navigation Map]], see [[Design Reference]].

## Bugs

| Bug | Status | Priority | Effort |
|---|---|---|---|
| [[B-01 An unverified changed email still signs in]] | 🟡 Partial · 5 notes | high | S |
| [[B-02 Deleted account answers 401, not the documented 404 E_USER_01]] | ⬜ To do | medium | S |

```dataview
TABLE status, priority, effort FROM #bug WHERE feature = "account" SORT priority ASC
```

## Related

- [[F-02 Auth & Sign-up]]
- [[F-03 Counts]]
- [[F-38 Linked Accounts (OAuth)]]
- [[F-33 Devices & NFC]]
- [[F-28 Subscription (Free vs Pro)]]

Project context: [[Ring Access Model]] · [[Architecture]] · [[API Conventions]] · [[Spec Map]]
