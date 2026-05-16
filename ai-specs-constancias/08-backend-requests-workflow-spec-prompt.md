# Prompt 08: Backend Flujo de Solicitudes

Usa este prompt para crear `specs/backend/requests-workflow.md`.

```text
Actua como workflow engineer. Crea la spec SDD/TDD del flujo de solicitudes de participacion.

Genera `specs/backend/requests-workflow.md` con:

1. Spec
2. Owns
3. Can modify
4. Can read
5. Purpose
6. Actors
7. Workflow diagram Mermaid
8. Functional requirements EARS
9. State transitions
10. Notification triggers
11. Failure modes
12. Test-first plan
13. Implementation tasks
14. Done when

Reglas:
- Estados: pending, approved, rejected, cancelled.
- Una solicitud debe pertenecer a un usuario, evento y rol solicitado.
- Evitar duplicados activos del mismo usuario para el mismo evento y rol.
- Rechazos deben permitir motivo visible al usuario y notas internas opcionales.
- Aprobaciones deben poder disparar correo automatico.
- Cambios de estado deben ser atomicos y auditados.
- Las reglas de aprobacion automatica deben ser configurables por evento.
- Incluye pruebas de transicion valida, transicion invalida, duplicados, permisos y notificaciones.

Devuelve solo el Markdown final.
```

