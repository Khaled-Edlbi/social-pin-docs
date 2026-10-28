---
type: module
id: <module id>
name: "<Module name>"
# priority: high           # optional (critical | high | medium | low); a module's features carry their own
# deadline: YYYY-MM-DD      # optional
owner: "<git user>"         # who last committed this card: what `git config user.name` prints
created: <date>
updated: <date>
tags: [module, module/<module id>]
---

# <Module name> · Module

One paragraph, in product terms: who the people are here, what they get done, and why it is its own module and not part of another. Vendors, endpoints and tables stay out; they belong to the layer notes. A module is the sum of its features; a feature is the sum of its cards, and all of its work is a part of its story.

## Features

| Feature | Backend | Story | Frontend req. | Backend | Frontend | QA |
|---|---|---|---|---|---|---|
| [[F-NN <Feature>]] | ⬜ To do | [[S-NN <Feature> Story\|Story]] | [[FR-NN <Feature> Frontend Requirements\|Req.]] | [[BD-NN <Feature> Backend Delivery\|Delivery]] · [[BI-NN <Feature> Backend Integration\|Integration]] | [[FD-NN <Feature> Frontend Delivery\|Delivery]] | [[QB-NN <Feature> QA Backend\|Backend]] · [[QF-NN <Feature> QA Frontend\|Frontend]] |

Every card is linked by its file name, code first (`[[F-27 Payments & Orders]]`). A card not written yet is linked by its name without a code; its scaffold gives it a code and repoints the link.

When the table is empty: the candidates in the order the product needs them, each with the reason, as business outcomes and not vendor operations.

## Product rules

- The rules that hold across every feature of the module whatever the implementation: who may do what, what a person may never see or lose, limits. A rule not yet decided is a decision card, not a sentence.

## Cross-cutting rules

- The technical rules every feature links: …

## Log

- <date> · created
