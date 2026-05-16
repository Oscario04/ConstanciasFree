"""
Script de pruebas para todos los endpoints de la API.
Ejecutar con el servidor corriendo en http://127.0.0.1:8000

    python test_api.py

Requiere: pip install requests
"""

import requests
import json
import sys

BASE_URL = "http://127.0.0.1:8000"

# ─── Credenciales de prueba ───────────────────────────────────────────────────
ADMIN_EMAIL    = "oscar@gmail.com"
ADMIN_PASSWORD = "Admin123"

USER_EMAIL    = "usuario_test@example.com"
USER_PASSWORD = "Test1234!"
USER_NAME     = "Usuario Test"
# ─────────────────────────────────────────────────────────────────────────────

# Colores para la terminal
OK    = "\033[92m✅"
FAIL  = "\033[91m❌"
INFO  = "\033[94mℹ️ "
RESET = "\033[0m"

passed = 0
failed = 0


def check(label: str, response: requests.Response, expected_status: int = 200):
    global passed, failed
    ok = response.status_code == expected_status
    icon = OK if ok else FAIL
    print(f"{icon} [{response.status_code}] {label}{RESET}")
    if not ok:
        print(f"   → {response.text[:300]}")
        failed += 1
    else:
        passed += 1
    return response


def header(title: str):
    print(f"\n\033[1m{'─'*50}\n  {title}\n{'─'*50}\033[0m")


# ══════════════════════════════════════════════════
# 0. HEALTH
# ══════════════════════════════════════════════════
header("0. Health & Root")
check("GET /",       requests.get(f"{BASE_URL}/"))
check("GET /health", requests.get(f"{BASE_URL}/health"))


# ══════════════════════════════════════════════════
# 1. AUTH — Registro
# ══════════════════════════════════════════════════
header("1. Autenticación")

r = check("POST /api/auth/register (nuevo usuario)",
    requests.post(f"{BASE_URL}/api/auth/register", json={
        "name":     USER_NAME,
        "email":    USER_EMAIL,
        "password": USER_PASSWORD,
        "role":     "attendee"
    }),
    expected_status=201
)

# Registro duplicado debe fallar
check("POST /api/auth/register (duplicado → 400)",
    requests.post(f"{BASE_URL}/api/auth/register", json={
        "name": USER_NAME, "email": USER_EMAIL,
        "password": USER_PASSWORD, "role": "attendee"
    }),
    expected_status=400
)

# Login admin
r_login_admin = requests.post(f"{BASE_URL}/api/auth/login", data={
    "username": ADMIN_EMAIL, "password": ADMIN_PASSWORD
})
check("POST /api/auth/login (admin)", r_login_admin)

if r_login_admin.status_code != 200:
    print(f"\n{FAIL} No se pudo autenticar como admin. Verifica que el admin exista (corre crear_admin.py){RESET}")
    sys.exit(1)

admin_token = r_login_admin.json()["access_token"]
admin_headers = {"Authorization": f"Bearer {admin_token}"}

# Login usuario normal
r_login_user = requests.post(f"{BASE_URL}/api/auth/login", data={
    "username": USER_EMAIL, "password": USER_PASSWORD
})
check("POST /api/auth/login (usuario)", r_login_user)
user_token = r_login_user.json()["access_token"]
user_headers = {"Authorization": f"Bearer {user_token}"}
user_id = r_login_user.json()["user"]["id"]

# Login con credenciales incorrectas
check("POST /api/auth/login (contraseña incorrecta → 401)",
    requests.post(f"{BASE_URL}/api/auth/login", data={
        "username": ADMIN_EMAIL, "password": "wrongpassword"
    }),
    expected_status=401
)


# ══════════════════════════════════════════════════
# 2. USUARIOS
# ══════════════════════════════════════════════════
header("2. Usuarios")

check("GET /api/users/me (admin)",
    requests.get(f"{BASE_URL}/api/users/me", headers=admin_headers))

check("GET /api/users/me (usuario)",
    requests.get(f"{BASE_URL}/api/users/me", headers=user_headers))

