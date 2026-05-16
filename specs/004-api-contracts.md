# Contratos API Backend

## Spec

Contrato REST real para el backend FastAPI existente.

## Convenciones

- Base URL local: `http://127.0.0.1:8000`.
- Prefijo API: `/api`.
- Auth: `Authorization: Bearer <token>`.
- Login: `application/x-www-form-urlencoded` con `username` y `password`.
- JSON para el resto de cuerpos, salvo descargas CSV/PDF.
- Errores: `{"detail": "mensaje"}` o errores nativos de validacion FastAPI.

## Endpoints

### Health

- `GET /`: publico. Devuelve mensaje y version.
- `GET /health`: publico. Devuelve `{ "status": "ok" }`.

### Auth

- `POST /api/auth/register`: publico. Crea usuario.
- `POST /api/auth/login`: publico. Devuelve token Bearer y datos basicos del usuario.

### Users

- `GET /api/users/me`: autenticado. Devuelve perfil actual sin password.
- `PATCH /api/users/me`: autenticado. Actualiza `phone`, `institution`, `bio`, `name`.
- `GET /api/users/`: admin. Lista usuarios.
- `PATCH /api/users/{user_id}/status?status=active`: admin. Actualiza estado.

### Events

- `GET /api/events/?status=&skip=0&limit=20`: publico. Lista eventos.
- `GET /api/events/{event_id}`: publico. Obtiene evento.
- `POST /api/events/`: admin, organizer. Crea evento.
- `PATCH /api/events/{event_id}`: admin, organizer. Actualiza evento.
- `DELETE /api/events/{event_id}`: admin. Archiva evento.

### Requests

- `POST /api/requests/`: autenticado. Crea solicitud.
- `GET /api/requests/me`: autenticado. Lista solicitudes propias.
- `GET /api/requests/event/{event_id}?status=`: admin, organizer. Lista solicitudes de evento.
- `GET /api/requests/{request_id}`: admin, organizer. Obtiene solicitud.
- `PATCH /api/requests/{request_id}/review`: admin, organizer. Aprueba o rechaza.
- `DELETE /api/requests/{request_id}`: autenticado. Cancela solicitud propia pendiente.

### Attendance

- `POST /api/attendance/check-in`: admin, staff, organizer. Registra check-in manual/sesion.
- `POST /api/attendance/check-out/{attendance_id}`: admin, staff, organizer. Registra salida.
- `GET /api/attendance/event/{event_id}`: admin, organizer. Lista asistencia.
- `GET /api/attendance/qr/{event_id}/{user_id}`: autenticado. Genera token QR temporal.
- `POST /api/attendance/qr-scan/{token}`: publico. Escanea QR y registra asistencia.

### Documents

- `POST /api/documents/issue?event_id=&user_id=&doc_type=constancia`: admin, organizer. Emite documento.
- `GET /api/documents/pdf/{code}`: publico. Descarga PDF si documento activo.
- `GET /api/documents/verify/{code}`: publico. Verifica documento.
- `GET /api/documents/me`: autenticado. Lista documentos propios.
- `GET /api/documents/event/{event_id}`: admin, organizer. Lista documentos de evento.
- `POST /api/documents/issue-batch/{event_id}?doc_type=constancia`: admin, organizer. Emision masiva sincronica.
- `PATCH /api/documents/{doc_id}/revoke?reason=`: admin. Revoca documento.

### Stats

- `GET /api/stats/dashboard`: admin, organizer. Totales y agregados.
- `GET /api/stats/event/{event_id}`: admin, organizer. Metricas por evento.
- `GET /api/stats/event/{event_id}/export/attendance`: admin, organizer. CSV.
- `GET /api/stats/event/{event_id}/export/documents`: admin, organizer. CSV.

### Admin

- `GET /api/admin/config`: admin. Devuelve configuracion publica operacional.
- `PATCH /api/admin/config`: admin. Recibe configuracion, actualmente responde mensaje sin persistencia.

## Matriz De Permisos

- Publico: health, listar/obtener eventos, verificar/descargar documento, escanear QR.
- Usuario autenticado: perfil, solicitudes propias, documentos propios, generar token QR.
- Staff: check-in y check-out.
- Organizer: crear/editar eventos, revisar solicitudes, asistencia, documentos, stats.
- Admin: todo lo anterior mas usuarios, archivar eventos, revocar documentos y admin config.

## Contract Tests

- `test_api.py` cubre flujo end-to-end con servidor real.
- Pendiente recomendado: migrar a pytest + TestClient con base de datos de prueba o fixtures Mongo aisladas.
