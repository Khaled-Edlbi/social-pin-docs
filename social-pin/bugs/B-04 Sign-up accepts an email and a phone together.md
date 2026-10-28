---
type: bug
id: B-04
status: todo
priority: medium
effort: S
feature: auth
module: identity
foundOn: BI-02 Auth & Sign-up Backend Integration
labels: []
screens: [s01]
depends: []
affects: ["BI-02 Auth & Sign-up Backend Integration", "QB-05 Auth & Sign-up QA Backend"]
related: ["BI-02 Auth & Sign-up Backend Integration", "QB-05 Auth & Sign-up QA Backend", "POST /auth/sign-up", E_AUTH_07]
pending: []
created: 2026-10-27
updated: 2026-10-28
tags: [bug, bug/todo, module/identity, priority/medium]
---

# ⬜ B-04 · Sign-up accepts an email and a phone together

**Found against:** [[BI-02 Auth & Sign-up Backend Integration]] · **Feature:** [[F-02 Auth & Sign-up]] · **Status:** To do · **Priority:** Medium · **Deadline:** — · **Effort:** S

**Found by:** [[QB-05 Auth & Sign-up QA Backend]] row B5, on build `main @ b4984d6 · localhost:3001, Node 22.22.2`.

## What

**What happens.** `POST /auth/sign-up { email, phone }` answers 201 and sends the code to the **email**. The PENDING account is stored with **both** the email and the phone. The phone was never proven, yet it is now attached: a later `sign-up { phone }` with that number answers 201 and continues the same PENDING account (a code to the phone), and once the account completes, the number belongs to it without ever having been verified.

**What should happen.** [[BI-02 Auth & Sign-up Backend Integration]]: *"Exactly one: neither is a 400 `E_AUTH_07`"*, and its error table: *"sign-up with neither or both of email / phone"* → 400 `E_AUTH_07`.

**Where.** `POST /auth/sign-up`: `UserService.findOrCreatePending` rejects only the body with neither; `SignUpDto` leaves "exactly one" to the service. Code: `src/modules/user/`, `src/modules/auth/dto/sign-up.dto.ts`.

**On which build.** `main @ b4984d6`, run 2026-10-27 on `localhost:3001` under Node 22.22.2.

The fix is the backend's (`/backend`): reject both with 400 `E_AUTH_07`, as the contract says. Or, if both should be allowed, that is a product call and the integration note moves instead.

## Design

- [[Screen Index#s01|s01]]

## Impact

Output of `node scripts/build-tree.mjs --impact B-04` when the bug was filed: the notes the fix touches and that must be updated or flagged when it ships.

- [[BI-02 Auth & Sign-up Backend Integration]] · BI-02 — the `E_AUTH_07` row
- [[QB-05 Auth & Sign-up QA Backend]] · QB-05 — row B5, re-run when this ships
- [[F-02 Auth & Sign-up]] · F-02 — wikilink →

## Definition of done

- [ ] The behaviour is fixed, or the notes are corrected, as the decision says (`resolution:` set, the tag `resolution/<id>` with it)
- [ ] The QA row that found it (B5) re-run against the fix, on a named build
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-10-27 · filed with --scaffold bug, found against Auth & Sign-up Backend Integration, from [[QB-05 Auth & Sign-up QA Backend]] row B5 on `main @ b4984d6`
