# Eventos, Sesiones Y Cupos

## Spec

Gestion de eventos con sesiones embebidas, capacidad global y estados operativos.

## Owns

- `app/routers/events.py`
- `app/models/event.py`
- `app/database.py`

## Domain Rules

- Un evento tiene `event_type`, fechas, capacidad, sesiones opcionales y `retention_years`.
- `capacity = 0` significa sin limite operativo.
- `registered` incrementa al aprobar solicitudes.
- Las solicitudes solo se permiten en eventos `published` u `ongoing`.
- Archivar un evento se implementa como soft delete con `status = archived`.

## State Model

Estados declarados:
- `draft`
- `published`
- `ongoing`
- `finished`
- `archived`

El backend actual permite cambiar `status` por PATCH sin validar transiciones.

## API References

- `GET /api/events/`
- `GET /api/events/{event_id}`
- `POST /api/events/`
- `PATCH /api/events/{event_id}`
- `DELETE /api/events/{event_id}`

## Functional Requirements EARS

- WHEN cualquier cliente consulta eventos THE SYSTEM SHALL devolver lista paginada con `events` y `total`.
- WHEN se crea un evento THE SYSTEM SHALL asignar `organizer_id`, `draft`, `registered = 0` y timestamps.
- WHEN admin archiva evento THE SYSTEM SHALL conservarlo y marcar `archived`.
- WHEN se filtra por status THE SYSTEM SHALL devolver solo eventos con ese estado.

## Brechas Pendientes

- `test_api.py` envia `location`, pero el modelo espera `venue` y tambien requiere `event_type`; el test debe actualizarse o el API aceptar alias.
- No hay validacion explicita de `start_date < end_date`.
- No hay endpoint dedicado para publicar/cerrar.
- No hay cupo por rol ni reglas de aprobacion automatica.

## Test-First Plan

- Crear evento con payload valido real.
- Rechazar payload sin `event_type`.
- Listar con `status`.
- Archivar como admin y negar archivar con usuario no admin.
- Probar que solicitudes a eventos no publicados fallan.
