# Prompt 05: Contratos API Backend

Usa este prompt para crear `specs/004-api-contracts.md`.

```text
Actua como API architect. Crea una especificacion de contratos REST para FastAPI.

Genera `specs/004-api-contracts.md` con:

1. Spec
2. Platform
3. Purpose
4. API conventions
5. Authentication model
6. Error model
7. Pagination/filter/sort conventions
8. OpenAPI requirements
9. Endpoints por modulo
10. Request/response schemas
11. Permission matrix
12. Idempotency rules
13. Rate limit rules
14. Contract tests
15. Done when

Modulos obligatorios:
- Auth and profile
- Roles and permissions
- Events and sessions
- Requests
- Attendance
- Certificates and public verification
- Templates
- Notifications
- Admin analytics
- Audit logs

Reglas:
- Usa rutas versionadas bajo `/api/v1`.
- Cada endpoint debe declarar method, path, auth, roles permitidos, request body, response body, errores y pruebas.
- Incluye errores normalizados: VALIDATION_ERROR, UNAUTHORIZED, FORBIDDEN, NOT_FOUND, CONFLICT, RATE_LIMITED, INTERNAL_ERROR.
- El verificador publico de documentos debe permitir consulta sin login, pero nunca exponer datos privados innecesarios.
- Ningun endpoint debe devolver secretos, storage_key privado ni hashes internos no necesarios.
- Incluye pruebas con pytest + httpx/TestClient antes de implementacion.
- Incluye criterios EARS por endpoint critico.

Devuelve solo el Markdown final.
```

