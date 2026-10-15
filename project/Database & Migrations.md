---
type: project
updated: 2026-10-15
tags: [project]
---

# Database & Migrations

## Prisma 7 rules

- Config is `prisma.config.ts` at the repo root and must `import 'dotenv/config'` (the Prisma 7 CLI no longer loads `.env`).
- Multi-file schema in `prisma/schema/`, one file per domain mirroring `src/modules/`; `config.prisma` holds only generator and datasource, with **no `url`** in the datasource block.
- Import from `../../generated/prisma/client`, never `@prisma/client`.
- **No `Prisma.validator`** on this generator: use `satisfies` select objects and `GetPayload` types in `src/prisma/validators/`.
- **All `DateTime` columns are `@db.Timestamptz(3)`.** A new one without it is a bug.
- Services use `TransactionHost#tx`, never `PrismaService`.

## The three migrations

| Order | Migration | Why separate |
|---|---|---|
| 1 | `…_extensions` | `CREATE EXTENSION postgis, btree_gist`; must precede the tables because `pincasts.geo` is a `geography` column |
| 2 | `…_init` | The 75 tables, 72 enums, 135 FKs, 176 indexes |
| 3 | `…_constraints_and_indexes` | Partial unique indexes, CHECK constraints, the `availability_slots` exclusion constraint, the PostGIS trigger and GiST index |

**Use `pnpm prisma:deploy`, never `prisma migrate dev`.** Prisma can see the GiST index on `geo` but cannot type the column, so `migrate dev` offers a migration that **drops the geospatial index**. `migrate deploy` never diffs.

**Never edit an applied migration.** A schema change gets a new folder:

```bash
pnpm prisma:generate
mkdir -p prisma/migrations/$(date +%Y%m%d%H%M%S)_<description>
pnpm prisma migrate diff --from-migrations prisma/migrations --to-schema prisma/schema \
  --script -o prisma/migrations/<new folder>/migration.sql
```

Read the SQL before committing.

## Constraints the database owns

- One default profile per account, one default Ring per owner, one GLOBAL role grant per user, one live subscription per owner and plan (partial unique indexes).
- An order has exactly one buyer; a post carries a Ring or an event; time windows are ordered; money is non-negative; a connection pair is canonical (`user_a_id < user_b_id`).
- `availability_slots`: `EXCLUDE USING GIST (user_id WITH =, tstzrange(starts_at, ends_at, '[)') WITH &&)`. Two concurrent bookings cannot both commit.
- `pincasts.geo` kept in sync by the `pincasts_sync_geo` trigger, GiST-indexed.

## Schema changes the design will need

| Change | Driven by |
|---|---|
| Base profile work fields (headline, company, location, avatar, bio) | [[D-02 Base profile work fields]] |
| Field library (profile-owned links / info blocks, per-Ring visibility rows) | [[D-03 Field library vs per-Ring copies]] |
| Ring settings columns (audience, join policy, members visible, …) | [[D-04 Ring settings]] |
| `pinNameChangedAt` | [[D-06 Pin name rules]] |
| `WIDGET_TYPE` + AVAILABILITY, PAYMENT, NOW_PLAYING, TESTIMONIAL | [[Widgets]] |
| Products / catalogue table | [[Events During]] |
| Ring invitation state | [[Ring Invitations & Join]] |

## Seeding

`pnpm db:seed`, explicit and idempotent (`upsert`). Reference data (permissions, roles, interests) everywhere; demo users only when `NODE_ENV !== 'production'`. Demo accounts are listed in [[Developer Setup]].

Related: [[SPEC_MAP]] (entity → model → file) · [[DEVELOPER_GUIDE]]
