---
type: project
updated: 2026-10-18
tags: [project]
layer: backend
---
# Developer guide

Getting the Social Pin core backend running, and the handful of things about
this repo that are not obvious from the code.

Binding rules: `CLAUDE.md`. Spec coverage: `Spec Map.md`.

---

## Prerequisites

- **Node 22+** and **pnpm 10.18+** (`packageManager` pins it).
- **PostgreSQL 14+ with PostGIS.** PostGIS is not optional: the first migration
  creates the extension, and `pincasts.geo` is a `geography` column.
  `btree_gist` is also required, for the exclusion constraint on
  `availability_slots`.

A disposable local database, with both extensions available:

```bash
docker run -d --name social-pin-db \
  -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=social_pin \
  -p 5432:5432 postgis/postgis:16-3.4
```

## First run

```bash
pnpm install
cp .env.example .env          # then fill in the two JWT secrets
pnpm prisma:generate          # writes src/generated/prisma (git-ignored)
pnpm prisma:deploy            # applies the three migrations in order
pnpm db:seed                  # permissions, roles, interests, demo accounts
pnpm start:dev
```

The startup banner then prints every address the app serves:

```
[Bootstrap] Social Pin API — development
[Bootstrap]   API      http://localhost:3000/api/v1
[Bootstrap]   Docs     http://localhost:3000/docs
[Bootstrap]   OpenAPI  http://localhost:3000/docs-json
[Bootstrap]   Uploads  http://localhost:3000/uploads
[Bootstrap] WARN  OTP delivery is not configured — verification codes are logged above.
```

Read it rather than Nest's route log. With URI versioning, Nest prints
`Mapped {/api/auth/login, POST} (version: 1)` — and `/api/auth/login` is a 404,
because the `v1` is applied per request and never appears in that line. The
banner prints the base that actually works.

The seeded demo accounts sign in with `POST /auth/login` and the `devCode` it
returns.

Generate the secrets with:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
```

`validateEnv` fails the process at boot if `DATABASE_URL`, `JWT_SECRET` or
`JWT_REFRESH_SECRET` is missing — deliberately, so a token is never signed with
an empty string.

## Verifying a checkout

```bash
pnpm prisma:generate && pnpm typecheck && pnpm test
pnpm test:e2e          # needs a migrated + seeded disposable database
```

## The three migrations, and why they are hand-written

`prisma migrate dev` cannot produce this sequence, so the migrations are
authored and committed directly.

| Order | Migration | Contents |
|---|---|---|
| 1 | `20261007115900_extensions` | `CREATE EXTENSION postgis, btree_gist`. Must precede the tables: `pincasts.geo` is a `geography` column, so the type has to exist first. |
| 2 | `20261007120000_init` | The 75 tables, 72 enums, 135 FKs and 176 indexes. Generated with `prisma migrate diff --from-empty --to-schema`. |
| 3 | `20261007120100_constraints_and_indexes` | Everything Prisma's schema language cannot say. |

What is in the third one, and why each needs raw SQL:

- **Partial unique indexes.** Postgres treats distinct NULLs as unequal, so a
  `@@unique` containing a nullable column does not constrain the NULL rows.
  These do: one default profile per account, one default ring per owner, one
  GLOBAL role grant per user, one live subscription per owner and plan.
- **CHECK constraints.** An order has exactly one buyer (user **or** business);
  a post must carry a ring or an event; time windows are ordered; money is
  non-negative; a connection's pair is canonical (`user_a_id < user_b_id`) and
  nothing is a relation to itself.
- **An exclusion constraint** on `availability_slots`:
  `EXCLUDE USING GIST (user_id WITH =, tstzrange(starts_at, ends_at, '[)') WITH &&)`.
  The service also checks for overlap, but two concurrent inserts can both pass
  a check and then both commit. Only the database can decide this one. Ranges
  are half-open, so a slot ending at 10:00 and one starting at 10:00 do not
  conflict.
- **The PostGIS trigger and GiST index.** A trigger rather than a generated
  column, because the generated form depends on the geometry→geography cast
  being marked immutable, which varies across PostGIS builds.

The third migration is **additive**, but one line of it is still visible to
Prisma: the GiST index `pincasts_geo_gist`. Prisma cannot type the `geo` column,
yet it can see an index on it, so

```bash
npx prisma migrate diff --from-migrations prisma/migrations --to-schema prisma/schema
```

reports one difference — *"Removed index on columns (geo)"*. Consequently
**`prisma migrate dev` will offer to generate a migration dropping that index**.
Do not accept it; dropping it would remove the index behind every nearby-PinCast
radius query.

Use `pnpm prisma:deploy` (`prisma migrate deploy`) instead. It applies the
recorded migrations without diffing, so the index is never at risk.

### Adding a schema change

```bash
# 1. edit prisma/schema/<domain>.prisma
pnpm prisma:generate

# 2. generate the SQL for the delta
mkdir -p prisma/migrations/$(date +%Y%m%d%H%M%S)_<description>
pnpm prisma migrate diff \
  --from-migrations prisma/migrations \
  --to-schema prisma/schema \
  --script -o prisma/migrations/<new folder>/migration.sql
