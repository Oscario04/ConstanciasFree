# Flujo De Solicitudes

## Spec

Solicitudes de participacion de usuarios para eventos publicados u ongoing.

## Owns

- `app/routers/requests.py`
- `app/models/document.py` para modelos `Request*`
- `app/services/email_service.py`

## Actors

- Usuario autenticado: crea, lista y cancela sus solicitudes pendientes.
- Admin/organizer: lista por evento, obtiene y revisa solicitudes.

## State Transitions

- `pending -> approved`
- `pending -> rejected`
- `pending -> cancelled`

No se permiten revisiones sobre solicitudes ya procesadas.

## Functional Requirements EARS

- WHEN un usuario solicita evento inexistente THE SYSTEM SHALL responder 404.
- WHEN un evento no esta `published` u `ongoing` THE SYSTEM SHALL responder 400.
- WHEN el cupo global esta lleno THE SYSTEM SHALL responder 400.
- WHEN existe solicitud activa del usuario para el evento THE SYSTEM SHALL responder 400.
- WHEN admin aprueba solicitud pendiente THE SYSTEM SHALL marcar approved, registrar reviewer, incrementar `events.registered` y enviar correo.
- WHEN admin rechaza solicitud pendiente THE SYSTEM SHALL marcar rejected y enviar correo.
- WHEN usuario cancela solicitud pendiente propia THE SYSTEM SHALL marcar cancelled.

## API References

- `POST /api/requests/`
- `GET /api/requests/me`
- `GET /api/requests/event/{event_id}`
- `GET /api/requests/{request_id}`
- `PATCH /api/requests/{request_id}/review`
- `DELETE /api/requests/{request_id}`

## Brechas Pendientes

- `RequestStatus` enum no incluye `cancelled`.
- `test_api.py` usa `notes`, pero el modelo espera `admin_message`.
- Duplicados se bloquean por usuario/evento, no por usuario/evento/rol.
- No hay transaccion Mongo para aprobar e incrementar contador de forma atomica.
- No hay auditoria persistente.

## Test-First Plan

- Solicitud exitosa contra evento publicado.
- Duplicado activo falla.
- Evento draft falla.
- Aprobacion incrementa contador.
- Rechazo conserva mensaje administrativo.
- Cancelacion despues de aprobacion falla.
