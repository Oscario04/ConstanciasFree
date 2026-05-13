"""
Servicio de generación de PDFs para constancias, diplomas y reconocimientos.
Usa ReportLab para generar los documentos con plantillas.
"""
import io
import qrcode
from reportlab.lib.pagesizes import landscape, A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm, mm
from reportlab.lib.colors import HexColor, black, white
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image
from reportlab.lib.enums import TA_CENTER
from datetime import datetime
from typing import Optional
import base64


def generate_qr_image(data: str) -> io.BytesIO:
    """Genera un QR code como bytes."""
    qr = qrcode.QRCode(version=1, box_size=8, border=2)
    qr.add_data(data)
    qr.make(fit=True)
    img = qr.make_image(fill_color="black", back_color="white")
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    buf.seek(0)
    return buf


def generate_constancia_pdf(
    recipient_name: str,
    event_title: str,
    event_date: str,
    role: str,
    verification_url: str,
    doc_type: str = "constancia",
    institution: str = "Institución Organizadora",
    hours: Optional[int] = None,
) -> bytes:
    """
    Genera un PDF de constancia/diploma/reconocimiento.
    Retorna los bytes del PDF generado.
    """
    buf = io.BytesIO()
    doc = SimpleDocTemplate(
        buf,
        pagesize=landscape(A4),
        rightMargin=1.5 * cm,
        leftMargin=1.5 * cm,
        topMargin=1.5 * cm,
        bottomMargin=1.5 * cm,
    )

    # Colores
    primary = HexColor("#1E3A5F")
    accent = HexColor("#C9A84C")
    light_bg = HexColor("#F5F0E8")

    styles = getSampleStyleSheet()

    title_style = ParagraphStyle(
        "DocTitle",
        parent=styles["Title"],
        fontSize=36,
        textColor=accent,
        alignment=TA_CENTER,
        fontName="Times-Bold",
        spaceAfter=0.3 * cm,
    )
    subtitle_style = ParagraphStyle(
        "Subtitle",
        parent=styles["Normal"],
        fontSize=14,
        textColor=primary,
        alignment=TA_CENTER,
        fontName="Times-Italic",
        spaceAfter=0.4 * cm,
    )
    body_style = ParagraphStyle(
        "Body",
        parent=styles["Normal"],
        fontSize=13,
        textColor=primary,
        alignment=TA_CENTER,
        fontName="Times-Roman",
        spaceAfter=0.2 * cm,
    )
    name_style = ParagraphStyle(
        "Name",
        parent=styles["Normal"],
        fontSize=28,
        textColor=primary,
        alignment=TA_CENTER,
        fontName="Times-Bold",
        spaceAfter=0.3 * cm,
    )
    small_style = ParagraphStyle(
        "Small",
        parent=styles["Normal"],
        fontSize=9,
        textColor=HexColor("#666666"),
        alignment=TA_CENTER,
        fontName="Helvetica",
    )

    doc_type_label = {
        "constancia": "CONSTANCIA DE PARTICIPACIÓN",
        "diploma": "DIPLOMA DE RECONOCIMIENTO",
        "reconocimiento": "RECONOCIMIENTO ESPECIAL",
    }.get(doc_type, "CONSTANCIA")

    role_label = {
        "speaker": "ponente",
        "attendee": "participante",
        "staff": "colaborador",
        "organizer": "organizador",
    }.get(role.lower(), role)

    hours_text = f" con duración de <b>{hours} horas</b>" if hours else ""

    qr_buf = generate_qr_image(verification_url)
    qr_img = Image(qr_buf, width=2.5 * cm, height=2.5 * cm)

    story = [
        Spacer(1, 0.5 * cm),
        Paragraph(institution.upper(), subtitle_style),
        Paragraph(doc_type_label, title_style),
        Spacer(1, 0.3 * cm),
        Paragraph("Se otorga el presente a:", body_style),
        Paragraph(recipient_name, name_style),
        Spacer(1, 0.2 * cm),
        Paragraph(
            f"por su distinguida participación como <b>{role_label}</b> en:",
            body_style,
        ),
        Paragraph(f"<b>{event_title}</b>", name_style),
        Paragraph(f"celebrado el {event_date}{hours_text}.", body_style),
        Spacer(1, 0.5 * cm),
        qr_img,
        Spacer(1, 0.2 * cm),
        Paragraph(f"Verificar en: {verification_url}", small_style),
        Spacer(1, 0.3 * cm),
        Paragraph(
            f"Documento generado el {datetime.utcnow().strftime('%d/%m/%Y')}",
            small_style,
        ),
    ]

    doc.build(story)
    buf.seek(0)
    return buf.read()