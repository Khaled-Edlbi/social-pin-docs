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
created: 2026-10-15
updated: 2026-10-19
tags: [task, task/todo, module/platform, priority/critical]
---

# ⬜ T-063 · Put the ErrorCode on the error body

**Feature:** [[Error Contract]] · **Status:** To do · **Priority:** Critical · **Effort:** S (S < 1 day, M 1–3 days, L > 3 days)

**Sub-tasks:** [[T-063-fe Frontend · Put the ErrorCode on the error body|Frontend]] · [[T-063-be Backend · Put the ErrorCode on the error body|Backend]] · **Story:** [[T-063 Story]]

## What

Every service throws `new HttpException({ ErrorCode, message }, status)` and the Frontend guide tells clients to **branch on the code and display the message**. But `AllExceptionsFilter` (`src/common/filters/all-exceptions.filter.ts`) copies only `message` and `error` from the exception response into the body it sends. The wire body is `{ statusCode, message, error, path, timestamp }` and `error` reads `"HttpException"` for every domain error. The stable code never reaches the client.

Add `errorCode` (camelCase on the wire, per the naming rule) to `ErrorBody`, copied from the exception response when present and omitted otherwise. Add a filter spec that asserts a domain error's body carries it and a validation error's does not. Update the error-shape examples in `Frontend API Guide.md` (both repos), [[API Conventions]] and [[Frontend Contract]].

## Design

No screen. Every error state in the app depends on it.

## Dependencies

- None. Found while writing the frontend notes on 2026-10-15.
- Every frontend note's "Errors to handle" table assumes this ships.

## Definition of done

- [ ] `ErrorBody.errorCode?: string`, set from `exception.getResponse().ErrorCode`
- [ ] Filter spec: domain error → `errorCode` present; `BadRequestException` from the `ValidationPipe` → absent and `message` is a string array
- [ ] `pnpm typecheck && pnpm test` green
- [ ] Branch `common/T-063/error-code-on-body` in both repos
- [ ] `Frontend API Guide.md` (both repos), [[API Conventions]], [[Frontend Contract]], [[Error Contract]] updated; the "until T-063" lines removed from the frontend notes
- [ ] [[Task Board]], [[Backlog]], [[Feature Tree]] updated

## Log

- 2026-10-15 · created from the frontend documentation pass
