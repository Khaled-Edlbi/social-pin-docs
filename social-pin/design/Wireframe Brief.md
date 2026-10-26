---
type: reference
source: socialPin-design/uploads/SocialPin_Mobile_UIUX_Wireframe_Brief.md
copied: 2026-10-15
tags: [design, reference]
---

> [!info] Reference copy
> Verbatim copy of the wireframe brief so that feature notes can link to its sections. The file under `socialPin-design/uploads/` is the source; if they differ, that one wins. Section map: [[Brief Section Map]].

# SocialPin — Mobile App UI/UX Wireframe Brief

*Scope: User mobile application (iOS/Android). All user types, all journeys.*
*Fidelity: **Wireframe only** — structure, flow, states, and motion intent. Not colors or final styling.*

---

## 0. How to use this brief

This document briefs the **wireframe** stage. For every screen it defines: **purpose**, **key elements** (structural, not styled), **primary actions**, **states** (empty / loading / error where relevant), and **motion intent** (the transition into/out of the screen and any signature in-screen animation).

**Wireframe fidelity rules:**
- Grayscale, boxes-and-labels. No brand colors, no final typography, no imagery beyond placeholders.
- **Do annotate motion.** Every screen-to-screen jump gets a transition note; signature moments get a motion callout. The wireframe deliverable is expected to be *animated / prototyped* (meaningful continuous transitions), so treat motion as a first-class part of the wireframe, not an afterthought.
- Where a component is Ring-dependent (e.g. the badge re-composes per Ring), show the *structural* change, not the color change.

**User types covered in the mobile app:**
- **Personal / Identity user** — the base experience everyone has.
- **User A — Visitor** — attends events.
- **User B — Exhibitor** — a business account at an event (starts as a visitor, upgrades).
- **User C — Organizer** — primarily a **web** platform; the mobile app only surfaces organizer *touchpoints* (e.g. an exhibitor being invited/added). Full organizer dashboard is out of scope for this mobile brief.

---

## 1. Core product concept the wireframes must communicate

Everything hangs on **Rings**: the user has one account but many audience-bound perspectives of their profile. A Ring controls what an audience sees; the QR/badge is bound to the *currently selected Ring*; connections are assigned to a Ring on accept; access is live-revocable and can expire.

Two ideas the wireframes must make *feel* obvious through structure and motion:
1. **Switching Ring re-composes your identity** — the profile/badge visibly rebuilds when the active Ring changes. This is the app's signature motion.
2. **"View as"** — you can preview your profile exactly as a chosen Ring sees it. This is the "aha" that teaches the whole model.

---

## 2. Global navigation & app shell

**Bottom tab bar (5 slots, center action):**

```
[ Home ]   [ Events ]   (◎ Badge)   [ Discover ]   [ Me ]
```

- **Home** — Rings hub + active-Ring profile (default landing).
- **Events** — event discovery, my events, in-event hub.
- **◎ Badge (center, elevated)** — one tap raises the shareable QR/badge for the active Ring. This is the most-used action, so it's the thumb-anchor.
- **Discover** — search (Ask Gemma), Nearby, PinCast, contacts.
- **Me** — account, subscription (Free/Pro), linked accounts, devices, settings.

**Persistent chrome:**
- **Active-Ring switcher** lives at the top of Home (and is reachable via a pull-down or a persistent chip elsewhere) — changing it changes the badge and profile everywhere.
- **Notifications bell** (top-right) with unread indicator.

**App-shell motion:**
- Tab changes use a **shared spatial model** (tabs slide along a horizontal axis; no hard cuts).
- The center Badge button uses a **rise + expand** transition into a badge sheet, and collapses back into the button on dismiss (continuous, reversible).

---

## 3. Onboarding (impressive, continuous, teaches Rings by doing)

Onboarding is a **single continuous narrative**, not a stack of disconnected forms. A **ring-shaped progress indicator** sits persistently on screen and **fills segment-by-segment** as the user completes steps — the product metaphor *is* the progress bar. Steps transition horizontally with the ring element as the shared, morphing anchor between them.

### 3.1 Flow

