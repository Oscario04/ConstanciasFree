# Frontend API Client Contract

## Spec

Contrato del cliente TypeScript que consume el backend FastAPI real.

## Base Configuration

- Env var: `VITE_API_BASE_URL`.
- Desarrollo: `http://127.0.0.1:8000`.
- Produccion Hostinger: dominio o subdominio donde viva el backend, por ejemplo `https://api.midominio.com`.
- Todas las rutas API usan `/api`, no `/api/v1`.

## Auth

Login:
- Endpoint: `POST /api/auth/login`.
- Content-Type: `application/x-www-form-urlencoded`.
- Body: `username`, `password`.
- Response: `access_token`, `token_type`, `user`.

Registro:
- Endpoint: `POST /api/auth/register`.
- JSON: `name`, `email`, `password`, `role`.

Headers autenticados:
- `Authorization: Bearer ${access_token}`.

## Shared Types

Roles:
- `admin | organizer | speaker | attendee | staff`.

User status:
- `active | inactive | suspended`.

Event status:
- `draft | published | ongoing | finished | archived`.

Event type:
- `conference | workshop | course | seminar | webinar`.

Request status:
- `pending | approved | rejected | cancelled`.

Document type:
- `diploma | constancia | reconocimiento`.

Document status:
- `active | revoked | archived`.

Attendance method:
- `qr | manual | session`.

## Payload Notes

- `PATCH /api/users/{user_id}/status` usa query param `status`.
- `POST /api/documents/issue` usa query params `event_id`, `user_id`, `doc_type`.
- `PATCH /api/documents/{doc_id}/revoke` usa query param `reason`.
- `POST /api/events/` requiere `event_type`; el campo de sede real es `venue`, no `location`.
- `PATCH /api/requests/{request_id}/review` espera `admin_message`, no `notes`.

## Error Handling

- Si response status es 401: limpiar sesion y redirigir a `/login`.
- Si status es 403: mostrar estado sin permiso.
- Si body incluye `detail`, mostrarlo como mensaje principal.
- Si FastAPI devuelve array de validacion, mapear errores por campo cuando sea posible.

## API Modules

- `authApi`: register, login.
- `usersApi`: me, updateMe, list, updateStatus.
- `eventsApi`: list, get, create, update, archive.
- `requestsApi`: create, mine, byEvent, get, review, cancel.
- `attendanceApi`: checkIn, checkOut, byEvent, createQr, scanQr.
- `documentsApi`: issue, verify, downloadUrl, mine, byEvent, issueBatch, revoke.
- `statsApi`: dashboard, eventStats, attendanceCsvUrl, documentsCsvUrl.
- `adminApi`: getConfig, updateConfig.

## Done When

- Todo endpoint usado por UI vive en un modulo tipado.
- No hay llamadas `fetch` sueltas fuera del cliente API.
- Los payloads coinciden con el contrato backend actual.
