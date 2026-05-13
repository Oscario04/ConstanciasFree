# ─────────────────────────────────────────────────────────────────────────────
# CARPETA: app/services/
# ARCHIVO: storage_service.py
# ─────────────────────────────────────────────────────────────────────────────

"""
Servicio de almacenamiento cloud para PDFs, imágenes y archivos.
Usa Cloudinary como proveedor principal.
Si las credenciales no están configuradas, guarda el archivo localmente
como fallback (solo para desarrollo).
"""

import cloudinary
import cloudinary.uploader
import io
import os
import logging
from app.config import settings

logger = logging.getLogger(__name__)

# Configurar Cloudinary si las credenciales están presentes
_cloudinary_configured = False

if settings.CLOUDINARY_CLOUD_NAME and settings.CLOUDINARY_API_KEY and settings.CLOUDINARY_API_SECRET:
    cloudinary.config(
        cloud_name=settings.CLOUDINARY_CLOUD_NAME,
        api_key=settings.CLOUDINARY_API_KEY,
        api_secret=settings.CLOUDINARY_API_SECRET,
        secure=True,
    )
    _cloudinary_configured = True
    logger.info("Cloudinary configurado correctamente")
else:
    logger.warning("Cloudinary no configurado — se usará almacenamiento local como fallback")


async def upload_pdf(pdf_bytes: bytes, public_id: str, folder: str = "constancias") -> str:
    """
    Sube un PDF a Cloudinary y retorna la URL pública segura.
    En caso de que Cloudinary no esté configurado, guarda localmente
    en /tmp y retorna una URL local (solo desarrollo).

    Args:
        pdf_bytes: Contenido del PDF en bytes.
        public_id:  Identificador único del archivo (sin extensión).
        folder:     Carpeta dentro de Cloudinary donde se guardará.

    Returns:
        URL pública del archivo subido.
    """
    if _cloudinary_configured:
        try:
            result = cloudinary.uploader.upload(
                pdf_bytes,
                public_id=f"{folder}/{public_id}",
                resource_type="raw",
                format="pdf",
                overwrite=True,
                access_mode="public",
            )
            url: str = result.get("secure_url", "")
            logger.info(f"PDF subido a Cloudinary: {url}")
            return url
        except Exception as e:
            logger.error(f"Error al subir PDF a Cloudinary: {e}")
            raise RuntimeError(f"No se pudo subir el archivo: {e}")

    # ── Fallback local (solo desarrollo) ──────────────────────────────────────
    local_dir = "/tmp/constancias"
    os.makedirs(local_dir, exist_ok=True)
    local_path = f"{local_dir}/{public_id}.pdf"
    with open(local_path, "wb") as f:
        f.write(pdf_bytes)
    local_url = f"{settings.FRONTEND_URL}/api/documents/pdf/{public_id}"
    logger.warning(f"PDF guardado localmente (fallback): {local_path}")
    return local_url


async def delete_file(public_id: str, folder: str = "constancias") -> bool:
    """
    Elimina un archivo de Cloudinary.
    Retorna True si se eliminó correctamente, False en caso contrario.

    Args:
        public_id: Identificador del archivo (sin extensión).
        folder:    Carpeta dentro de Cloudinary.
    """
    if not _cloudinary_configured:
        logger.warning("Cloudinary no configurado — no se puede eliminar el archivo")
        return False
    try:
        result = cloudinary.uploader.destroy(
            f"{folder}/{public_id}",
            resource_type="raw",
        )
        destroyed = result.get("result") == "ok"
        if destroyed:
            logger.info(f"Archivo eliminado de Cloudinary: {folder}/{public_id}")
        return destroyed
    except Exception as e:
        logger.error(f"Error al eliminar archivo de Cloudinary: {e}")
        return False


async def get_signed_url(public_id: str, folder: str = "constancias", expires_at: int = 3600) -> str:
    """
    Genera una URL firmada y temporal para un archivo privado en Cloudinary.
    Útil si en el futuro se quiere restringir el acceso a los PDFs.

    Args:
        public_id:  Identificador del archivo.
        folder:     Carpeta en Cloudinary.
        expires_at: Segundos hasta que la URL expire (default: 1 hora).

    Returns:
        URL firmada temporal.
    """
    if not _cloudinary_configured:
        raise RuntimeError("Cloudinary no está configurado")
    try:
        url = cloudinary.utils.cloudinary_url(
            f"{folder}/{public_id}.pdf",
            resource_type="raw",
            sign_url=True,
            expires_at=expires_at,
        )[0]
        return url
    except Exception as e:
        logger.error(f"Error al generar URL firmada: {e}")
        raise RuntimeError(f"No se pudo generar la URL: {e}")