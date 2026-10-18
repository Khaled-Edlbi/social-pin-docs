---
type: story
code: cleanup-jobs
scope: feature
feature: cleanup-jobs
module: platform
status: draft
screens: []
updated: 2026-10-18
tags: [story, story/draft, module/platform, layer/business]
---

# Cleanup Jobs · User Story

**Feature:** [[Cleanup Jobs]] · **Status:** Draft (awaiting product sign-off) · **Frontend Requirements:** [[Cleanup Jobs Frontend Requirements]] · **API Integration:** not yet (backend not built)

The operator needs the database to forget what the product promised to forget: a temporary Ring whose owner chose "delete", the list of who a PinCast reached, one-time codes that expired ten minutes ago, refresh tokens nobody can use. None of this changes what a viewer can see today, because access is decided live; it changes what is stored. There is no screen.

## Persona

The operator running the service and the product owner answering "do you keep that?". End users feel the jobs only as the absence of stale rows.

## Stories

### S1 · Temporary Rings marked AUTO_DELETE are removed

**As the** product owner **I want** a Ring whose disposition is `AUTO_DELETE` to be deleted by a scheduled job **so that** the "delete" the owner chose after a meeting actually happens.

Acceptance criteria:
- [ ] Only Rings with `disposition = AUTO_DELETE` are touched; `UNDECIDED`, `KEEP` and `MERGE` are never deleted by a job.
- [ ] The job is idempotent: running it twice deletes nothing the first run did not.
- [ ] Each run logs how many Rings it removed.

### S2 · PinCast recipients and expired codes are purged

**As the** product owner **I want** `PincastRecipient` rows older than the retention window and `VerificationCode` rows past `expiresAt` deleted **so that** proximity history and one-time secrets do not accumulate.

Acceptance criteria:
- [ ] Purge uses the indexed `detectedAt` and `expiresAt` columns; the retention window for recipients is a named constant, not a literal.
- [ ] A PinCast whose results the owner has not yet opened keeps its recipients for at least the window.

### S3 · EXPIRED statuses are materialised for reporting

**As the** operator **I want** `RING_STATUS.EXPIRED` and `RING_MEMBER_STATUS.EXPIRED` set once the windows lapse **so that** reports can count expired Rings without re-evaluating timestamps.

Acceptance criteria:
- [ ] Materialising a status never changes an access decision: `RingAccessService` keeps deciding from `startsAt` / `expiresAt` against `now`.
- [ ] A Ring that is `EXPIRED` stays editable by its owner (keep / merge / delete), as `assertCanAdminister` already ignores expiry.

## States and motion the design asks for

- None. No prototype screen references these jobs.

## Rules the backend already enforces

- Access is correct without the jobs: expiry is evaluated live on every request, exclusive at the `expiresAt` instant ([[Ring Access Engine]]).
- The schema carries `Ring.disposition`, `PincastRecipient.detectedAt` (indexed) and `VerificationCode.expiresAt` (indexed); the jobs are not written ([[T-054 Cleanup jobs]]).

## Open questions

- No decision note names this feature. The PinCast recipient retention window is unstated; the owner's results screen depends on it (see the requirements).
