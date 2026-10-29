---
id: B-03
type: bug
module: identity
feature: auth
status: todo
priority: high
effort: S
foundOn: BI-02 Auth & Sign-up Backend Integration
screens: [s68]
depends: []
affects: ["BI-02 Auth & Sign-up Backend Integration", "BD-02 Auth & Sign-up Backend Delivery", "QB-05 Auth & Sign-up QA Backend"]
related: ["BI-02 Auth & Sign-up Backend Integration", "QB-05 Auth & Sign-up QA Backend", "Auth Model", "POST /auth/refresh", E_AUTH_04]
pending: []
created: 2026-10-27
updated: 2026-10-29
tags: [bug, bug/todo, module/identity, priority/high]
---

# ⬜ B-03 · Two refreshes at once both succeed and fork the session

**Found against:** [[BI-02 Auth & Sign-up Backend Integration]] · **Feature:** [[F-02 Auth & Sign-up]] · **Status:** To do · **Priority:** High · **Deadline:** — · **Effort:** S

**Found by:** [[QB-05 Auth & Sign-up QA Backend]] row B42, on build `main @ b4984d6 · localhost:3001, Node 22.22.2`.

## What

**What happens.** Two `POST /auth/refresh` calls sent at the same moment with the **same** refresh token both answer 201, each with a new pair. Both new refresh tokens stay live: after the race the account holds two unrevoked rows, and refreshing with either fork answers 201 again. Sequentially the rotation holds (a replay is 401 `E_AUTH_04`, row B41); only the concurrent case breaks. Reproduced on the third attempt of five in a follow-up run.

**What should happen.** [[BI-02 Auth & Sign-up Backend Integration]]: *"Refresh is single-use … returns a new pair and kills the one sent, in the same transaction"*, and *"Two concurrent refreshes end the session."* One of the two calls must answer 401 `E_AUTH_04`, and at most one new token may exist. This is also how a stolen refresh token is meant to surface ([[Auth Model]]): with the race, a thief who replays a token while its owner refreshes ends up with a session of their own instead of killing both.

**Where.** `POST /auth/refresh`: `AuthService.refresh` → `TokenService.findLiveRefreshToken` and the revoke of the presented row. The row is read, compared and revoked without a lock or a conditional update, so both transactions see it live. Code: `src/modules/auth/`.

**On which build.** `main @ b4984d6`, run 2026-10-27 on `localhost:3001` under Node 22.22.2.

The fix is the backend's (`/backend`): revoke with a conditional write (`revokedAt: null` in the `where`, and treat zero rows updated as 401), or lock the row, so exactly one rotation wins.

## Design

- [[Screen Index#s68|s68]]

## Impact

Output of `node scripts/build-tree.mjs --impact B-03` when the bug was filed: the notes the fix touches and that must be updated or flagged when it ships.

- [[BI-02 Auth & Sign-up Backend Integration]] · BI-02 — the "single-use" rule this breaks
- [[QB-05 Auth & Sign-up QA Backend]] · QB-05 — row B42, re-run when this ships
- [[F-02 Auth & Sign-up]] · F-02 — wikilink →

## Definition of done

- [ ] The behaviour is fixed, or the notes are corrected, as the decision says (`resolution:` set, the tag `resolution/<id>` with it)
- [ ] A spec in the backend repo that runs two rotations of one token concurrently and expects one 201 and one 401
- [ ] The QA row that found it (B42) re-run against the fix, on a named build
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-10-27 · filed with --scaffold bug, found against Auth & Sign-up Backend Integration, from [[QB-05 Auth & Sign-up QA Backend]] row B42 on `main @ b4984d6`
