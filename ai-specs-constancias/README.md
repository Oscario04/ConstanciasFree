# AI Specs para Plataforma de Constancias

Esta carpeta contiene prompts profesionales para que agentes de IA generen especificaciones siguiendo Spec Driven Development (SDD) y Test Driven Development (TDD) para la plataforma de gestion de eventos, asistencia y documentos verificables.

## Adaptacion para este backend

En este repo los prompts de esta carpeta ya fueron aterrizados al backend FastAPI existente en la carpeta `specs/`.

Usa `specs/000-backend-existing-api-adaptation.md` como punto de entrada. Esa version documenta la API real bajo `/api`, las colecciones MongoDB existentes y las brechas frente a los prompts originales. Los archivos de `ai-specs-constancias/` quedan como material fuente para futuras fases, no como contrato actual de implementacion.

## Como usar esta carpeta

1. Entrega primero `01-agent-constitution-prompt.md` al agente.
2. Genera la base de producto con `02-product-brief-spec-prompt.md`.
3. Genera arquitectura y contratos con los prompts `03` a `05`.
4. Genera specs backend y frontend por modulo, manteniendo cada spec como fuente de verdad local.
5. Antes de implementar, usa `16-testing-tdd-quality-gates-spec-prompt.md` para exigir pruebas rojas, verdes y refactor.
6. Usa `17-mcp-workflow-suggestions.md` como guia separada para conectar herramientas externas sin mezclarla con los specs principales.

## Estructura sugerida para el repo destino

```text
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
```

## Principios usados

- SDD: primero se especifica que debe hacer el sistema, despues se planea como implementarlo y al final se parte en tareas ejecutables.
- TDD: cada requisito debe tener pruebas verificables antes de escribir la implementacion.
- EARS: los criterios se redactan como `WHEN <evento> THE SYSTEM SHALL <resultado>` para que sean comprobables.
- Trazabilidad: cada endpoint, pantalla, entidad y test debe mapearse a un requisito.
- Context grounding: el agente debe leer archivos existentes, contratos y pruebas antes de modificar codigo.
