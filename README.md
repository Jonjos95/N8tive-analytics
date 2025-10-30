## N8tive Analytics Monorepo

This repository contains the prototype for N8tive Analytics, a real-time analytics web application within the broader N8tive.io suite. It is structured as a monorepo to support multiple apps with shared Single Sign-On (SSO) and UI components.

### Apps and Packages
- apps/
  - auth: OAuth2/JWT SSO microservice (FastAPI)
  - analytics-backend: Analytics service (FastAPI) with REST + WebSocket
  - analytics-web: React + Tailwind + Recharts frontend
- packages/
  - ui: Shared UI components (Navbar, Sidebar, Cards, Theme toggle)
  - shared: Shared types and utilities

### Key Features
- JWT-based SSO, reusable `auth` service
- Real-time KPI updates via WebSocket
- Interactive, customizable dashboard with draggable widgets
- Persistence with PostgreSQL (SQLite fallback for local dev)
- Export to CSV and PNG/PDF (client-side)
- Multi-tenant support (org-scoped data)

### Getting Started
1. Install Node.js (>=18) and Python (>=3.10).
2. Install dependencies (from repo root):
   - npm install
3. Environment variables:
   - Create `.env` files under each service as needed. See examples in service READMEs.
4. Run with Docker (recommended for full stack):
   - docker compose up --build

### Workspaces
This repo uses npm workspaces. Root `package.json` references `apps/*` and `packages/*`.

### Deployment
- Each service includes a `Dockerfile`. Use `docker compose` for local and staging.
- Suitable for AWS ECS, Kubernetes, or Vercel (frontend).

### License
Proprietary. © N8tive.io
