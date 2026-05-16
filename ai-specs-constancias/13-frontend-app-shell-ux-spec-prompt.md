# Prompt 13: Frontend App Shell, UX y Sistema Visual

Usa este prompt para crear `specs/frontend/app-shell-ux.md`.

```text
Actua como frontend architect y product designer. Crea la spec SDD/TDD para la estructura React + TypeScript + Tailwind de la aplicacion.

Genera `specs/frontend/app-shell-ux.md` con:

1. Spec
2. Owns
3. Can modify
4. Can read
5. Purpose
6. Information architecture
7. Route map
8. Layout rules
9. Component system rules
10. State/data fetching rules
11. Accessibility requirements
12. Responsive requirements
13. Error/loading/empty states
14. Test-first plan
15. Implementation tasks
16. Done when

Reglas:
- UI profesional, operacional y escaneable; no landing page decorativa como pantalla inicial del sistema autenticado.
- Usar TypeScript estricto para contratos de API.
- Definir rutas publicas, autenticadas y administrativas.
- Definir guardas de rutas por rol/permisos.
- Componentes deben tener estados loading, error, empty y success.
- Accesibilidad minima: labels, foco visible, navegacion por teclado, contraste y ARIA cuando aplique.
- Incluir pruebas con React Testing Library para componentes criticos y Playwright para flujos principales.
- No hardcodear datos que deban venir de API salvo fixtures de test.

Devuelve solo el Markdown final.
```

