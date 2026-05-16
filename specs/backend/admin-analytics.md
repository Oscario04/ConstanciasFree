# Admin, Reportes Y Metricas

## Spec

Metricas administrativas, exportaciones CSV y configuracion operacional minima.

## Owns

- `app/routers/stats.py`
- `app/routers/admin.py`

## Metrics Catalog

Dashboard:
- total de eventos.
- total de usuarios.
- total de documentos.
- total de solicitudes.
- solicitudes pendientes.
- solicitudes aprobadas.
- documentos por tipo.
- eventos por estado.

Evento:
- solicitudes totales.
- aprobadas, rechazadas y pendientes.
- asistencia total.
- documentos totales.
- aprobados por rol.

Exports:
- CSV de asistencia por evento.
- CSV de documentos por evento.

## API References

- `GET /api/stats/dashboard`
- `GET /api/stats/event/{event_id}`
- `GET /api/stats/event/{event_id}/export/attendance`
- `GET /api/stats/event/{event_id}/export/documents`
- `GET /api/admin/config`
- `PATCH /api/admin/config`

## Functional Requirements EARS

- WHEN admin/organizer consulta dashboard THE SYSTEM SHALL devolver agregados reproducibles desde MongoDB.
- WHEN admin/organizer consulta evento THE SYSTEM SHALL devolver conteos por estado y rol.
- WHEN admin/organizer exporta asistencia THE SYSTEM SHALL devolver CSV con nombre, email, rol, check-in, check-out, metodo y duracion.
- WHEN admin/organizer exporta documentos THE SYSTEM SHALL devolver CSV con nombre, tipo, rol, emision, expiracion, status y URL.
- WHEN rol no autorizado consulta stats THE SYSTEM SHALL responder 403.

## Brechas Pendientes

- `admin/config` no persiste cambios.
- No hay AuditLog para consultas sensibles.
- No hay filtros por rango de fecha/rol en stats.
- No hay XLSX.
- No hay metricas de fallos de notificacion.

## Test-First Plan

- Permisos admin/organizer permitidos.
- Attendee prohibido.
- Conteos consistentes con fixtures semilla.
- CSV contiene headers esperados.
- Config PATCH documenta o implementa persistencia.
