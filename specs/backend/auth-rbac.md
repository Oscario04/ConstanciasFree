# Auth, Usuarios Y RBAC

## Spec

Autenticacion JWT y permisos por rol fijo para el backend actual.

## Owns

- `app/routers/auth.py`
- `app/routers/users.py`
- `app/utils/auth.py`
- `app/models/user.py`

## Functional Requirements EARS

- WHEN un usuario se registra con email nuevo THE SYSTEM SHALL crear usuario activo con password hasheado.
- WHEN un usuario se registra con email existente THE SYSTEM SHALL responder 400.
- WHEN un usuario inicia sesion con credenciales validas y estado `active` THE SYSTEM SHALL devolver JWT Bearer.
- WHEN un usuario inactivo o suspendido inicia sesion THE SYSTEM SHALL responder 403.
- WHEN un token es invalido o expiro THE SYSTEM SHALL responder 401.
- WHEN un rol no permitido accede a un endpoint protegido THE SYSTEM SHALL responder 403.
- WHEN un admin lista usuarios THE SYSTEM SHALL ocultar `password`.

## Roles Reales

- `admin`
- `organizer`
- `speaker`
- `attendee`
- `staff`

## API References

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/users/me`
- `PATCH /api/users/me`
- `GET /api/users/`
- `PATCH /api/users/{user_id}/status?status=active`

## Security Requirements

- Passwords se guardan con bcrypt.
- JWT usa `SECRET_KEY`, `ALGORITHM` y expiracion de `ACCESS_TOKEN_EXPIRE_MINUTES`.
- Las respuestas nunca deben incluir `password`.
- Produccion debe cambiar `SECRET_KEY` por valor seguro.

## Brechas Pendientes

- No hay logout, refresh token ni recuperacion real de contrasena.
- No hay roles dinamicos ni permisos granulares persistidos.
- No hay AuditLog para acciones administrativas.
- `PATCH /api/users/{user_id}/status` espera `status` como query param, no JSON body; `test_api.py` actualmente envia JSON.

## Test-First Plan

- Registro exitoso y duplicado.
- Login exitoso, password incorrecto, usuario suspendido.
- Acceso con token invalido.
- Acceso admin contra rol sin permiso.
- Validar que usuarios listados no exponen `password`.

## Done When

- La matriz de permisos real esta cubierta por tests.
- Las brechas quedan como tareas antes de prometer comportamiento adicional.
