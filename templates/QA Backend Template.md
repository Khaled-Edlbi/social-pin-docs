---
type: qa-backend
code: <feature id>
scope: feature
feature: <feature id>
module: <module id>
status: draft
screens: []
depends: []
affects: []
related: []
# priority: high           # optional: inherits the feature's when absent (critical | high | medium | low)
# deadline: YYYY-MM-DD      # optional: inherits the feature's when absent
# pending: ["[[Note]]: what is left", "@who: what is left"]   # done, but a note is left for a card or a person → Partial until cleared
pending: []
# unmet: ["[[<Feature name> Backend Delivery]]: S2 · what the story says, what was delivered instead"]   # story parts the delivery does not fulfil → the story shows ✕; a bug goes in pending
unmet: []
created: <date>
updated: <date>
tags: [qa-backend, qa-backend/draft, module/<module>, layer/qa]
---

# 🧪 <Feature name> · QA Backend

> Blocked by default until [[<Feature name> Backend Delivery]] is `done` (the hand-off order in `docs.config.json`); `blockedBy: []` opts out, `blockedBy: [...]` names other blockers.

**Feature:** [[<Feature name>]] · **Verifies:** [[<Feature name> Backend Delivery]] against [[<Feature name> Story]] and [[<Feature name> Frontend Requirements]] · **Verdict:** Draft

Expected behaviour of the API, as artefacts a person can check a build against: tables and diagrams, **not test code** (the specs live in the backend repo). `status: passing` or `failing` after a run; the verdict tells the PM whether the story can be fulfilled (passing with nothing pending or unmet). A failing row is one of two things: a story part the delivery does not fulfil (not built, or built other than the story says) goes in `unmet` and turns the story's badge ✕; a bug (built as asked, but it breaks) is filed against the Backend Integration and goes in `pending`, and leaves the story alone.

## Scope

What is covered and what is deliberately not.

## Expected behaviour

| # | Given | When | Then | Checked |
|---|---|---|---|---|
| B1 | … | `POST /…` with … | 201, body has … | ⬜ |
| B2 | … | … | 404 `E_…` | ⬜ |

## State diagram

```mermaid
stateDiagram-v2
  [*] --> A
  A --> B: event
```

## Error matrix

| Situation | Status | ErrorCode | Same body as |
|---|---|---|---|

## Privacy and access checks

- Viewer not in the Ring → … (must be indistinguishable from …)

## Verdict

- Run on: — · build: — · result: — · failing rows: — · story parts unmet: — · bugs: —
