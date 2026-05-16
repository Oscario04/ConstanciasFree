# Prompt 12: Backend Admin, Reportes, Auditoria y Metricas

Usa este prompt para crear `specs/backend/admin-analytics.md`.

```text
Actua como backend/reporting engineer. Crea la spec SDD/TDD para panel administrativo, reportes, metricas y auditoria.

Genera `specs/backend/admin-analytics.md` con:

1. Spec
2. Owns
3. Can modify
4. Can read
5. Purpose
6. Metrics catalog
7. Report catalog
8. Audit events catalog
9. Functional requirements EARS
10. Query and aggregation rules
11. Export rules
12. Permissions
13. Test-first plan
14. Implementation tasks
15. Done when

Metricas minimas:
- Inscritos por evento
- Solicitudes por estado
- Aprobados por rol
- Asistencia por sesion
- Elegibles para documento
- Documentos emitidos, archivados y revocados
- Fallos de notificacion

Reglas:
- Los endpoints administrativos requieren permisos explicitos.
- Las metricas deben ser agregaciones reproducibles desde MongoDB.
- Exportaciones CSV/XLSX son fase 2 si no existen aun.
- Toda consulta sensible debe registrar AuditLog cuando acceda a datos personales o documentos.
- Incluye pruebas de permisos, agregaciones, filtros por fecha/evento/rol y consistencia con datos semilla.

Devuelve solo el Markdown final.
```

