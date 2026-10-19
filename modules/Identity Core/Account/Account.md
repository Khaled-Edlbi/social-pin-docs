---
type: feature
id: account
name: "Account"
priority: critical
module: identity
screens: [s68]
updated: 2026-10-19
tags: [feature, module/identity, priority/critical]
---

# Account

**Backend:** Done · **Priority:** Critical · **Module:** [[Identity Core Module|Identity Core]]

**Layers:** [[Account Story|Story]] · [[Account Frontend Requirements|Frontend Requirements]] · [[Account Backend Delivery|Backend Delivery]] · [[Account Backend Integration|Backend Integration]] · [[Account Frontend Delivery|Frontend Delivery]] · [[Account QA Backend|QA Backend]] · [[Account QA Frontend|QA Frontend]]

The authenticated account: read it, change email or phone, soft-delete it.

## Design reference

| Screen | Name | Note |
|---|---|---|
| [[Screen Index#s68|s68]] | Me / Account |  |

Wireframe brief sections: [[Wireframe Brief#Account, subscription & settings|§12 Account, subscription & settings]]

Prototype: `socialPin-design/.proto2.json` (screen ids above), click-through map in [[Navigation Map]], see [[Design Reference]].

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

Project context: [[Ring Access Model]] · [[Architecture]] · [[API Conventions]] · [[Spec Map]]
