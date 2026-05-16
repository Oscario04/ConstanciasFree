# Adaptacion de Specs al Backend Existente

## Spec

Estas especificaciones documentan el backend FastAPI ya creado en `app/` y reemplazan la intencion original de los prompts de `ai-specs-constancias/` por una fuente de verdad alineada con la API real.

## Backend Real

- Framework: FastAPI.
- Base de datos: MongoDB via Motor.
- Autenticacion: JWT Bearer con login OAuth2 password form.
- Prefijo real: `/api`, no `/api/v1`.
- Routers reales: `auth`, `users`, `events`, `requests`, `attendance`, `documents`, `stats`, `admin`.
- Colecciones reales: `users`, `events`, `requests`, `attendance`, `documents`, `qr_tokens`.
- Servicios reales: PDF con ReportLab, storage Cloudinary con fallback local de desarrollo, email SMTP.

## Diferencias Contra Los Prompts Originales

- `Role` dinamico no existe como coleccion; los roles son enum/string en `users.role`.
- `Venue`, `Template`, `Notification`, `AuditLog` y `PublicVerification` no existen como colecciones separadas.
- `Certificate` esta implementado como `documents`.
- `Session` esta embebido en `events.sessions`.
- El verificador publico existe en `GET /api/documents/verify/{code}`.
- Las respuestas de error usan `HTTPException.detail`; no hay envoltorio normalizado con codigos como `VALIDATION_ERROR`.
- La cancelacion de solicitudes existe aunque el enum del modelo no incluye `cancelled`; el router escribe ese estado directamente.
- No hay versionado `/api/v1`.

## Reglas De Adaptacion

- Toda nueva especificacion debe referenciar rutas reales bajo `/api`.
- No se deben prometer modulos no implementados como obligatorios; se deben marcar como fase futura.
- Los criterios EARS deben probar comportamiento existente o brechas concretas.
- Los tests deben ejecutarse contra `test_api.py` o migrarse gradualmente a pytest/TestClient.

## Done When

- Las specs describen exactamente la API actual.
- Las brechas quedan marcadas como pendientes, no como comportamiento existente.
- Cualquier cambio futuro al backend actualiza primero estas specs.

## Frontend Adaptado

Las especificaciones para React + TypeScript + Tailwind viven en `specs/frontend/`.

- `app-shell-ux.md`: arquitectura, rutas, UX, estado y pruebas.
- `api-client-contract.md`: cliente TypeScript contra la API real.
- `public-portal.md`: portal publico, usuario y verificador.
- `admin-dashboard.md`: panel administrativo/staff con permisos reales.
- `hostinger-deployment.md`: build estatico y despliegue en Hostinger.
