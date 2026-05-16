# Prompt 16: TDD, Quality Gates y Definicion de Terminado

Usa este prompt para crear `specs/quality/tdd-quality-gates.md`.

```text
Actua como QA automation lead y test architect. Crea la spec transversal de TDD y quality gates para backend FastAPI y frontend React.

Genera `specs/quality/tdd-quality-gates.md` con:

1. Spec
2. Purpose
3. Test pyramid
4. Backend TDD workflow
5. Frontend TDD workflow
6. Contract testing
7. E2E testing
8. Security testing
9. Accessibility testing
10. Performance smoke testing
11. CI quality gates
12. Traceability matrix
13. Bug workflow
14. Done when

Reglas:
- Todo requisito EARS debe tener al menos una prueba o verificacion explicita.
- Backend: pytest, FastAPI TestClient/httpx, pruebas de servicios, repositorios y endpoints.
- Frontend: Vitest/Jest si aplica, React Testing Library y Playwright para flujos principales.
- Los contratos API deben probarse contra esquemas y errores normalizados.
- E2E minimos: solicitud aprobada, asistencia registrada, documento emitido, verificacion publica.
- Security checks minimos: auth requerida, permisos por rol, no exposicion de datos privados, rate limit en verificacion si aplica.
- Accessibility checks minimos: labels, foco, teclado y contraste en flujos principales.
- Ninguna tarea se considera completa sin evidencia de pruebas ejecutadas o justificacion documentada.
- Cuando falle una prueba, el agente debe decidir si corregir implementacion o actualizar spec si el comportamiento esperado estaba mal definido.

Devuelve solo el Markdown final.
```

