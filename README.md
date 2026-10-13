<div align="center">

# 🚨 RescueChain

### Cloud-Based Emergency Supply Chain Management System

**Find critical medical supplies faster. Connect people with nearby suppliers. Coordinate reservations when every minute matters.**

[![React](https://img.shields.io/badge/React-Vite-149ECA?logo=react&logoColor=white)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)
[![Jenkins](https://img.shields.io/badge/Jenkins-CI%2FCD-D24939?logo=jenkins&logoColor=white)](https://www.jenkins.io/)

[Overview](#-overview) · [Architecture](ARCHITECTURE.md) · [Features](#-features) · [Quick Start](#-getting-started) · [API](#-api-overview) · [DevOps](#-devops--cicd) · [Roadmap](#-roadmap)

</div>

---

## 🌍 Overview

**RescueChain** is a full-stack, microservices-oriented emergency supply chain platform that helps users discover nearby suppliers of essential medical resources—such as **oxygen cylinders, blood, and medicines**—and reserve available inventory for pickup or delivery.

The system brings together three roles:

- **Users** search nearby inventory, reserve supplies, track requests, and apply to become suppliers.
- **Suppliers** manage stock and view incoming reservations.
- **Administrators** review supplier applications, manage users, audit activity, and oversee inventory.

The project also serves as a hands-on **DevOps engineering platform**, with containerized services, Jenkins continuous integration, and security quality gates.

> **Project status:** Core application and Dockerized development environment are implemented. Production readiness, Jenkins foundations, continuous integration, and the SonarQube/Trivy security phase are reported complete. Automated deployment, notifications, and monitoring remain planned. This is a project demonstration, not a certified emergency-response service.

## ✨ Features

| Area | Capabilities |
| --- | --- |
| 🔐 Authentication | Registration, login, JWT authentication, role-based protected routes |
| 📍 Discovery | Find nearby suppliers by item, required quantity, and geographic coordinates |
| 📦 Inventory | Suppliers add items, view inventory, and update stock |
| 🛒 Reservations | Atomic stock decrement; pickup and delivery reservation flows |
| ⏱️ Expiration | Pickup reservations expire after 15 minutes; expired stock is restored by a background worker |
| 🚚 Delivery | One-minute cancellation window, followed by delayed auto-confirmation using a Bull job |
| 🏥 Supplier onboarding | Application and administrator approval/rejection workflow |
| 🛡️ Administration | User management, block/unblock, inventory oversight, low-stock views, activity logs |
| 🐳 Containers | Multi-stage Docker builds, Nginx-served frontend, Docker Compose |
| ⚙️ CI/CD | Jenkins controller and dedicated agent; checkout, dependency installation, and build stages established |

### Reservation lifecycle

```mermaid
flowchart TD
    A[Search nearby supplies] --> B[Select supplier and quantity]
    B --> C{Stock available?}
    C -- No --> D[Choose another supplier]
    C -- Yes --> E[Reserve and decrement stock atomically]
    E --> F{Request type}
    F -- Pickup --> G[15-minute pickup window]
    G --> H{Completed in time?}
    H -- Yes --> I[Completed]
    H -- No --> J[Cancel and restore stock]
    F -- Delivery --> K[1-minute cancellation window]
    K --> L{Cancelled in window?}
    L -- Yes --> J
    L -- No --> M[Auto-confirm delivery]
```

> Delivery auto-confirmation is a workflow state transition; it does not imply that physical delivery or courier tracking has been completed.

## 🏗️ Architecture

RescueChain separates the React frontend, authentication/administration service, and inventory/reservation service. Each backend service uses its own PostgreSQL database; Redis supports asynchronous reservation processing.

```mermaid
flowchart LR
    Client[React / Nginx] --> Auth[Auth API :5000]
    Client --> Inventory[Inventory API :4000]
    Auth --> AuthDB[(Auth PostgreSQL)]
    Inventory --> InventoryDB[(Inventory PostgreSQL)]
    Inventory --> Redis[(Redis / Bull)]
```

For service responsibilities, data ownership, reservation state transitions, concurrency, failure modes, and infrastructure diagrams, see **[ARCHITECTURE.md](ARCHITECTURE.md)**.

### Technology stack

| Layer | Technologies |
| --- | --- |
| Frontend | React, Vite, JavaScript, Zustand, Axios, CSS |
| Backend | Node.js, Express.js, REST APIs, Zod |
| Identity & security | JWT, bcrypt, Helmet, CORS, role-based authorization |
| Database | PostgreSQL (Neon), Prisma 5 |
| Background processing | Redis, Bull, scheduled reservation-expiry worker |
| Containers | Docker, Docker Compose, Nginx |
| CI/CD | Jenkins controller, dedicated Jenkins agent, Git, Docker CLI |
| Quality & security (Phases 2–3) | Unit tests, SonarQube, quality gates, Trivy |
| Planned operations | SSH deployment, health verification, rollback, Prometheus, Grafana, Loki |

## 🗂️ Project structure

The following is a **high-level** structure; filenames and paths may vary with the current branch.

```text
RescueChain/
├── frontend/                    # React + Vite application
│   ├── src/
│   ├── Dockerfile
│   └── nginx.conf
├── services/
│   ├── auth-service/
│   │   ├── prisma/
│   │   ├── src/
│   │   ├── index.js
│   │   └── server.js
│   └── inventory-service/
│       ├── prisma/
│       ├── src/
│       ├── index.js
│       └── server.js
├── docker/
│   └── jenkins/
│       ├── agents/
│       │   └── Dockerfile
│       └── docker-compose.yml
├── Jenkinsfile
├── docker-compose.yml
├── README.md
└── ARCHITECTURE.md
```

## 🚀 Getting started

### Prerequisites

- Git
- Docker Engine + Docker Compose plugin
- Two PostgreSQL databases (for example, Neon)
- Environment variables for JWT, database access, and Redis/Bull as required by the service configuration

### 1. Clone

```bash
git clone https://github.com/RudraSingh05/RescueChain.git
cd RescueChain
```

### 2. Configure environment variables

Create local environment files **in the paths expected by your Compose and service configuration**. The following is a reference checklist, **not a guaranteed drop-in `.env` schema**:

```dotenv
# Auth service
DATABASE_URL=postgresql://USER:PASSWORD@HOST/auth_db?sslmode=require
JWT_SECRET=replace-with-a-long-random-secret

# Inventory service: use its own database connection
# DATABASE_URL=postgresql://USER:PASSWORD@HOST/inventory_db?sslmode=require

# Redis connection: use the hostname/network configured in Compose
# REDIS_HOST=redis
# REDIS_PORT=6379
```

The two services require **different `DATABASE_URL` values**. Check their actual environment-variable names and Compose `env_file`/`environment` declarations before starting.

**Never commit** `.env` files, Neon credentials, JWT secrets, Jenkins agent secrets, or Docker registry tokens. Provide a sanitized `.env.example` for collaborators.

### 3. Start the stack

From the directory containing the application's Compose file:

```bash
docker compose up --build -d
docker compose ps
```

Expected local service ports from the current setup:

| Service | Port |
| --- | --- |
| Frontend (Nginx) | `80` |
| Auth API | `5000` |
| Inventory API | `4000` |
| Redis | `6379` (internal access recommended) |

Visit **http://localhost** for the frontend when port 80 is published on the host.

Useful commands:

```bash
docker compose logs -f
docker compose ps
docker compose down
```

> **Database setup:** Run the appropriate Prisma migration/deployment commands for each service before using a new database (for example, `npx prisma migrate deploy` where migrations exist). Do not use `prisma migrate reset` against data you need to preserve.

## 🔌 API overview

The table summarizes implemented routes discussed in the project. Confirm the router mount paths, request bodies, and response contracts against source code before treating this as a complete API specification.

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/inventory/suppliers/nearest` | Find nearby suppliers by item, quantity, latitude, longitude |
| `POST` | `/inventory/reserve` | Reserve inventory for pickup or delivery |
| `GET` | `/inventory/my` | Get current user's reservations |
| `GET` | `/inventory/supplier/reservations` | View reservations received by a supplier |
| `POST` | `/inventory/add` | Add a supplier inventory item |
| `PATCH` | `/inventory/update` | Update supplier stock |
| `GET` | `/inventory/my` | Supplier inventory view (route/context should be verified) |

Example supplier lookup:

```bash
curl 'http://localhost:4000/inventory/suppliers/nearest?itemName=oxygen&quantity=1&lat=26.4499&lon=80.3319'
```

Authenticated endpoints require a valid JWT, typically:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

Auth service includes registration, login, supplier application review, administrative user management, and activity logs. Exact public route paths should be documented after checking the source routers.

## 🔄 DevOps & CI/CD

RescueChain is being extended into an end-to-end DevOps portfolio project. The objective is to **build, validate, scan, publish, deploy, and observe** independently containerized services.

### CI and security workflow (Phases 0–3)

```mermaid
flowchart TD
    A[GitHub repository] --> B[Jenkins controller and agent]
    B --> C[Checkout source]
    C --> D[Install dependencies]
    D --> E[ESLint and unit tests]
    E --> F[Application build]
    F --> G[Docker image build]
    G --> H[Docker image push]
    H --> I[SonarQube analysis]
    I --> J{Quality gate passes?}
    J -- No --> K[Fail pipeline]
    J -- Yes --> L[Trivy scan]
    L --> M[Security-validated artifact]
    M -. Phase 4: planned .-> N[SSH / Compose deployment]
    N -. planned .-> O[Health check and rollback]
    O -. Phases 5–6: planned .-> P[Notifications and monitoring]
```


> This is a **logical workflow**, not a verified stage-by-stage reproduction of the current `Jenkinsfile`. The exact order of Docker push and security checks should follow the repository's pipeline configuration.

### Milestone status

| Phase | Scope | Status |
| --- | --- | --- |
| **0 — Production readiness** | Multi-stage Dockerfiles, Nginx serving the Vite build, health endpoints, Compose improvements, `.dockerignore`, ESLint, Prettier | ✅ Complete |
| **1 — Jenkins** | Dockerized Jenkins, agents, credentials, pipelines, parameters, shared libraries; Blue Ocean optional | ✅ Complete (per project update) |
| **2 — Continuous integration** | Checkout → Install → ESLint → Unit Tests → Build → Docker Build → Docker Push | ✅ Complete (per project update) |
| **3 — Security** | SonarQube → Quality Gate → Trivy | ✅ Complete (per project update) |
| **4 — Deployment** | SSH → `docker compose pull` → Rolling Restart → Health Check → Rollback | ⏳ Planned |
| **5 — Notifications** | Slack/Discord alerts for builds and deployments | ⏳ Planned |
| **6 — Monitoring** | Prometheus, Grafana, Node Exporter, cAdvisor, Loki, Promtail | ⏳ Planned |

### Jenkins CI and security

The project has progressed through **Phase 3**, including automated build workflows and security tooling. Its planned end-to-end DevOps lifecycle is to promote successfully built and security-validated container images into a deployment environment, followed by health verification, alerting, and observability.

**Quality and security tooling:**

- **ESLint and Prettier:** JavaScript linting and consistent formatting.
- **Unit tests:** Test execution as part of the CI milestone.
- **Docker:** Repeatable, containerized application builds.
- **SonarQube:** Static code analysis and maintainability/security findings.
- **Quality Gate:** Pipeline-level acceptance criteria for code quality.
- **Trivy:** Container and dependency vulnerability scanning.

> Exact quality thresholds, scan severity policies, registry naming, and image tags depend on your Jenkins and SonarQube configuration. Add them here once verified rather than publishing invented metrics.

### Security and operations principles

- Store sensitive values in **Jenkins Credentials** or appropriately protected environment injection, not in source-controlled pipeline definitions.
- Use immutable, versioned container image tags instead of relying only on `latest`.
- Run automated tests and quality gates before publishing images.
- Scan dependencies and container images before promotion.
- Verify application health after deployment and define a rollback procedure.
- Prefer private/internal Redis networking; avoid exposing databases and queue infrastructure publicly.

## 🗺️ Roadmap

- [x] **Phase 0 — Production readiness:** multi-stage Dockerfiles, Nginx, health endpoints, Compose, `.dockerignore`, ESLint, Prettier
- [x] **Phase 1 — Jenkins:** controller, agents, credentials, pipelines, parameters, shared libraries (Blue Ocean optional)
- [x] **Phase 2 — CI:** checkout, dependency installation, lint, unit tests, build, Docker build and push
- [x] **Phase 3 — Security:** SonarQube analysis, quality gate, Trivy scanning
- [ ] **Phase 4 — Deployment:** SSH, `docker compose pull`, rolling restart, health checks, rollback
- [ ] **Phase 5 — Notifications:** Slack or Discord for build started/failed and deployment succeeded/failed
- [ ] **Phase 6 — Monitoring:** Prometheus, Grafana, Node Exporter, cAdvisor, Loki, Promtail

**Current focus: Phase 4 — automated deployment.** The deployment workflow is a planned milestone, not yet claimed as implemented.

**Potential product enhancements:** WebSocket-driven inventory updates, richer delivery tracking, supplier reliability insights, and improved automated test coverage.

## 📐 Technical documentation

- **[ARCHITECTURE.md](ARCHITECTURE.md)** — service boundaries, component diagrams, data models, request flows, asynchronous jobs, concurrency controls, security boundaries, and deployment considerations.

## 🧠 Engineering challenges

**Preventing overbooking:** Inventory reservations use atomic stock changes so simultaneous requests cannot independently claim the same available quantity.

**Managing time-bound reservations:** A background worker cancels expired pickup reservations and restores stock; delivery reservations use delayed queue processing for automatic confirmation.

**Separating service ownership:** Authentication and inventory maintain their own data stores and responsibilities, reducing tight coupling between unrelated workflows.

**Building reliable CI:** A dedicated Jenkins agent isolates build tooling from the controller, while Docker-based builds help produce repeatable artifacts across environments.

<!-- ## 📸 Screenshots and demo

Add verified screenshots or recordings from your running application here:

- User dashboard and nearest-supplier search
- Reservation flow
- Supplier inventory dashboard
- Admin approval and audit views
- Successful Jenkins pipeline execution -->

<!-- Example once assets exist:
![User dashboard](docs/screenshots/user-dashboard.png)
-->

## 🤝 Contributing

Contributions and suggestions are welcome. Open an issue describing the proposed change, then submit a focused pull request with testing notes. Do not include credentials, personal medical information, or real emergency-request data in issues or screenshots.

## 👨‍💻 Author

**Rudra Pratap Singh**  
GitHub: [@RudraSingh05](https://github.com/RudraSingh05)

---

<div align="center">

**RescueChain — Building more accessible, coordinated emergency supply chains.**

*Developed as a full-stack engineering and DevOps learning project.*

</div>
