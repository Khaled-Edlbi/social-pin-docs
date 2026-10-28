---
type: feature
id: <slug>
name: "<Feature name>"
priority: high
# release: the release this feature is scoped to, mvp | v1 | later (docs.config.json releases); its layer notes and bugs inherit it
release: later
# deadline: YYYY-MM-DD      # optional: the feature's date; its layer notes and bugs inherit it unless they carry their own
module: <identity|connections|shared-rings|discovery|events|meetings|commerce|platform>
# frontendOnly: true      # optional: no backend part; the backend and QA-backend cards are not required and do not count
screens: []
depends: []
affects: []
related: []
created: <date>
updated: <date>
tags: [feature, module/<module>, priority/high, release/later]
---

# <Feature name>

**Backend:** not started · **Priority:** High · **Release:** Later · **Deadline:** — · **Module:** [[<Module name> Module|<Module name>]]

**Layers:** [[<Feature name> Story|Story]] · [[<Feature name> Frontend Requirements|Frontend Requirements]] · [[<Feature name> Backend Delivery|Backend Delivery]] · [[<Feature name> Backend Integration|Backend Integration]] · [[<Feature name> Frontend Delivery|Frontend Delivery]] · [[<Feature name> QA Backend|QA Backend]] · [[<Feature name> QA Frontend|QA Frontend]]

The **business** note and the main node of the feature: what it is for, in product terms, and which screens it serves. How it was built lives in the layer notes above; this note stays readable by someone who never opens them.

## Design reference

| Screen | Name | Note |
|---|---|---|
| [[Screen Index#sNN|sNN]] | … | … |

Wireframe brief sections: [[Wireframe Brief#…|§…]]

## Product rules

- The rules that hold whatever the implementation (privacy, what a viewer may never learn, limits).

## Decisions

- [[ND-NN …]] — what it blocks here.

## Related

- [[<Other feature>]] — why (shared endpoint, table, screen or rule).

Project context: [[Ring Access Model]] · [[Architecture]] · [[API Conventions]] · [[Spec Map]]
