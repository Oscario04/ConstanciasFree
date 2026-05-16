---
name: Institutional Assurance
source: Stitch project "Gestion VisDeDat"
source_project: projects/4745246738105777550
device: desktop-first responsive
updated: 2026-05-16
---

# DESIGN.md

Design system and frontend direction for ConstanciasFree, based on the Stitch project `Gestion VisDeDat`.

This file is the visual contract for future frontend work. It should be read together with:

- `AGENTS.md`
- `SPEC.md`
- `specs/frontend/app-shell-ux.md`
- `specs/frontend/api-client-contract.md`
- `specs/frontend/public-portal.md`
- `specs/frontend/admin-dashboard.md`

## Product Mood

The interface must feel institutional, precise, and trustworthy. This is a credential, event, and document verification system, so the design should communicate:

- official record keeping
- secure document handling
- calm administrative control
- fast public verification
- clear status and audit confidence

Avoid marketing-heavy layouts, playful decoration, loud gradients, or oversized empty hero sections. The product should feel like a modern public-sector or university operations tool.

## Stitch Reference

Project reviewed: `Gestion VisDeDat`

Screens found:

- `Inicio: Minimalista & Funcional`
- `Inicio de Sesion: Minimalista`
- `Registro de Usuario: Minimalista`
- `Catalogo de Eventos: Minimalista`
- `Detalle de Evento: Minimalista`
- `Solicitud de Participacion: Minimalista`
- `Dashboard de Usuario: Minimalista`
- `Mis Documentos: Minimalista`
- `Visor de Documento: Minimalista`
- `Verificador Publico: Minimalista`

Use these as the visual baseline for public and authenticated frontend flows.

## Design Tokens

### Color

Use a light institutional palette anchored in navy, cool surfaces, and restrained functional status colors.

```yaml
colors:
  background: "#f9f9ff"
  surface: "#f9f9ff"
  surface-lowest: "#ffffff"
  surface-low: "#f0f3ff"
  surface-container: "#e7eeff"
  surface-container-high: "#dee8ff"
  surface-container-highest: "#d8e3fa"
  surface-dim: "#cfdaf1"
  surface-variant: "#d8e3fa"

  text: "#111c2c"
  text-muted: "#43474e"
  outline: "#74777f"
  outline-soft: "#c4c6cf"

  primary: "#002045"
  primary-container: "#1a365d"
  primary-soft: "#d6e3ff"
  primary-soft-strong: "#adc7f7"
  on-primary: "#ffffff"

  secondary: "#5b5f61"
  secondary-container: "#dde0e2"

  success: "#2f855a"
  success-deep: "#002715"
  success-container: "#9ff5c1"

  warning: "#d69e2e"
  danger: "#ba1a1a"
  danger-container: "#ffdad6"
  on-danger: "#ffffff"
```

Color usage:

- Primary navy is for navigation, main actions, active states, and official headers.
- Green is reserved for verified, active, valid, or success states.
- Amber is reserved for pending, draft, or waiting review states.
- Red is reserved for invalid, rejected, revoked, failed, or destructive states.
- Surfaces should stay quiet and cool; do not create a one-color navy page.

### Typography

Use Inter for all roles.

```yaml
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 40px
    fontWeight: 700
    lineHeight: 48px
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: 700
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: 700
    lineHeight: 32px
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: 600
    lineHeight: 32px
  headline-sm:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: 600
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: 400
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: 400
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: 400
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: 600
    lineHeight: 16px
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: 500
    lineHeight: 16px
```

Typography rules:

- Keep letter spacing at `0` in implementation unless a local component needs tiny label tracking.
- Use hero-sized text only on public entry screens.
- Use compact headings inside dashboards, cards, sidebars, and forms.
- Labels should stay visible above form fields.

### Shape

```yaml
radius:
  sm: 4px
  default: 8px
  md: 12px
  lg: 16px
  xl: 24px
  full: 9999px
```

Usage:

- Buttons, inputs, tabs, and cards: 8px.
- Dense table cells and checkboxes: 4px.
- Modals and large document previews: 12px to 16px.
- Status pills may use full radius when they are metadata, not buttons.

### Spacing

```yaml
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 48px
  max-width: 1280px
```

Layout rules:

- Use a 4px base unit with an 8px practical rhythm.
- Keep desktop content within a 1280px max-width container.
- Use 16px side margins on mobile and 48px on desktop.
- Dashboards can use dense spacing; public verification should be more focused and spacious.

## Layout System

### Public Portal

Public screens include inicio, catalogo de eventos, detalle de evento, login, registro, solicitud, and verificador publico.

Rules:

