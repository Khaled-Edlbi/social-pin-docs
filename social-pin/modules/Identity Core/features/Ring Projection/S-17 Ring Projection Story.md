---
id: S-17
type: story
module: identity
feature: ring-projection
status: approved
scope: feature
screens: [s14, s20, s23, s24, s25, s28, s29, s30, s36, s37, s68]
approvedBy: "Omar Fostok"
approvedAt: 2026-10-29
owner: "Omar Fostok"
related: ["D-02 One main profile every Ring starts from", "D-03 Links entered once, switched on or off per Ring", "D-05 Inherit per field, copy without members", "S-06 Files Upload Story", "S-14 Profiles & Pin Name Story", "S-19 View As & Pin Views Story", "S-89 Gemma AI Story", "F-38 Linked Accounts (OAuth)"]
created: 2026-10-18
updated: 2026-10-29
tags: [story, story/approved, module/identity, layer/business]
---

# Ring Projection · User Story

**Feature:** [[F-10 Ring Projection]] · **Status:** Approved 2026-10-29 by Omar Fostok (first approved 2026-10-25 by khaled; reworked 2026-10-29 by the design review: S1, S3, S4, S5, S7 changed, S9 and S10 added) · **Frontend Requirements:** [[FR-10 Ring Projection Frontend Requirements]] · **Backend Integration:** [[BI-07 Ring Projection Backend Integration]]

A Ring owner decides what one audience sees: the headline, role, company and location they go by there (or none of them), the nickname, the bio, the photo, which social and contact links, which custom fields, which files, and whether this Ring may see their birthdate, gender, marital status, phone and email. The projection is the Ring's perspective of the one profile; editing it and then checking it with "View as" is the core loop of the product. Decided, built in this story's S9 and S10: links, custom fields and files are one library each Ring switches on or off ([[D-03 Links entered once, switched on or off per Ring]]), and each main-profile field follows the main profile until the Ring changes or hides it ([[D-02 One main profile every Ring starts from]], [[D-05 Inherit per field, copy without members]]).

## Persona

