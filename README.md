<div align="center">

# 🍱 NoFoodWaste

### An Intelligent Food Donation & Redistribution Platform

*Connecting surplus food donors with hunger spots across Chennai — in real time.*

[![Node.js](https://img.shields.io/badge/Node.js-v20+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose_v8-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongoosejs.com)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-v4-010101?style=for-the-badge&logo=socket.io)](https://socket.io)
[![Apache Kafka](https://img.shields.io/badge/Apache_Kafka-3.7-231F20?style=for-the-badge&logo=apachekafka)](https://kafka.apache.org)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://docker.com)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Core Problem Statement](#-core-problem-statement)
- [Key Features](#-key-features)
- [System Architecture](#-system-architecture)
- [Tech Stack](#-tech-stack)
- [User Roles](#-user-roles)
- [Donation Lifecycle](#-donation-lifecycle)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
- [Real-Time Events](#-real-time-events-socketio)
- [Kafka Architecture](#-kafka-architecture)
- [Database Schema Overview](#-database-schema-overview)

---

## 🌟 Overview

**NoFoodWaste** is a full-stack, production-ready platform built for an NGO based in Chennai, India. It automates the entire food donation pipeline — from an IVR phone call made by a donor to the verified delivery of food at a registered hunger spot (shelters, orphanages, community kitchens).

The system uses **real-time WebSocket communication**, **geospatial driver matching**, **ETA-based feasibility checks** against FSSAI food safety windows, and an **Apache Kafka message bus** for high-throughput driver location tracking.

---

## 🚨 Core Problem Statement

NGOs managing food redistribution face three critical challenges:

| Problem | Impact |
|---|---|
| **High call volume** | Employees overwhelmed; no automated triage |
| **The Golden Time Window** | Cooked food is safe for only ~4 hours (FSSAI regulation); delays cause wastage |
| **No data analytics** | No visibility into donation trends, driver performance, or spot utilization |

NoFoodWaste solves all three with automated IVR intake, ETA-gated verification, and a data-rich admin dashboard.

---

## ✨ Key Features

- 📞 **Exotel IVR Integration** — Donors call a number; the system automatically creates a donation entry from the phone call
- ⏱️ **FSSAI-Compliant ETA Engine** — Google Maps Directions API (with Haversine fallback) checks if food can be delivered before the 4-hour expiry window
- 📍 **Geospatial Driver Matching** — MongoDB `$near` queries find the nearest available, verified driver within a 50 km radius
- 🔄 **Auto-Reassignment Chain** — If a driver rejects, the next nearest driver is automatically assigned
- ⚡ **Dual Real-Time Tracking** — Socket.IO for instant UI updates + Apache Kafka for batch-efficient GPS persistence
- 📅 **Scheduled Daily Donors** — Cron-based auto-creation of donations for registered recurring donors
- 🗺️ **Live Driver Map** — Admin sees all online drivers on a live Google Map, updating in real time
- 📸 **Photo Proof of Delivery** — Drivers upload pickup and delivery photos
- 👥 **5-Role Access Control** — Admin, Employee, Driver, Volunteer, Donor with JWT-based RBAC

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                             │
│            React 19 + Vite + Tailwind CSS v4                │
│   (Admin / Employee / Driver / Donor / Volunteer Dashboards) │
└──────────────────────┬──────────────────────────────────────┘
                       │ REST API + Socket.IO
┌──────────────────────▼──────────────────────────────────────┐
│                        BACKEND                              │
│               Node.js + Express v5                          │
│                                                             │
│  ┌────────────┐  ┌──────────────┐  ┌─────────────────────┐ │
│  │ REST Routes│  │  Socket.IO   │  │    Cron Jobs        │ │
│  │ (6 modules)│  │  (6 rooms)   │  │ expire + schedule   │ │
│  └─────┬──────┘  └──────┬───────┘  └─────────────────────┘ │
│        │                │                                   │
│  ┌─────▼────────────────▼──────────────────────────────┐   │
│  │              Service Layer                           │   │
│  │  geoService · etaService · driverService             │   │
│  │  verificationService · donationService               │   │
│  └─────────────────────┬───────────────────────────────┘   │
│                        │                                    │
│  ┌─────────────────────▼──────────┐  ┌──────────────────┐  │
│  │         MongoDB Atlas          │  │  Apache Kafka    │  │
│  │  (Users, Donations, Deliveries │  │ (driver_locations│  │
│  │   HungerSpots, DailyDonors)    │  │     topic)       │  │
│  └────────────────────────────────┘  └──────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                       │
        ┌──────────────▼──────────────┐
        │       External APIs         │
        │  Exotel IVR · Google Maps   │
        └─────────────────────────────┘
```

---

## 🛠️ Tech Stack

### Backend

| Category | Technology |
|---|---|
| Runtime | Node.js v20+ |
| Framework | Express v5 |
| Database | MongoDB Atlas (Mongoose v8) |
| Authentication | JWT + bcryptjs (salt rounds: 12) |
| Real-time | Socket.IO v4 |
| Message Broker | Apache Kafka 3.7 (KRaft, via KafkaJS v2) |
| File Uploads | Multer |
| Scheduling | node-cron |
| HTTP Client | Axios |
| Logging | Morgan |

### Frontend

| Category | Technology |
|---|---|
| Framework | React 19 (Vite) |
| Routing | React Router v7 |
| Styling | Tailwind CSS v4 |
| Maps | @react-google-maps/api |
| Real-time | socket.io-client |
| Toast Notifications | react-hot-toast |
| Icons | lucide-react |

### Infrastructure

| Service | Tool |
|---|---|
| Kafka Broker | Apache Kafka 3.7 (KRaft mode) |
| Kafka Monitoring | Provectuslabs Kafka UI |
| Containerization | Docker Compose |

---

## 👥 User Roles

| Role | Authentication | Created By | Description |
|---|---|---|---|
| **Admin** | Username + Password | Auto-seeded on first start | Full platform access, user management, live map |
| **Employee** | Username + Password | Admin | Verifies donations, calls donors, approves/rejects |
| **Driver** | Username + Password | Admin | Picks up and delivers food, GPS tracking |
| **Volunteer** | Username + Password | Self-registration (admin approval) | Assists with deliveries |
| **Donor** | OTP (phone number) | Auto-created on OTP verification | Submits food donations |

---

## 🔄 Donation Lifecycle

```
[Donor calls Exotel IVR]
         │
         ▼
  pending_verification  ──── Employee verifies via phone call ────▶  verified
         │                                                               │
         │                                                    ETA feasibility check
         │                                                               │
         │                                              ┌────────────────▼────────────────┐
         │                                              │  ETA OK → approve              │
         │                                              │  ETA Warning → force approve   │
         │                                              └────────────────┬────────────────┘
         │                                                               │
         │                                                           validated
         │                                                               │
         │                                              Auto-assign nearest driver (geo)
         │                                                               │
         │                                                           assigned
         │                                                               │
         │                                              Driver accepts ──▶  accepted
         │                                              Driver rejects ──▶  [auto-reassign]
         │                                                               │
         │                                                           picked_up
         │                                                               │
         │                                                           in_transit
         │                                                               │
         │                                                 ┌─────────────▼───────────────┐
         │                                                 │  delivered  │  failed       │
         │                                                 └─────────────────────────────┘
         │
    rejected (employee) / expired (cron, >4h FSSAI window)
```

---

## 📁 Project Structure

```
NoFoodWaste/
│
├── backend/
│   ├── config/
│   │   ├── db.js                   # MongoDB connection
│   │   └── kafka.js                # Kafka producer/consumer instances
│   ├── controllers/
│   │   ├── adminController.js      # User CRUD, dashboard stats
│   │   ├── authController.js       # Login, OTP, registration, seed admin
│   │   ├── dailyDonorController.js # Recurring donor management
│   │   ├── deliveryController.js   # Full delivery workflow
│   │   ├── donationController.js   # Donation CRUD + webhook
│   │   └── hungerSpotController.js # Hunger spot management
│   ├── middleware/
│   │   ├── auth.js                 # JWT protect + RBAC authorize
│   │   └── upload.js               # Multer file upload config
│   ├── models/
│   │   ├── User.js                 # Unified user model (all roles)
│   │   ├── Donation.js             # Donation lifecycle model
│   │   ├── Delivery.js             # Delivery tracking model
│   │   ├── DailyDonor.js           # Recurring donor schedule
│   │   ├── HungerSpot.js           # Distribution location
│   │   ├── Notification.js         # In-app + SMS notifications
│   │   └── OTP.js                  # Donor OTP records
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── adminRoutes.js
│   │   ├── donationRoutes.js
│   │   ├── deliveryRoutes.js
│   │   ├── hungerSpotRoutes.js
│   │   └── dailyDonorRoutes.js
│   ├── services/
│   │   ├── cronService.js          # Auto-expire + daily donor scheduler
│   │   ├── donationService.js      # Webhook intake, auto-expire logic
│   │   ├── driverService.js        # Auto/manual assign + reassign
│   │   ├── etaService.js           # Google Maps ETA + Haversine fallback
│   │   ├── geoService.js           # MongoDB $near geospatial queries
│   │   ├── kafkaService.js         # Kafka producer
│   │   ├── validationService.js    # Quantity threshold, duplicate check
│   │   └── verificationService.js  # Verify/approve/reject donation
│   ├── workers/
│   │   └── locationConsumer.js     # Kafka consumer + batch DB flush
│   ├── uploads/                    # Multer storage (pickup/delivery photos)
│   ├── server.js                   # App entry point + Socket.IO setup
│   └── package.json
│
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── Footer.jsx
│       │   └── StatusBadge.jsx
│       ├── context/
│       │   ├── AuthContext.jsx      # JWT auth state + login/logout
│       │   └── GoogleMapsContext.jsx
│       ├── hooks/
│       │   └── useSocket.js         # Socket.IO connection hook
│       ├── pages/
│       │   ├── LandingPage.jsx
│       │   ├── LoginPortal.jsx
│       │   ├── Dashboard.jsx        # Smart role-based router
│       │   ├── admin/               # AdminDashboard, RegisterUser, UserManagement
│       │   ├── auth/                # Login pages per role + VolunteerRegister
│       │   ├── donor/               # DonorDashboard
│       │   ├── driver/              # DriverDashboard
│       │   ├── employee/            # EmployeeDashboard
│       │   └── volunteer/           # VolunteerDashboard
│       ├── services/
│       │   └── api/index.js         # Axios API client (all endpoints)
│       └── App.jsx                  # Routes + ProtectedRoute wrapper
│
├── docker-compose.yml               # Kafka + Kafka UI
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v20+
- **npm** v9+
- **Docker Desktop** (for Kafka; optional but recommended)
- **MongoDB Atlas** account (or local MongoDB)
- **Google Maps API Key** (optional; Haversine fallback used if absent)

---

### 1. Clone the repository

```bash
git clone https://github.com/your-org/nofoodwaste.git
cd nofoodwaste/NoFoodWaste
```

---

### 2. Start Kafka (optional but recommended)

```bash
docker-compose up -d
```

This starts:
- **Kafka broker** on `localhost:9092`
- **Kafka UI** at `http://localhost:8080`

> The server starts and runs fully without Kafka. Location tracking will fall back to direct Socket.IO events.

---

### 3. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file (see [Environment Variables](#-environment-variables)):

```bash
cp .env.example .env
# Edit .env with your values
```

Start the development server:

```bash
npm run dev
```

The API will be available at `http://localhost:5000`.

> **On first start**, an admin account is automatically seeded using the credentials in your `.env` file.

---

### 4. Frontend Setup

```bash
cd ../frontend
npm install
```

Create a `.env` file:

```bash
cp .env.example .env
# Edit .env with your values
```

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## 🔐 Environment Variables

### Backend — `backend/.env`

| Variable | Required | Default | Description |
|---|---|---|---|
| `PORT` | No | `5000` | Server port |
| `MONGO_URI` | ✅ Yes | — | MongoDB connection string |
| `JWT_SECRET` | ✅ Yes | — | JWT signing secret (use a long random string) |
| `JWT_EXPIRES_IN` | No | `7d` | JWT token expiry |
| `CLIENT_URL` | No | `http://localhost:5173` | Frontend URL for CORS |
| `NODE_ENV` | No | `development` | `development` / `production` |
| `ADMIN_USERNAME` | No | `admin` | Seeded admin username |
| `ADMIN_PASSWORD` | No | `admin123` | Seeded admin password (**change this!**) |
| `ADMIN_NAME` | No | `NGO Admin` | Seeded admin display name |
| `ADMIN_EMAIL` | No | `admin@nofoodwaste.org` | Seeded admin email |
| `ADMIN_PHONE` | No | `9999999999` | Seeded admin phone |
| `GOOGLE_MAPS_API_KEY` | No | — | Google Maps Directions API key |
| `KAFKA_BROKERS` | No | `localhost:9092` | Kafka broker address |
| `KAFKA_CLIENT_ID` | No | `nfw-backend` | Kafka client identifier |

**Example `backend/.env`:**

```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/nofoodwaste
JWT_SECRET=replace_with_a_very_long_random_secret_string
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
NODE_ENV=development

ADMIN_USERNAME=admin
ADMIN_PASSWORD=YourSecurePasswordHere
ADMIN_NAME=NGO Admin
ADMIN_EMAIL=admin@yourdomain.org
ADMIN_PHONE=9876543210

GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

KAFKA_BROKERS=localhost:9092
KAFKA_CLIENT_ID=nfw-backend
```

---

### Frontend — `frontend/.env`

| Variable | Required | Description |
|---|---|---|
| `VITE_API_URL` | ✅ Yes | Backend API base URL (e.g. `http://localhost:5000/api`) |
| `VITE_GOOGLE_MAPS_API_KEY` | No | Google Maps JS API key for map components |

**Example `frontend/.env`:**

```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

---

## 📡 API Reference

### Authentication — `/api/auth`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/login` | Public | Login for Admin, Employee, Driver |
| `POST` | `/otp/send` | Public | Send OTP to donor's phone |
| `POST` | `/otp/verify` | Public | Verify OTP and get JWT |
| `POST` | `/volunteer/register` | Public | Volunteer self-registration |
| `POST` | `/volunteer/login` | Public | Volunteer login |
| `GET` | `/me` | Protected | Get current authenticated user |
| `POST` | `/admin/register-user` | Admin | Create Driver or Employee account |

---

### Donations — `/api/donations`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET/POST` | `/exotel-webhook` | **Public** | Exotel IVR callback (creates donation) |
| `GET` | `/pending-verification` | Employee, Admin | List donations awaiting verification |
| `POST` | `/verify` | Employee, Admin | Verify donation + ETA check |
| `POST` | `/approve` | Employee, Admin | Approve + auto-assign driver |
| `POST` | `/reject` | Employee, Admin | Reject donation with reason |
| `POST` | `/manual-assign` | Employee, Admin | Override driver assignment |
| `GET` | `/stats` | Employee, Admin | Donation statistics by status |
| `POST` | `/trigger-daily-donor` | Admin | Manually trigger a daily donor |
| `GET` | `/my` | Donor | Donor's own donation history |
| `GET` | `/` | Admin, Employee | All donations (paginated) |
| `GET` | `/:id` | Authenticated | Single donation detail |

---

### Deliveries — `/api/delivery`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/accept` | Driver | Accept assigned delivery |
| `POST` | `/reject` | Driver | Reject delivery (triggers reassign) |
| `POST` | `/pickup` | Driver | Confirm pickup with photo |
| `POST` | `/transit` | Driver | Mark as in transit |
| `POST` | `/complete` | Driver, Volunteer | Complete delivery with photo |
| `POST` | `/fail` | Driver | Mark delivery as failed |
| `PUT` | `/location` | Driver | Update GPS coordinates |
| `PUT` | `/online-status` | Driver | Go Online / Go Offline |
| `GET` | `/my` | Driver, Volunteer | Own delivery history |
| `GET` | `/all` | Admin, Employee | All deliveries |
| `GET` | `/:id` | Authenticated | Single delivery detail |

---

### Admin — `/api/admin`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/users` | Admin | All users (paginated, filterable by role) |
| `GET` | `/users/:id` | Admin | Single user detail |
| `PUT` | `/users/:id` | Admin | Update user fields |
| `PUT` | `/users/:id/block` | Admin | Toggle block/unblock |
| `PUT` | `/users/:id/verify` | Admin | Verify a volunteer |
| `DELETE` | `/users/:id` | Admin | Delete user |
| `GET` | `/stats` | Admin | Platform-wide user statistics |

---

## ⚡ Real-Time Events (Socket.IO)

### Client → Server (emit)

| Event | Payload | Description |
|---|---|---|
| `join_room` | `roomId: string` | Join a generic room |
| `join_employee_room` | — | Join the employees broadcast room |
| `join_admin_room` | — | Join the admin live map room |
| `join_donation_room` | `donationId: string` | Track a specific donation |
| `join_driver_room` | `driverId: string` | Driver's personal notification room |
| `join_delivery_room` | `deliveryId: string` | Track a specific delivery |
| `driver_location_update` | `{ driverId, deliveryId, coordinates }` | Direct socket location broadcast |

### Server → Client (listen)

| Event | Room | Payload | Description |
|---|---|---|---|
| `newDonationRequest` | `employees` | `{ donationId, donorPhone, quantity }` | New IVR donation arrived |
| `verificationPending` | `employees` | `{ donation, etaWarning, etaSeconds }` | Donation verified, needs approval |
| `noDriverAvailable` | `employees` | `{ donationId, reason }` | Reassign failed, manual action needed |
| `driverAssigned` | `driver_{id}` | `{ deliveryId, pickupAddress, hungerSpot, etaMinutes }` | New delivery assigned to driver |
| `deliveryStatusUpdate` | `donation_{id}` | `{ donationId, status, ... }` | Real-time status update for donor |
| `locationUpdate` | `delivery_{id}` | `{ driverId, coordinates, timestamp }` | Driver GPS for delivery tracking |
| `driverLocationUpdate` | `admins` | `{ driverId, coordinates, deliveryId }` | Live map: driver GPS update |
| `driverOnlineStatus` | `admins` | `{ driverId, isOnline, name }` | Driver went online/offline |

---

## 🚀 Kafka Architecture

Kafka is used for high-throughput driver location event processing. The system runs fully without Kafka (graceful degradation).

```
Driver REST Call (PUT /api/delivery/location)
       │
       ├──▶ kafkaService.produceLocationEvent()  ──▶  Kafka Topic: driver_locations
       │                                                        │
       │                                          locationConsumer.js
       │                                                        │
       │                                         Buffer in Map (by driverId)
       │                                                        │
       │                                      setInterval(5000ms) → bulkWrite to MongoDB
       │
       └──▶ Socket.IO direct emit to 'admins' room  (immediate, no Kafka dependency)
```

### Topics

| Topic | Partitioned By | Consumer Group | Purpose |
|---|---|---|---|
| `driver_locations` | `driverId` | `nfw-location-group` | GPS coordinates for all active drivers |

### Kafka UI

Access the Kafka monitoring dashboard at **`http://localhost:8080`** when Docker Compose is running.

---

## 🗄️ Database Schema Overview

### Donation Status Flow

| Status | Meaning |
|---|---|
| `pending_verification` | IVR received; waiting for employee call |
| `verified` | Employee filled food details; ETA computed |
| `validated` | Approved; ready for driver assignment |
| `assigned` | Driver assigned |
| `picked` | Driver confirmed pickup |
| `in_transit` | En route to hunger spot |
| `delivered` | Successfully delivered ✅ |
| `failed` | Could not be delivered |
| `rejected` | Rejected by employee |
| `expired` | Passed FSSAI 4-hour food safety window |

### Key MongoDB Indexes

| Collection | Index | Type | Purpose |
|---|---|---|---|
| `users` | `currentLocation` | `2dsphere` | Nearest driver geo queries |
| `users` | `role` | Regular | Role-based filtering |
| `donations` | `pickupLocation` | `2dsphere` | Nearest hunger spot |
| `donations` | `status`, `donor`, `assignedDriver`, `expiresAt` | Regular | Common query filters |
| `deliveries` | `status`, `driver`, `donation` | Regular | Delivery lookups |
| `hungerSpots` | `location` | `2dsphere` | Nearest spot geo queries |
| `dailyDonors` | `location` | `2dsphere` | Geo-aware scheduling |

---

## 🧑‍💻 Development Scripts

### Backend

```bash
npm run dev    # Start with nodemon (hot reload)
npm start      # Start production server
```

### Frontend

```bash
npm run dev     # Vite dev server (http://localhost:5173)
npm run build   # Production build to dist/
npm run preview # Preview production build
npm run lint    # ESLint check
```

---

## 📄 License

This project is developed for research and NGO operational purposes. All rights reserved.

---

<div align="center">

Made with ❤️ to fight food wastage in Chennai

</div>