check("PATCH /api/users/me",
    requests.patch(f"{BASE_URL}/api/users/me", headers=user_headers, json={
        "phone": "3310001234",
        "institution": "Universidad Test",
        "bio": "Bio de prueba"
    })
)

check("GET /api/users/ (lista, solo admin)",
    requests.get(f"{BASE_URL}/api/users/", headers=admin_headers))

check("PATCH /api/users/{id}/status",
    requests.patch(f"{BASE_URL}/api/users/{user_id}/status",
        headers=admin_headers, params={"status": "active"}))


# ══════════════════════════════════════════════════
# 3. EVENTOS
# ══════════════════════════════════════════════════
header("3. Eventos")

r_event = check("POST /api/events/ (crear)",
    requests.post(f"{BASE_URL}/api/events/", headers=admin_headers, json={
        "title":       "Congreso de Prueba",
        "description": "Evento generado por test_api.py",
        "event_type":  "conference",
        "start_date":  "2025-09-01T09:00:00",
        "end_date":    "2025-09-01T18:00:00",
        "venue":       "Auditorio Principal",
        "capacity":    100
    }),
    expected_status=201
)

event_id = None
if r_event.status_code == 201:
    event_id = r_event.json().get("id") or r_event.json().get("_id")
    print(f"   → event_id: {event_id}")

check("GET /api/events/ (lista)",
    requests.get(f"{BASE_URL}/api/events/", headers=user_headers))

if event_id:
    check(f"GET /api/events/{event_id}",
        requests.get(f"{BASE_URL}/api/events/{event_id}", headers=user_headers))

    check(f"PATCH /api/events/{event_id}",
        requests.patch(f"{BASE_URL}/api/events/{event_id}", headers=admin_headers, json={
            "description": "Descripción actualizada"
        })
    )


# ══════════════════════════════════════════════════
# 4. SOLICITUDES
# ══════════════════════════════════════════════════
header("4. Solicitudes")

request_id = None
if event_id:
    r_req = check("POST /api/requests/ (crear solicitud)",
        requests.post(f"{BASE_URL}/api/requests/", headers=user_headers, json={
            "event_id": event_id
        }),
        expected_status=201
    )
    if r_req.status_code == 201:
        request_id = r_req.json().get("id")
        print(f"   → request_id: {request_id}")

check("GET /api/requests/me",
    requests.get(f"{BASE_URL}/api/requests/me", headers=user_headers))

if event_id:
    check(f"GET /api/requests/event/{event_id}",
        requests.get(f"{BASE_URL}/api/requests/event/{event_id}", headers=admin_headers))

if request_id:
    check(f"GET /api/requests/{request_id}",
        requests.get(f"{BASE_URL}/api/requests/{request_id}", headers=user_headers))

    check(f"PATCH /api/requests/{request_id}/review (aprobar)",
        requests.patch(f"{BASE_URL}/api/requests/{request_id}/review",
            headers=admin_headers,
            json={"status": "approved", "admin_message": "Aprobado en prueba automatica"}
        )
    )


# ══════════════════════════════════════════════════
# 5. ASISTENCIA
# ══════════════════════════════════════════════════
header("5. Asistencia")

attendance_id = None
if event_id:
    r_checkin = check("POST /api/attendance/check-in",
        requests.post(f"{BASE_URL}/api/attendance/check-in", headers=admin_headers, json={
            "event_id": event_id,
            "user_id": user_id,
            "method": "manual"
        }),
        expected_status=201
    )
    if r_checkin.status_code == 201:
        attendance_id = r_checkin.json().get("id")
        print(f"   → attendance_id: {attendance_id}")

    check(f"GET /api/attendance/event/{event_id}",
        requests.get(f"{BASE_URL}/api/attendance/event/{event_id}", headers=admin_headers))

    check(f"GET /api/attendance/qr/{event_id}/{user_id}",
        requests.get(f"{BASE_URL}/api/attendance/qr/{event_id}/{user_id}", headers=user_headers))

