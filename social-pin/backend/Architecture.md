---
type: project
created: 2026-10-15
updated: 2026-10-28
tags: [project]
layer: backend
---

# Architecture

Condensed from `CLAUDE.md` (binding) and the skills in `api-pattern-kit/`. When this note and `CLAUDE.md` differ, `CLAUDE.md` wins.

## Stack (pinned)

| Concern | Choice | Version |
|---|---|---|
| Framework | NestJS | `^11.0.0` |
| ORM | Prisma, `prisma-client` generator, output `src/generated/prisma` | `^7.8.0` |
| Database | PostgreSQL + PostGIS, `btree_gist` | 14+ |
| Driver | `@prisma/adapter-pg` | `^7.8.0` |
| Docs | `@nestjs/swagger` at `/docs` | `^11.0.0` |
| Transactions | `nestjs-cls` + `@nestjs-cls/transactional` | `^6.2.1` / `^3.2.1` |
| Validation | `class-validator` + `class-transformer` | `^0.14.1` / `^0.5.1` |
| Auth | `passport-jwt`, `bcryptjs` | |
| Tests | Jest + `@swc/jest` | |
| Compiler | TypeScript **6.x, never 7** (the Nest CLI needs the programmatic compiler API that 7.0 dropped). Consequence: no path aliases, relative imports everywhere. | |

## Folder structure

```
src/
  main.ts                    Swagger + port + startup banner only
  app.module.ts              module registration + CLS transactional plugin
  config/                    configuration.ts, env.validation.ts (the only place that reads process.env)
  prisma/                    prisma.service, prisma-tx adapter, validators/<domain>.validator.ts
  common/                    shared kit: decorators, guards, filters, interceptors, mixins, utils, testing
  generated/prisma/          git-ignored; pnpm prisma:generate
  modules/<feature>/         module, controller, service, query-builder, dto/, entities/, *.spec.ts
prisma/schema/*.prisma       one file per domain, mirrors src/modules
prisma/migrations/           hand-authored, three ordered steps
prisma/seed/                 idempotent upserts
test/                        e2e specs
```

## Golden rules

1. Never return a Prisma model from a controller: `@Serialize(Entity)` with `@Expose()` on every public field.
2. camelCase in TypeScript; snake_case only at the DB boundary via `@map`.
3. Group by feature, not by layer.
4. Validate all input at the edge: DTOs + global `ValidationPipe` (`whitelist`, `forbidNonWhitelisted`).
5. Every endpoint documented: `@ApiTags`, typed `@ApiResponse`.
6. Business logic in services; controllers do routing, binding, docs, status codes.
7. Reuse `src/common/`; a second copy of an existing block is a review failure.
8. **Every visibility decision goes through `RingAccessService`.** See [[Ring Access Model]].

## Shared kit (import, never re-implement)

| Need | Import |
|---|---|
| Response mapping | `@Serialize(Entity)` |
| Errors | `throw new HttpException({ ErrorCode, message }, status)`; codes in `common/enums/error-code.enum.ts` |
| DTO helpers | `@Trim()`, `@MyIsOptional()` |
| Pagination | `EntityPaginationMixin`, `paginationDtoMixin`, `TABLE_MAX_LIMIT = 50` |
| Search → where | `AbstractQueryBuilder`, `notEmpty` |
| Auth | `@AuthenticatedController`, `@AuthorizedApi`, `@Public`, `@CurrUser`, `RolesGuard` |
| DB | `TransactionHost<PrismaTxAdapter>`, `@Transactional` |
| Bootstrap | `configureApp(app)` (used by `main.ts` and every e2e spec) |
| Tests | `transactionalTestingImports(prismaMock)` |
| Visibility | `RingAccessService` |

## Build order for a new feature

```
prisma/schema/<domain>.prisma → pnpm prisma:generate → migration (new folder, never edit an applied one)
  → src/prisma/validators/<domain>.validator.ts   (`satisfies` select + Payload type)
  → entities/  → dto/  → <feature>.query-builder.service.ts
  → <feature>.service.ts → <feature>.controller.ts → <feature>.service.spec.ts
  → register in app.module.ts
```

Declare literal routes (`/shared-with-me`) **before** `/:id` routes.

A service change ships a spec covering every thrown domain error, each query-builder filter, and an assertion that a secret field is absent from the response. `pnpm typecheck && pnpm test` before finishing.

## Modules today

| Module | Owns | Feature notes |
|---|---|---|
| `auth` | sign-up, OTP sign-in, tokens | [[F-02 Auth & Sign-up]], [[Auth Model]] |
| `user` | `/users/me` | [[F-01 Account]] |
| `profile` | profiles, Pin name | [[F-07 Profiles & Pin Name]] |
| `ring` | Rings, members | [[F-11 Rings]], [[F-09 Ring Members]] |
| `ring-profile` | projections, `/views` | [[F-10 Ring Projection]], [[F-12 View As & Pin Views]] |
| `file` | uploads | [[F-04 Files Upload]] |
| `ring-access` | the engine | [[F-08 Ring Access Engine]] |

Every TODO feature becomes a new folder under `src/modules/` and a new row here.

Related: [[API Conventions]] · [[Database & Migrations]] · [[Developer Setup]]
