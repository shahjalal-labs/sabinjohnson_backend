# 👥 Sabin Johnson — Enterprise HR, Payroll & Staff Management API

![Architecture Banner](./assets/banner.svg)

<p align="center">
  <a href="https://www.postman.com/shahjalal-backend-9458759/shahjalal-api-portfolio/collection/48491387-f7668bad-3211-430c-84c9-31c5f9205578" target="_blank">
    <img src="https://run.pstmn.io/button.svg" alt="View in Postman" />
  </a>
  <a href="https://www.postman.com/shahjalal-backend-9458759/shahjalal-api-portfolio/collection/48491387-f7668bad-3211-430c-84c9-31c5f9205578" target="_blank">
    <img src="https://img.shields.io/badge/Postman-Instant_Live_API_Docs-FF6C37?style=for-the-badge&logo=postman&logoColor=white" alt="Live API Documentation" />
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/JWT_Auth-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" alt="JWT_Auth" />
  <img src="https://img.shields.io/badge/HRMS-A855F7?style=for-the-badge&logo=users&logoColor=white" alt="HRMS" />
  
</p>

---

## 📌 Executive Overview

Sabin Johnson is a centralized corporate Human Resource Management System (HRMS) backend. It automates employee lifecycle workflows, departmental hierarchies, leave balance tracking, performance appraisals, and automated payroll computations.

---

## 🚀 Key Architectural Highlights

- **Employee Lifecycle**: Onboarding, profile management, contract tracking, and offboarding workflows.
- **Leave Management**: Automated leave balance accrual, multi-tier manager approval chains, and holiday calendars.
- **Payroll Engine**: Configurable salary components, tax deductions, bonuses, and payslip generation.
- **Performance Reviews**: KPI goal setting, 360-degree peer reviews, and rating analytics.
- **Enterprise Security**: Granular RBAC (SuperAdmin, HR Manager, Department Lead, Employee).

---

## 📬 API Documentation & Interactive Postman Collection

The complete REST API specification is published in our public Postman showcase workspace:

* 🌐 **Instant Live API Documentation**: [Explore sabinjohnson_backend in Postman (Instant Web View)](https://www.postman.com/shahjalal-backend-9458759/shahjalal-api-portfolio/collection/48491387-f7668bad-3211-430c-84c9-31c5f9205578)
* 📁 **Local Postman File**: [`docs/postman_collection.json`](./docs/postman_collection.json) (import directly into Postman Desktop or Newman CLI).

### Core Endpoint Modules

| Module | Base Route | Key Capabilities |
|---|---|---|
| **Authentication** | `/api/v1/auth` | Corporate SSO / JWT login with department permission guards |
| **Employees** | `/api/v1/employee` | Staff directory, organizational tree, job designations |
| **Attendance & Leave** | `/api/v1/leave` | Leave requests, manager approvals, time-off balances |
| **Payroll** | `/api/v1/payroll` | Salary calculation, deductions, monthly disbursement logs |
| **Departments** | `/api/v1/department` | Corporate divisions, cost centers, and branch offices |

---

## 📂 Project Architecture

```plaintext
sabinjohnson_backend/
├── assets/
│   └── banner.*                 # Project architecture visual banner
├── docs/
│   └── postman_collection.json  # Full Postman API collection v2.1
├── src/
│   ├── app/
│   │   ├── middlewares/         # Global error handlers, auth & validation guards
│   │   ├── modules/             # Domain-driven feature modules
│   │   └── routes/              # Centralized route aggregator
│   ├── config/                  # Environment & external service configurations
│   └── server.ts                # Application bootstrapper & HTTP server
├── prisma/
│   └── schema.prisma            # Database schema definition
├── .env.example                 # Sanitized environment template
├── package.json
└── tsconfig.json
```

---

## 🛠️ Quickstart & Local Setup

### Prerequisites
* **Node.js**: `v20.x` or higher
* **Database**: MongoDB or PostgreSQL (as specified in `schema.prisma`)

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/shahjalal-labs/sabinjohnson_backend.git
cd sabinjohnson_backend
npm install
```

### 2. Environment Configuration
Copy the provided `.env.example` file to create your local `.env`:
```bash
cp .env.example .env
```

### 3. Initialize Prisma Client
```bash
npx prisma generate
```

### 4. Run Development Server
```bash
npm run dev
```

---

## 👨‍💻 Engineering & Authorship

Developed and maintained by **Md. Shahjalal**.

* **GitHub**: [@shahjalal-labs](https://github.com/shahjalal-labs)
* **Email**: [muhommodshahjalal@gmail.com](mailto:muhommodshahjalal@gmail.com)

---

## 📄 License

This project is licensed under the [ISC License](LICENSE).