```

Read the generated SQL before committing. Never edit an applied migration.

## Things that will otherwise cost you an afternoon

**`prisma.config.ts` must `import 'dotenv/config'`.** The Prisma 7 CLI no longer
loads `.env` itself. Without it every CLI command runs with an undefined
`DATABASE_URL` and reports an empty datasource url.

**Import the generated client, not `@prisma/client`.** Always
`../../generated/prisma/client`, by relative path.

**There is no `Prisma.validator`.** The `prisma-client` generator does not ship
one. Use `satisfies`.

**TypeScript is pinned to 6.x on purpose.** The Nest CLI and the Swagger plugin
call TypeScript's programmatic compiler API, which 7.0 drops until 7.1. A
consequence is no `baseUrl` path aliases — relative imports throughout.

**Every new `DateTime` column needs `@db.Timestamptz(3)`.** The default
`timestamp without time zone` would be reinterpreted in the session timezone by
any raw query or external tool, and the exclusion constraint needs `tstzrange`.

**The Jest setup has two shims, in `jest.swc-env.js`.** It has to run as plain
CommonJS before the first transform. See the deviations list in `CLAUDE.md` for
what each one works around; the short version is an `@swc/core` cache path that
overflows Windows' `MAX_PATH`, and Prisma's generated `.js` import specifiers.

**OTP delivery is not wired.** `AuthService.issueCode` logs the code. In
development, read it from the server output:

```
[dev] verification code for sara@example.com (SIGN_UP): 482913
```

The same code also comes back in the response as `devCode`, **in every
environment** — there are no passwords, so without it nothing could sign in.
While it is returned, anyone who knows an account's email or phone can sign in
as it. Remove it (`AuthService.issueCode`, `VerificationChallengeEntity`) when
a delivery provider is wired.

## Walking the main flow by hand

```bash
BASE=http://localhost:3000/api/v1

# 1. sign up — returns a challenge with devCode
curl -s -X POST $BASE/auth/sign-up \
  -H 'content-type: application/json' \
  -d '{"email":"new@example.com"}'
# → {"destination":"new@example.com","channel":"EMAIL",
#    "expiresAt":"...","devCode":"482913"}

# 2. answer it with devCode (or with the code from the server log)
curl -s -X POST $BASE/auth/verify-code \
  -H 'content-type: application/json' \
  -d '{"destination":"new@example.com","code":"482913","purpose":"SIGN_UP"}'

# 3. pick a pin name — creates profile, default ring, projection
curl -s -X POST $BASE/auth/complete-registration \
  -H 'content-type: application/json' \
  -d '{"onboardingToken":"<from step 2>","pinName":"NewPerson","fullName":"New Person"}'
```

Or skip all three and sign in as a seeded account — two calls:

```bash
curl -s -X POST $BASE/auth/login \
  -H 'content-type: application/json' \
  -d '{"identifier":"sara@socialpin.test"}'
# → {..., "devCode":"482913"}

curl -s -X POST $BASE/auth/login/verify \
  -H 'content-type: application/json' \
  -d '{"identifier":"sara@socialpin.test","code":"482913"}'
```

Then the thing worth seeing — the same pin name returning different bodies to
different viewers, and a 404 to someone in none of her rings:

```bash
curl -s $BASE/views/pin/SaraAz -H "Authorization: Bearer <omar's token>"
curl -s $BASE/views/pin/SaraAz -H "Authorization: Bearer <organizer's token>"
curl -s $BASE/views/pin/SaraAz -H "Authorization: Bearer <admin's token>"   # 404
```

## Seeded demo accounts

Created only when `NODE_ENV !== 'production'`. Sign in with an OTP code, as
above.

| Email | Pin | Role | Notes |
|---|---|---|---|
| `sara@socialpin.test` | `!SaraAz` | USER (Pro) | Three rings with different projections; one hidden link |
| `omar@socialpin.test` | `!OmarK` | EXHIBITOR (Pro) | In Sara's "E-commerce Clients" ring |
| `organizer@socialpin.test` | `!GulfExpo` | ORGANIZER (Pro) | In Sara's "Family" ring |
| `admin@socialpin.test` | `!SPAdmin` | SUPER_ADMIN | In none of Sara's rings — the negative case |

The admin account is the useful one: a platform role grants **no** view of
someone's profile. Only ring membership does.

## Project layout

See `CLAUDE.md` → Folder structure. The three directories worth knowing first:

- `src/modules/ring-access/` — the one service that decides visibility. Read it
  before touching any read path.
- `src/modules/ring-profile/` — the projection: how a viewer's request becomes a
  response.
- `prisma/schema/` — one file per domain, mirroring `src/modules/`. Every model
  carries a comment citing the spec clause it implements.

## CI

```bash
pnpm install --frozen-lockfile
pnpm prisma:generate
pnpm typecheck
pnpm test
pnpm prisma:deploy && pnpm db:seed && pnpm test:e2e   # against a throwaway Postgres
```

The e2e job needs a `postgis/postgis` service container, not plain `postgres` —
the first migration will fail without the extension.
