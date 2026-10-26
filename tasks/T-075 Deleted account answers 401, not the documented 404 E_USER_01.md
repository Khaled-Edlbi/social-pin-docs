---
type: task
id: T-075
status: todo
priority: medium
effort: S
feature: account
module: identity
labels: [bug]
screens: [s68]
depends: []
affects: ["Account Backend Integration", "Account Story", "Account QA Backend"]
related: ["Account Backend Delivery", "Error Contract Backend Delivery", "Auth Model", "Account QA Backend", "T-063 Put the ErrorCode on the error body", "Rings", "Profiles & Pin Name"]
pending: []
created: 2026-10-26
updated: 2026-10-26
tags: [task, task/todo, module/identity, priority/medium, bug]
---

# ⬜ T-075 · Deleted account answers 401, not the documented 404 E_USER_01

**Feature:** [[Account]] · **Status:** To do · **Priority:** Medium · **Deadline:** — · **Effort:** S · **Found by:** [[Account QA Backend]] row B14, build `dev 2026-10-26 · localhost:3000`

**Layer notes** (created with `node scripts/build-tree.mjs --scaffold <kind> T-075` as each team picks the task up): [[T-075 Backend Delivery|Backend Delivery]] · [[T-075 QA Backend|QA Backend]]

## What

**What happens.** `DELETE /users/me` returns 200 with an empty body, as documented. Every later call with the same access token — `GET /users/me`, `GET /rings`, `GET /profiles` — answers `401 {"statusCode":401,"message":"Account is not active","error":"HttpException"}`. The guard rejects a `DELETED` account before any handler runs, so **no route can produce the 404**.

**What should happen.** [[Account Backend Integration]]'s error matrix tells the client to handle `404 E_USER_01` — "the account no longer exists (deleted elsewhere)" — as a sign-out state, and [[Account Story]] S4 repeats it ("a later 404 from `GET /users/me` … is treated as a sign-out"). That row is unreachable. Either the guard lets a `DELETED` account through to the handler so it can answer 404, or — more likely the right call, since the 401 already carries the sign-out meaning the client needs — the matrix row and S4's criterion are corrected to say 401 and `E_USER_01` is retired from this path.

**Where.** The auth guard, and the error matrix of [[Account Backend Integration]]. Code: `src/modules/auth/` (the guard), `src/modules/user/`. Screen [[Screen Index#s68|s68]].

**Worth knowing before fixing.** The client's behaviour is already correct: it signs out on the 401, which is what S4 asks for. Nothing is broken for a user — this is a contract row that does not describe the build, and the cheap fix is to the documents. Note also that a deleted account and a **suspended** one return the identical body, so the client cannot tell them apart and does not need to. Branching on the code is impossible anyway until [[T-063 Put the ErrorCode on the error body]] lands.

## Design

- [[Screen Index#s68|s68]]

## Impact

Output of `node scripts/build-tree.mjs --impact T-075` when the task was written: the notes this change touches and that must be updated or flagged when it ships.

- [[Account]] · F-01 — wikilink →
- [[Account Backend Integration]] · BI-01 — the `404 E_USER_01` row of the error matrix (flagged 2026-10-26)
- [[Account Story]] · S-01 — S4's third acceptance criterion names the 404
- [[Account Backend Delivery]] · BD-01 — describes the soft delete that the guard then intercepts
- [[Error Contract Backend Delivery]] · BD-35 — owns `E_USER_01` and the one body shape
- [[Account QA Backend]] · QB-04 — row B14 re-run when this ships

## Definition of done

- [ ] Decided which way it goes: the guard lets `DELETED` through to a 404, or the notes are corrected to 401
- [ ] If the notes move: the `E_USER_01` row updated or retired in [[Account Backend Integration]], and [[Account Story]] S4 re-approved (`/pm`, then `/owner`)
- [ ] Code per the backend's `CLAUDE.md`
- [ ] `pnpm typecheck && pnpm test` green
- [ ] The flag line on [[Account Backend Integration]] cleared
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] [[Account QA Backend]] row B14 re-run on a named build (`/qa`)
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-10-26 · filed by QA against [[Account QA Backend]] row B14 (no parent task: the finding is feature-level)
