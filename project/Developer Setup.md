---
type: project
updated: 2026-10-15
tags: [project]
---

# Developer Setup

Short version. The full guide, including the migration story and the flow walked by hand with curl, is [[DEVELOPER_GUIDE]].

## Prerequisites

Node 22+, pnpm 10.18+, PostgreSQL 14+ **with PostGIS and `btree_gist`**.

```bash
docker run -d --name social-pin-db \
  -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=social_pin \
  -p 5432:5432 postgis/postgis:16-3.4
```

## First run

```bash
pnpm install
cp .env.example .env          # fill in JWT_SECRET and JWT_REFRESH_SECRET
pnpm prisma:generate
pnpm prisma:deploy            # never `migrate dev`, see Database & Migrations
pnpm db:seed
pnpm start:dev
```

Read the startup banner, not Nest's route log: the real base is `http://localhost:3000/api/v1`, docs at `/docs`, OpenAPI at `/docs-json`.

## Verify

```bash
pnpm prisma:generate && pnpm typecheck && pnpm test     # 168 tests, 9 suites
pnpm test:e2e                                            # needs a migrated + seeded disposable DB (never run yet, see T-055)
```

## Demo accounts (non-production only)

All share the password `socialpin-dev-password`.

| Email | Pin | Role | Why it matters |
|---|---|---|---|
| `sara@socialpin.test` | `!SaraAz` | USER (Pro) | Three Rings with different projections; one hidden link |
| `omar@socialpin.test` | `!OmarK` | EXHIBITOR (Pro) | In Sara's "E-commerce Clients" Ring |
| `organizer@socialpin.test` | `!GulfExpo` | ORGANIZER (Pro) | In Sara's "Family" Ring |
| `admin@socialpin.test` | `!SPAdmin` | SUPER_ADMIN | In none of Sara's Rings: `GET /views/pin/SaraAz` is a 404 for them. A platform role grants no view. |

## Things that cost an afternoon

- `prisma.config.ts` must `import 'dotenv/config'`.
- Import the generated client, not `@prisma/client`.
- There is no `Prisma.validator`; use `satisfies`.
- TypeScript stays on 6.x.
- Every new `DateTime` needs `@db.Timestamptz(3)`.
- Jest needs `jest.swc-env.js` to run first (an `@swc/core` cache-path shim and a `.js`-specifier mapper).

Related: [[Architecture]] · [[Database & Migrations]] · [[E2E Test Run]]