- The first viewport should reveal the actual product purpose: events, constancias, verification, or access.
- Do not make a generic landing page before the product experience.
- Verification pages should use a centered, single-column layout.
- Event catalog pages should favor scan-friendly filters and compact event cards.
- Login and register pages should be restrained, with visible labels and clear validation states.

### Authenticated User Area

Authenticated screens include dashboard, mis documentos, and visor de documento.

Rules:

- Use an app-shell layout with predictable navigation.
- Prioritize task completion: review events, check requests, view documents, download or verify PDFs.
- Avoid decorative cards around whole page sections.
- Use cards only for repeated items, document previews, modals, and bounded tools.

### Admin Area

Admin screens should extend the same visual language with higher density.

Rules:

- Use tables for users, requests, attendance, and document issuance.
- Use sticky headers for long tables when possible.
- Keep filters, search, and status segmentation visible near the table.
- Use destructive actions sparingly and with confirmation.

## Components

### Buttons

Primary:

- background: `primary`
- text: `on-primary`
- radius: 8px
- height: 40px to 44px
- use for one main action per section

Secondary:

- white or transparent background
- navy border or soft outline
- navy text
- use for navigation, secondary actions, and safe alternatives

Destructive:

- red text or red outline by default
- solid red only for confirmed destructive flows

Icon buttons:

- Use icons for compact tools like view, download, copy, search, filter, approve, reject.
- Add accessible labels/tooltips.

### Inputs

- Label always visible above the field.
- 1px soft border using `outline-soft`.
- Focus border uses `primary` with a soft blue ring.
- Error states use `danger` and a concise message below the field.
- Required fields should be indicated by label text or helper text, not color alone.

### Cards

Use cards for:

- event summaries
- document summaries
- certificate previews
- request status panels
- modal content

Card rules:

- white or `surface-lowest` background
- 1px `outline-soft` border
- radius 8px
- subtle shadow only when needed for hierarchy
- no card inside another card

### Status Indicators

```yaml
statuses:
  verified:
    color: success
    icon: check
  active:
    color: success
    icon: check-circle
  pending:
    color: warning
    icon: clock
  draft:
    color: warning
    icon: file
  rejected:
    color: danger
    icon: x-circle
  revoked:
    color: danger
    icon: shield-alert
```

Status rules:

- Include text and icon; do not rely on color alone.
- Use green only for trust-positive states such as verified, issued, active, valid.
- Verification badges are a signature component and should be visually distinct without becoming flashy.

### Tables

Use tables for admin and staff workflows.

Rules:

- Dense but readable rows.
- Sticky header for long lists.
- Alternating row background may use `surface-lowest` and `surface`.
- Status column should be scannable.
- Row actions should be icon-first with tooltips.
- Avoid wrapping action buttons into multiple lines.

### Document Viewer

Document viewer screens should feel official and quiet.

Rules:

- Keep document preview as the primary visual object.
- Metadata panel should show recipient, event, issue date, code, and verification status.
- Primary actions: download PDF, copy verification link, open public verification.
- Valid documents should show a green verified badge.
- Invalid or revoked documents should show a red warning state with explanation.

### Public Verifier

Public verification is a trust-critical flow.

Rules:

- Single focused input for verification code.
- Clear result state: valid, not found, revoked, or expired if implemented.
- For valid documents, show official metadata and a strong verified indicator.
- Do not require authentication for `GET /api/documents/verify/{code}`.

## Motion And Feedback

- Use short transitions: 120ms to 180ms.
- Animate opacity, transform, border, and background only.
- Do not animate layout in dense admin tables.
- Loading states should use skeletons for lists and a small spinner for buttons.
- Toasts should be concise and not block the next action.

## Accessibility

- Maintain strong contrast for text and status states.
- Every icon-only button needs an accessible label.
- Form errors must be text, not just red borders.
- Keyboard focus must be visible.
- Tables need semantic headers.
- Verification result states must include clear text labels.

## Implementation Notes

- Prefer Tailwind tokens mapped from this file if a frontend is created.
- Keep reusable components small and domain-oriented: `StatusBadge`, `EventCard`, `DocumentCard`, `VerificationResult`, `DataTable`, `AppShell`.
- Use real API paths from `specs/frontend/api-client-contract.md`.
- Do not invent `/api/v1`.
- Do not design screens around unimplemented backend collections unless the spec marks them as future work.

## Done When

A frontend screen follows this design system when:

- It uses the navy/cool-surface institutional palette.
- It uses Inter with the scale above.
- It keeps border radius and spacing consistent.
- It makes status and verification states immediately scannable.
- It supports the real ConstanciasFree API and product flows.
- It is responsive without text overlap or layout jumps.

