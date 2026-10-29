---
id: P-13
type: project
layer: backend
depends: []
affects: []
related: ["B-06 Timestamps the app writes are stored shifted by the server time zone", "BD-02 Auth & Sign-up Backend Delivery"]
created: 2026-10-15
updated: 2026-10-29
tags: [project]
---

# Database & Migrations

> ⚠ Affected by [[D-02 One main profile every Ring starts from]] (2026-10-25): ND-02 decided, one main profile (headline, role, company, location, photo, bio) every Ring starts from; a Ring may change all of them but the full name and keeps its own value when the main one changes.

> ⚠ Affected by [[D-03 Links entered once, switched on or off per Ring]] (2026-10-25): ND-03 decided, links are entered once and only switched on or off per Ring; booking, Behance, Dribbble, GitHub and YouTube join the types, detected from the pasted link.

> ⚠ Affected by [[D-04 Ring settings at launch and their defaults]] (2026-10-25): ND-04 decided, six Ring settings at launch with private defaults (join with a code or invite, approve each one, members can't see each other, invite or save attachments); the owner and the Ring's admins change them; members who may see each other see full cards.

> ⚠ Affected by [[D-06 Yearly rename, old name freed, case-insensitive]] (2026-10-25): ND-06 decided, a Pin name can be changed once a year, the old name is free at once, names ignore capitals, suggestions come only from the person's own name.

## Prisma 7 rules

- Config is `prisma.config.ts` at the repo root and must `import 'dotenv/config'` (the Prisma 7 CLI no longer loads `.env`).
- Multi-file schema in `prisma/schema/`, one file per domain mirroring `src/modules/`; `config.prisma` holds only generator and datasource, with **no `url`** in the datasource block.
- Import from `../../generated/prisma/client`, never `@prisma/client`.
- **No `Prisma.validator`** on this generator: use `satisfies` select objects and `GetPayload` types in `src/prisma/validators/`.
- **All `DateTime` columns are `@db.Timestamptz(3)`.** A new one without it is a bug.
- **Every database session runs in UTC.** `@prisma/adapter-pg` sends a `Date` as its UTC wall-clock time with no offset, and Postgres reads an offset-less `timestamptz` in the session's `TimeZone`; on a server whose default is not UTC every write was stored shifted by that offset, and the adapter shifted reads back, so only raw queries, `now()` and constraints saw it ([[B-06 Timestamps the app writes are stored shifted by the server time zone]]). `createPgAdapter` in `src/prisma/pg-adapter.ts` builds the one adapter `PrismaService` and the seed use, with `options: '-c TimeZone=UTC'`; never construct `PrismaPg` anywhere else. A `DATABASE_URL` with its own `options=` parameter replaces that pin (`pg` lets the connection string win), so do not put one there. `test/timestamps.e2e-spec.ts` compares a stored code's expiry with Postgres's `now()`; it only means something on a server whose `SHOW timezone` is not UTC.
- **Rows written before `main @ 26958cd` on a non-UTC server stay shifted.** No data migration: there is no production database, and the shift is each writer's server offset at the time (DST included), so no single correction is right. A development database written that way is rebuilt (`pnpm prisma:deploy` on an empty database, then `pnpm db:seed`) or lived with.
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
| Base profile work fields (headline, company, location, avatar, bio) | [[ND-02 Base profile work fields]] |
| Field library (profile-owned links / info blocks, per-Ring visibility rows) | [[ND-03 Field library vs per-Ring copies]] |
| Ring settings columns (audience, join policy, members visible, …) | [[ND-04 Ring settings]] |
| `pinNameChangedAt` | [[ND-06 Pin name rules]] |
| `WIDGET_TYPE` + AVAILABILITY, PAYMENT, NOW_PLAYING, TESTIMONIAL | [[F-13 Widgets]] |
| Products / catalogue table | [[F-23 Events During]] |
| Ring invitation state | [[F-17 Ring Invitations & Join]] |

## Seeding

`pnpm db:seed`, explicit and idempotent (`upsert`). Reference data (permissions, roles, interests) everywhere; demo users only when `NODE_ENV !== 'production'`. Demo accounts are listed in [[Developer Setup]].

Related: [[Spec Map]] (entity → model → file) · [[Developer Guide]]
