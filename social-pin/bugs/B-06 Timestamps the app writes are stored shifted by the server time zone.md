---
type: bug
id: B-06
status: todo
priority: high
effort: M
feature: auth
module: identity
foundOn: BD-02 Auth & Sign-up Backend Delivery
labels: []
screens: []
depends: []
affects: ["BD-02 Auth & Sign-up Backend Delivery", "Database & Migrations", "QB-05 Auth & Sign-up QA Backend"]
related: ["BD-02 Auth & Sign-up Backend Delivery", "QB-05 Auth & Sign-up QA Backend", "Database & Migrations", "QB-04 Account QA Backend"]
pending: []
created: 2026-10-27
updated: 2026-10-28
tags: [bug, bug/todo, module/identity, priority/high]
---

# ⬜ B-06 · Timestamps the app writes are stored shifted by the server time zone

**Found against:** [[BD-02 Auth & Sign-up Backend Delivery]] · **Feature:** [[F-02 Auth & Sign-up]] (found here; the defect is in every module) · **Status:** To do · **Priority:** High · **Deadline:** — · **Effort:** M

**Found by:** [[QB-05 Auth & Sign-up QA Backend]] while setting up row B15, on build `main @ b4984d6 · localhost:3001, Node 22.22.2`.

## What

**What happens.** On a machine whose time zone is not UTC (here Node and Postgres both on `Asia/Damascus`, UTC+3), every `DateTime` the app writes is stored **3 hours early**. Seen on one sign-up at 12:00:57Z:

| Value | Written by | Stored as | True instant |
|---|---|---|---|
| `verification_codes.expires_at` | the app (`now + 10 min`) | 09:10:57Z | 12:10:57Z |
| `verification_codes.created_at` | Prisma's `@default(now())` | 09:00:57Z | 12:00:57Z |
| `users.created_at`, `updated_at` | Prisma | 09:00:57Z | 12:00:57Z |
| `now()` in Postgres | the database | 12:00:57Z | 12:00:57Z |

The app reads its own values back shifted the other way, so the API looks right (`lastLoginAt` and `expiresAt` come back correct, rows B1 and B34) and the app's own comparisons agree with each other. Anything that reads the column as the instant it claims to be does not: a raw query, Postgres's `now()` (a code aged with `now() - interval '1 minute'` was still accepted), a report, a backup restored elsewhere, and any constraint or index that compares stored times with each other or with `now()`.

**What should happen.** The backend's own rule (`CLAUDE.md`, *Prisma rules*): *"All `DateTime` columns are `@db.Timestamptz(3)`. The spec requires UTC storage with explicit timezones; `timestamp without time zone` would be reinterpreted by any raw query or external tool in the session timezone."* The columns are `timestamptz`, but the values reaching them are local wall-clock times labelled as UTC: the same failure by another route.

**Where.** The Prisma 7 driver adapter (`@prisma/adapter-pg`) path that serialises `Date` parameters, together with a non-UTC process or session time zone. Not specific to auth: every table is affected. Code: `src/prisma/`, `prisma.config.ts`.

**On which build.** `main @ b4984d6`, run 2026-10-27 on `localhost:3001` under Node 22.22.2, Postgres session `TimeZone = Asia/Damascus`.

**Worth knowing before fixing.** Existing rows written on this machine are already 3 hours early; a fix that makes new writes correct leaves old rows wrong, so it needs a decision on the data as well as the code (`/backend`). A machine whose process and database both run in UTC would not show this, which is why the specs (mocked Prisma) never could. Fixes to evaluate: pin the process and the connection's session to UTC, or configure the adapter so it sends instants with an offset.

## Design

No screen.

## Impact

Output of `node scripts/build-tree.mjs --impact B-06` when the bug was filed: the notes the fix touches and that must be updated or flagged when it ships.

- [[BD-02 Auth & Sign-up Backend Delivery]] · BD-02 — where it was found (code expiry)
- [[Database & Migrations]] — the `timestamptz` rule this breaks
- [[QB-05 Auth & Sign-up QA Backend]] · QB-05 — row B15's setup, re-run against a corrected build
- [[F-02 Auth & Sign-up]] · F-02 — wikilink →

## Definition of done

- [ ] The behaviour is fixed, and a decision taken for the rows already stored (`resolution:` set, the tag `resolution/<id>` with it)
- [ ] A check that runs with a non-UTC `TZ` and compares a stored value with Postgres `now()`
- [ ] [[QB-05 Auth & Sign-up QA Backend]] row B15 re-run by ageing a code with Postgres's `now()`, on a named build
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-10-27 · filed with --scaffold bug, found against Auth & Sign-up Backend Delivery, while setting up [[QB-05 Auth & Sign-up QA Backend]] row B15 on `main @ b4984d6`
