# PROMPT.md

Reusable prompt templates for agent workflows in this project.

## 1. Context Loader

Use this before planning or implementation.

```text
You are working in the ConstanciasFree repository.

First read:
- AGENTS.md
- SPEC.md
- BACKLOG.md
- specs/000-backend-existing-api-adaptation.md
- Any spec directly related to the requested feature

Then inspect the relevant files under app/.

Respect the real backend:
- FastAPI + MongoDB/Motor
- API prefix /api
- Routers: auth, users, events, requests, attendance, documents, stats, admin
- documents are the implemented certificate/constancia concept
- users.role is the implemented role mechanism

Return a short plan with files to edit, tests to run, and spec updates needed.
```

## 2. Spec To Code

Use this when converting an accepted spec or backlog item into implementation.

```text
Implement the selected task from BACKLOG.md using the accepted specs as the contract.

Workflow:
1. Quote the backlog item id and related spec file.
2. Inspect the current implementation before editing.
3. Update specs first if the implementation changes the contract.
4. Make the smallest code change that satisfies the acceptance criteria.
5. Add or update focused verification.
6. Run the relevant checks.
7. Update BACKLOG.md status and notes.

Do not introduce /api/v1, new required collections, or undocumented modules unless the task explicitly requires them.
```

## 3. API Contract Review

Use this before frontend or integration work.

```text
Review the API contract against the implemented FastAPI routers.

Inputs:
- app/main.py
- app/routers/*.py
- specs/004-api-contracts.md
- specs/frontend/api-client-contract.md

Find:
- Route path mismatches
- Method mismatches
- Request/response shape mismatches
- Auth or role mismatches
- Future features incorrectly described as existing behavior

Output findings first, then recommended spec or code updates.
```

## 4. Test Gap Finder

Use this when improving quality gates.

```text
Analyze test coverage for the selected backend flow.

Inputs:
- test_api.py
- specs/quality/tdd-quality-gates.md
- Relevant backend spec
- Relevant router/model/service files

List missing behavior checks, risky edge cases, setup data needs, and a minimal next test plan.
Prefer focused pytest/TestClient migration when it gives clearer feedback than the broad script.
```

## 5. Backlog Groomer

Use this after specs or code change.

```text
Update BACKLOG.md so another agent can continue.

Rules:
- Preserve completed items.
- Keep ids stable.
- Use statuses: todo, in_progress, blocked, done.
- Each item must include source, scope, acceptance, verification, and notes.
- If a discovered gap is not part of the current task, add it as todo instead of implementing it silently.
```

