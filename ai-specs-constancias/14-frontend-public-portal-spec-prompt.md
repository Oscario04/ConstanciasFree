# Prompt 14: Frontend Portal Publico y Verificador

Usa este prompt para crear `specs/frontend/public-portal.md`.

```text
Actua como frontend engineer orientado a usuarios finales. Crea la spec SDD/TDD para portal publico, registro, solicitudes, perfil publico y verificacion de documentos.

Genera `specs/frontend/public-portal.md` con:

1. Spec
2. Owns
3. Can modify
4. Can read
5. Purpose
6. Public routes
7. User flows
8. Functional requirements EARS
9. API dependencies
10. Privacy rules
11. UI states
12. Accessibility requirements
13. Test-first plan
14. Implementation tasks
15. Done when

Flujos minimos:
- Registro/login
- Ver eventos disponibles
- Solicitar participacion con rol
- Consultar estado de solicitud
- Ver perfil propio
- Consultar documento por URL publica o QR
- Descargar documento si esta permitido

Reglas:
- El verificador publico debe mostrar validez, tipo de documento, evento, nombre visible y estado sin exponer datos privados innecesarios.
- Documento revoked debe mostrarse como no valido.
- Documento archived debe respetar politica de visibilidad.
- Formularios deben validar cliente y mostrar errores de API.
- Incluir pruebas para registro, solicitud, estados de solicitud y verificacion publica.

Devuelve solo el Markdown final.
```

