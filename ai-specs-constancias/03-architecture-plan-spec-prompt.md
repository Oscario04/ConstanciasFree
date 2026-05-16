# Prompt 03: Arquitectura y Plan Tecnico

Usa este prompt para crear `specs/002-architecture-plan.md`.

```text
Actua como software architect. Crea un plan tecnico SDD para implementar la plataforma con React + TypeScript + Tailwind, FastAPI en Vercel, MongoDB Atlas, Cloudinary/S3 y Hostinger Email.

Genera `specs/002-architecture-plan.md` con:

1. Spec
2. Platform
3. Purpose
4. System context
5. Component diagram en Mermaid
6. Deployment view
7. Runtime flows clave en Mermaid
8. Backend structure propuesta
9. Frontend structure propuesta
10. Data/storage boundaries
11. API boundaries
12. Security boundaries
13. Serverless constraints
14. Observability and audit
15. Migration and scalability plan
16. Architecture decision records
17. Done when

Reglas:
- Declara que MongoDB guarda metadatos y estado transaccional, no PDFs binarios.
- Declara que Cloudinary/S3 guarda documentos e imagenes.
- Declara que Vercel maneja endpoints rapidos; colas, generacion masiva y workers largos son fase futura.
- Incluye decisiones para CORS, variables de entorno, secretos, rate limiting y logs.
- Incluye politica de versionado de contratos API.
- Incluye minimo 8 ADRs con estado: Accepted, Proposed o Deferred.
- Para cada decision incluye consecuencias y alternativas rechazadas.
- No propongas una arquitectura monolitica con archivos locales persistentes.

Devuelve solo el Markdown final.
```

