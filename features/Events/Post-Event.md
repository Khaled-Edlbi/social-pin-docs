---
type: feature
id: post-event
name: "Post-Event"
status: todo
priority: P1
domain: events
screens: [s62]
updated: 2026-10-18
tags: [feature, status/todo, domain/events, priority/P1]
---

# ❌ Post-Event

**Status:** TODO · **Priority:** P1 · **Domain:** [[Feature Tree#Events|Events]] · **Story:** [[Post-Event Story]] · **Requirements:** [[Post-Event Requirements]]

Summary stats (connections, meetings, scans) and follow-up suggestions (s62). The keep / merge / expire choice for the Event Ring already exists.

## Design reference

| Screen | Name | Note |
|---|---|---|
| [[Screen Index#s62|s62]] | Post-event summary | Keep / merge / expire done |

Wireframe brief sections: [[Wireframe Brief#Post-event|§8.5 Post-event]]

Prototype: `socialPin-design/.proto2.json` (screen ids above), click-through map in [[Navigation Map]], see [[Design Reference]].

## Backend state

**Endpoints**

- `POST /rings/:id/disposition`

**Tables / models:** `EventSummary`, `AnalyticsEvent`, `FollowUpAutomation`

**Code:** `src/modules/ring/ring.service.ts`

### What exists

- Ring disposition.

### Gaps

- Compute and store `EventSummary`.
- Follow-up suggestions (Gemma).
- Needs scan counting from [[Badge & QR]] and connections from [[Connections]].

## Tasks

| Task | Status | Priority | Effort |
|---|---|---|---|
| [[T-050 Post-event summary and follow-ups]] | ⛔ Blocked | P1 | M |

```dataview
TABLE status, priority, effort FROM #task WHERE feature = "post-event" SORT priority ASC
```

## Related

- [[Rings]]
- [[Events During]]
- [[Connections]]
- [[Badge & QR]]
- [[Gemma AI]]

Project context: [[Ring Access Model]] · [[Architecture]] · [[API Conventions]] · [[SPEC_MAP]]