A Ring owner on Ring data ([[Screen Index#s14|s14]]) and its edit screens, or in step 3 and 4 of the create wizard, shaping a Ring for clients, family or a company. Owner or a `CONTENT_MANAGER` admin; viewers see the result through [[S-19 View As & Pin Views Story]].

## Stories

### S1 · Ring data ([[Screen Index#s14|s14]])

**As a** Ring owner **I want** one screen that shows everything this Ring exposes **so that** I can review and jump into any part of it.

Acceptance criteria:
- [ ] Loads `GET /rings/:ringId/projection` (owner entity) and shows **only what this Ring shows**: "WHAT THIS RING SHOWS" (the fields that are on, by name), "SOCIAL PROFILES · N" (the links that are on, with their values), "ATTACHMENTS & LINKS" (file and link chips that are on, [[S-06 Files Upload Story|Files Upload · S3]]), widgets (read-only), access.
- [ ] **Nothing off is shown**, greyed or not; the owner entity still carries off rows (for the editors), and s14 doesn't render them. A section with nothing on shows only its "+ Add" (→ s36). Each section opens its editor: fields and files → s24, socials → s25.
- [ ] Header actions: People · N (s15), View as <Ring> (s31), Rename (s22), "+ Add information to this Ring" (s36).
- [ ] A fresh Ring opens with an empty projection (created on first access), never an error.
- [ ] A 403 renders the screen read-only with no edit affordances.

### S2 · What it shows, during creation ([[Screen Index#s20|s20]])

**As a** Ring owner **I want** to choose fields, links and files for a new Ring in the wizard **so that** the Ring is ready when I finish.

Acceptance criteria:
- [ ] Step 3 writes to the new Ring's projection as the user switches items on (`POST …/links`, `…/info-blocks`, `…/attachments`), so Back and Next keep state server-side.
- [ ] Step 3 is the library the design draws ("N of M on"): every field, link, custom field and file I have is listed once and I switch each on or off for the new Ring; nothing is retyped (S9). Until S9 ships, the app imitates it on the phone (it copies a value from another Ring, or asks once), and a change applies to this Ring only.

### S3 · How you appear ([[Screen Index#s23|s23]])

**As a** Ring owner **I want** to set the headline, role, company, location, nickname, bio and photo for this Ring **so that** my clients meet a different me than my family.

Acceptance criteria:
- [ ] s23, top to bottom:
  - **Full name**: shown, read-only, "the same in every Ring" ([[D-02 One main profile every Ring starts from]]). The API still accepts `displayName` today; the editor does not send it.
  - **Photo**: Change (→ s29), Inherit, Copy a Ring, Upload (→ s30).
  - **Headline**, **Role**, **Company**, **Location**: each row shows the value this Ring shows and its state, "**Follows your Pin**" or "**Own for <Ring>**"; tapping it offers **Inherit** or **Write my own**, and "**Reset to Pin**" when it has its own (S10). If the field is off on s24, the row reads "**Hidden in <Ring>**" and links there.
  - **Nickname** ("What friends call you", [[S-14 Profiles & Pin Name Story|Profiles & Pin Name · S3]]): the same pattern; a Ring's `nickname`, `null` follows the profile's. **Works today.**
  - **Bio**: Reset, Write my own, Inherit, Copy a Ring (`bio` ≤ 2000).
  - "Inherit stays in sync with your Pin. Copy takes a snapshot." at the bottom.
- [ ] **Copy a Ring** (s28), for the photo and the bio: pick another of my Rings, preview, "Use this bio"; it copies once (a snapshot), afterwards the two are independent ([[D-05 Inherit per field, copy without members]]). **Available now**: the client reads the other Ring's `bio` (or `avatarFileId`) and saves it with `PATCH /rings/:ringId/projection`.
- [ ] Each field follows the main profile until I change it here; changing one stops that field only from following; a field I changed here keeps its value when I change the main one (D-05).
- [ ] "Gemma: rewrite" is [[S-89 Gemma AI Story]]'s and not shown until Gemma is built.
- [ ] No theme row: `themeConfig` stays in the backend with no screen in v1.
- [ ] Not available yet: headline, role, company and location (no main profile fields, [[S-14 Profiles & Pin Name Story|Profiles & Pin Name · S9–S11]], and S10); their rows are shown disabled with "coming soon". Nickname, photo and bio work today (`PATCH …/projection` with `nickname` ≤ 60, `bio`, `avatarFileId`; `null` follows the profile).
- [ ] Save returns to s14; the Ring re-composes with the new header.
- [ ] **For the designer:** the four field rows and the nickname row are not drawn.

### S4 · What it shows ([[Screen Index#s24|s24]])

**As a** Ring owner **I want** one list of everything this Ring could show, each switched on or off **so that** each audience gets only what I meant for it.

Acceptance criteria:
- [ ] s24 "Fields, links and files · N of M on" lists, each with a switch:
  - the main-profile fields **Headline**, **Role & company**, **Location** (on by default on a new Ring; S10). The **name** has no row: it is always shown. The design's "Name & headline" reads "Headline";
  - the five contact and private fields: **Phone**, **Email**, **Birthdate**, **Gender**, **Marital status** (`showPhone`, `showEmail`, `showBirthdate`, `showGender`, `showMaritalStatus`, all off on a new Ring);
  - my custom fields and files (S9; files: [[S-06 Files Upload Story|Files Upload · S12]]).
- [ ] The five contact and private rows show the value that would be shared (from the profile or the account) and "not set" when empty, so turning one on does not surprise; a field with no value can't be turned on ("Set it on Me first").
- [ ] **The same switches are on Me** ([[Screen Index#s68|s68]]): each private-field row on Me shows which Rings show it ("Family Ring only") and opens a list of my Rings with a switch each; switching there is the same as switching here ([[S-14 Profiles & Pin Name Story|Profiles & Pin Name · S4]]).
- [ ] A switch change is saved on its own `PATCH`; the switch reflects the response, not the tap.
- [ ] "+ Add a field, link or file" offers **Field** (S7's sheet), **Social profile** (S5's sheet) and **File** (the picker, [[S-06 Files Upload Story|Files Upload · S1]]).
- [ ] Off today: a link or custom field is switched off with its `isVisible`; a file is detached ([[S-06 Files Upload Story|Files Upload · S12]]); once S9 ships, off means "not switched on for this Ring".
- [ ] **For the designer:** the Birthdate, Gender, Marital status and Location rows, and "Headline" for "Name & headline", are not drawn.

### S5 · Social profiles ([[Screen Index#s25|s25]])

**As a** Ring owner **I want** my LinkedIn, WhatsApp and website entered once and switched on for this Ring **so that** this audience can reach me where I want, and editing a link fixes it everywhere.

Acceptance criteria:
- [ ] s25 lists my links, "N of M on", each with a switch; a link is entered once and each Ring only switches it on or off ([[D-03 Links entered once, switched on or off per Ring]], S9).
- [ ] "**+ Add a social profile**" (the design's "+ Connect another account"; also s36's "Social profile") opens a sheet: **paste a link** (or a number for WhatsApp, a handle for X or Instagram); the **type is detected** and shown with its icon; an optional **label** ("Work LinkedIn"); Save adds it to this Ring, switched on. **Nothing signs in** to the other service ("Connect" is [[F-38 Linked Accounts (OAuth)]]'s).
- [ ] Detection covers the 15 `LINK_TYPE` values of today; anything else is a website link. The five types D-03 added (booking, Behance, Dribbble, GitHub, YouTube) are saved as labelled custom links until the backend has them. Not available yet: the five types.
- [ ] The client validates `value` per type before sending (`http(s)` URL, E.164, email, `lat,lng`); a server 400 `E_RING_PROFILE_03` shows the server message inline.
- [ ] Several links of one type are allowed; the label tells them apart.
- [ ] Today (copies per Ring): edit, switch off (`isVisible`), reorder (`sortOrder`) and remove through `PATCH` / `DELETE …/links/:linkId`; until S9 ships, a change made here applies to this Ring only and the screen says so.
- [ ] **For the designer:** the button text and the sheet are not drawn.

### S6 · Photo for this Ring ([[Screen Index#s29|s29]])

**As a** Ring owner **I want** a different photo per Ring **so that** the face matches the audience.

Acceptance criteria:
- [ ] Upload ([[S-06 Files Upload Story]]) then `PATCH { avatarFileId }`; 400 `E_FILE_04` returns to the picker. The picker itself is [[S-11 Photo Library Story|Photo Library · S1]].
- [ ] The photo cannot be fetched back yet ([[ND-16 Viewer access to file bytes]]); the local image is kept for the session and a placeholder shown later.
- [ ] Without a photo of its own, the Ring shows the main profile's photo; "Reset to Pin" returns to it (D-02, D-05). Not available yet: there is no main photo today.

### S7 · Add to this Ring ([[Screen Index#s36|s36]])

**As a** Ring owner **I want** one sheet to add a field, a social profile, a file or a widget **so that** I do not hunt through screens.

Acceptance criteria:
- [ ] **Field** ("Phone, email, address, custom") opens "**Add a field**", with quick picks: **Phone** and **Email** (my account's own; picking one switches it on for this Ring, nothing typed), **Address** (a field titled "Address", value typed), **Custom** (my own title ≤ 120 and value ≤ 4000). Save adds it to this Ring, switched on. A custom field is edited or deleted from its row on s24 (the same sheet).
- [ ] **Social profile** opens S5's sheet; **File** opens the picker ([[S-06 Files Upload Story|Files Upload · S1]]); **Widget** → s37 ([[F-13 Widgets]], not available yet).
- [ ] Until S9 ships, a custom field belongs to this Ring only (an info block on it); afterwards it belongs to me and other Rings can switch it on.
- [ ] Done returns to s14 with the new rows present after a refetch.
- [ ] **For the designer:** the "Add a field" sheet is not drawn.

### S8 · Check it with View as ([[Screen Index#s31|s31]])

**As a** Ring owner **I want** to flip to what this audience sees right after an edit **so that** I trust the Ring before I share it.

Acceptance criteria:
- [ ] "View as <Ring>" calls `GET /views/ring/:ringId` after invalidating its cache; off rows and off switches are absent, `null` reads "Not shared".
- [ ] The flip transition is reversible; the owner view returns to s14.

### S9 · One library, switched on per Ring ([[Screen Index#s20|s20]], [[Screen Index#s24|s24]], [[Screen Index#s25|s25]])

**As a** Ring owner **I want** each link, custom field and file entered once and switched on per Ring **so that** editing it once fixes it everywhere.

Acceptance criteria:
- [ ] A **link**, a **custom field** and a **file** belong to **me**, entered once; each Ring only switches each one **on or off**. Editing a link or a field changes it in every Ring that shows it; a value never differs between Rings (two values are two items) ([[D-03 Links entered once, switched on or off per Ring]]).
- [ ] **Links, custom fields and files follow the same rule** (D-03's open point, answered by the design review of 2026-10-29). Files already work this way ([[S-06 Files Upload Story|Files Upload · S12]]: upload once, attach per Ring).
- [ ] s20 and s24 list every item I have, on or off for this Ring, with the "N of M on" count; s25 the same for links.
- [ ] Order within a Ring: each Ring keeps its own order until product says otherwise (D-03, *Still open*).
- [ ] What exists today (copies per Ring) moves into the library once: identical copies (same type and value) become one item, switched on in each Ring that had it.
- [ ] Not available yet: each Ring holds its own copies today; until this ships, the app's phone-side imitation stays and the screens say a change applies to this Ring only.

### S10 · Follow the Pin, change it, or hide it, per field ([[Screen Index#s23|s23]], [[Screen Index#s24|s24]])

**As a** Ring owner **I want** each main-profile field on a Ring to follow my Pin, have its own value, or be hidden **so that** one Ring can say "Product lead" and another nothing at all.

Acceptance criteria:
- [ ] Each main-profile field (**headline**, **role**, **company**, **location**) on a Ring is in one of three states: **off** (switched off on s24), **on following the Pin** (the default on a new Ring), or **on with its own value** (set on s23); "Reset to Pin" goes back to following ([[D-05 Inherit per field, copy without members]]).
- [ ] A Ring that changed a field keeps its value when the main one changes; one that follows changes with it.
- [ ] The **photo** and the **bio** follow the same rule without "off" (`null` follows the profile, as today).
- [ ] The **name** is always on and the same in every Ring (D-02).
- [ ] Not available yet: depends on the main profile fields ([[S-14 Profiles & Pin Name Story|Profiles & Pin Name · S9–S11]]); no Ring can hide or change them today.

## States and motion the design asks for

- State: empty projection, a section with nothing on, switch on / off with the value preview, a field following the Pin / own for this Ring / hidden in this Ring, saving, read-only (403), invalid link value, the "Add a field" and "Add a social profile" sheets, "coming soon" for the main-profile fields and widgets until they ship.
- Motion: saving any part re-composes the Ring on return to s14 (the signature motion); View as is a flip. Reduced motion: cross-fade.

## Rules the backend already enforces

- `GET …/projection` requires `CONTENT_MANAGER` or owner and creates the projection on first access for the Ring's profile (falling back to the owner's default).
- `PATCH` updates `displayName`, `nickname`, `bio`, `avatarFileId`, `themeConfig` and the five `show*` flags; `null` clears and falls back to the base profile; `avatarFileId` must be the caller's file (400 `E_FILE_04`).
- Link values are validated by type (`assertLinkValueMatchesType`): absolute `http(s)` URLs with `javascript:` and `data:` refused, E.164 phones, an email, a `lat,lng` pair; several links of one type allowed.
- Sub-resource writes are transactional and scoped to the Ring; a foreign id is 404 (`E_RING_PROFILE_03` / `E_RING_PROFILE_04`).
- Hidden rows are excluded by the viewer query, never read into a viewer response; sensitive fields are gated only in `toView`, all `show*` default `false`; `displayName` falls back to the full name, never the nickname.
- Widgets are selected and returned but have no endpoints.

## Open questions

- Decided: [[D-02 One main profile every Ring starts from]], [[D-03 Links entered once, switched on or off per Ring]], [[D-05 Inherit per field, copy without members]]; built in S9 and S10 (design review 2026-10-29). The main profile fields are [[S-14 Profiles & Pin Name Story|Profiles & Pin Name · S9–S11]].
- Answered 2026-10-29: custom fields and files follow the same on/off rule as links (S9).
- The order of links within a Ring: shared, or per Ring (D-03, *Still open*); S9 keeps it per Ring until product says otherwise.
