# Prompt 11: Backend Notificaciones y Correo

Usa este prompt para crear `specs/backend/notifications-email.md`.

```text
Actua como backend engineer de comunicaciones. Crea la spec SDD/TDD para notificaciones por correo usando Hostinger Email.

Genera `specs/backend/notifications-email.md` con:

1. Spec
2. Owns
3. Can modify
4. Can read
5. Purpose
6. Notification events
7. Template model
8. Functional requirements EARS
9. Delivery rules
10. Retry/dead-letter strategy
11. Privacy rules
12. Test-first plan
13. Implementation tasks
14. Done when

Eventos minimos:
- Registro de usuario
- Solicitud recibida
- Solicitud aprobada
- Solicitud rechazada
- Recordatorio de evento
- Documento emitido
- Documento revocado

Reglas:
- Plantillas versionadas con variables declaradas.
- No enviar correos sin destinatario validado.
- No bloquear transacciones criticas si falla el proveedor de correo; registrar fallo y permitir reintento.
- No incluir datos sensibles innecesarios en correos.
- Cada envio debe generar Notification con estado queued, sent, failed o skipped.
- Incluye pruebas de render de plantilla, variables faltantes, fallo SMTP, reintento y auditoria.

Devuelve solo el Markdown final.
```