```
Splash / brand moment
   → Value narrative (3 continuous panels: "one you, many audiences" → Rings → control)
   → Auth choice:  [ Continue with Email ]  [ Continue with Phone ]  [ Continue with LinkedIn ]
        ├─ Email  → enter email → Email OTP → enter code → create password
        ├─ Phone  → country code + number → SMS OTP → enter code → create password
        └─ LinkedIn → OAuth → IMPORT PROFILE (see 3.3) → review imported fields
   → Choose Pin name  (!handle, live availability check)
   → Create your first Ring (default Ring; suggested: Family / Clients / Company)
   → Add links & interests (optional, skippable)
   → "View as" teaser  → preview how this Ring sees you   ← the aha moment
   → Permissions primer (notifications, nearby/PinCast) — explained, not dumped
   → Land on Home (first Ring active, badge ready)
```

### 3.2 The three login/signup methods

All three are shown as equal, primary choices on one screen.

| Method | Wireframe flow | States to draw |
|---|---|---|
| **Email** | Email field → OTP screen (6-digit) → set password | invalid email, code sent, wrong/expired code, resend timer |
| **Phone** | Country-code selector + number → SMS OTP → set password | invalid number, code sent, wrong/expired code, resend timer |
| **LinkedIn** | OAuth hand-off → return → profile import review | OAuth cancelled/failed, permissions denied |

**Motion:** the auth choice screen's three options **converge into a single verification flow** — whichever is chosen, the ring-progress anchor persists so the user never feels dropped into a different app.

### 3.3 LinkedIn profile import (call out as its own flow)

After LinkedIn OAuth, show a **"Review your imported profile"** screen so the user confirms, rather than silently ingesting data:

- **Elements:** imported avatar, full name, headline/role, company, location, and a list of importable fields each with a **toggle/checkbox** (include / skip) and inline-editable value.
- **Mapping note for wireframer:** imported fields populate the user's **base profile**, which then feeds the **first Ring**. Show the relationship (imported data → profile → Ring) structurally so it's clear the import isn't a dead-end.
- **Primary action:** *Confirm & continue* → proceeds to Pin name.
- **States:** partial import (some fields unavailable), nothing returned (fall back to manual), edit-before-import.
- **Motion:** imported fields **animate into their slots** as a continuous "assembling your profile" sequence rather than appearing all at once — reinforces that a profile is being built for them.

---

## 4. Identity & profile journeys (base experience)

### 4.1 Home — Rings hub + active profile
- **Purpose:** default landing; shows the active Ring's profile and lets the user switch Rings.
- **Key elements:** active-Ring header (name, bio/image *for this Ring*), **Ring switcher** (horizontal carousel of My Rings + Shared Rings with counts), connections counter, per-Ring info blocks, linked accounts, attachments, widgets, "View as", "Add information to your Ring".
- **Primary actions:** switch Ring · show Badge · View as · edit Ring · add info/widget.
- **Signature motion:** **switching a Ring re-composes the profile** — the header, info blocks, linked accounts and badge preview visibly rebuild via staggered transitions tied to the carousel scroll. This is *the* motion of the app; prototype it fully.

### 4.2 Ring management
- **Screens:** My Rings vs Shared Rings (with counts) · Create/Edit Ring · Ring members · Ring expiry · Ring theming (structural placeholder only) · delegated admins (company Rings).
- **Create Ring:** name → audience purpose → what this Ring exposes (fields, links, attachments) → optional expiry.
- **Motion:** creating a Ring animates a **new ring forming** and taking its place in the carousel; deleting collapses it out.

### 4.3 "View as" (preview per Ring)
- **Purpose:** show the profile exactly as a chosen Ring sees it.
- **Elements:** Ring selector + a rendered "outside view" clearly marked as a preview; toggle back to owner view.
- **Motion:** a **flip / perspective transition** between "your view" and "their view" — continuous, reversible, so the mental model lands.

### 4.4 Badge / QR (center action)
- **Purpose:** present the shareable QR/badge for the **active Ring**.
- **Elements:** large QR/badge, Ring label, share options (link, save, etc.), "scan" toggle to flip to the scanner.
- **States:** Ring selected, no Ring, scanning.
- **Motion:** **rise + expand** from the center tab; **badge re-composes if the user changes Ring while it's open**; flipping to scanner is a continuous card-flip.

