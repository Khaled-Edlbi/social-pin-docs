---
type: feature
id: <slug>
name: "<Feature name>"
priority: P1
module: <identity|connections|shared-rings|discovery|events|meetings|commerce|platform>
# frontendOnly: true      # optional: no backend part; the backend and QA-backend cards are not required and do not count
screens: []
depends: []
affects: []
related: []
updated: <date>
tags: [feature, module/<module>, priority/P1]
---

# <Feature name>

**Backend:** not started · **Priority:** P1 · **Module:** [[<Module name> Module|<Module name>]]

**Layers:** [[<Feature name> Story|Story]] · [[<Feature name> Frontend Requirements|Frontend Requirements]] · [[<Feature name> Backend Delivery|Backend Delivery]] · [[<Feature name> Backend Integration|Backend Integration]] · [[<Feature name> Frontend Delivery|Frontend Delivery]] · [[<Feature name> QA Backend|QA Backend]] · [[<Feature name> QA Frontend|QA Frontend]]

The **business** note and the main node of the feature: what it is for, in product terms, and which screens it serves. How it was built lives in the layer notes above; this note stays readable by someone who never opens them.

## Design reference

| Screen | Name | Note |
|---|---|---|
| [[Screen Index#sNN|sNN]] | … | … |

Wireframe brief sections: [[Wireframe Brief#…|§…]]

## Product rules

- The rules that hold whatever the implementation (privacy, what a viewer may never learn, limits).

## Tasks

| Task | Status | Priority | Effort |
|---|---|---|---|
| [[T-NNN …]] | ⬜ To do | P1 | M |

## Decisions

- [[D-NN …]] — what it blocks here.

## Related

- [[<Other feature>]] — why (shared endpoint, table, screen or rule).

Project context: [[Ring Access Model]] · [[Architecture]] · [[API Conventions]] · [[Spec Map]]
