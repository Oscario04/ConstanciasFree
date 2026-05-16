# Prompt 02: Product Brief y Alcance Funcional

Usa este prompt para crear `specs/001-product-brief.md`.

```text
Actua como product manager senior y analista funcional. Crea el Product Brief SDD para la plataforma de gestion de eventos, solicitudes, asistencia y documentos verificables.

Base funcional:
- Usuarios con roles dinamicos: expositor, oyente, participante, staff, invitado y roles configurables.
- Eventos con sedes, fechas, horarios, cupos, sesiones y reglas de aprobacion.
- Solicitudes con aprobacion, rechazo, observaciones y correo automatico.
- Asistencia manual y por QR, por evento y por sesion.
- Emision de diplomas, constancias, reconocimientos y certificados.
- Persistencia documental por 1, 3, 5 anos o indefinida.
- Enlaces publicos verificables por documento y perfil publico del usuario.
- Panel administrativo con metricas, reportes y trazabilidad.

Genera `specs/001-product-brief.md` con estas secciones:

1. Spec
2. Purpose
3. Actors
4. User journeys prioritizados
5. Alcance MVP
6. Alcance fase 2
7. Alcance fase 3
8. Fuera de alcance inicial
9. Requisitos funcionales con formato EARS
10. Requisitos no funcionales
11. Riesgos y decisiones pendientes
12. Done when

Reglas:
- Prioriza historias como P1, P2 y P3.
- Para cada historia escribe criterios EARS:
  - WHEN <evento> THE SYSTEM SHALL <resultado>
  - IF <condicion> THE SYSTEM SHALL <resultado>
  - WHILE <estado> THE SYSTEM SHALL <resultado>
- Incluye minimo 20 requisitos funcionales.
- Incluye requisitos de accesibilidad, rendimiento, seguridad, auditabilidad y retencion.
- No inventes pagos, facturacion ni e-commerce; no estan en el alcance.
- El resultado debe servir como fuente de verdad para backend y frontend.

Devuelve solo el Markdown final.
```

