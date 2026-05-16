# Asistencia Manual Y QR

## Spec

Registro de asistencia manual, por sesion y por token QR temporal.

## Owns

- `app/routers/attendance.py`
- `app/models/document.py` para modelos `Attendance*`
- `app/database.py` indices de `attendance` y `qr_tokens`

## QR Model

- Token aleatorio con `secrets.token_urlsafe(16)`.
- Se persiste en `qr_tokens` con `event_id`, `user_id`, `created_at`, `used`.
- TTL MongoDB: 600 segundos.
- El escaneo marca `used = True` y crea asistencia con `method = qr`.

## Functional Requirements EARS

- WHEN staff/admin/organizer registra check-in THE SYSTEM SHALL crear asistencia con `registered_by`.
- WHEN existe check-in activo para usuario/evento THE SYSTEM SHALL responder 400.
- WHEN se registra check-out THE SYSTEM SHALL establecer `check_out`.
- WHEN se genera QR THE SYSTEM SHALL crear token temporal scoped a evento y usuario.
- WHEN se escanea QR valido no usado THE SYSTEM SHALL registrar asistencia y marcar token usado.
- WHEN se escanea QR usado o inexistente THE SYSTEM SHALL responder 400.

## API References

- `POST /api/attendance/check-in`
- `POST /api/attendance/check-out/{attendance_id}`
- `GET /api/attendance/event/{event_id}`
- `GET /api/attendance/qr/{event_id}/{user_id}`
- `POST /api/attendance/qr-scan/{token}`

## Brechas Pendientes

- `GET /api/attendance/qr/{event_id}/{user_id}` no valida que el usuario autenticado pueda generar QR para ese `user_id`.
- `POST /api/attendance/qr-scan/{token}` es publico y no valida doble check-in activo.
- No se valida existencia de evento/usuario antes de check-in manual.
- No hay correccion manual ni motivo auditado.
- El metodo `import` del prompt original no existe; el backend usa `session`.

## Test-First Plan

- Check-in manual con staff permitido.
- Check-in con attendee prohibido.
- Check-in duplicado falla.
- QR valido registra asistencia.
- QR reusado falla.
- Token expirado no registra asistencia.
