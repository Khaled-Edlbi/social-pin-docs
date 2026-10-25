---
type: task
id: T-063
status: todo
priority: critical
effort: S
feature: error-contract
module: platform
screens: []
depends: []
affects: ["API Conventions", "Frontend Contract", "Error Contract", "Error Contract Backend Delivery"]
related: ["T-063 Story", "D-19", "DR-19"]
pending: []
owner: "khaled"
created: 2026-10-15
updated: 2026-10-25
tags: [task, task/todo, module/platform, priority/critical]
---

# ⬜ T-063 · Put the ErrorCode on the error body

**Feature:** [[Error Contract]] · **Status:** To do · **Priority:** Critical · **Effort:** S (S < 1 day, M 1–3 days, L > 3 days)

**Sub-tasks:** [[T-063-fe Frontend · Put the ErrorCode on the error body|Frontend]] · [[T-063-be Backend · Put the ErrorCode on the error body|Backend]] · **Story:** [[T-063 Story]]

**Layer notes** (this ticket's chain, on the parent task per [[DR-19 A ticket's layer notes live on the parent task]]; each layer scaffolds its own with `node scripts/build-tree.mjs --scaffold <kind> T-063`): [[T-063 Frontend Requirements|Frontend Requirements]] → [[T-063 Backend Delivery|Backend Delivery]] → [[T-063 Backend Integration|Backend Integration]] → [[T-063 Frontend Delivery|Frontend Delivery]], with [[T-063 QA Backend|QA Backend]] after the delivery and [[T-063 QA Frontend|QA Frontend]] after the client. None is written yet; the chain is drawn under the ticket in the tree, each card blocked by the one before it.

## What

Every service throws `new HttpException({ ErrorCode, message }, status)` and the Frontend guide tells clients to **branch on the code and display the message**. But `AllExceptionsFilter` (`src/common/filters/all-exceptions.filter.ts`) copies only `message` and `error` from the exception response into the body it sends. The wire body is `{ statusCode, message, error, path, timestamp }` and `error` reads `"HttpException"` for every domain error. The stable code never reaches the client.

Add `errorCode` (camelCase on the wire, per the naming rule) to `ErrorBody`, copied from the exception response when present and omitted otherwise. Add a filter spec that asserts a domain error's body carries it and a validation error's does not. Update the error-shape examples in `Frontend API Guide.md` (both repos), [[API Conventions]] and [[Frontend Contract]].

## Design

No screen. Every error state in the app depends on it.

## Dependencies

- None. Found while writing the frontend notes on 2026-10-15.
- Every frontend note's "Errors to handle" table assumes this ships.

## Impact

`node scripts/build-tree.mjs --impact T-063`, 2026-10-25. Read in this order:

- **This ticket.** [[T-063 Story]] (S-88, approved), the halves [[T-063-be Backend · Put the ErrorCode on the error body]] (to do) and [[T-063-fe Frontend · Put the ErrorCode on the error body]] (blocked by the backend half), and the chain above, all seven cards not written yet. [[D-19 Where a ticket's layer notes live]] is fulfilled by [[DR-19 A ticket's layer notes live on the parent task]].
- **The feature.** [[Error Contract]] (F-35) and [[Error Contract Story]] (S-87), which this story rolls up into; [[Error Contract Backend Delivery]] (BD-35) is where the backend half rolls its delivery up.
- **The reference the change rewrites.** [[API Conventions]] (P-10), [[Frontend Contract]], [[Auth Model]] (P-12) and `Frontend API Guide.md` in both repositories: each carries an error-shape example that gains `errorCode`.
- **Everything that branches on a code.** The error codes travel: `E_AUTH_01/02/03/05/06/08`, `E_PROFILE_02`, `E_RING_01/04`, `E_USER_04` and `DELETE /rings/:id` are shared with [[Auth & Sign-up]] (F-02), [[Account]] (F-01), [[Rings]] (F-11), [[Profiles & Pin Name]] (F-07), [[Code Delivery]] (F-32), [[Delegated Admins]] (F-16), [[Devices & NFC]] (F-33), [[Ring Projection]] (F-10), [[Onboarding Imports]] (F-05), [[Event Ring Auto-creation]] (F-21), [[Exhibitor]] (F-24) and [[Meetings]] (F-26). Nothing in them changes: they gain a field they can read.
- **The notes that wait on it.** Every Frontend Requirements note in the vault links this ticket from its *Errors to handle* table and carries an "until T-063" line to remove when it ships. They are the frontend's to update, not this ticket's to edit.

## Definition of done

- [ ] `ErrorBody.errorCode?: string`, set from `exception.getResponse().ErrorCode`
- [ ] Filter spec: domain error → `errorCode` present; `BadRequestException` from the `ValidationPipe` → absent and `message` is a string array
- [ ] `pnpm typecheck && pnpm test` green
- [ ] Branch `common/T-063/error-code-on-body` in both repos
- [ ] `Frontend API Guide.md` (both repos), [[API Conventions]], [[Frontend Contract]], [[Error Contract]] updated; the "until T-063" lines removed from the frontend notes
- [ ] [[Task Board]], [[Backlog]], [[Feature Tree]] updated

## Log

- 2026-10-15 · created from the frontend documentation pass
- 2026-10-25 · `tickets/pm/M-08-platform/F-35-error-contract/S-88-task-flow` · the ticket's card flow set up: the chain named above, `## Impact` written, relations declared. [[D-19 Where a ticket's layer notes live]] raised from this ticket and fulfilled by [[DR-19 A ticket's layer notes live on the parent task]] (option 1, the parent task). **Flagged:** both halves, whose *Layer notes* lines still point at their own cards — [[T-063-fe Frontend · Put the ErrorCode on the error body]] for `/frontend`, [[T-063-be Backend · Put the ErrorCode on the error body]] for `/backend`; each clears its own flag. **For `/owner`:** [[Agent Rules]] §2 still says "each half writes its own layer notes (`--scaffold <kind> T-063-fe`)" and the *Layer notes* line in `templates/Task Template.md` points a half at its own cards; both now read against DR-19 and are flagged. **Next on this ticket:** `/frontend` writes [[T-063 Frontend Requirements]], the only card not waiting on another.
