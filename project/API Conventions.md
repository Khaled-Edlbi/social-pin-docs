---
type: project
updated: 2026-10-15
tags: [project]
---

# API Conventions

## DTOs

One DTO per direction / operation. Every field carries both a `class-validator` rule and `@ApiProperty` / `@ApiPropertyOptional`. `Update<X>Dto extends PartialType(Create<X>Dto)` with `PartialType` from `@nestjs/swagger`. `Search<X>Dto extends paginationDtoMixin({ limit: { default: 20 } })`. `@MyIsOptional()` for "absent is fine", `@MyIsOptional(true)` when `null` clears a field. Never accept a Prisma type as a body.

## Entities

The response **allow-list**. `implements PrismaModel` is the drift guard: add a column and the entity stops compiling until someone decides whether it is public. A narrower audience gets its **own entity**, never a runtime `delete row.x`:

- `ProfileEntity` (owner) vs `RingProfileViewEntity` (viewer)
- `RingProfileOwnerEntity` (editing, has `isVisible`, hidden rows) vs `RingProfileViewEntity` (visible rows only)
- `AccountEntity` (no `passwordHash` in the query at all)

`RingProfileViewEntity` is the one computed-payload entity that is not `implements PrismaModel`.

## Serialization and lists

`@Serialize(Entity)` on the handler; the global interceptor runs `plainToInstance(entity, data, { excludeExtraneousValues: true })`. Controllers never call `new Entity()`. Lists return `{ data, meta: { total } }`; **`meta.total` is the unpaginated count**.

## Pagination and search

Filters live in a `*QueryBuilderService extends AbstractQueryBuilder`, never inline. `build()` takes `OmitPagination<DTO>`. The builder skips `undefined`, not falsy values, so `isTemporary: false` is a real filter. Always-applicable scoping (`deletedAt: null`) goes in `defaultQuery`. `TABLE_MAX_LIMIT = 50` is a hard ceiling. Ordering is each endpoint's explicit decision.

## Transactions

Services inject `TransactionHost<PrismaTxAdapter>` and use `this.txHost.tx`; they never inject `PrismaService`. `@Transactional<PrismaTxAdapter>()` for read-then-write, parent + children, or any multi-write that must be all-or-nothing. Nested calls join the caller's transaction via CLS.

## Errors

One body from `AllExceptionsFilter`:

```json
{ "statusCode": 404, "message": "Ring not found", "error": "NotFound",
  "path": "/api/v1/rings/abc", "timestamp": "2026-10-07T09:41:22.104Z" }
```

Domain errors carry a stable `ErrorCode` (`E_RING_02`); all codes live in `common/enums/error-code.enum.ts`; a retired code is never reused. Never leak a Prisma error message.

## Bootstrap and config

`configureApp(app)` owns prefix (`api`), URI versioning (`v1`), CORS, the `ValidationPipe`, serializers, static uploads and the filter; `main.ts` adds Swagger, the port and the banner. The banner prints the real base `/api/v1`, because Nest's route log omits the version segment. `process.env` is read only in `src/config` (plus `PrismaService`'s constructor, `prisma.config.ts` and the seed client).

## Testing

Unit specs beside the unit; mock `PrismaService` with `$transaction: jest.fn((cb) => cb(prismaMock))` via `transactionalTestingImports`. e2e specs call the same `configureApp(app)` and need a disposable seeded Postgres.

Related: [[Architecture]] · [[Database & Migrations]]
