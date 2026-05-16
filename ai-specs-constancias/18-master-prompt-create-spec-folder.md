# Prompt Maestro: Crear Carpeta Completa de Specs

Usa este prompt cuando quieras que un agente cree directamente la estructura completa `specs/` en un repo nuevo o existente.

```text
Actua como staff engineer, product architect y QA lead. Vas a crear una carpeta completa de specs Markdown para agentes de IA siguiendo Spec Driven Development y Test Driven Development.

Producto:
Una plataforma web escalable para administrar eventos, registrar solicitudes, validar perfiles, controlar asistencia, emitir diplomas/constancias/reconocimientos/certificados y conservarlos durante anos con enlaces publicos verificables.

Stack:
- Frontend: React + TypeScript + Tailwind, build publicado en Hostinger.
- Backend: FastAPI en Vercel.
- Base de datos: MongoDB Atlas.
- Storage: Cloudinary o S3 para PDFs e imagenes.
- Correo: Hostinger Email.

Crea exactamente esta estructura:

specs/
  000-constitution.md
  001-product-brief.md
  002-architecture-plan.md
  003-domain-data-model.md
  004-api-contracts.md
  backend/
    auth-rbac.md
    events.md
    requests-workflow.md
    attendance-qr.md
    certificates-documents.md
    notifications-email.md
    admin-analytics.md
  frontend/
    app-shell-ux.md
    public-portal.md
    admin-dashboard.md
  quality/
    tdd-quality-gates.md
  workflow/
    mcp-suggestions.md

Reglas globales:
- Usa lenguaje profesional, especifico y accionable.
- Cada archivo debe incluir Purpose, Owns/Can modify/Can read cuando aplique, Must, Must not, requisitos EARS, plan TDD, tareas y Done when.
- Cada requisito debe ser trazable a tests.
- Cada tarea debe usar formato `[T001]`, `[T002]`; marca `[P]` si es paralelizable.
- No implementes codigo; solo specs.
- No inventes funcionalidades fuera de la propuesta: no pagos, no e-commerce, no facturacion.
- Declara que documentos se almacenan en Cloudinary/S3 y metadatos en MongoDB.
- Declara que no se deben guardar PDFs persistentes en filesystem local.
- Declara que Vercel no debe ejecutar generacion masiva ni colas largas; eso queda para worker futuro.
- Declara que vencimiento operativo no elimina documentos; se archivan o revocan.
- Usa Mermaid para diagramas de arquitectura, workflow de solicitud y ciclo de documento.
- Incluye matriz de permisos por rol.
- Incluye quality gates: pytest, tests de API, contract tests, React Testing Library, Playwright, accesibilidad y seguridad.
- Incluye seccion separada de MCPs en `workflow/mcp-suggestions.md`; no mezcles MCPs como requerimientos del producto.

Proceso:
1. Primero crea `000-constitution.md`.
2. Luego crea producto, arquitectura, modelo de datos y contratos API.
3. Luego crea specs backend.
4. Luego crea specs frontend.
5. Luego crea quality gates.
6. Finalmente crea sugerencias MCP.

Devuelve los archivos creados y un resumen corto de trazabilidad.
```

