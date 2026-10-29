---
id: B-05
type: bug
module: identity
feature: auth
status: todo
priority: low
effort: S
foundOn: BI-02 Auth & Sign-up Backend Integration
screens: [s06]
depends: []
affects: ["BI-02 Auth & Sign-up Backend Integration", "QB-05 Auth & Sign-up QA Backend"]
related: ["BI-02 Auth & Sign-up Backend Integration", "QB-05 Auth & Sign-up QA Backend", "POST /auth/complete-registration", E_AUTH_05]
pending: []
created: 2026-10-27
updated: 2026-10-29
tags: [bug, bug/todo, module/identity, priority/low]
---

# ⬜ B-05 · Expired onboarding token answers 401, not the documented 400

**Found against:** [[BI-02 Auth & Sign-up Backend Integration]] · **Feature:** [[F-02 Auth & Sign-up]] · **Status:** To do · **Priority:** Low · **Deadline:** — · **Effort:** S

**Found by:** [[QB-05 Auth & Sign-up QA Backend]] row B30, on build `main @ b4984d6 · localhost:3001, Node 22.22.2`.

## What

**What happens.** `POST /auth/complete-registration` with an onboarding token past its 15 minutes, or with a broken signature, answers **401** `{ message: "Verification session is invalid or expired" }`.

**What should happen.** [[BI-02 Auth & Sign-up Backend Integration]]: *"400 `E_AUTH_05`: the onboarding token expired or was issued for another purpose → back to s02"*. The wrong-purpose case does answer 400 ("This verification was not for a sign-up"); only the expired or forged token differs.

**Where.** `POST /auth/complete-registration`: `TokenService.verifyOnboardingToken` throws `HttpStatus.UNAUTHORIZED`. Code: `src/modules/auth/token.service.ts`.

**On which build.** `main @ b4984d6`, run 2026-10-27 on `localhost:3001` under Node 22.22.2.

**Worth knowing before fixing.** Nothing breaks for a user as long as the client treats both statuses as "back to s02", and the code (`E_AUTH_05`) is the same. But a client that follows the integration note handles 400 only, and a generic 401 handler may try a token refresh the user does not have. Either the status moves to 400, or the integration note says 401: a small call, the backend's (`/backend`).

## Design

- [[Screen Index#s06|s06]]

## Impact

Output of `node scripts/build-tree.mjs --impact B-05` when the bug was filed: the notes the fix touches and that must be updated or flagged when it ships.

- [[BI-02 Auth & Sign-up Backend Integration]] · BI-02 — the `E_AUTH_05` row of complete-registration
- [[QB-05 Auth & Sign-up QA Backend]] · QB-05 — row B30, re-run when this ships
- [[F-02 Auth & Sign-up]] · F-02 — wikilink →

## Definition of done

- [ ] The behaviour is fixed, or the notes are corrected, as the decision says (`resolution:` set, the tag `resolution/<id>` with it)
- [ ] The QA row that found it (B30) re-run against the fix, on a named build
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-10-27 · filed with --scaffold bug, found against Auth & Sign-up Backend Integration, from [[QB-05 Auth & Sign-up QA Backend]] row B30 on `main @ b4984d6`
