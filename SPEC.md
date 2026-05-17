# SPEC.md

Shared contract for humans and AI agents working on this project.

## Outcomes

- Keep the FastAPI backend documented and aligned with the actual implementation.
- Provide a reliable path from specs to tasks to implementation.
- Support future frontend work against the real API contract under `/api`.
- Make each agent handoff explicit enough that another agent can continue without rediscovering project rules.

## Scope

In scope:

- Backend maintenance for `app/`.
- API contract and domain documentation under `specs/`.
- Frontend planning against `specs/frontend/`.
- Testing and quality gates under `specs/quality/`.
- Agent workflows through `AGENTS.md`, `PROMPT.md`, `SPEC.md`, and `BACKLOG.md`.

Out of scope unless explicitly requested:

- Replacing the existing backend architecture.
- Introducing `/api/v1` versioning.
- Adding unimplemented collections as mandatory current behavior.
- Treating `ai-specs-constancias/` as implementation truth.
- Large refactors unrelated to an active task.

## Constraints

- Current API prefix is `/api`.
- Current backend is FastAPI + Motor + MongoDB.
- Current auth is JWT Bearer using OAuth2 password login.
- Existing route groups are `auth`, `users`, `events`, `requests`, `attendance`, `documents`, `stats`, and `admin`.
- Existing main verification script is `test_api.py`.
- Specs must describe current behavior or label gaps as future work.
- New work should preserve compatibility with the current frontend specs unless the task updates those specs first.

## Decisions

- `specs/000-backend-existing-api-adaptation.md` is the entry point for understanding the project contract.
- `specs/004-api-contracts.md` is the API reference layer and must use real `/api` paths.
- `documents` is the implemented certificate/constancia concept.
- `users.role` is the implemented authorization role mechanism.
- EARS-style acceptance criteria are preferred for requirements that need testing.
- `BACKLOG.md` is the canonical parseable task list for agents.
- The friendly frontend product name is `Constancias Claras`; backend/API naming can remain ConstanciasFree where already implemented.

## Tasks

Use `BACKLOG.md` for active task state. Keep this section for high-level workstreams:

- Maintain backend specs against the real API.
- Gradually migrate broad script testing toward focused automated tests.
- Build frontend features only against `specs/frontend/api-client-contract.md`.
- Track implementation gaps as backlog items instead of silently assuming they exist.

## Verification Criteria

A change is complete when:

- Relevant specs and code agree on route paths, models, roles, and side effects.
- Any changed behavior has a runnable verification path.
- `test_api.py` or a focused test is updated when the API contract changes.
- New backlog items include owner, status, source, and verification notes.
- No new secrets, virtualenv files, cache files, or generated artifacts are introduced.