### 4.5 QR scan (scanning someone else)
- **Flow:** open scanner → detect code → resolve to that person's Ring-view → **Connect/Add** prompt.
- **On scan of another user:** show their Ring-scoped profile → *Connect* → the flow in §5.
- **States:** scanning, no permission (camera), invalid code, resolved profile.
- **Motion:** detected code **animates into the resolved profile card** (continuous, the QR "becomes" the person).

---

## 5. Connections & networking (the "Connect/Add" model — not a feed)

A connection is an **access request**, not a content subscription. On accepting, the owner **chooses which Ring** to place the requester in (Gemma can suggest one). Membership is **private to the owner**; the requester only ever sees *what* is shared, never *which* Ring.

### 5.1 Screens
- **Requests inbox** — incoming Connect requests needing action.
- **Accept sheet** — on accept, **pick a Ring** to add them to (default suggested by Gemma). Bottom-sheet.
- **Following / Followers / Connections lists** — with the note that "follow" may be relabeled **Connect/Add**.
- **Connection detail** — the person, and (owner-only) which Ring they're in, with **live re-assignment** control.
- **Introduce Friends** — suggest a Ring to add someone to (via Gemma).

### 5.2 Motion & states
- Accept = a **card slides into the chosen Ring** (spatial confirmation of "they're now in this audience").
- **Live re-assignment:** moving a connection between Rings animates the move; copy reinforces "what they see just changed."
- States: no requests (empty), pending, accepted, declined.

---

## 6. Discovery journeys

### 6.1 Discover hub
- Entry points: **Ask Gemma or Discover** (search by Pin name, recent searches) · **Nearby** · **PinCast** · **Contacts** · **Devices**.

### 6.2 Nearby discovery
- **Purpose:** "see who's around me" / **search nearby by Ring** (returns users in that Ring nearby).
- **Elements:** a **radar/proximity view** with nearby pins; Ring filter; list fallback.
- **Motion:** pins **populate onto the radar** with a continuous sweep; selecting a pin expands it into a profile card.
- **States:** searching, none found, permission needed.

### 6.3 PinCast (proximity broadcast)
- **Purpose:** broadcast your account to nearby PinCast users, limited by **distance + time**.
- **Flow:** configure (which Ring, distance, duration) → **broadcasting** state (live radiating animation) → **"PinCast ended — see results"** → results list (who was reached).
- **Signature motion:** the **broadcast ripple** — continuous concentric waves while live; on end, waves **collapse into the results list**.
- **States:** setup, live/countdown, ended-with-results, ended-empty.

### 6.4 Contacts & Devices
- **Contacts** — saved connections, searchable.
- **Devices** — linked-device management (add/remove, current device highlighted).

---

## 7. Before-event journeys (User A — Visitor)

### 7.1 Events tab — discovery & my events
- **Elements:** browse/discover events; "my events"; event cards (name, cover, date, location).
- **Motion:** event card **expands into the event landing page** via shared-element transition (cover image is the shared element).

### 7.2 Event landing page
- **Elements:** name + cover, location, **date & time**, **map**, schedule, **exhibitor list**, **mini-events list**, lounges, AI assistant entry, primary CTA.
- **Primary CTA:** RSVP / register / buy.

