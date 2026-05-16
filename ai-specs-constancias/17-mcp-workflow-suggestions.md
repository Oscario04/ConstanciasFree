# Sugerencias de MCPs y Flujo Agil

Este documento es deliberadamente separado de los specs principales. Los MCPs ayudan al flujo, pero no deben convertirse en requisitos funcionales del producto.

## MCPs recomendados

- GitHub MCP: leer issues, crear ramas, abrir PRs, comentar evidencia de pruebas y revisar diffs.
- Filesystem MCP: navegar specs, contratos, pruebas y codigo local con menos perdida de contexto.
- MongoDB MCP: inspeccionar esquemas, indices y datos semilla en ambientes de desarrollo.
- Browser/Playwright MCP: validar flujos frontend, capturar screenshots y verificar regresiones visuales.
- Cloudinary/S3 MCP o SDK tooling: validar subida, metadata y permisos de objetos en storage.
- Email/SMPP/SMTP sandbox MCP: probar plantillas, variables y estados de envio sin mandar correos reales.
- OpenAPI/Swagger tooling MCP: validar contratos, generar clientes TypeScript y detectar drift.

## Flujo agil sugerido

1. Backlog ligero: cada feature entra como issue con objetivo, actor y riesgo.
2. Spec: el agente genera o actualiza `requirements.md` usando EARS.
3. Design: el agente crea `design.md` con contratos, modelos, diagramas y decisiones.
4. Tasks: el agente parte trabajo en tareas pequenas, trazables y con pruebas.
5. TDD red: el agente escribe pruebas que fallan.
6. TDD green: el agente implementa la menor solucion correcta.
7. Refactor: el agente mejora estructura sin cambiar comportamiento.
8. Verify: el agente ejecuta tests, linters, typecheck y E2E cuando aplique.
9. PR evidence: el agente adjunta resumen, riesgos, pruebas y screenshots.
10. Spec drift check: si el codigo cambio el comportamiento, se actualiza la spec antes de cerrar.

## Prompts operativos para agentes

```text
Antes de implementar, usa los MCPs disponibles para obtener evidencia local. Lee specs padre, contratos API, modelos, tests existentes e issues relacionados. No inventes APIs ni estructuras. Si falta informacion, registra una pregunta en la spec y propone una decision reversible.
```

```text
Despues de implementar, usa herramientas de verificacion para demostrar: pruebas ejecutadas, contratos respetados, permisos validados, capturas si hubo UI y cambios de spec si existio drift. El PR no esta listo sin evidencia.
```

## Politica de uso

- Los MCPs deben ampliar contexto, no reemplazar specs.
- Ningun MCP debe acceder a datos productivos reales sin autorizacion explicita.
- Las credenciales deben estar en variables de entorno o secret manager, nunca en specs.
- Los agentes deben dejar evidencia reproducible: comandos, resultados y rutas de archivos.

