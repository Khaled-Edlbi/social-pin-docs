---
type: task
id: T-062
status: todo
priority: critical
effort: S
feature: files
module: identity
screens: [s14, s29, s30, s31, s44]
depends: []
created: 2026-10-15
updated: 2026-10-19
tags: [task, task/todo, module/identity, priority/critical]
---

# ⬜ T-062 · Serve uploaded file bytes by id

**Feature:** [[Files Upload]] · **Status:** To do · **Priority:** Critical · **Effort:** S (S < 1 day, M 1–3 days, L > 3 days)

**Sub-tasks:** [[T-062-fe Frontend · Serve uploaded file bytes by id|Frontend]] · [[T-062-be Backend · Serve uploaded file bytes by id|Backend]] · **Story:** [[T-062 Story]]

## What

A client cannot display a Ring photo or download an attachment today. `FileEntity` deliberately omits `storageKey`, the static `/uploads` mount is keyed by that storage path, and nothing maps a file **id** to bytes. So `avatarFileId` on every projection and view, and `attachments[].id`, are dead ends for the UI.

Add `GET /files/:id/content` (or a signed `url` on the view entities) that streams the bytes **after** an access check: the caller is the uploader, or the file is referenced by a Ring projection the caller may see, resolved through `RingAccessService` (golden rule 8). `PUBLIC` files (event covers, logos) skip the check. Keep `storageKey` private.

## Design

- [[Screen Index#s29|s29]] Photo for this Ring
- [[Screen Index#s30|s30]] Photo library
- [[Screen Index#s31|s31]] View as (flip)
- [[Screen Index#s44|s44]] Scanned Pin
- [[Screen Index#s14|s14]] Ring data

## Dependencies

- None. Found while writing the frontend notes on 2026-10-15.
- Makes [[Ring Projection Backend Integration]], [[View As & Pin Views Backend Integration]] and [[Files Upload Backend Integration]] renderable.

## Definition of done

- [ ] Route + access check through `RingAccessService`; `storageKey` never leaves the server
- [ ] A hidden attachment (`isVisible: false`) is not served to a viewer
- [ ] Spec covers uploader, member of a live Ring, non-member (same 404 body as `/views`), hidden row
- [ ] `pnpm typecheck && pnpm test` green
- [ ] Branch `file/T-062/serve-file-bytes` in both repos
- [ ] [[Files Upload]], [[Ring Projection]], [[View As & Pin Views]] notes and their frontend notes updated; `Frontend API Guide.md` in both repos
- [ ] [[Task Board]], [[Backlog]], [[Feature Tree]], [[Frontend Contract]] updated

## Log

- 2026-10-15 · created from the frontend documentation pass
