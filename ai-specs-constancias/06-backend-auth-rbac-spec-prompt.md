# Prompt 06: Backend Auth, Usuarios, Roles y Permisos

Usa este prompt para crear `specs/backend/auth-rbac.md`.

```text
Actua como backend security engineer. Crea la spec SDD/TDD para autenticacion, usuarios, roles dinamicos y permisos.

Genera `specs/backend/auth-rbac.md` con:

1. Spec
2. Owns
3. Can modify
4. Can read
5. Purpose
6. Functional requirements EARS
7. Security requirements
8. Data model dependencies
9. API dependencies
10. Permission matrix
11. Test-first plan
12. Implementation tasks
13. Done when

Reglas:
- Incluye registro, login, logout, refresh si aplica, recuperacion de contrasena y perfil.
- Soporta roles dinamicos configurables sin redeploy.
- Define permisos granulares para admin, staff, expositor, oyente, participante e invitado.
- Las contrasenas deben almacenarse con hash seguro; nunca texto plano.
- Las respuestas de auth no deben filtrar si un email existe en flujos sensibles.
- Toda accion administrativa debe emitir AuditLog.
- Incluye pruebas unitarias de servicios, pruebas de API y pruebas de permisos.
- Escribe tareas en formato checkbox con IDs: `[T001]`.
- Marca tareas paralelizables con `[P]` cuando no dependan de otra.

Devuelve solo el Markdown final.
```

