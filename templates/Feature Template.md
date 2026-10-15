---
type: feature
id: <slug>
name: "<Feature name>"
status: todo
priority: P1
domain: <identity|connections|shared-rings|discovery|events|meetings|commerce|platform>
screens: []
updated: <date>
tags: [feature, status/todo, domain/<domain>, priority/P1]
---

# ❌ <Feature name>

**Status:** TODO · **Priority:** P1 · **Domain:** [[Feature Tree#<Domain>|<Domain>]]

One paragraph: what the user does, in design terms.

## Design reference

| Screen | Name | Note |
|---|---|---|
| [[Screen Index#sNN\|sNN]] | | |

Wireframe brief sections: [[Wireframe Brief#<section>|§n]]

## Backend state

**Endpoints:** none yet.

**Tables / models:** `Model`

### What exists

### Gaps

## Tasks

```dataview
TABLE status, priority, effort FROM #task WHERE feature = "<slug>" SORT priority ASC
```

## Open decisions

## Related

- [[Ring Access Model]]
