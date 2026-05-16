# Quality Gates Y TDD

## Spec

Puertas de calidad adaptadas al backend existente.

## Estado Actual

- Existe `test_api.py` como prueba manual end-to-end contra servidor real.
- No hay suite pytest automatizada en el repo.
- El script actual tiene payloads que no coinciden completamente con los modelos reales.

## Quality Gates

- Gate 1: `python -m compileall app` debe pasar.
- Gate 2: los contratos de `specs/004-api-contracts.md` deben tener prueba de exito y prueba de permiso/error.
- Gate 3: todo router nuevo debe tener tests de auth/roles.
- Gate 4: cambios en modelos deben actualizar `specs/003-domain-data-model.md`.
- Gate 5: cambios en rutas deben actualizar `specs/004-api-contracts.md` y `test_api.py`.

## Correcciones Prioritarias De Tests

- `POST /api/events/` debe enviar `event_type` y `venue`, no `location`.
- `PATCH /api/requests/{id}/review` debe enviar `admin_message`, no `notes`.
- `POST /api/documents/issue` debe enviar `event_id`, `user_id` y `doc_type` como query params o el endpoint debe cambiar a JSON.
- `POST /api/attendance/check-in` requiere rol `admin`, `staff` u `organizer`; no debe usarse token de attendee.
- `PATCH /api/users/{id}/status` espera query param `status`.

## Done When

- El script end-to-end refleja el contrato real.
- Existe una suite pytest minima para auth, eventos, solicitudes, asistencia y documentos.
- Las specs se tratan como fuente de verdad antes de modificar endpoints.
