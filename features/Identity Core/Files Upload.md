---
type: feature
id: files
name: "Files Upload"
status: done
priority: P1
domain: identity
screens: [s14, s20, s36]
updated: 2026-10-15
tags: [feature, status/done, domain/identity, priority/P1]
---

# ✅ Files Upload

**Status:** Done · **Priority:** P1 · **Domain:** [[Feature Tree#Identity Core|Identity Core]]

Multipart upload with type and size checks, metadata read, delete. A file becomes visible only when a reachable context (a Ring projection) references it.

## Design reference

| Screen | Name | Note |
|---|---|---|
| [[Screen Index#s14|s14]] | Ring data |  |
| [[Screen Index#s20|s20]] | New Ring · step 3 (what it shows) | Field library → D-03 |
| [[Screen Index#s36|s36]] | Add to this Ring |  |

Wireframe brief sections: [[Wireframe Brief#Home — Rings hub + active profile|§4.1 Home — Rings hub + active profile]]

Prototype: `socialPin-design/.proto2.json` (screen ids above), click-through map in [[Navigation Map]], see [[Design Reference]].

## Backend state

**Endpoints**

- `POST /files`
- `GET /files/:id`
- `DELETE /files/:id`

**Tables / models:** `File`

**Code:** `src/modules/file/`, `src/common/upload/`

### What exists

- Max 25 MB. Accepted: JPEG, PNG, WebP, GIF, PDF, DOCX / XLSX / PPTX, DOC / PPT, TXT, CSV. Anything else is a 415.
- Binaries in object storage, metadata in the database; `FileService.persist` / `discard` are the only methods touching bytes.
- The response omits the storage path.

### Gaps

- No "list my files" and no "N Rings inherit it" count. See [[Photo Library]].

## Tasks

_No open tasks._

```dataview
TABLE status, priority, effort FROM #task WHERE feature = "files" SORT priority ASC
```

## Related

- [[Photo Library]]
- [[Ring Projection]]

Project context: [[Ring Access Model]] · [[Architecture]] · [[API Conventions]] · [[SPEC_MAP]]
