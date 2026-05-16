# AGENTS.md

Persistent instructions for AI agents working in this repository.

## Project Snapshot

This project is a FastAPI backend for a platform that manages events, attendance, requests, and verifiable constancias/reconocimientos.

- Runtime: Python + FastAPI.
- Database: MongoDB through Motor.
- Auth: JWT Bearer, OAuth2 password login.
- API base path: `/api`.
- Main app: `app/main.py`.
- Routers: `app/routers/`.
- Models: `app/models/`.
- Services: `app/services/`.
- Current specs: `specs/`.
- Prompt source material: `ai-specs-constancias/`.

## Source Of Truth

Read `specs/000-backend-existing-api-adaptation.md` before making implementation or spec decisions. It explains how the original prompt set maps to the backend that actually exists.

The current contract is the implemented backend plus the files under `specs/`. Files under `ai-specs-constancias/` are useful source material for future phases, but they are not the current implementation contract.

## Backend Guardrails

- Use `/api`, not `/api/v1`.
- Keep routes aligned with the existing routers: `auth`, `users`, `events`, `requests`, `attendance`, `documents`, `stats`, and `admin`.
- Do not introduce required collections that are not implemented unless the task explicitly creates that feature.
- Treat roles as values on `users.role`, not as a separate `Role` collection.
- Treat certificates as `documents`.
- Treat event sessions as embedded data under `events.sessions`.
- Keep public verification aligned with `GET /api/documents/verify/{code}`.
- Preserve current `HTTPException.detail` error style unless a spec explicitly changes the error contract.

## Coding Standards

- Follow existing file and naming patterns before introducing new abstractions.
- Keep changes scoped to the requested feature or bug.
- Prefer Pydantic models and existing schemas over ad hoc dictionaries for API boundaries.
- Keep async database access consistent with Motor patterns already used in the routers.
- Do not commit secrets, local `.env` values, generated files, virtual environments, or cache folders.
- Use clear Spanish domain terms when the existing code or specs already use them; use English for Python identifiers when the surrounding code does.

## Verification

Use the narrowest verification that proves the change:

- For backend behavior, start the API and run `python test_api.py` when the change touches end-to-end API flows.
- For focused changes, add or migrate tests toward pytest/TestClient when practical.
- For spec-only changes, verify links, endpoint names, route prefixes, and terminology against `app/main.py`, routers, and existing specs.

## Working Agreement

Before implementing:

1. Read the relevant spec in `specs/`.
2. Inspect the existing code path.
3. Update the spec first when behavior or contracts change.
4. Update `BACKLOG.md` task status when a task is started or finished.
5. Record important decisions in `SPEC.md` when they affect future agent work.

