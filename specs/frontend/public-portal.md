# Frontend Portal Publico Y Verificador

## Spec

Portal publico y area de usuario para eventos, solicitudes, perfil y documentos.

## Owns

- Rutas publicas.
- Rutas autenticadas de usuario.
- Formularios de registro/login/solicitud.
- Verificador publico de documentos.

## Purpose

Permitir que participantes encuentren eventos, soliciten participacion, consulten sus solicitudes, vean sus documentos y verifiquen constancias mediante codigo o QR.

## Public Routes

- `/`: lista eventos disponibles y acceso al verificador.
- `/eventos`: lista eventos.
- `/eventos/:eventId`: detalle de evento.
- `/login`: inicio de sesion.
- `/registro`: creacion de cuenta.
- `/verificar`: formulario de codigo.
- `/verificar/:code`: resultado de verificacion publica.

## Authenticated User Routes

- `/app`: resumen personal.
- `/app/perfil`: datos propios.
- `/app/solicitudes`: estado de solicitudes.
- `/app/documentos`: documentos emitidos.
- `/app/eventos/:eventId/solicitar`: formulario de solicitud.

## User Flows

Registro/login:
- Usuario crea cuenta con rol default `attendee`.
- Login guarda token y carga usuario actual.

Eventos:
- Usuario lista eventos con `GET /api/events/`.
- Detalle usa `GET /api/events/{event_id}`.
- La UI debe señalar si el evento no acepta solicitudes por estado.
- La UI debe mostrar capacidad y progreso de registro cuando `capacity` sea mayor que cero, usando azul para baja ocupacion, amarillo desde ocupacion media y rojo cuando el cupo este cerca de llenarse.

Solicitudes:
- Usuario solicita con `POST /api/requests/`.
- Usuario consulta con `GET /api/requests/me`.
- Usuario cancela pendiente con `DELETE /api/requests/{request_id}`.

Documentos:
- Usuario consulta propios con `GET /api/documents/me`.
- Verificacion publica usa `GET /api/documents/verify/{code}`.
- Descarga usa `GET /api/documents/pdf/{code}`.

## Functional Requirements EARS

- WHEN visitante abre eventos THE SYSTEM SHALL mostrar lista, loading, error y empty state.
- WHEN visitante intenta solicitar evento sin sesion THE SYSTEM SHALL enviarlo a login y regresar despues de autenticar.
- WHEN usuario envia solicitud valida THE SYSTEM SHALL mostrar confirmacion y actualizar `Mis solicitudes`.
- WHEN API devuelve solicitud duplicada THE SYSTEM SHALL mostrar el mensaje `detail`.
- WHEN usuario cancela solicitud pendiente THE SYSTEM SHALL pedir confirmacion.
- WHEN visitante verifica codigo activo THE SYSTEM SHALL mostrar validez, tipo, fecha, evento, nombre visible y link de PDF.
- WHEN documento no existe THE SYSTEM SHALL mostrar resultado no encontrado.
- WHEN documento esta revoked o archived THE SYSTEM SHALL mostrar que no es valido para uso publico.

## API Dependencies

- Auth: `POST /api/auth/register`, `POST /api/auth/login`.
- Events: `GET /api/events/`, `GET /api/events/{event_id}`.
- Requests: `POST /api/requests/`, `GET /api/requests/me`, `DELETE /api/requests/{request_id}`.
- Users: `GET /api/users/me`, `PATCH /api/users/me`.
- Documents: `GET /api/documents/me`, `GET /api/documents/verify/{code}`, `GET /api/documents/pdf/{code}`.

## Privacy Rules

- Verificador publico solo muestra metadata que backend entrega.
- No mostrar emails en verificacion publica.
- No exponer token JWT en URLs.
- No guardar password ni datos sensibles en storage.

## UI States

- Login/registro: idle, submitting, success, API error.
- Eventos: skeleton list, empty, error, paginacion.
- Solicitudes: badges por estado.
- Verificador: formulario vacio, verificando, valido, no encontrado, no valido.
- Documentos: lista con descarga, expiracion y estado.

## Accessibility

- Formularios con labels visibles.
- Errores leidos por screen readers mediante `aria-describedby`.
- Resultado de verificacion anunciado con `role="status"`.
- Navegacion por teclado completa.

## Test-First Plan

- Registro renderiza validaciones cliente.
- Login envia form-urlencoded y guarda token.
- Solicitar evento requiere sesion.
- Solicitud duplicada muestra error API.
- Verificador muestra documento valido.
- Verificador maneja 404 y 410.

## Implementation Tasks

- [T001] Crear formularios login/registro.
- [T002] Crear pagina de eventos y detalle.
- [T003] Crear flujo de solicitud.
- [T004] Crear perfil y mis solicitudes.
- [T005] Crear mis documentos.
- [T006] Crear verificador publico.
- [T007] Agregar tests MSW/RTL.

## Done When

- Un usuario puede registrarse, entrar, ver eventos, solicitar, consultar estado y verificar documentos.
- Ninguna pantalla publica depende de endpoints admin.
