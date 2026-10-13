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

[Overview](#-overview) · [Architecture](#-architecture) · [Features](#-features) · [Quick Start](#-getting-started) · [API](#-api-overview) · [DevOps](#-devops--cicd) · [Roadmap](#-roadmap)

</div>

---

## 🌍 Overview

**RescueChain** is a full-stack, microservices-oriented emergency supply chain platform that helps users discover nearby suppliers of essential medical resources—such as **oxygen cylinders, blood, and medicines**—and reserve available inventory for pickup or delivery.

The system brings together three roles:

- **Users** search nearby inventory, reserve supplies, track requests, and apply to become suppliers.
- **Suppliers** manage stock and view incoming reservations.
- **Administrators** review supplier applications, manage users, audit activity, and oversee inventory.

The project also serves as a hands-on **DevOps engineering platform**, with containerized services and a progressively developed Jenkins CI/CD pipeline.

> **Project status:** Core application and Dockerized development environment are implemented. Jenkins-based CI is in progress; security scanning, automated deployment, notifications, and observability are roadmap items. This is a project demonstration, not a certified emergency-response service.

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

```mermaid
flowchart TB
    U[User / Supplier / Admin] --> F[React + Vite frontend\nNginx container]
    F -->|JWT / REST| A[Auth Service\nNode.js + Express :5000]
    F -->|JWT / REST| I[Inventory Service\nNode.js + Express :4000]
    A --> PA[(Neon PostgreSQL\nauth_db)]
    I --> PI[(Neon PostgreSQL\ninventory_db)]
    I --> R[(Redis)]
    R --> Q[Bull delayed delivery jobs]
    I --> W[Reservation expiry worker]
    subgraph Local infrastructure
      F
      A
      I
      R
      Q
      W
    end
```

**Design decisions**

- **Service separation:** Authentication/administration and inventory/reservations have independent Express services and PostgreSQL databases.
- **Prisma ORM:** Database access and schema management are handled per service.
- **JWT-based access:** Role-aware frontend routing and authenticated API calls.
- **Atomic reservations:** Stock is decremented atomically to reduce overbooking under concurrent demand.
- **Asynchronous workflows:** Redis/Bull supports delayed delivery confirmation; a periodic worker expires uncollected pickup reservations.
- **Deployment-ready frontend:** Vite produces static assets served by Nginx rather than running the development server in the production image.

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
| Planned quality & security | Unit tests, SonarQube, quality gates, Trivy |
| Planned operations | SSH deployment, health verification, rollback, Prometheus, Grafana, Loki |

## 🗂️ Project structure

The following is a **high-level** structure; filenames and paths may vary with the current branch.

```text
RescueChain/
├── frontend/                    # React + Vite application (verify folder name)
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
│       └── docker-compose.yml
└── docker-compose.yml          # Confirm actual Compose location
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

### CI/CD target architecture

```mermaid
flowchart LR
    G[GitHub push] --> J[Jenkins pipeline]
    J --> C[Checkout]
    C --> N[Install dependencies]
    N --> L[Lint + unit tests]
    L --> B[Application build]
    B --> DB[Docker image build]
    DB --> S[SonarQube + Trivy]
    S --> P[Registry push]
    P --> D[Deployment]
    D --> H[Health checks]
    H --> O[Observability]
```

**Diagram shows the target pipeline, not the current implemented pipeline.**

<!-- ### Current CI progress

| Stage / capability | Status |
| --- | --- |
| Multi-stage Dockerfiles, Nginx, health endpoints | ✅ Completed |
| Docker Compose and `.dockerignore` improvements | ✅ Completed |
| ESLint and Prettier configuration | ✅ Configured |
| Jenkins in Docker | ✅ Completed |
| Dedicated Jenkins agent with Git, Node/npm, Docker CLI | ✅ Completed |
| Jenkins checkout, install, application build | ✅ Completed |
| Jenkins Docker image build | 🚧 In progress |
| Jenkins credentials and Docker registry push | ⏳ Planned |
| Automated unit tests and enforced lint gate | ⏳ Planned |
| SonarQube, Trivy, deployment, alerts, monitoring | ⏳ Planned | -->

### Security and operations principles

- Store sensitive values in **Jenkins Credentials** or appropriately protected environment injection, not in source-controlled pipeline definitions.
- Use immutable, versioned container image tags instead of relying only on `latest`.
- Run automated tests and quality gates before publishing images.
- Scan dependencies and container images before promotion.
- Verify application health after deployment and define a rollback procedure.
- Prefer private/internal Redis networking; avoid exposing databases and queue infrastructure publicly.

<!-- ## 🗺️ Roadmap

- [x] **Phase 0 — Production readiness:** multi-stage builds, Nginx, health checks, Compose, lint/format configuration
- [ ] **Phase 1 — Jenkins foundations:** controller and agent completed; credentials, parameters, shared libraries remaining
- [ ] **Phase 2 — Continuous integration:** checkout/install/build working; Docker build/push, tests, enforced lint pending
- [ ] **Phase 3 — Security:** SonarQube, quality gates, Trivy
- [ ] **Phase 4 — Deployment:** SSH deployment, Compose image pulls, controlled restarts, health checks, rollback
- [ ] **Phase 5 — Notifications:** Slack or Discord pipeline notifications
- [ ] **Phase 6 — Monitoring:** Prometheus, Grafana, Node Exporter, cAdvisor, Loki, Promtail

**Potential product enhancements:** WebSocket-driven inventory updates, richer delivery tracking, supplier reliability insights, and improved automated test coverage. -->

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
