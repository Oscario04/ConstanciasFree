# Prompt 10: Backend Documentos, PDFs y Verificacion Publica

Usa este prompt para crear `specs/backend/certificates-documents.md`.

```text
Actua como backend lead para documentos verificables. Crea la spec SDD/TDD para constancias, diplomas, certificados, reconocimientos, PDFs, QR y verificacion publica.

Genera `specs/backend/certificates-documents.md` con:

1. Spec
2. Owns
3. Can modify
4. Can read
5. Purpose
6. Document lifecycle
7. Functional requirements EARS
8. Template variable contract
9. PDF generation rules
10. Storage rules
11. Public verification rules
12. Retention and revocation rules
13. Security/privacy rules
14. Test-first plan
15. Implementation tasks
16. Done when

Reglas:
- Tipos: diploma, constancia, reconocimiento, certificado.
- Estados: active, archived, revoked.
- Cada documento debe tener verification_code unico y URL publica de verificacion.
- Cada PDF debe incluir QR apuntando al verificador publico.
- Los PDFs no deben guardarse en filesystem local persistente.
- Metadata en MongoDB; archivo en Cloudinary/S3.
- Vencimiento operativo no elimina fisicamente el documento.
- Revocacion debe conservar historial, motivo, actor y fecha.
- Generacion masiva debe quedar preparada para worker futuro, no endpoint serverless bloqueante.
- Incluye pruebas de elegibilidad, unicidad, revocacion, verificacion publica, privacidad y storage failure.

Devuelve solo el Markdown final.
```

