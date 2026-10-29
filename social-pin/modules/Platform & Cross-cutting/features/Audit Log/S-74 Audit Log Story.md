---
id: S-74
type: story
module: platform
feature: audit-log
status: approved
scope: feature
screens: []
approvedBy: "khaled"
approvedAt: 2026-10-25
owner: "khaled"
created: 2026-10-18
updated: 2026-10-29
tags: [story, story/approved, module/platform, layer/business]
---

# Audit Log · User Story

**Feature:** [[F-30 Audit Log]] · **Status:** Approved 2026-10-25 by khaled · **Frontend Requirements:** [[FR-30 Audit Log Frontend Requirements]] · **API Integration:** not yet (backend not built)

The product owner needs to be able to answer "who did what to whose access, and when" after the fact: a Ring grant that a member disputes, a sign-out-everywhere the account holder did not make, a payment that was refunded, a meeting request that Gemma sent on someone's behalf. The `AuditLog` table exists for this; nothing writes to it yet. There is no screen.

## Persona

The product owner and the operator who handles a support request. Not an end user: the design has no audit screen and the story does not add one.

## Stories

### S1 · Sensitive account actions are recorded

**As the** product owner **I want** every sign-in code issue, sign-in and logout-everywhere written to the audit log **so that** a disputed account takeover can be traced to an actor, an IP and a time.

Acceptance criteria:
- [ ] `login/verify`, `request-code` and `logout-everywhere` each write one `AuditLog` row with `actorId`, `action`, `resourceType = user`, `resourceId`, `ipAddress`, `userAgent`.
- [ ] `metadata` never contains a code, a hash or a token; redaction happens in the writer, as the schema comment requires.

### S2 · Ring access changes are recorded

**As the** product owner **I want** every grant, revoke and reassignment of a Ring member logged **so that** "why can this person see my work profile" has an answer.

Acceptance criteria:
- [ ] `POST / PATCH / DELETE /rings/:ringId/members/…` and `…/reassign` each write a row naming the Ring, the member and the before/after Ring for a reassign.
- [ ] The row is written in the same transaction as the change, so a rolled-back change leaves no audit trace and a committed one always has one.

### S3 · Payment and AI actions are recorded

**As the** product owner **I want** payments and every Gemma action that touches another person logged **so that** automation and money have a paper trail.

Acceptance criteria:
- [ ] A payment state change and a confirmed `AiAction` execution each write a row; the AI row names the `AiAction` id as `resourceId`.
- [ ] A failed audit write never turns a successful request into an error for the client.

### S4 · Audit log writes

*From T-053 (status then: In progress), merged 2026-10-27.*

`AuditLogService.record()` from auth, ring members, payments and AI actions.
The service is `AuditLogService`, not `AuditService`: it owns the `audit_logs`
table, and `record()` deliberately carries no transaction of its own so it
joins the caller's — an entry cannot claim a change the database rolled back.

Shipped so far: the service, its reads, and the operator panel's writes (a
status change, the platform role, a role grant or revoke each record one). See
[[F-42 Operator Panel]]. Still open, and why this stays in progress: the access,
payment and AI writers, and the retention job.

## States and motion the design asks for

- None. No prototype screen references the audit log.

## Rules the backend already enforces

- The table and its indexes (`actorId + createdAt`, `resourceType + resourceId + createdAt`, `action + createdAt`) exist; `actorId` is nullable and set to null when the actor's account is deleted, so the trail outlives the account.
- Nothing writes to it yet ([[S-74 Audit Log Story|Audit Log · S4]]). The list of actions to log is fixed by the feature note: auth, ring members, payments, AI actions.

## Open questions

- No decision note names this feature. Retention of audit rows is not stated anywhere and should be set before [[S-74 Audit Log Story|Audit Log · S4]] ships.
