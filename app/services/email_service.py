"""
Servicio de notificaciones por correo electrónico.
Usa aiosmtplib para envíos asíncronos.
"""
import aiosmtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from app.config import settings
import logging

logger = logging.getLogger(__name__)


def _build_message(to_email: str, subject: str, html_body: str) -> MIMEMultipart:
    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = settings.EMAIL_FROM
    msg["To"] = to_email
    msg.attach(MIMEText(html_body, "html"))
    return msg


async def send_email(to_email: str, subject: str, html_body: str) -> bool:
    if not settings.SMTP_USER or not settings.SMTP_PASSWORD:
        logger.warning("SMTP no configurado — email no enviado")
        return False
    try:
        msg = _build_message(to_email, subject, html_body)
        await aiosmtplib.send(
            msg,
            hostname=settings.SMTP_HOST,
            port=settings.SMTP_PORT,
            username=settings.SMTP_USER,
            password=settings.SMTP_PASSWORD,
            start_tls=True,
        )
        return True
    except Exception as e:
        logger.error(f"Error enviando correo a {to_email}: {e}")
        return False


async def send_approval_email(to_email: str, name: str, event_title: str, role: str):
    html = f"""
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:24px;border:1px solid #e0e0e0;border-radius:8px">
      <h2 style="color:#1E3A5F">¡Solicitud aprobada!</h2>
      <p>Hola <b>{name}</b>,</p>
      <p>Tu solicitud para participar como <b>{role}</b> en el evento <b>{event_title}</b> ha sido <span style="color:#28a745">aprobada</span>.</p>
      <p>Recibirás tu constancia una vez finalizado el evento.</p>
      <hr style="border:none;border-top:1px solid #eee">
      <small style="color:#999">{settings.APP_NAME}</small>
    </div>
    """
    await send_email(to_email, f"Solicitud aprobada — {event_title}", html)


async def send_rejection_email(to_email: str, name: str, event_title: str, reason: str = ""):
    reason_block = f"<p><b>Motivo:</b> {reason}</p>" if reason else ""
    html = f"""
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:24px;border:1px solid #e0e0e0;border-radius:8px">
      <h2 style="color:#1E3A5F">Actualización de solicitud</h2>
      <p>Hola <b>{name}</b>,</p>
      <p>Lamentamos informarte que tu solicitud para el evento <b>{event_title}</b> no fue aprobada en esta ocasión.</p>
      {reason_block}
      <p>Puedes consultar otros eventos disponibles en la plataforma.</p>
      <hr style="border:none;border-top:1px solid #eee">
      <small style="color:#999">{settings.APP_NAME}</small>
    </div>
    """
    await send_email(to_email, f"Actualización de solicitud — {event_title}", html)


async def send_document_email(to_email: str, name: str, event_title: str, doc_url: str):
    html = f"""
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:24px;border:1px solid #e0e0e0;border-radius:8px">
      <h2 style="color:#1E3A5F">Tu constancia está lista</h2>
      <p>Hola <b>{name}</b>,</p>
      <p>Tu documento para el evento <b>{event_title}</b> ha sido emitido y está disponible para descarga.</p>
      <p style="text-align:center">
        <a href="{doc_url}" style="background:#1E3A5F;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:bold">Descargar constancia</a>
      </p>
      <p>También puedes verificar su autenticidad usando el código QR incluido en el documento.</p>
      <hr style="border:none;border-top:1px solid #eee">
      <small style="color:#999">{settings.APP_NAME}</small>
    </div>
    """
    await send_email(to_email, f"Tu constancia — {event_title}", html)