### 7.3 Tickets, access levels, RSVP, registration, payment
- **Ticket & package selection** — packages, access to sub-events, **visitor levels** (Visitor, Sponsor, VIP, Exhibitor, Staff).
- **RSVP / Registration** — form; account data pre-fills where possible.
- **Payment** — ticket/package/sub-event purchase; methods per organizer (card / e-payment / etc.); confirmation.
- **On success:** the **Event Ring is granted** — show this explicitly (a Ring is added to the user's hub). This is the key tie-back to the identity core.
- **States:** sold out, tier unavailable, payment pending/failed/succeeded.
- **Motion:** successful registration animates the **Event Ring joining the user's Ring carousel** — continuous bridge from "event" to "identity."

---

## 8. In-event journeys (User A — Visitor)

### 8.1 In-event hub (Event Ring active)
- **Elements:** event schedule, map, **exhibitor list**, **mini-events/lounges**, **AI assistant (Pro)**, **CTA (Get help)**, nearby-by-Ring, upgrade entry.
- **Motion:** entering an event **switches the active Ring to the Event Ring** using the signature Ring re-compose motion, so the app visibly "enters event mode."

### 8.2 Exhibitor discovery → request a meeting
- Browse exhibitor list → exhibitor profile → **Request a meeting** → **select an available slot** (exhibitor's slots) → **confirmation + auto-created temporary Ring** holding meeting details → exhibitor accepts, or **declined → notification + reason**.
- **Motion:** requesting a meeting spawns a **temporary Ring** that animates in as a distinct, time-limited object (visually differentiated from permanent Rings via structure, e.g. a dashed/temporary treatment — no color needed).

### 8.3 Sub-events, lounges, upgrades
- Manage access to **sub-events** (seminars, VIP, networking lounges) — subscribe & pay.
- **Upgrade during the event** — Delegate / Sponsor / VIP; **Pro** users get any-lounge access + **Smart Match**.
- **States:** locked (needs upgrade), owned, purchasable.

### 8.4 Matchmaking (Smart Match)
- **Elements:** suggested people/exhibitors with **match strength (Strong / Good / Weak)**; Gemma can **automate sending meeting requests** (Pro).
- **Motion:** match cards **surface/stack by strength**; accepting a suggestion flows straight into the slot-based meeting request.

### 8.5 Post-event
- **CTA (Get help) → Summary → Result** ("how the user got use of the event").
- **After event:** temporary/event Ring lifecycle — **keep / merge / auto-delete** (present as an explicit choice sheet).
- **Motion:** the post-event summary **assembles from the user's event activity** (continuous build); the Ring-lifecycle choice animates keep (stays), merge (two Rings combine), or delete (collapses out).

---

## 9. Exhibitor journeys (User B)

Exhibitor **starts as a visitor**, then creates a **business account** — show the upgrade as a continuation of the same identity, not a separate app.

### 9.1 Become an exhibitor / business account setup
- **Flow:** visitor → *Create business account* → industry + activity + tags → address + social links → logo + phone + email + website + P.O. Box + About → video link + photo gallery → upload files (PDF/PPT/links).
- Business is showcased via a **business Ring**.
- **Motion:** business-account creation **forms a business Ring** using the Ring-creation motion, signaling the business identity now lives alongside personal Rings.

### 9.2 Exhibitor in-event tools
- **Exhibitor ↔ Exhibitor meetings** — request a meeting with another exhibitor (same slot-based flow + auto temp Ring).
- **Incoming meetings** — list of requested meetings → **Need Action** → **Accept** (offer available date/time slots) or **Decline** (send declined notification + reason).
- **Mini-events** tied to the exhibitor's selected package.
- **Discoverable-via-AI** toggle; approve/reject requests.
- **Analytics** — who viewed the Ring/account: QR scans, video clicks, Rings opened.
- **States:** need-action, accepted, declined, no requests.

### 9.3 Organizer touchpoints inside the app (light)
- Exhibitor may **receive an invitation**, be **inserted (as a pin/member)** into a business account, be asked to **upload requested files**, and see **booth/area** and **payment** status.
- Full organizer dashboard is **web** — the app only shows the exhibitor's side of these (invitation received, files requested, status).

---

## 10. Meetings & scheduling (cross-cutting)

- **Meetings screen** — meeting cards (event, date, time slot, title, org, room/location); calendar view.
- **Slot-based request** — request → pick a slot from the other party's availability → **confirmation + auto temp Ring** with meeting details → other party accepts/declines → **decline returns a notification + reason**.
- **Motion:** confirmed meetings animate onto the calendar; each meeting's **temporary Ring** is visibly linked to the meeting card.
- **States:** requested, confirmed, declined (with reason), cancelled, past.

---

## 11. Notifications (cross-cutting)

- **Grouped** by Today / Yesterday / Last 7 days.
- **Types:** connect request received, connect request accepted, **PinCast ended (see results)**, **pins nearby (scan now)**, meeting requests/actions, event/registration updates.
- **Motion:** tapping a notification **deep-links with a shared-element transition** into the relevant screen (e.g. "PinCast ended" → results; "pins nearby" → radar).

---

## 12. Account, subscription & settings (Me)

- **Manage account** — personal info, linked accounts, email/phone, password.
- **Subscription / Account type** — **Free vs Pro** (Pro gates: any-lounge access, Smart Match, Gemma automation, AI assistant).
- **Linked accounts** — per the profile model, multiple accounts of the same type supported.
- **Devices** — linked-device management.
- **Privacy defaults** — sensitive fields (gender, marital status, birthdate) **optional & Ring-scoped by default** — surface these as clear toggles.

---

## 13. Gemma (AI) — where it appears

Gemma is a cross-cutting layer, not a separate tab. Surface it at: **Discover** (Ask Gemma / search), **accept sheet** (suggest a Ring), **Introduce Friends**, **matchmaking** (suggest & auto-request meetings, Pro), and **profile management** (who to put in a Ring, merge suggestions, links). Wireframe it as a **consistent entry affordance** (e.g. a persistent Gemma prompt/entry) that opens a context-aware assistant sheet.

---

## 14. Motion & animation principles (summary for the prototyper)

The app should feel **continuous and spatial** — screens relate to each other in space, and objects (Rings, badges, meetings, people) **persist and transform** across transitions rather than being replaced.

**Signature motions to prototype fully:**
1. **Ring re-compose** — switching the active Ring rebuilds the profile & badge (staggered, tied to the switcher). *The* app motion.
2. **Onboarding ring-fill** — the progress indicator is a ring that completes as onboarding progresses; the ring is the shared anchor between steps.
3. **LinkedIn import assembly** — imported fields animate into a profile being built.
4. **Badge rise/expand** — center action grows into the badge sheet, reversible.
5. **QR-to-person** — a scanned code becomes the resolved profile card.
6. **PinCast ripple** — continuous broadcast waves that collapse into results.
7. **Nearby radar sweep** — pins populate on a sweep.
8. **Event Ring joins the hub** — registration bridges "event" → "identity."
9. **Temporary Ring lifecycle** — spawn (on meeting), then keep / merge / delete.
10. **View-as flip** — perspective flip between owner-view and audience-view.

**Guardrails:** every transition should be *reversible* and *interruptible*; motion should carry meaning (state change, spatial relationship, or the Rings metaphor) — never decorative. Respect reduced-motion accessibility (provide a simplified fallback).

---

## 15. Screen inventory (wireframe checklist)

**Onboarding:** Splash · Value narrative (×3) · Auth choice · Email OTP · Phone OTP · Set password · LinkedIn OAuth return · **LinkedIn import review** · Pin name · Create first Ring · Add links/interests · View-as teaser · Permissions primer.

**Identity:** Home (Rings hub + active profile) · My Rings / Shared Rings · Create/Edit Ring · Ring members · Ring expiry · Delegated admins · View as · Badge/QR · Add info/widgets.

**Scan & connect:** Scanner · Resolved profile · Connect prompt · Requests inbox · Accept (pick Ring) sheet · Following/Followers/Connections · Connection detail (re-assign) · Introduce Friends.

**Discover:** Discover hub · Search / Ask Gemma · Nearby radar · PinCast setup · PinCast live · PinCast results · Contacts · Devices.

**Before event:** Events tab · Event landing · Ticket/package select · RSVP/Registration · Payment · Confirmation (Event Ring granted).

**In event:** In-event hub · Exhibitor list · Exhibitor profile · Request meeting / pick slot · Sub-events/lounges · Upgrade · Smart Match · Get help · Post-event summary · Ring lifecycle (keep/merge/delete).

**Exhibitor:** Create business account (multi-step) · Business Ring · Exhibitor↔exhibitor meeting · Incoming meetings (Need Action) · Accept-with-slots / Decline · Package mini-events · Discoverable toggle · Exhibitor analytics · Invitation received / files requested / booth & payment status.

**Meetings:** Meetings list · Calendar · Meeting detail · Confirm/Decline (reason).

**Cross-cutting:** Notifications (grouped) · Me / Account · Subscription (Free/Pro) · Linked accounts · Privacy/Ring-scoped fields · Gemma assistant sheet.

---

*Prepared as a wireframe-stage brief. Colors, typography, and final visual styling are intentionally out of scope. Feature scope derived from the SocialPin V0.9.1 features list.*
