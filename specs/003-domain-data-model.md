# Modelo De Dominio Y Datos

## Spec

Modelo de dominio real para la plataforma de constancias, solicitudes, asistencia y documentos verificables.

## Colecciones MongoDB

### users

Campos:
- `_id`: ObjectId.
- `name`: string.
- `email`: email unico.
- `password`: hash bcrypt.
- `role`: `admin | organizer | speaker | attendee | staff`.
- `status`: `active | inactive | suspended`.
- `phone`, `institution`, `bio`: string opcional.
- `created_at`, `updated_at`: datetime UTC.

Indices:
- `email` unico.
- `role`.
- `status`.

### events

Campos:
- `_id`: ObjectId.
- `title`, `description`: string.
- `event_type`: `conference | workshop | course | seminar | webinar`.
- `start_date`, `end_date`: datetime UTC.
- `venue`: string opcional.
- `capacity`: integer, `0` significa sin limite operativo.
- `registered`: integer.
- `sessions`: arreglo embebido con `title`, `start_time`, `end_time`, `location`, `speaker_ids`.
- `organizer_id`: string con ObjectId del usuario.
- `status`: `draft | published | ongoing | finished | archived`.
- `retention_years`: integer.
- `created_at`, `updated_at`: datetime UTC.

Indices:
- `status`.
- `organizer_id`.
- `start_date`.

### requests

Campos:
- `_id`: ObjectId.
- `user_id`: string.
- `event_id`: string.
- `requested_role`: `speaker | attendee | staff | organizer`.
- `status`: `pending | approved | rejected | cancelled`.
- `message`: string opcional.
- `admin_message`: string opcional.
- `reviewed_by`, `reviewed_at`: opcionales al revisar.
- `created_at`, `updated_at`: datetime UTC.

Indices:
- compuesto `user_id + event_id`.
- `status`.
- `event_id`.

Nota: el enum en `app/models/document.py` no incluye `cancelled`, pero el router si persiste ese estado al cancelar.

### attendance

Campos:
- `_id`: ObjectId.
- `user_id`: string.
- `event_id`: string.
- `session_id`: string opcional.
- `check_in`: datetime UTC.
- `check_out`: datetime UTC opcional.
- `method`: `qr | manual | session`.
- `registered_by`: string opcional con usuario que registro.
- `created_at`: datetime UTC.

Indices:
- compuesto `user_id + event_id`.
- `event_id`.

### documents

Campos:
- `_id`: ObjectId.
- `user_id`: string.
- `event_id`: string.
- `document_type`: `diploma | constancia | reconocimiento`.
- `status`: `active | revoked | archived`.
- `verification_code`: string unico.
- `public_url`: URL frontend `/verify/{code}`.
- `pdf_url`: URL Cloudinary o fallback local.
- `qr_url`: URL de verificacion.
- `issued_at`: datetime UTC.
- `expires_at`: datetime UTC opcional.
- `metadata`: objeto con `user_name`, `event_title`, `role`.
- `revoke_reason`, `revoked_at`: opcionales.

Indices:
- `verification_code` unico.
- compuesto `user_id + event_id`.
- `status`.
- `expires_at`.

### qr_tokens

Campos:
- `_id`: ObjectId.
- `token`: string unico.
- `event_id`: string.
- `user_id`: string.
- `created_at`: datetime UTC.
- `used`: boolean.

Indices:
- `token` unico.
- TTL sobre `created_at` con 600 segundos.

## Estados

- Solicitud: `pending -> approved | rejected | cancelled`.
- Evento: `draft -> published -> ongoing -> finished -> archived`, aunque el backend permite actualizar `status` directamente.
- Documento: `active -> revoked | archived`.
- Usuario: `active | inactive | suspended`.

## Reglas Actuales

- El email de usuario debe ser unico.
- No se aceptan solicitudes para eventos inexistentes o no disponibles (`published`, `ongoing`).
- No se aceptan solicitudes activas duplicadas para el mismo usuario/evento.
- Un documento requiere usuario, evento y solicitud aprobada.
- No se emite un documento activo duplicado para el mismo usuario/evento.
- El QR de asistencia expira por TTL de MongoDB y se marca como usado al escanear.

## Brechas Pendientes

- Validar ObjectId antes de construirlo para evitar errores 500 en IDs invalidos.
- Alinear enum `RequestStatus` con `cancelled`.
- Agregar auditoria persistente si se requiere trazabilidad formal.
- Agregar colecciones `notifications` y `templates` si se quiere cola/versionado de emails.
