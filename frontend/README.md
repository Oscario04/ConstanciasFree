# ConstanciasFree Frontend

Frontend React + TypeScript + Tailwind para el backend FastAPI existente.

## Comandos

```bash
npm install
npm run dev
npm run typecheck
npm run test
npm run build
npm run e2e
```

## Variables

```bash
VITE_API_BASE_URL=http://127.0.0.1:8000
```

## Estructura

- `src/lib/api`: cliente tipado para rutas reales `/api`.
- `src/lib/auth`: sesion, usuario actual y permisos.
- `src/components`: UI base alineada con `../DESIGN.md`.
- `src/pages`: pantallas publicas, usuario, admin y staff.
- `src/routes`: guards de autenticacion y rol.
- `src/test`: pruebas Vitest/RTL.
- `tests/e2e`: smoke Playwright.

## Normas SDD

- Antes de cambiar comportamiento, actualizar `specs/frontend/*` y contratos API.
- No usar endpoints fuera de `specs/004-api-contracts.md`.
- Mantener Stitch como referencia visual y `DESIGN.md` como contrato local.
- Las rutas siguen `/api`, no `/api/v1`.

