# Frontend Implementation Map

Matriz de trazabilidad SDD para conectar Stitch, rutas frontend, API real y pruebas.

| Stitch screen | Frontend route | Backend endpoints | Spec | Test |
| --- | --- | --- | --- | --- |
| Inicio: Minimalista & Funcional | `/` | `GET /api/events/` | `specs/frontend/public-portal.md` | Playwright public smoke |
| Catalogo de Eventos: Minimalista | `/eventos` | `GET /api/events/` | `specs/frontend/public-portal.md` | RTL/MSW events list |
| Detalle de Evento: Minimalista | `/eventos/:eventId` | `GET /api/events/{event_id}` | `specs/frontend/public-portal.md` | RTL/MSW event detail |
| Inicio de Sesion: Minimalista | `/login` | `POST /api/auth/login` | `specs/frontend/public-portal.md` | RTL login form |
| Registro de Usuario: Minimalista | `/registro` | `POST /api/auth/register` | `specs/frontend/public-portal.md` | RTL register form |
| Solicitud de Participacion: Minimalista | `/app/eventos/:eventId/solicitar` | `POST /api/requests/` | `specs/frontend/public-portal.md` | RTL request mutation |
| Dashboard de Usuario: Minimalista | `/app` | `GET /api/requests/me`, `GET /api/documents/me` | `specs/frontend/app-shell-ux.md` | RTL auth guard |
| Mis Documentos: Minimalista | `/app/documentos` | `GET /api/documents/me`, `GET /api/documents/pdf/{code}` | `specs/frontend/public-portal.md` | RTL documents list |
| Visor de Documento: Minimalista | `/app/documentos`, `/verificar/:code` | `GET /api/documents/verify/{code}`, `GET /api/documents/pdf/{code}` | `specs/frontend/public-portal.md` | RTL verifier |
| Verificador Publico: Minimalista | `/verificar`, `/verificar/:code` | `GET /api/documents/verify/{code}` | `specs/frontend/public-portal.md` | Playwright verifier smoke |

## Admin/Staff Extensions

| Area | Frontend route | Backend endpoints | Spec | Test |
| --- | --- | --- | --- | --- |
| Dashboard admin | `/admin` | `GET /api/stats/dashboard` | `specs/frontend/admin-dashboard.md` | RTL/MSW dashboard |
| Eventos admin | `/admin/eventos`, `/admin/eventos/:eventId` | `GET/POST/PATCH/DELETE /api/events` | `specs/frontend/admin-dashboard.md` | RTL event form |
| Solicitudes admin | `/admin/eventos/:eventId/solicitudes` | `GET /api/requests/event/{event_id}`, `PATCH /api/requests/{request_id}/review` | `specs/frontend/admin-dashboard.md` | RTL review flow |
| Asistencia | `/admin/eventos/:eventId/asistencia`, `/staff/asistencia` | `GET /api/attendance/event/{event_id}`, `POST /api/attendance/check-in` | `specs/frontend/admin-dashboard.md` | Playwright check-in smoke |
| Documentos admin | `/admin/eventos/:eventId/documentos` | `GET /api/documents/event/{event_id}`, issue, issue-batch, revoke | `specs/frontend/admin-dashboard.md` | RTL revoke confirm |
| Usuarios admin | `/admin/usuarios` | `GET /api/users/`, `PATCH /api/users/{user_id}/status` | `specs/frontend/admin-dashboard.md` | RTL permission guard |
| Configuracion | `/admin/configuracion` | `GET/PATCH /api/admin/config` | `specs/frontend/admin-dashboard.md` | RTL warning copy |

