# Prompt 04: Modelo de Dominio y Datos

Usa este prompt para crear `specs/003-domain-data-model.md`.

```text
Actua como domain modeler y backend lead. Crea una especificacion de dominio para MongoDB Atlas.

Entidades base:
- User
- Role
- Event
- Venue
- Session
- Request
- Attendance
- Certificate
- Template
- Notification
- AuditLog
- PublicVerification

Genera `specs/003-domain-data-model.md` con:

1. Spec
2. Purpose
3. Ubiquitous language
4. Entity ownership
5. Collections MongoDB
6. Campos por entidad
7. Indices requeridos
8. Relaciones y referencias
9. Estados y maquinas de estado
10. Reglas de validacion
11. Politicas de retencion
12. Ejemplos JSON validos
13. Casos borde
14. Tests de contrato de datos
15. Done when

Reglas:
- Usa tipos concretos: ObjectId/string UUID, email, enum, datetime ISO 8601, boolean, array, embedded object.
- Cada entidad debe tener created_at, updated_at y campos de auditoria cuando aplique.
- Certificate debe incluir type, hash, public_url, storage_provider, storage_key, verification_code, expires_at, status y retention_policy.
- Request debe soportar estados: pending, approved, rejected, cancelled.
- Certificate debe soportar estados: active, archived, revoked.
- Attendance debe soportar check-in manual y QR, por session_id y event_id.
- Incluye indices unicos para email y verification_code.
- Incluye pruebas esperadas para validacion, unicidad, transiciones y borrado logico.

Devuelve solo el Markdown final.
```

