# Prompt 15: Frontend Panel Administrativo

Usa este prompt para crear `specs/frontend/admin-dashboard.md`.

```text
Actua como frontend lead para herramientas administrativas. Crea la spec SDD/TDD del panel administrativo.

Genera `specs/frontend/admin-dashboard.md` con:

1. Spec
2. Owns
3. Can modify
4. Can read
5. Purpose
6. Admin route map
7. Screens
8. Functional requirements EARS
9. Data table patterns
10. Form patterns
11. Permission-aware UI
12. Audit visibility
13. Test-first plan
14. Implementation tasks
15. Done when

Pantallas minimas:
- Dashboard general
- Usuarios y roles
- Eventos y sesiones
- Solicitudes
- Asistencia
- Plantillas de documentos
- Documentos emitidos
- Notificaciones
- Auditoria/reportes

Reglas:
- Tablas deben soportar busqueda, filtros, paginacion y estados vacios.
- Acciones destructivas o sensibles deben requerir confirmacion y motivo cuando aplique.
- La UI debe ocultar acciones sin permiso, pero la seguridad real depende del backend.
- Cada formulario debe mapear campos al contrato API.
- Incluye pruebas de permisos visuales, filtros, aprobacion/rechazo, check-in manual y revocacion de documento.

Devuelve solo el Markdown final.
```

