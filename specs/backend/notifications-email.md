# Notificaciones Y Correo

## Spec

Envio directo de correos SMTP para aprobacion, rechazo y documento emitido.

## Owns

- `app/services/email_service.py`
- `app/routers/requests.py`
- `app/routers/documents.py`
- `app/config.py`

## Eventos Implementados

- Solicitud aprobada.
- Solicitud rechazada.
- Documento emitido.

## Eventos No Implementados

- Registro de usuario.
- Solicitud recibida.
- Recordatorio de evento.
- Documento revocado.

## Functional Requirements EARS

- WHEN se aprueba una solicitud THE SYSTEM SHALL intentar enviar correo de aprobacion.
- WHEN se rechaza una solicitud THE SYSTEM SHALL intentar enviar correo de rechazo.
- WHEN se emite un documento THE SYSTEM SHALL intentar enviar correo con enlace al PDF.
- WHEN SMTP no esta configurado THE SYSTEM SHALL no bloquear el flujo y registrar warning/fallo segun servicio.

## Brechas Pendientes

- No hay coleccion `notifications`.
- No hay estados `queued | sent | failed | skipped`.
- No hay reintentos ni dead-letter.
- No hay plantillas versionadas persistentes.
- No hay tests aislados de render/envio.

## Test-First Plan

- Mock de SMTP exitoso.
- Mock de fallo SMTP que no interrumpa transaccion critica si esa es la regla deseada.
- Validar que las funciones reciben destinatario, nombre, evento y URL/motivo.
- Agregar coleccion `notifications` antes de prometer auditoria de envio.
