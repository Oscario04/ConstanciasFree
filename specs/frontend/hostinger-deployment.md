# Despliegue Frontend En Hostinger

## Spec

Despliegue de una app React + TypeScript + Tailwind como sitio estatico en Hostinger.

## Build Output

- Comando: `npm run build`.
- Output esperado Vite: `dist/`.
- Subir contenido de `dist/` a `public_html/` o directorio del subdominio configurado.

## Environment Variables

Archivo local:
- `.env.development`

Produccion antes de build:
- `.env.production`

Variables:
- `VITE_API_BASE_URL=https://api.midominio.com`

El valor debe apuntar al backend FastAPI accesible publicamente. Si el backend vive en otro dominio, configurar CORS en `app/main.py`.

## Hostinger Routing

Como React Router usa rutas del lado cliente, Hostinger debe redirigir todas las rutas al `index.html`.

Archivo `.htaccess` recomendado en `public_html/`:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

## CORS Requirements

Backend debe permitir el dominio real del frontend:
- `https://midominio.com`
- `https://www.midominio.com`
- o subdominio usado por Hostinger.

En desarrollo ya existe `http://localhost:5173`.

## Asset And Cache Rules

- Archivos con hash de Vite pueden cachearse largo plazo.
- `index.html` no debe cachearse agresivamente.
- No subir `.env`, source maps privados ni archivos de desarrollo innecesarios.

## Deployment Checklist

- [T001] Configurar dominio/subdominio en Hostinger.
- [T002] Definir `VITE_API_BASE_URL` de produccion.
- [T003] Ejecutar `npm ci`.
- [T004] Ejecutar `npm run typecheck`.
- [T005] Ejecutar `npm run test` si existe.
- [T006] Ejecutar `npm run build`.
- [T007] Subir `dist/` a Hostinger.
- [T008] Agregar `.htaccess`.
- [T009] Probar `/`, `/login`, `/eventos`, `/verificar/demo` y una ruta `/admin`.
- [T010] Validar login real contra backend.

## Rollback

- Conservar el build anterior en carpeta versionada o backup de Hostinger.
- Si falla login por CORS, no tocar frontend primero: revisar `allow_origins` del backend y dominio real.

## Done When

- Recargar rutas profundas no da 404.
- La app puede llamar al backend de produccion.
- Login, ver eventos y verificador publico funcionan desde el dominio Hostinger.
