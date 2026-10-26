---
type: bug
id: B-02
status: done
resolution: fixed
priority: medium
effort: S
feature: account
module: identity
foundOn: Account Backend Integration
labels: []
screens: [s68]
depends: []
affects: ["Account Backend Integration", "Account Story", "Account QA Backend"]
related: ["Account QA Backend", "Account QA Frontend", "Account Backend Delivery", "Error Contract Backend Delivery", "Auth Model", "T-063 Put the ErrorCode on the error body", "Rings", "Profiles & Pin Name"]
pending: ["[[Account Frontend Delivery]]: keep the 404 branch on GET /users/me deliberately, and decide whether a 404 from any other authenticated route also ends the session (/frontend)", "[[Account QA Frontend]]: run F15 on a build with main @ b4984d6; needs a second phone (/qa)"]
created: 2026-10-26
updated: 2026-10-26
tags: [bug, bug/done, module/identity, priority/medium, resolution/fixed]
---

# ✅ B-02 · Deleted account answers 401, not the documented 404 E_USER_01

**Found against:** [[Account Backend Integration]] · **Feature:** [[Account]] · **Status:** Done · **Resolution:** fixed · **Priority:** Medium · **Deadline:** — · **Effort:** S

**Found by:** [[Account QA Backend]] row B14, on build `dev 2026-10-26 · localhost:3000`, and seen from the client in [[Account QA Frontend]] row F19.

## What

**What happens.** `DELETE /users/me` returns 200 with an empty body, as documented. Every later call with the same access token — `GET /users/me`, `GET /rings`, `GET /profiles` — answers `401 {"statusCode":401,"message":"Account is not active","error":"HttpException"}`. The guard rejects a `DELETED` account before any handler runs, so **no route can produce the 404**.

**What should happen.** [[Account Backend Integration]]'s error matrix tells the client to handle `404 E_USER_01` — "the account no longer exists (deleted elsewhere)" — as a sign-out state, and [[Account Story]] S4 repeats it. That row is unreachable. Either the guard lets a `DELETED` account through to the handler so it can answer 404, or — more likely the right call, since the 401 already carries the sign-out meaning the client needs — the matrix row and S4's criterion are corrected to say 401 and `E_USER_01` is retired from this path.

**Where.** The auth guard, and the error matrix of [[Account Backend Integration]], the card this bug hangs under. Code: `src/modules/auth/` (the guard), `src/modules/user/`. Screen [[Screen Index#s68|s68]].

**On which build.** `dev 2026-10-26 · localhost:3000`.

**What the client does with it.** [[Account Frontend Delivery]] has a branch for a 404 on `GET /users/me` that ends the session with "Your account has been deleted." Since the server never sends that 404, the branch is dead code and the user sees whatever the 401 path shows instead. Worth checking on a run which message actually appears ([[Account QA Frontend]] row F19).

**Worth knowing before fixing.** Nothing is broken for a user: the client signs out on the 401, which is what S4 asks for. This is a contract row that does not describe the build, and the cheap fix is to the documents. A deleted account and a **suspended** one also return the identical body, so the client cannot tell them apart and does not need to. Branching on the code is impossible anyway until [[T-063 Put the ErrorCode on the error body]] lands.

## Design

- [[Screen Index#s68|s68]]

## Impact

Output of `node scripts/build-tree.mjs --impact B-02` when the bug was filed: the notes this change touches and that must be updated or flagged when it ships.

- [[Account]] · F-01 — wikilink →
- [[Account Backend Integration]] · BI-01 — the card this bug was found against, and where it hangs: the `404 E_USER_01` row of its error matrix (flagged 2026-10-26)
- [[Account QA Backend]] · QB-04 — row B14, re-run when this ships
- [[Account QA Frontend]] · QF-04 — row F19, the client's dead 404 branch
- [[Account Story]] · S-01 — S4's third acceptance criterion names the 404
- [[Account Backend Delivery]] · BD-01 — describes the soft delete that the guard then intercepts
- [[Error Contract Backend Delivery]] · BD-35 — owns `E_USER_01` and the one body shape

## Definition of done

- [x] Decided which way it goes: the guard answers a `DELETED` account 404 `E_USER_01` (2026-10-26, @khaled: "fix it in the backend side")
- [x] ~~If the notes move: the `E_USER_01` row updated or retired in [[Account Backend Integration]], and [[Account Story]] S4 re-approved~~ — not applicable: the code moved to the contract, S4 is unchanged
- [ ] The client's dead 404 branch removed or kept deliberately, with [[Account Frontend Delivery]] saying which (`/frontend`) — in `pending`; the branch is live now
- [x] Code per the backend's `CLAUDE.md` — `JwtStrategy` only; no visibility decision involved
- [x] `pnpm typecheck && pnpm test` green — 216 tests, `main @ b4984d6`
- [x] The flag line on [[Account Backend Integration]] cleared
- [x] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] [[Account QA Backend]] row B14 ✅ on `main @ b4984d6` and cleared from its `pending`; [[Account QA Frontend]] row F15 (the deleted-account row; F19 is the suspended one) not run yet, in `pending` (`/qa`)
- [x] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-10-26 · branch `tickets/qa/M-01-identity/F-01-account/B-02-fixed` · `/qa` re-ran B14 on `main @ b4984d6` (localhost:3001, Node 22.22.2): a deleted account's old token answers `404 "User not found"` on `/users/me`, `/rings` and `/profiles`; a suspended one keeps 401 (B21 ✅). Closed `done`, `resolution: fixed`, on @khaled's word. Partial until the two `pending` items clear: [[Account Frontend Delivery]] (`/frontend`) and [[Account QA Frontend]] F15 (`/qa`, needs a second phone).
- 2026-10-26 · backend `B-02/auth/deleted-account-404`, merged to `main` as `b4984d6` · `JwtStrategy` answers a DELETED account (or a missing row) 404 `E_USER_01`; SUSPENDED and PENDING keep 401 `E_AUTH_03`. Backend notes updated; this card, both QA notes and [[Account Frontend Delivery]] flagged.

- 2026-10-26 · branch `docs/admin/project/bug-type` · retyped by `/admin`: `type: bug` (tags `bug`, `bug/<status>`) instead of a task with `labels: [bug]`, as every bug card now is. Nothing else changed: same code, same place in the tree, same status.
- 2026-10-26 · created with --scaffold task --label bug --found-on "Account Backend Integration", filed by QA from [[Account QA Backend]] row B14. Replaces T-075 and T-077, both withdrawn the same day with their codes retired, as the bug rule moved twice: first to hang a parentless bug under the feature's story, then to hang it under the card it was found against and number it `B-NN`.
