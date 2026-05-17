---
title: Company Master — Redesign & Feature Completion
date: 2026-05-17
status: approved
---

## Overview

Redesign the existing Company Master page (`/master/company`) to match the reference ERP screenshot. The existing page has all the correct fields and a working API but uses a side-by-side layout. This spec covers the full visual redesign, logo upload, State dropdown, VIEW modal, DELETE action, and table updates.

## Layout

Stacked full-width layout:

1. **Page header** — "Company Master" title, "* Denotes mandatory field" label on the right
2. **Form card** — full width, white background
3. **Company Details table card** — full width, below form, with PRINT button

## Form Fields (exact reference order)

| Row | Fields | Notes |
|-----|--------|-------|
| 1 | `*Code` (small col) + `Group` (Company Group) | Both required |
| 2 | `*Company Name (200 Ch)` | Full width, required |
| 3 | `*Company Address1 (200 Ch)` | Full width, required |
| 4 | `Company Address2 (200 Ch)` | Full width, optional |
| 5 | `Company Address3 (200 Ch)` | Full width, optional |
| 6 | City · State · Country · Pin Code · Phone No. · Fax No. | 6 equal columns, all text inputs |
| 7 | E-Mail · Website · C.I.No. · Service Tax No. · PAN No. · VAT No. | 6 equal columns |
| 8 | `State` dropdown (from DB) + `Payable At` | State = `<Select->` placeholder |
| 9 | Company Logo upload | Label shows "Company Logo:(width=145px and height=72px)", Choose File input + ATTACH button. ATTACH triggers immediate upload to server; returned path stored in hidden state field and included on SAVE. |
| 10 | Action buttons: SAVE · VIEW · CLOSE | Orange SAVE, grey VIEW/CLOSE |

**Note on State field:** Row 6 "State" is a free-text field (like City, Country). Row 8 "State" is the dropdown populated from the `states` DB table. This matches the reference screenshot exactly — the reference uses both a text State field in row 6 and a select State in row 8 (labelled separately).

## Buttons

- **SAVE** — POST (create) or PUT (update) the company record. On success, reset form and refresh table.
- **VIEW** — Open read-only modal showing all fields + logo preview for the currently loaded/saved company. Disabled if no record is loaded.
- **CLOSE** — Reset form to blank state.

## Company Details Table

Columns: S. NO. | CODE | GROUP NAME | COMPANY NAME | EDIT | DELETE

- Dark slate header row (matching existing ERP style: `bg-slate-700 text-white`)
- Alternating white / gray-50 striped rows
- EDIT — pencil icon, loads row into form above (scroll to top)
- DELETE — trash icon (red), shows `confirm()` dialog before deleting
- PRINT button below table

## API Changes

### Existing (no change needed)
- `GET /api/master/company` — returns all companies ordered by name
- `POST /api/master/company` — creates company
- `PUT /api/master/company` — updates company (requires `id` in body)

### New: DELETE
- `DELETE /api/master/company` — body `{ id }`, deletes company by PK

### New: Logo Upload
- `POST /api/master/upload-logo`
- Accepts `multipart/form-data` with field `file`
- Saves to `/public/uploads/logos/<timestamp>-<originalname>`
- Returns `{ path: '/uploads/logos/<filename>' }`
- Uses `formidable` for multipart parsing (already available or add as dependency)

### New: States list
- `GET /api/master/states` — returns `[{ id, name }]` ordered by name
- Used to populate the State dropdown in row 8

## State & Data Flow

```
Page load
  → fetch /api/master/company   (React Query: queryKey ['company'])
  → fetch /api/master/states    (React Query: queryKey ['states'])

ATTACH clicked (logo section)
  → POST /api/master/upload-logo with selected file
  → store returned path in component state (logoPath)
  → show filename as confirmation text next to button

SAVE clicked
  → POST or PUT /api/master/company including logoPath from state (if any)
  → invalidate ['company'] query → table refreshes

EDIT row clicked
  → setValue all fields from row data → scroll to form top

DELETE row clicked
  → confirm dialog
  → DELETE /api/master/company { id }
  → invalidate ['company']

VIEW clicked
  → open modal with current form values (read-only)
```

## File Changes

| File | Change |
|------|--------|
| `src/pages/master/company.tsx` | Full rewrite — new layout, fields, logo upload, VIEW modal |
| `src/pages/api/master/company.ts` | Add DELETE handler |
| `src/pages/api/master/upload-logo.ts` | New file — logo upload endpoint |
| `src/pages/api/master/states.ts` | New file — states list endpoint |

## Logo Storage

- Directory: `public/uploads/logos/` (create if not exists)
- Filename pattern: `<Date.now()>-<sanitized-originalname>`
- DB column: `companies.logo` (STRING 500) — stores relative path `/uploads/logos/<filename>`
- In VIEW modal: render as `<img src={logo} width={145} height={72} />`

## Constraints

- No external file storage (S3 etc.) — local `/public` folder only
- `formidable` v3 for multipart parsing (Next.js Pages Router does not parse multipart natively)
- `config: { api: { bodyParser: false } }` required on the upload endpoint
- Mandatory fields (marked with `*`): Code, Company Name, Company Address1
- City, State (text), Country, PIN — currently required in schema; keep as-is
