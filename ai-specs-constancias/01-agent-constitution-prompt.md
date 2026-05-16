# Prompt 01: Constitucion del Proyecto para Agentes

Usa este prompt para crear `specs/000-constitution.md`.

```text
Actua como arquitecto principal y technical product owner. Crea una constitucion SDD para una plataforma web de gestion de eventos, asistencia y emision persistente de constancias, diplomas, certificados y reconocimientos.

Contexto del producto:
- Frontend: React + TypeScript + Tailwind, desplegado en Hostinger.
- Backend: FastAPI, desplegado en Vercel.
- Base de datos: MongoDB Atlas.
- Storage: Cloudinary o S3 para PDFs e imagenes.
- Correo: Hostinger Email.
- El sistema administra usuarios, roles dinamicos, eventos, solicitudes, asistencia QR/manual, documentos verificables, notificaciones, metricas, reportes, auditoria y retencion documental.

Genera un archivo Markdown con estas secciones:

1. Vision del sistema
2. Principios no negociables
3. Reglas SDD para agentes
4. Reglas TDD para agentes
5. Arquitectura permitida
6. Arquitectura prohibida
7. Politicas de datos, privacidad y auditoria
8. Politicas de documentos verificables
9. Reglas de seguridad
10. Definicion de terminado

Requisitos de redaccion:
- Usa lenguaje normativo: MUST, MUST NOT, SHOULD, MAY.
- Cada regla debe ser comprobable.
- Incluye reglas de trazabilidad: todo codigo debe mapear a un requisito, contrato o tarea.
- Incluye regla de pruebas: ningun endpoint, flujo critico o componente de UI puede implementarse sin prueba o criterio verificable.
- Incluye regla de contexto: antes de modificar codigo, el agente debe leer specs padre, contratos, modelos y tests relacionados.
- Incluye limites de escritura: cada spec debe declarar Owns, Can modify y Can read.
- Incluye politica de no eliminacion fisica de documentos: revocar o archivar antes que borrar.
- Incluye politica de serverless: no ejecutar trabajos largos de PDF masivo dentro de endpoints Vercel.

Devuelve solo el contenido completo de `specs/000-constitution.md`.
```

