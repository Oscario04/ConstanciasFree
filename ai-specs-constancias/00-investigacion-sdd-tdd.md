# Investigacion Base: SDD, TDD y Patrones para Agentes

## Hallazgos aplicados

Spec Driven Development trata las especificaciones como artefactos vivos que guian o generan implementaciones. GitHub Spec Kit lo plantea como un flujo donde las specs dejan de ser andamiaje desechable y pasan a dirigir el trabajo de codigo. Su flujo recomendado separa `constitution`, `specify`, `plan`, `tasks` e `implement`, por eso esta carpeta divide prompts de principios, producto, arquitectura, tareas y calidad.

Kiro usa tres artefactos centrales por spec: `requirements.md`, `design.md` y `tasks.md`, con requisitos redactados en EARS. Por eso cada prompt exige criterios `WHEN / IF / WHILE / WHERE ... THE SYSTEM SHALL ...`, historias priorizadas y tareas verificables.

SpecDD aporta una idea util para agentes: specs jerarquicas con autoridad de escritura. Un spec padre define restricciones; un spec hijo puede agregar o estrechar reglas, pero no contradecirlas. Por eso los prompts piden secciones `Owns`, `Can modify`, `Can read`, `Must` y `Must not`.

El paper "Spec Kit Agents: Context-Grounded Agentic Workflows" advierte que los agentes pueden quedar ciegos al contexto del repo, causando APIs inventadas o violaciones arquitectonicas. Por eso cada prompt exige evidencia local: leer estructura, contratos, modelos y tests antes de proponer cambios.

## Fuentes consultadas

- GitHub Spec Kit: https://github.com/github/spec-kit
- SpecDD: https://specdd.ai/
- Kiro Specs Concepts: https://kiro.help/docs/kiro/specs/concepts
- Spec Kit Agents, arXiv 2604.05278: https://arxiv.org/abs/2604.05278

## Adaptacion al proyecto

El producto base es una plataforma web para administrar eventos, solicitudes, roles, asistencia, emision de constancias/diplomas/reconocimientos/certificados, persistencia documental, verificacion publica y panel administrativo.

Stack definido:

- Frontend: React + TypeScript + Tailwind, publicado en Hostinger.
- Backend: FastAPI en Vercel.
- Base de datos: MongoDB Atlas.
- Storage: Cloudinary o S3 para PDFs e imagenes.
- Correo: Hostinger Email.

Restriccion clave: Vercel es adecuado para CRUD y consultas rapidas. La generacion masiva de PDFs, colas y trabajos largos deben quedar especificados como worker futuro o servicio dedicado.

