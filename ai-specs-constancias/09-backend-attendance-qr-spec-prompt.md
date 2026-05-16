# Prompt 09: Backend Asistencia Manual y QR

Usa este prompt para crear `specs/backend/attendance-qr.md`.

```text
Actua como backend engineer especializado en trazabilidad. Crea la spec SDD/TDD de asistencia por QR y manual.

Genera `specs/backend/attendance-qr.md` con:

1. Spec
2. Owns
3. Can modify
4. Can read
5. Purpose
6. QR model
7. Functional requirements EARS
8. Anti-fraud rules
9. API references
10. Data validations
11. Reporting implications
12. Test-first plan
13. Implementation tasks
14. Done when

Reglas:
- Permitir check-in por evento y por sesion.
- Permitir check-out si el evento lo requiere.
- Registrar metodo: qr, manual, import.
- Registrar actor que valido la asistencia.
- QR debe expirar o ser scoped al evento/sesion.
- Evitar doble check-in no intencional; si ocurre, responder idempotentemente.
- Permitir correccion manual solo a roles autorizados y auditando motivo.
- La asistencia debe alimentar elegibilidad de certificado.
- Incluye pruebas de QR valido, QR expirado, QR de otra sesion, duplicado, permiso insuficiente y correccion manual.

Devuelve solo el Markdown final.
```

