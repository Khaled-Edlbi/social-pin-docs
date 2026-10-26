---
type: feature
id: account
name: "Account"
priority: critical
release: mvp
module: identity
screens: [s68]
created: 2026-10-18
updated: 2026-10-25
tags: [feature, module/identity, priority/critical, release/mvp]
---

# Account

> ⚠ Affected by [[B-01 An unverified changed email still signs in]] (2026-10-26): "_No open tasks._" under ## Tasks is out of date. [[Account QA Backend]] filed two bugs against this feature, B-01 and [[B-02 Deleted account answers 401, not the documented 404 E_USER_01]], both open. They hang under [[Account Backend Integration]], the card they were found against, not under the story.

**Backend:** Done · **Priority:** Critical · **Release:** MVP · **Module:** [[Identity Core Module|Identity Core]]

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
