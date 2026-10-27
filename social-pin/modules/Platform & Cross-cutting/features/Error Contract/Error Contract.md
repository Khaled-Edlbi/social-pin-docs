---
type: feature
id: error-contract
name: "Error Contract"
priority: critical
release: mvp
module: platform
screens: []
created: 2026-10-18
updated: 2026-10-27
tags: [feature, module/platform, priority/critical, release/mvp]
---

# Error Contract

**Backend:** Partial (needs more) · **Priority:** Critical · **Release:** MVP · **Module:** [[Platform & Cross-cutting Module|Platform & Cross-cutting]]

**Layers:** [[Error Contract Story|Story]] · [[Error Contract Frontend Requirements|Frontend Requirements]] · [[Error Contract Backend Delivery|Backend Delivery]] · [[Error Contract Backend Integration|Backend Integration]] · [[Error Contract Frontend Delivery|Frontend Delivery]] · [[Error Contract QA Backend|QA Backend]] · [[Error Contract QA Frontend|QA Frontend]]

One error body for the whole API, with a stable per-domain code the client branches on and a human message it displays.

## Design reference

_No prototype screen. Every error state in the app depends on it._

## Work

One story per feature (since 2026-10-27): all of this feature's work is in [[Error Contract Story]]. The tasks merged into it on 2026-10-27:

| Was | Title | Status then | Priority | Now in the story |
|---|---|---|---|---|
| T-063 | Put the ErrorCode on the error body | To do | critical | S4–S8 |
| T-067 | Split E_RING_01 and E_RING_PROFILE_03 | To do | critical | S9–S11 |

### Log of the merged tasks

- T-063 · 2026-10-15 · created from the frontend documentation pass
- T-063 · 2026-10-25 · `tickets/pm/M-08-platform/F-35-error-contract/S-88-task-flow` · the ticket's card flow set up: the chain named above, `## Impact` written, relations declared. [[ND-19 Where a ticket's layer notes live]] raised from this ticket and fulfilled by [[D-19 A ticket's layer notes live on the parent task]] (option 1, the parent task). **Flagged:** both halves, whose *Layer notes* lines still point at their own cards — T-063-fe Frontend · Put the ErrorCode on the error body for `/frontend`, T-063-be Backend · Put the ErrorCode on the error body for `/backend`; each clears its own flag. **For `/owner`:** [[Agent Rules]] §2 still says "each half writes its own layer notes (`--scaffold <kind> T-063-fe`)" and the *Layer notes* line in `templates/Task Template.md` points a half at its own cards; both now read against D-19 and are flagged. **Next on this ticket:** `/frontend` writes T-063 Frontend Requirements, the only card not waiting on another.
- T-063 · 2026-10-18 · created as the backend half of T-063
- T-063 · 2026-10-18 · created as the frontend half of T-063
- T-067 · 2026-10-26 · created with `--scaffold task` under [[Error Contract]], for S3 of [[Error Contract Story]], which had no ticket. Critical, both sides, `depends: [T-063]` so it reads Blocked until the code is on the wire — splitting before that changes nothing a client can see, splitting after it is a contract change. **Flagged:** T-067-be Backend · Split E_RING_01 and E_RING_PROFILE_03, scaffolded with `depends: []` while this parent waits on T-063, so the board offers it as pickable; `/backend` types the inherited `depends` and clears it. The same is true of every half the scaffold writes, which is `/owner`'s to settle. **Next:** the ticket waits on T-063 Put the ErrorCode on the error body; when that is done, `/frontend` writes `T-067 Frontend Requirements`.
- T-067 · 2026-10-26 · created as the backend half of T-067
- T-067 · 2026-10-26 · created as the frontend half of T-067

## Decisions

- [[ND-19 Where a ticket's layer notes live]] — decided, a ticket's layer notes hang on the parent task and the halves write into them ([[D-19 A ticket's layer notes live on the parent task|D-19]]); raised from [[Error Contract Story|Error Contract · S4–S8]]

## Related

- [[API Conventions]]
- [[Frontend Contract]]

Project context: [[Ring Access Model]] · [[Architecture]] · [[API Conventions]] · [[Spec Map]]
