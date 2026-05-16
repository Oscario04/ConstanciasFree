# Documentos, PDFs Y Verificacion Publica

## Spec

Emision de constancias, diplomas y reconocimientos como documentos verificables.

## Owns

- `app/routers/documents.py`
- `app/models/document.py`
- `app/services/pdf_service.py`
- `app/services/storage_service.py`
- `app/services/email_service.py`

## Lifecycle

- Emitido: documento `active` con `verification_code`, `public_url`, `pdf_url`, `expires_at`.
- Verificado: consulta publica por codigo.
- Descargado: proxy de PDF remoto o fallback local.
- Revocado: status `revoked`, con `revoke_reason` y `revoked_at`.
- Archivado: estado modelado, sin endpoint dedicado.

## Functional Requirements EARS

- WHEN admin/organizer emite documento para usuario/evento validos con solicitud aprobada THE SYSTEM SHALL generar PDF, subirlo y guardar metadata.
- WHEN no existe solicitud aprobada THE SYSTEM SHALL responder 400.
- WHEN ya existe documento activo para usuario/evento THE SYSTEM SHALL responder 400.
- WHEN se verifica codigo activo THE SYSTEM SHALL devolver `valid = true` y metadata publica.
- WHEN se verifica codigo inexistente THE SYSTEM SHALL responder 404.
- WHEN documento no esta activo THE SYSTEM SHALL responder 410.
- WHEN admin revoca documento THE SYSTEM SHALL marcar `revoked`.

## API References

- `POST /api/documents/issue?event_id=&user_id=&doc_type=constancia`
- `GET /api/documents/pdf/{code}`
- `GET /api/documents/verify/{code}`
- `GET /api/documents/me`
- `GET /api/documents/event/{event_id}`
- `POST /api/documents/issue-batch/{event_id}`
- `PATCH /api/documents/{doc_id}/revoke?reason=`

## Storage Rules

- Proveedor principal: Cloudinary raw PDF.
- Fallback desarrollo: `/tmp/constancias/{code}.pdf`.
- `pdf_url` queda publico.

## Brechas Pendientes

- El prompt original menciona `certificado`; el enum real no lo incluye.
- La emision usa query params, no JSON body; `test_api.py` actualmente envia JSON con `type`.
- Emision masiva es sincronica, no worker/background job.
- Revocacion no guarda `revoked_by`.
- Verificacion publica expone `pdf_url`; revisar privacidad segun producto.

## Test-First Plan

- Emitir documento con solicitud aprobada.
- Intentar duplicado activo.
- Verificar codigo valido.
- Descargar PDF activo.
- Revocar y comprobar 410 en verificacion.
- Simular fallo de storage.
