---
id: P-04
type: project
layer: business
stage: mvp
created: 2026-10-15
updated: 2026-10-29
tags: [project, stage/mvp]
---

# Project Overview

**Stage:** MVP: building the smallest set of features we would release, the ones with `release: mvp`. It moves to Beta when every MVP feature is Done and its QA passes. The stage is typed here by the owner, never computed; the ladder is `stages` in `docs.config.json` and the rule is in [[Docs Tree#Stage, release and environments]].

## The product

Social Pin is a digital-identity app. A person has **one account** and **many Rings**. A Ring is an audience (Family, Clients, Company, the people at TechSummit '26, the person I am meeting at 11:20) bound to a perspective of the profile: photo, bio, nickname, links, info blocks, files, widgets, and the sensitive fields the owner chooses to share with that audience.

Four ideas carry the whole product:

1. **Switching Ring re-composes your identity.** The badge, the profile, the QR all change with the active Ring.
2. **"View as."** The owner sees their profile exactly as a chosen Ring sees it. In the backend this is literally the same code path as the member's view ([[F-12 View As & Pin Views]]).
3. **A connection is an access request.** On accept the owner picks a Ring. Membership is private to the owner; access is live-revocable and can expire ([[F-14 Connections]], [[F-09 Ring Members]]).
4. **Events and meetings are Rings too.** Registering for an event grants an Event Ring; a meeting spawns a temporary Ring; afterwards the owner keeps, merges or lets it expire ([[F-21 Event Ring Auto-creation]], [[F-26 Meetings]], [[F-11 Rings]]).

Surrounding features: a badge / QR bound to the active Ring, PinCast proximity broadcast, nearby-by-Ring, events with tickets and exhibitors, slot-based meetings, companies and shared Rings, notifications, Free vs Pro, and Gemma, the AI layer that suggests Rings, matches and intros.

### What it is not

Not a social network, not content-driven. No feed, no posts in the current scope (the schema has contextual posts and chat for a later phase, each forced to carry a Ring or event). No "a user's profile" endpoint: every outward read is a Ring projection.

### User types (from the brief)

| Type | Mobile app role |
|---|---|
| Personal / identity user | The base experience everyone has |
| Visitor (User A) | Attends events, registers, meets exhibitors |
| Exhibitor (User B) | Starts as a visitor, creates a business account and a business Ring |
| Organizer (User C) | Mostly web; the app only shows touchpoints (invitation, requested files, booth and payment status) |

## The backend today

| | |
|---|---|
| Stack | NestJS 11 · Prisma 7 (`prisma-client` generator) · PostgreSQL + PostGIS · Swagger · TypeScript 6 |
| Modules with endpoints | 7: `auth`, `user`, `profile`, `ring` (+ members), `ring-profile` (+ views), `file`, `ring-access` |
| Endpoints | 49 |
| Tables | 75 (72 enums), all with migrations, constraints and indexes |
| Tables with no service yet | about 30 (connections, events, meetings, PinCast, business, commerce, notifications, AI, analytics, chat, posts) |
| Unit tests | 168 in 9 suites, green; typecheck green |
| e2e tests | written, never run (need a seeded PostGIS database) |

The implemented part is what the entities spec calls the centre of the system: *"The Ring Access Model should be treated as the central database/business concept."* Everything else is modelled so that it **extends the Ring model** instead of growing a second permission system. See [[Ring Access Model]] and [[Architecture]].

## Sources this vault is built from

- `CLAUDE.md` at the repo root: the binding project rules.
- [[Spec Map]]: every spec entity and feature mapped to code.
- [[Developer Guide]] and [[Frontend API Guide]].
- The design: 78 prototype screens, the click-through map and the wireframe brief ([[Design Reference]]).
- [[Status Report 2026-10-15]]: the backend vs design comparison.
