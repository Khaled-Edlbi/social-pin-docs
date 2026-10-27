---
type: feature
id: gemma
name: "Gemma AI"
priority: medium
release: later
module: platform
screens: [s13, s60]
created: 2026-10-15
updated: 2026-10-27
owner: "omar"
tags: [feature, module/platform, priority/medium, release/later]
---

# Gemma AI

**Backend:** TODO · **Priority:** Medium · **Release:** Later · **Module:** [[Platform & Cross-cutting Module|Platform & Cross-cutting]]

**Layers:** [[Gemma AI Story|Story]] · [[Gemma AI Frontend Requirements|Frontend Requirements]] · [[Gemma AI Backend Delivery|Backend Delivery]] · [[Gemma AI Backend Integration|Backend Integration]] · [[Gemma AI Frontend Delivery|Frontend Delivery]] · [[Gemma AI QA Backend|QA Backend]] · [[Gemma AI QA Frontend|QA Frontend]]

The cross-cutting assistant: assistant sheet (s13), Smart Match (s60), and suggestions everywhere (Pin name, Ring name, which Ring on accept, bio rewrite, meeting agenda).

## Design reference

| Screen | Name | Note |
|---|---|---|
| [[Screen Index#s13|s13]] | Gemma sheet |  |
| [[Screen Index#s60|s60]] | Smart Match |  |

Wireframe brief sections: [[Wireframe Brief#Smart Match|§8.4 Smart Match]], [[Wireframe Brief#Gemma|§13 Gemma]]

Prototype: `socialPin-design/.proto2.json` (screen ids above), click-through map in [[Navigation Map]], see [[Design Reference]].

## Work

One story per feature (since 2026-10-27): all of this feature's work is in [[Gemma AI Story]]. The tasks merged into it on 2026-10-27:

| Was | Title | Status then | Priority | Now in the story |
|---|---|---|---|---|
| T-051 | Gemma assistant sheet and suggestions | Needs a decision | medium | S7 |
| T-052 | Smart Match | Blocked | medium | S8 |

### Log of the merged tasks

- T-051 · 2026-10-15 · created from the backend vs design comparison ([[Status Report 2026-10-15]])
- T-051 · 2026-10-18 · created as the backend half of T-051
- T-051 · 2026-10-18 · created as the frontend half of T-051
- T-052 · 2026-10-15 · created from the backend vs design comparison ([[Status Report 2026-10-15]])
- T-052 · 2026-10-18 · created as the backend half of T-052
- T-052 · 2026-10-18 · created as the frontend half of T-052

## Decisions

- [[ND-06 Pin name rules]] — decided, yearly rename, old name freed, case-insensitive; suggestions only from the person's own name ([[D-06 Yearly rename, old name freed, case-insensitive|D-06]])

## Related

- [[Connections]]
- [[Meetings]]
- [[Interests]]
- [[Subscription (Free vs Pro)]]
- [[Ring Access Engine]]
- [[Audit Log]]

Project context: [[Ring Access Model]] · [[Architecture]] · [[API Conventions]] · [[Spec Map]]
