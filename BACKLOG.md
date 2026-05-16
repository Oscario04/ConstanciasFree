# BACKLOG.md

Parseable backlog for agents. Keep item ids stable and update status as work changes.

Allowed statuses: `todo`, `in_progress`, `blocked`, `done`.

## Items

### BL-006 - Fullstack branch setup

- status: done
- source: Plan SDD Fullstack Con Rama Separada
- scope: git branch, repo root
- acceptance: Work happens on `feature/fullstack-stitch-mvp`.
- verification: `git branch --show-current` returns `feature/fullstack-stitch-mvp`.
- notes: Branch created from `main`.

### BL-007 - Backend contract and smoke alignment

- status: done
- source: `specs/004-api-contracts.md`, `specs/quality/tdd-quality-gates.md`
- scope: `test_api.py`, backend tests, API specs
- acceptance: Smoke script uses real payloads and backend routes remain under `/api`.
- verification: `python -m compileall app`; pytest contract checks; optional `python test_api.py` with running server.
- notes: Smoke script payloads aligned; pytest contract checks added.

### BL-008 - Frontend MVP scaffold and flows

- status: in_progress
- source: `DESIGN.md`, `specs/frontend/*`, Stitch `Gestion VisDeDat`
- scope: `frontend/`
- acceptance: React/Vite app implements public, user, admin and staff routes against the real API client.
- verification: `npm run typecheck`, `npm run test`, `npm run build`, Playwright smoke.
- notes: Frontend scaffold and MVP screens added; local Node/npm is missing, so frontend command verification is pending on a machine with Node installed.

### BL-010 - Frontend command verification

- status: done
- source: Plan SDD Fullstack Con Rama Separada
- scope: `frontend/`
- acceptance: `npm run typecheck`, `npm run test`, `npm run build` and `npm run e2e` run successfully.
- verification: Portable Node was used; `npm run typecheck`, `npm run test`, and `npm run build` passed.
- notes: Native shell still lacks global Node/npm, but the project validates with portable Node.

### BL-011 - Demo seed data

- status: done
- source: user request for demo data
- scope: `scripts/seed_demo.py`, MongoDB demo records
- acceptance: Seed creates representative users, events, requests, attendance and documents for each role.
- verification: Run `python scripts/seed_demo.py --reset-demo` and inspect public/user/admin/staff screens.
- notes: All demo records use `demo_seed: true`; password is `Demo1234!`.

### BL-009 - Fullstack traceability documentation

- status: done
- source: Plan SDD Fullstack Con Rama Separada
- scope: `specs/frontend/implementation-map.md`, `frontend/README.md`
- acceptance: Stitch screens map to frontend routes, backend endpoints, specs and tests.
- verification: Files exist and reference real `/api` endpoints.
- notes: Keep updated as screens evolve.

### BL-001 - Keep backend specs aligned with real API

- status: todo
- source: `specs/000-backend-existing-api-adaptation.md`
- scope: `specs/`, `app/main.py`, `app/routers/`
- acceptance: Specs use `/api` paths and describe implemented routers, collections, roles, and document behavior accurately.
- verification: Compare specs against `app/main.py` and router files; record mismatches as backlog items.
- notes: Do not treat `ai-specs-constancias/` as current contract.

### BL-002 - Verify API contract for frontend client

- status: todo
- source: `specs/frontend/api-client-contract.md`
- scope: `specs/004-api-contracts.md`, `specs/frontend/api-client-contract.md`, `app/routers/`
- acceptance: Frontend contract matches actual backend methods, paths, auth requirements, and payload shapes.
- verification: Run an API contract review using `PROMPT.md` template 3.
- notes: Important before implementing React/TypeScript client code.

### BL-003 - Improve focused backend test strategy

- status: todo
- source: `specs/quality/tdd-quality-gates.md`
- scope: `test_api.py`, future pytest/TestClient tests
- acceptance: Critical flows have focused tests or a documented migration plan from broad script checks.
- verification: Run `python test_api.py` for broad smoke coverage when the server is available; add focused checks for changed behavior.
- notes: Existing script requires a running server at `http://127.0.0.1:8000`.

### BL-004 - Track future-only domain concepts explicitly

- status: todo
- source: `ai-specs-constancias/`, `specs/000-backend-existing-api-adaptation.md`
- scope: `specs/`, future implementation tasks
- acceptance: Concepts not implemented today, such as separate `Role`, `Venue`, `Template`, `Notification`, `AuditLog`, and `PublicVerification` collections, are clearly labeled as future work.
- verification: Search specs for these concepts and confirm they are not described as mandatory current backend behavior.
- notes: Prevents agents from creating frontend/backend assumptions that do not exist.

### BL-005 - Maintain agent workflow files

- status: done
- source: user request on 2026-05-16
- scope: `AGENTS.md`, `SPEC.md`, `PROMPT.md`, `BACKLOG.md`
- acceptance: Root-level agent files exist and reflect project-specific backend/spec logic.
- verification: Confirm files are present and readable at repo root.
- notes: Created as persistent coordination docs for future agent work.
