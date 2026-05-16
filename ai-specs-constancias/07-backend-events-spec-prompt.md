# Prompt 07: Backend Eventos, Sedes y Sesiones

Usa este prompt para crear `specs/backend/events.md`.

```text
Actua como backend feature lead. Crea la spec SDD/TDD para eventos, sedes, fechas, horarios, cupos, sesiones y reglas de aprobacion.

Genera `specs/backend/events.md` con:

1. Spec
2. Owns
3. Can modify
4. Can read
5. Purpose
6. Domain rules
7. Functional requirements EARS
8. State model
9. API contract references
10. Validation rules
11. Test-first plan
12. Implementation tasks
13. Done when

Reglas:
- Un evento puede tener una o muchas sesiones.
- Un evento puede tener cupo global y cupo por rol.
- Una sesion debe tener fecha/hora inicio y fin validas.
- No permitir publicar eventos incompletos.
- No permitir solicitudes para eventos cerrados, archivados o sin cupo.
- Soportar reglas de aprobacion manual o automatica.
- Registrar auditoria en creacion, publicacion, cierre, edicion critica y archivado.
- Incluye pruebas para cupos, fechas, estados, filtros y permisos.

Devuelve solo el Markdown final.
```

