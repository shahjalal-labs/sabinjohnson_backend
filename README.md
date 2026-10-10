# 🚗 Sabin Johnson — On-Demand Ride-Hailing, Driver Dispatch & Delivery Mobility API

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
  <img src="https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socketdotio&logoColor=white" alt="Socket.io" />
  <img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Stripe-635BFF?style=for-the-badge&logo=stripe&logoColor=white" alt="Stripe" />
  <img src="https://img.shields.io/badge/Ride_Hailing-F59E0B?style=for-the-badge&logo=navigation&logoColor=white" alt="Ride_Hailing" />
  
</p>

---

## 📌 Executive Overview

**Sabin Johnson Backend** is a high-concurrency mobility and transportation dispatch engine. Engineered with **Node.js, TypeScript, Express, Socket.io, and Prisma ORM**, the platform orchestrates real-time ride-hailing and food/parcel delivery operations: **geolocated driver-rider matching**, dynamic fare calculation based on distance and route coordinates, **live driver telemetry tracking**, in-app Socket chat, in-app wallet balance, driver cash-out/withdrawal processing, and customer rating workflows.

---

## 🚀 Key Architectural & Domain Capabilities

- **Real-Time Ride Dispatch**: Socket.io bi-directional coordination matching nearby drivers with ride requests using coordinate distance heuristics.
- **Multi-Role Mobility Support**: Granular RBAC distinguishing passengers (`User`), vehicle operators (`Rider`), delivery couriers (`Food_Deliver`), and dispatch admins.
- **Vehicle Registry & Onboarding**: Vehicle documentation compliance tracking (license plates, registration certificates, inspection approval state machine).
- **Driver In-App Wallet & Cash-Out**: Automated fare distribution, driver earnings ledger, platform commission deduction, and withdrawal request payouts.
- **Live Passenger-Driver Communication**: Real-time Socket.io chat rooms (`Room`, `Message`) with read receipts and push notifications.

---

## 📬 API Documentation & Interactive Postman Collection

The complete REST API specification is published in our public Postman showcase workspace:

* 🌐 **Instant Live API Documentation**: [Explore sabinjohnson_backend in Postman (Instant Web View)](https://www.postman.com/shahjalal-backend-9458759/shahjalal-api-portfolio/collection/48491387-f7668bad-3211-430c-84c9-31c5f9205578)
* 📁 **Local Postman File**: [`docs/postman_collection.json`](./docs/postman_collection.json) (ready for Postman Desktop or Newman CLI).

### Core Endpoint Modules

| Module | Base Route | Key Capabilities |
|---|---|---|
| **Authentication** | `/api/v1/auth` | Passenger & driver onboarding, phone verification, JWT session rotation |
| **Ride Dispatch** | `/api/v1/ridesharing` | Request ride, accept dispatch, pickup/dropoff lifecycle, status updates |
| **Vehicles** | `/api/v1/vehicle` | Driver vehicle registration, license documentation, inspection status |
| **Wallet & Withdrawals** | `/api/v1/withdrawal` | Driver wallet balance, payout requests, bank ledger reconciliation |
| **Favorites / Labels** | `/api/v1/label` | Saved frequent addresses (Home, Work, Airport) with geo-coordinates |
| **Ratings & Reviews** | `/api/v1/rating` | Bidirectional passenger-driver post-ride rating and review feedback |
| **Chat & Rooms** | `/api/v1/room` | Real-time communication channel between active passenger and assigned rider |

---

## 📂 Project Architecture

```plaintext
sabinjohnson_backend/
├── assets/
│   └── banner.svg               # Architectural visual banner
├── docs/
│   └── postman_collection.json  # Full Postman API collection v2.1
├── src/
│   ├── app/
│   │   ├── middlewares/         # Global error handlers, auth & validation guards
│   │   ├── modules/             # Domain feature modules
│   │   └── routes/              # Centralized route registration
│   ├── config/                  # Environment & external service configurations
│   └── server.ts                # Application bootstrapper
├── prisma/
│   └── schema.prisma            # Prisma database schema definition
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

### 2. Configure Environment Variables
```bash
cp .env.example .env
```

### 3. Generate Prisma Client
```bash
npx prisma generate
```

### 4. Run Development Server
```bash
npm run dev
```

---

## 👨‍💻 Engineering & Authorship

Developed and engineered by **Md. Shahjalal**.

* **GitHub**: [@shahjalal-labs](https://github.com/shahjalal-labs)
* **Email**: [muhommodshahjalal@gmail.com](mailto:muhommodshahjalal@gmail.com)

---

## 📄 License

This project is licensed under the [ISC License](LICENSE).
