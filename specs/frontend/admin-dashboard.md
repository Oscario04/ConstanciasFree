# Frontend Panel Administrativo

## Spec

Panel administrativo para roles `admin`, `organizer` y `staff`, alineado con endpoints reales.

## Owns

- Rutas `/admin/*` y `/staff/*`.
- Tablas operativas.
- Formularios de eventos, solicitudes, asistencia, documentos, usuarios y configuracion.

## Admin Route Map

- `/admin`: dashboard general.
- `/admin/eventos`: tabla de eventos.
- `/admin/eventos/nuevo`: formulario de evento.
- `/admin/eventos/:eventId`: detalle editable.
- `/admin/eventos/:eventId/solicitudes`: solicitudes del evento.
- `/admin/eventos/:eventId/asistencia`: asistencia y export.
- `/admin/eventos/:eventId/documentos`: documentos y emision.
- `/admin/usuarios`: usuarios y estado.
- `/admin/configuracion`: configuracion.
- `/staff/asistencia`: acceso rapido a check-in/check-out.

Rutas fase futura:
- `/admin/plantillas`: bloqueada hasta tener backend.
- `/admin/notificaciones`: bloqueada hasta tener backend.
- `/admin/auditoria`: bloqueada hasta tener backend.
- `/admin/roles`: bloqueada hasta roles dinamicos.

## Screens

Dashboard:
- Consume `GET /api/stats/dashboard`.
- Muestra totales, solicitudes pendientes, documentos por tipo y eventos por estado.

Eventos:
- Lista `GET /api/events/`.
- Crear `POST /api/events/`.
- Editar `PATCH /api/events/{event_id}`.
- Archivar `DELETE /api/events/{event_id}` solo admin.

Solicitudes:
- Lista `GET /api/requests/event/{event_id}`.
- Aprueba/rechaza `PATCH /api/requests/{request_id}/review`.
- Form usa `status` y `admin_message`.

Asistencia:
- Lista `GET /api/attendance/event/{event_id}`.
- Check-in `POST /api/attendance/check-in`.
- Check-out `POST /api/attendance/check-out/{attendance_id}`.
- Export CSV abre URL de stats.

Documentos:
- Lista `GET /api/documents/event/{event_id}`.
- Emite individual con query params.
- Emision masiva `POST /api/documents/issue-batch/{event_id}`.
- Revoca `PATCH /api/documents/{doc_id}/revoke?reason=`.

Usuarios:
- Lista `GET /api/users/`.
- Cambia estado con `PATCH /api/users/{user_id}/status?status=`.

Configuracion:
- `GET /api/admin/config`.
- `PATCH /api/admin/config`, actualmente sin persistencia garantizada.

## Functional Requirements EARS

- WHEN admin abre dashboard THE SYSTEM SHALL mostrar metricas desde `/api/stats/dashboard`.
- WHEN organizer abre dashboard THE SYSTEM SHALL permitir stats pero ocultar acciones admin-only.
- WHEN staff entra THE SYSTEM SHALL ver asistencia, no usuarios ni config.
- WHEN admin crea evento THE SYSTEM SHALL enviar `event_type`, `venue`, fechas, capacidad, sesiones y retencion.
- WHEN admin aprueba solicitud THE SYSTEM SHALL actualizar tabla y contador de pendientes.
- WHEN admin rechaza solicitud THE SYSTEM SHALL requerir mensaje visible si producto lo decide.
- WHEN staff registra check-in THE SYSTEM SHALL mostrar registro creado o error de duplicado.
- WHEN admin revoca documento THE SYSTEM SHALL pedir motivo antes de ejecutar.
- WHEN usuario sin permiso intenta ruta admin THE SYSTEM SHALL mostrar 403.

## Data Table Patterns

- Search cliente cuando dataset ya cargado.
- Filtros por status/rol/tipo cuando backend lo soporte; si no, filtrar cliente y marcar limite.
- Paginacion en eventos usa `skip` y `limit`.
- Filas con menu de acciones.
- Empty states con accion primaria cuando rol tenga permiso.
- Exportaciones CSV como links autenticados o descarga via fetch blob con Bearer cuando aplique.

## Form Patterns

- Zod schema por payload.
- Fechas en datetime local convertidas a ISO antes de enviar.
- Confirmaciones para archivar evento, cancelar solicitud, revocar documento y emision masiva.
- Boton submit con loading y bloqueo anti doble envio.
- Errores de FastAPI mapeados a campos.

## Permission-Aware UI

- `admin`: acceso completo.
- `organizer`: eventos, solicitudes, asistencia, documentos, stats.
- `staff`: asistencia.
- `attendee` y `speaker`: sin acceso admin.

## Audit Visibility

- Backend no tiene AuditLog; no construir pantalla real de auditoria.
- Mostrar placeholder de fase futura solo si el producto lo necesita, sin acciones falsas.

## Test-First Plan

- Guards ocultan `/admin/usuarios` para organizer.
- Dashboard renderiza metricas mock.
- Crear evento envia payload real.
- Aprobar/rechazar solicitud invalida queries.
- Check-in manual maneja duplicado.
- Revocar documento requiere confirmacion y motivo.
- CSV export genera request correcta.

## Implementation Tasks

- [T001] Crear layout admin/staff.
- [T002] Crear dashboard con stats.
- [T003] Crear CRUD operativo de eventos.
- [T004] Crear vista de solicitudes por evento.
- [T005] Crear vista de asistencia y exports.
- [T006] Crear vista de documentos y revocacion.
- [T007] Crear vista de usuarios admin.
- [T008] Crear configuracion con advertencia de persistencia actual.
- [T009] Agregar pruebas de permisos y flujos principales.

## Done When

- Admin/organizer/staff tienen pantallas acordes a permisos reales.
- Las pantallas fase futura no prometen acciones sin backend.
- Cada mutacion invalida y refresca datos relacionados.
