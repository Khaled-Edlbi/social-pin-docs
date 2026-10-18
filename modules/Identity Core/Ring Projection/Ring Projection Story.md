---
type: story
code: ring-projection
scope: feature
feature: ring-projection
module: identity
status: draft
screens: [s14, s20, s23, s24, s25, s29, s36]
updated: 2026-10-18
tags: [story, story/draft, module/identity, layer/business]
---

# Ring Projection · User Story

**Feature:** [[Ring Projection]] · **Status:** Draft (awaiting product sign-off) · **Frontend Requirements:** [[Ring Projection Frontend Requirements]] · **Backend Integration:** [[Ring Projection Backend Integration]]

A Ring owner decides what one audience sees: the name and nickname they go by there, the bio, the photo, the theme, which social and contact links, which info blocks ("Add a field"), which files, and whether this Ring may see their birthdate, gender, marital status, phone and email. The projection is the Ring's perspective of the one profile; editing it and then checking it with "View as" is the core loop of the product.

## Persona

A Ring owner on Ring data ([[Screen Index#s14|s14]]) and its edit screens, or in step 3 and 4 of the create wizard, shaping a Ring for clients, family or a company. Owner or a `CONTENT_MANAGER` admin; viewers see the result through [[View As & Pin Views Story]].

## Stories

### S1 · Ring data ([[Screen Index#s14|s14]])

**As a** Ring owner **I want** one screen that shows everything this Ring exposes **so that** I can review and jump into any part of it.

Acceptance criteria:
- [ ] Loads `GET /rings/:ringId/projection` (owner entity) and shows: photo, display name, nickname, bio, the five `show*` toggles' state, links, info blocks, attachments, widgets (read-only), with hidden rows greyed.
- [ ] Header actions: People · N (s15), View as <Ring> (s31), Rename (s22), "+ Add information to this Ring" (s36).
- [ ] A fresh Ring opens with an empty projection (created on first access), never an error.
- [ ] A 403 renders the screen read-only with no edit affordances.

### S2 · What it shows, during creation ([[Screen Index#s20|s20]])

**As a** Ring owner **I want** to choose fields, links and files for a new Ring in the wizard **so that** the Ring is ready when I finish.

Acceptance criteria:
- [ ] Step 3 writes to the new Ring's projection as the user adds items (`POST …/links`, `…/info-blocks`, `…/attachments`), so Back and Next keep state server-side.
- [ ] The design's "N of 7 on" library toggle is shown as a plain add-list until [[D-03 Field library vs per-Ring copies]] is decided; each Ring holds its own copies today.

### S3 · How you appear ([[Screen Index#s23|s23]])

**As a** Ring owner **I want** to set the name, nickname, bio, photo and theme for this Ring **so that** my clients meet a different me than my family.

Acceptance criteria:
- [ ] `PATCH /rings/:ringId/projection` with any of `displayName` (≤ 120), `nickname` (≤ 60), `bio` (≤ 2000), `avatarFileId`, `themeConfig`.
- [ ] A "Use my Pin's name" action sends `null` for `displayName`, which falls back to the profile's full name; same for `nickname`.
- [ ] "Inherit, stays in sync with your Pin" and "Copy a Ring" (s28) are shown disabled with "coming soon" until [[D-05 Copy or inherit]] / [[D-02 Base profile work fields]].
- [ ] Save returns to s14; the Ring re-composes with the new header.

### S4 · What it shows: sensitive fields ([[Screen Index#s24|s24]])

**As a** Ring owner **I want** five clear toggles for birthdate, gender, marital status, phone and email **so that** each audience gets only what I meant for it.

Acceptance criteria:
- [ ] Toggles map to `showBirthdate`, `showGender`, `showMaritalStatus`, `showPhone`, `showEmail`; all off on a new Ring.
- [ ] Each toggle shows the value that would be shared (from the profile or the account) and "not set" when empty, so turning it on does not surprise.
- [ ] A toggle change is saved on its own `PATCH`; the toggle reflects the response, not the tap.
- [ ] Rows for links, blocks and files have a visibility switch (`isVisible`), which hides them from every viewer.

### S5 · Social profiles ([[Screen Index#s25|s25]])

**As a** Ring owner **I want** to add my LinkedIn, WhatsApp and website to this Ring **so that** this audience can reach me where I want.

Acceptance criteria:
- [ ] Add: pick a `type` from the 15 `LINK_TYPE` values, enter `value` and optional `label`; the client validates `value` per type before sending (`http(s)` URL, E.164, email, `lat,lng`).
- [ ] Edit, hide, reorder (`sortOrder`) and remove through `PATCH` / `DELETE …/links/:linkId`.
- [ ] Several links of one type are allowed; the label distinguishes "Work LinkedIn" from "Personal".
- [ ] A server 400 `E_RING_PROFILE_03` shows the server message inline.

### S6 · Photo for this Ring ([[Screen Index#s29|s29]])

**As a** Ring owner **I want** a different photo per Ring **so that** the face matches the audience.

Acceptance criteria:
- [ ] Upload ([[Files Upload Story]]) then `PATCH { avatarFileId }`; 400 `E_FILE_04` returns to the picker.
- [ ] The photo cannot be fetched back yet; the local image is kept for the session and a placeholder shown later.

### S7 · Add to this Ring ([[Screen Index#s36|s36]])

**As a** Ring owner **I want** one sheet to add a field, a social profile, a file or a widget **so that** I do not hunt through screens.

Acceptance criteria:
- [ ] Field → s24 (info block: `title` ≤ 120, `body` ≤ 4000); Social profile → s25; File → upload and attach; Widget → s37 (not available yet).
- [ ] Done returns to s14 with the new rows present after a refetch.

### S8 · Check it with View as ([[Screen Index#s31|s31]])

**As a** Ring owner **I want** to flip to what this audience sees right after an edit **so that** I trust the Ring before I share it.

Acceptance criteria:
- [ ] "View as <Ring>" calls `GET /views/ring/:ringId` after invalidating its cache; hidden rows and off toggles are absent, `null` reads "Not shared".
- [ ] The flip transition is reversible; the owner view returns to s14.

## States and motion the design asks for

- State: empty projection, hidden row (greyed), toggle on / off with the value preview, saving, read-only (403), invalid link value, "coming soon" for inherit / copy / widgets.
- Motion: saving any part re-composes the Ring on return to s14 (the signature motion); View as is a flip. Reduced motion: cross-fade.

## Rules the backend already enforces

- `GET …/projection` requires `CONTENT_MANAGER` or owner and creates the projection on first access for the Ring's profile (falling back to the owner's default).
- `PATCH` updates `displayName`, `nickname`, `bio`, `avatarFileId`, `themeConfig` and the five `show*` flags; `null` clears and falls back to the base profile; `avatarFileId` must be the caller's file (400 `E_FILE_04`).
- Link values are validated by type (`assertLinkValueMatchesType`): absolute `http(s)` URLs with `javascript:` and `data:` refused, E.164 phones, an email, a `lat,lng` pair; several links of one type allowed.
- Sub-resource writes are transactional and scoped to the Ring; a foreign id is 404 (`E_RING_PROFILE_03` / `E_RING_PROFILE_04`).
- Hidden rows are excluded by the viewer query, never read into a viewer response; sensitive fields are gated only in `toView`, all `show*` default `false`; `displayName` falls back to the full name, never the nickname.
- Widgets are selected and returned but have no endpoints.

## Open questions

- [[D-03 Field library vs per-Ring copies]] — "4 of 7 on" (s20, s24) assumes one library; the backend stores a copy per Ring. Blocks S2's and S4's toggle UI.
- [[D-05 Copy or inherit]] — "Inherit, stays in sync" (s23) and "Copy a Ring" (s28). Blocks S3's inherit and copy actions.
- [[D-02 Base profile work fields]] — the base bio and photo that inherit needs.
