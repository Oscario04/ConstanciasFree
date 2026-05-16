from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


def read(path: str) -> str:
    return (ROOT / path).read_text(encoding="utf-8")


def test_backend_uses_api_prefix_not_api_v1():
    main = read("app/main.py")
    assert 'prefix="/api/auth"' in main
    assert "/api/v1" not in main


def test_event_contract_uses_event_type_and_venue():
    model = read("app/models/event.py")
    smoke = read("test_api.py")
    assert "event_type: EventType" in model
    assert "venue:" in model
    assert '"event_type":  "conference"' in smoke
    assert '"venue":       "Auditorio Principal"' in smoke
    assert '"location"' not in smoke


def test_review_and_document_smoke_payloads_match_router_contracts():
    smoke = read("test_api.py")
    documents_router = read("app/routers/documents.py")
    requests_router = read("app/routers/requests.py")
    assert "admin_message" in requests_router
    assert '"admin_message": "Aprobado en prueba automatica"' in smoke
    assert "event_id: str" in documents_router
    assert "user_id: str" in documents_router
    assert "doc_type: DocumentType" in documents_router
    assert 'params={\n            "event_id": event_id,' in smoke