if attendance_id:
    check(f"POST /api/attendance/check-out/{attendance_id}",
        requests.post(f"{BASE_URL}/api/attendance/check-out/{attendance_id}",
            headers=user_headers))


# ══════════════════════════════════════════════════
# 6. DOCUMENTOS
# ══════════════════════════════════════════════════
header("6. Documentos")

doc_code = None
if event_id:
    r_doc = check("POST /api/documents/issue (emitir documento)",
        requests.post(f"{BASE_URL}/api/documents/issue", headers=admin_headers, params={
            "event_id": event_id,
            "user_id": user_id,
            "doc_type": "constancia"
        }),
        expected_status=201
    )
    if r_doc.status_code == 201:
        doc_code = r_doc.json().get("verification_code")
        doc_id   = r_doc.json().get("id")
        print(f"   → code: {doc_code}")

check("GET /api/documents/me",
    requests.get(f"{BASE_URL}/api/documents/me", headers=user_headers))

if event_id:
    check(f"GET /api/documents/event/{event_id}",
        requests.get(f"{BASE_URL}/api/documents/event/{event_id}", headers=admin_headers))

if doc_code:
    check(f"GET /api/documents/verify/{doc_code} (verificación pública)",
        requests.get(f"{BASE_URL}/api/documents/verify/{doc_code}"))

    check(f"GET /api/documents/pdf/{doc_code}",
        requests.get(f"{BASE_URL}/api/documents/pdf/{doc_code}", headers=user_headers))

if event_id:
    check(f"POST /api/documents/issue-batch/{event_id}",
        requests.post(f"{BASE_URL}/api/documents/issue-batch/{event_id}",
            headers=admin_headers),
        expected_status=201
    )


# ══════════════════════════════════════════════════
# 7. ESTADÍSTICAS
# ══════════════════════════════════════════════════
header("7. Estadísticas")

check("GET /api/stats/dashboard",
    requests.get(f"{BASE_URL}/api/stats/dashboard", headers=admin_headers))

if event_id:
    check(f"GET /api/stats/event/{event_id}",
        requests.get(f"{BASE_URL}/api/stats/event/{event_id}", headers=admin_headers))

    check(f"GET /api/stats/event/{event_id}/export/attendance",
        requests.get(f"{BASE_URL}/api/stats/event/{event_id}/export/attendance",
            headers=admin_headers))

    check(f"GET /api/stats/event/{event_id}/export/documents",
        requests.get(f"{BASE_URL}/api/stats/event/{event_id}/export/documents",
            headers=admin_headers))


# ══════════════════════════════════════════════════
# 8. ADMINISTRACIÓN
# ══════════════════════════════════════════════════
header("8. Administración")

check("GET /api/admin/config",
    requests.get(f"{BASE_URL}/api/admin/config", headers=admin_headers))

check("PATCH /api/admin/config",
    requests.patch(f"{BASE_URL}/api/admin/config", headers=admin_headers, json={
        "app_name": "Constancias Test"
    })
)


# ══════════════════════════════════════════════════
# LIMPIEZA — Cancelar solicitud y archivar evento
# ══════════════════════════════════════════════════
header("9. Limpieza")

if request_id:
    check(f"DELETE /api/requests/{request_id} (cancelar)",
        requests.delete(f"{BASE_URL}/api/requests/{request_id}", headers=user_headers))

if event_id:
    check(f"DELETE /api/events/{event_id} (archivar)",
        requests.delete(f"{BASE_URL}/api/events/{event_id}", headers=admin_headers))


# ══════════════════════════════════════════════════
# RESUMEN
# ══════════════════════════════════════════════════
total = passed + failed
print(f"\n{'═'*50}")
print(f"  Resultado: {passed}/{total} pruebas pasaron")
if failed:
    print(f"  {FAIL} {failed} fallaron{RESET}")
else:
    print(f"  {OK} ¡Todo en orden!{RESET}")
print(f"{'═'*50}\n")
