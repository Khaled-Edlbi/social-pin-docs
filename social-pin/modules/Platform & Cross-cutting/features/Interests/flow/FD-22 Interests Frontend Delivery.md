---
id: FD-22
type: frontend-delivery
module: platform
feature: interests
status: in-progress
scope: feature
deployedTo: []
screens: [s07, s71]
owner: "Omar Fostok"
depends: []
affects: []
related: ["S-92 Interests Story", "FR-37 Interests Frontend Requirements", "BD-37 Interests Backend Delivery", "F-36 Gemma AI", "F-02 Auth & Sign-up"]
pending: []
created: 2026-11-15
updated: 2026-11-15
tags: [frontend-delivery, frontend-delivery/in-progress, module/platform, layer/frontend]
---

# 🟡 Interests · Frontend Delivery

> Blocked by default until [[Interests Backend Integration]] is `current` (the hand-off order in `docs.config.json`); `blockedBy: []` opts out, `blockedBy: [...]` names other blockers.

**Feature:** [[F-37 Interests]] · **Status:** In progress · **Built from:** [[Interests Backend Integration]] (not written yet: the interests endpoints don't exist) · **Against:** [[S-92 Interests Story]] · **Requirements:** [[FR-37 Interests Frontend Requirements]] · **QA:** [[Interests QA Frontend]]

Both pickers are built, but on a sample list, and **nothing is saved or sent**: `GET /interests`, `GET /users/me/interests` and `PUT /users/me/interests` don't exist yet ([[S-92 Interests Story|Interests · S5]]). The note stays `in-progress`, and blocked by the flow, until they do. It is on `social_pin` `rings/F-11/honest-rings` @ `778d9b4` (2026-11-12), not on `main` yet. `778d9b4` gave both screens one shared vocabulary. At `778d9b4`: `dart analyze` 0 errors, `flutter test` 1752 passed.

## Screens shipped

| Screen | State | Note |
|---|---|---|
| [[Screen Index#s07\|s07]] Interests (sign-up) | 🟡 | Picks tags from the **shared vocabulary**: 20 interests in three groups, WORK, CRAFT and OFF THE CLOCK, in English and Arabic. Picks are kept by id in the sign-up flow, so stepping back keeps them. **Not sent:** the sign-up doesn't save them, because there is no endpoint (`778d9b4`) |
| [[Screen Index#s71\|s71]] Interests (from Me) | 🟡 | The same vocabulary, by group. First *Suggested from your Rings* (a sample of three, until [[F-36 Gemma AI\|Gemma]] proposes real ones), then each group without the suggested ones, so no chip shows twice; *Your picks* is built from what's picked. Search matches the name in the current language. The two switches are shown. **A sample, not saved:** it opens with three picks, and nothing is sent anywhere (`778d9b4`) |

## Calls made

| Endpoint | Where | Notes (retries, cache keys, optimistic updates) |
|---|---|---|
| — | s07, s71 | None: the interests endpoints don't exist yet. |

## State kept on the client

- **The vocabulary:** a bundled list of 20 `{ id, name, category }`, by FR-37's shape. Once `GET /interests` exists, the backend's list and ids replace it.
- **s07 picks:** in the sign-up flow's memory only. **s71 picks:** on that screen only. Neither is persisted.

## Deviations from the story or the integration note

- **The vocabulary is bundled, not read:** a sample until `GET /interests` exists. The ids are the app's, not the backend's.
- **s71 opens with three picks** and three suggestions, as the design shows; neither comes from the person's data.

## Not done yet

- **Reading the vocabulary, reading my selection, saving it:** waits on [[S-92 Interests Story|Interests · S5]] and [[BD-37 Interests Backend Delivery]].
- **Real suggestions and "Let Gemma add interests it notices":** [[F-36 Gemma AI]].

## Tests

At `778d9b4`: `interest_vocabulary_test` (new: unique ids, every group has interests, every name and heading in en and ar, every word both pickers used before is in it, s71's sample picks and suggestions are the vocabulary's, s71 search by the name in the language shown, the s71 screen), plus the sign-up step render tests (`sign_up_steps_render_test`, updated).

## Log

- 2026-11-15 · app branch `rings/F-11/honest-rings` @ `778d9b4` (social_pin, not on `main` yet; analyze 0 errors, 1752 tests pass) · S1–S3 (the pickers, on a sample) · s07, s71 (one vocabulary of 20 interests in three groups, en and ar; not saved) · written; `in-progress` and blocked until the interests endpoints and their Backend Integration exist · flagged nothing
