# Frontend App Shell, UX Y Sistema Visual

## Spec

Aplicacion frontend en React + TypeScript + Tailwind para consumir el backend FastAPI existente bajo `/api`.

## Owns

- Futuro frontend React, sugerido en `frontend/`.
- Configuracion Vite, TypeScript, Tailwind y rutas.
- Cliente API tipado contra `specs/004-api-contracts.md`.

## Platform

- React 18+.
- TypeScript estricto.
- Vite.
- Tailwind CSS.
- React Router.
- TanStack Query para data fetching/cache.
- React Hook Form + Zod para formularios.
- Hostinger como hosting del build estatico.

## Purpose

Entregar una interfaz operacional para registro, login, eventos, solicitudes, asistencia, documentos verificables y administracion, sin inventar endpoints no disponibles.

## Information Architecture

- Publico: inicio operativo, eventos, detalle de evento, verificador de documentos.
- Auth: login, registro, perfil, mis solicitudes, mis documentos.
- Staff/Admin/Organizer: dashboard, eventos, solicitudes, asistencia, documentos, usuarios, configuracion.
- Fase futura: plantillas, notificaciones persistentes, auditoria visual y roles dinamicos.

## Route Map

Publicas:
- `/`: redirige segun sesion; sin sesion muestra eventos publicados y acceso a verificador.
- `/login`
- `/registro`
- `/eventos`
- `/eventos/:eventId`
- `/verificar`
- `/verificar/:code`
- `/documentos/pdf/:code` redirige o abre `GET /api/documents/pdf/{code}`.

Autenticadas:
- `/app`
- `/app/perfil`
- `/app/solicitudes`
- `/app/documentos`
- `/app/eventos/:eventId/solicitar`

Admin/organizer:
- `/admin`
- `/admin/eventos`
- `/admin/eventos/nuevo`
- `/admin/eventos/:eventId`
- `/admin/eventos/:eventId/solicitudes`
- `/admin/eventos/:eventId/asistencia`
- `/admin/eventos/:eventId/documentos`
- `/admin/usuarios`
- `/admin/configuracion`

Staff:
- `/staff/asistencia`
- `/staff/eventos/:eventId/check-in`

## Layout Rules

- La app autenticada debe abrir en una herramienta usable, no en landing decorativa.
- Navegacion lateral en desktop con control para contraer/expandir; en mobile debe existir navegacion compacta sin bloquear contenido.
- Header con busqueda/contexto y menu de perfil con avatar o inicial del usuario, acceso a perfil y salida.
- Tablas y formularios deben ser densos, escaneables y con acciones claras.
- No usar textos largos explicando la app dentro de la UI; usar etiquetas concretas.
- Componentes con ancho maximo para lectura, pero pantallas operativas de tablas usan todo el viewport.
- El nombre visible del producto debe ser amigable e institucional; evitar nombres internos del prompt como marca principal.
- Los accesos entre areas (`/app`, `/admin`, `/staff`) deben mostrarse como cambio de contexto, no duplicar la navegacion activa de cada area.

## Component System Rules

- `Button`, `IconButton`, `Input`, `Select`, `Textarea`, `Checkbox`, `Badge`, `Alert`, `Dialog`, `Table`, `Tabs`, `Pagination`, `EmptyState`, `Skeleton`.
- Iconos con `lucide-react`.
- Estados por componente: loading, error, empty, success, disabled.
- Cards solo para items repetidos o paneles de datos; no envolver secciones completas dentro de cards anidadas.
- Badges de estado:
  - solicitud: pending, approved, rejected, cancelled.
  - evento: draft, published, ongoing, finished, archived.
  - documento: active, revoked, archived.
  - usuario: active, inactive, suspended.

## State And Data Fetching

- `VITE_API_BASE_URL` controla el backend, ejemplo produccion `https://api.tudominio.com`.
- Tokens Bearer en memoria + persistencia local controlada; si se usa `localStorage`, limpiar en logout y 401.
- TanStack Query para GETs, mutations para POST/PATCH/DELETE.
- Invalidar queries despues de crear solicitud, aprobar, check-in, emitir/revocar documento o actualizar perfil.
- Tipos compartidos frontend deben mapear los modelos reales, no los prompts originales.

## Auth Guards

- `PublicRoute`: no requiere token.
- `AuthenticatedRoute`: requiere token valido y usuario.
- `RoleRoute`: valida `user.role`.
- La UI puede ocultar acciones sin permiso, pero el backend sigue siendo autoridad.

## Accessibility

- Inputs con `label` visible o `aria-label` cuando el icono sea suficiente.
- Foco visible en todos los controles.
- Dialogs con focus trap y cierre por Escape.
- Tablas con encabezados semanticos.
- Contraste AA minimo.
- Mensajes de error asociados al campo.

## Responsive Requirements

- Mobile: navegacion compacta, tablas convertidas a lista o columnas prioritarias.
- Tablet/desktop: sidebar persistente y tablas completas.
- Formularios no deben romperse con emails, nombres largos o codigos de verificacion.

## Error, Loading And Empty States

- Loading: skeletons en tablas/paneles y spinners solo en botones.
- Error API: mostrar `detail` cuando exista.
- 401: limpiar sesion y enviar a `/login`.
- 403: mostrar pantalla sin permiso.
- Empty: mensaje corto con accion primaria cuando aplique.
- No renderizar objetos JSON crudos en pantallas finales; mapear respuestas administrativas a metricas, listas o pares etiqueta/valor legibles.

## Test-First Plan

- Unit/component: guardas de rutas, badges de estado, formularios login/registro/evento.
- Integration: cliente API con mocks MSW.
- E2E Playwright: login, solicitar evento, verificar documento, aprobar solicitud, check-in manual.
- Visual smoke: desktop y mobile para rutas principales.

## Implementation Tasks

- [T001] Crear app Vite React TypeScript.
- [T002] Configurar Tailwind, ESLint y strict TS.
- [T003] Crear cliente API con interceptores y tipos.
- [T004] Implementar auth store y guardas de rutas.
- [T005] Construir layout publico, autenticado y admin.
- [T006] Implementar componentes base y estados UI.
- [T007] Conectar flujos publicos.
- [T008] Conectar flujos admin/staff.
- [T009] Agregar pruebas RTL/MSW.
- [T010] Agregar Playwright smoke.

## Done When

- El frontend compila con `tsc`.
- Las rutas consumen solo endpoints documentados en `specs/004-api-contracts.md`.
- Los roles controlan navegacion y acciones visibles.
- El build estatico puede desplegarse en Hostinger.
