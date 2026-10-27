---
type: feature
id: post-event
name: "Post-Event"
priority: high
release: v1
module: events
screens: [s62]
related: ["View As & Pin Views"]
created: 2026-10-15
updated: 2026-10-27
tags: [feature, module/events, priority/high, release/v1]
---

# Post-Event

**Backend:** TODO · **Priority:** High · **Release:** v1 · **Module:** [[Events Module|Events]]

**Layers:** [[Post-Event Story|Story]] · [[Post-Event Frontend Requirements|Frontend Requirements]] · [[Post-Event Backend Delivery|Backend Delivery]] · [[Post-Event Backend Integration|Backend Integration]] · [[Post-Event Frontend Delivery|Frontend Delivery]] · [[Post-Event QA Backend|QA Backend]] · [[Post-Event QA Frontend|QA Frontend]]

Summary stats (connections, meetings, scans) and follow-up suggestions (s62). The keep / merge / expire choice for the Event Ring already exists.

## Design reference

| Screen | Name | Note |
|---|---|---|
| [[Screen Index#s62|s62]] | Post-event summary | Keep / merge / expire done |

Wireframe brief sections: [[Wireframe Brief#Post-event|§8.5 Post-event]]

Prototype: `socialPin-design/.proto2.json` (screen ids above), click-through map in [[Navigation Map]], see [[Design Reference]].

## Work

One story per feature (since 2026-10-27): all of this feature's work is in [[Post-Event Story]]. The tasks merged into it on 2026-10-27:

| Was | Title | Status then | Priority | Now in the story |
|---|---|---|---|---|
| T-050 | Post-event summary and follow-ups | Blocked | high | S6 |

### Log of the merged tasks

- T-050 · 2026-10-15 · created from the backend vs design comparison ([[Status Report 2026-10-15]])
- T-050 · 2026-10-18 · created as the backend half of T-050
- T-050 · 2026-10-18 · created as the frontend half of T-050

## Related

- [[Rings]]
- [[Events During]]
- [[Connections]]
- [[Badge & QR]]
- [[Gemma AI]]

Project context: [[Ring Access Model]] · [[Architecture]] · [[API Conventions]] · [[Spec Map]]
