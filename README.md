<div align="center">

```
███████╗ █████╗ ██╗      ██████╗██╗  ██╗    ███████╗ ██████╗ 
██╔════╝██╔══██╗██║     ██╔════╝██║  ██║    ██╔════╝██╔═══██╗
█████╗  ███████║██║     ██║     ███████║    ███████╗██║   ██║
██╔══╝  ██╔══██║██║     ██║     ██╔══██║    ╚════██║██║   ██║
███████╗██║  ██║███████╗╚██████╗██║  ██║    ███████║╚██████╔╝
╚══════╝╚═╝  ╚═╝╚══════╝ ╚═════╝╚═╝  ╚═╝    ╚══════╝ ╚═════╝ 
```

# ✦ ealch.so ✦
### *The Future of Hotel Management — Multivendor. Seamless. Unstoppable.*

<br/>

[![Next.js](https://img.shields.io/badge/Frontend-Next.js_15-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![NestJS](https://img.shields.io/badge/Backend-NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-MIT-gold?style=for-the-badge)](LICENSE)

<br/>

> *"One platform to rule all hotels. One dashboard to find them. One system to bring them all and in the darkness bind them."*

<br/>

---

</div>

<br/>

## ◈ What is ealch.so?

**ealch.so** is a next-generation **multivendor hotel management platform** — a unified ecosystem where hotel owners, managers, and guests converge. Built for scale, speed, and elegance.

Whether you're managing a boutique inn in Dhaka or a chain of 500-room luxury resorts across continents — **ealch.so** handles it all from a single, beautiful interface.

```
╔══════════════════════════════════════════════════════════════╗
║  🏨 Hotel A  ·  🏩 Hotel B  ·  🏪 Hotel C  ·  🏬 Hotel D    ║
║               ↓         ↓         ↓         ↓                ║
║          ┌─────────────────────────────────┐                 ║
║          │        ealch.so Platform        │                 ║
║          │   Unified · Scalable · Smart    │                 ║
║          └─────────────────────────────────┘                 ║
║                         ↓                                    ║
║         👥 Guests  ·  📊 Analytics  ·  💳 Payments          ║
╚══════════════════════════════════════════════════════════════╝
```

<br/>

---

## ◈ Tech Stack

<table>
<tr>
<td width="50%">

### 🖥️ Frontend
```
Framework    →  Next.js 15 (App Router)
Language     →  TypeScript
Styling      →  Tailwind CSS + Shadcn/UI
State        →  Zustand / React Query
Auth         →  NextAuth.js
Animations   →  Framer Motion
```

</td>
<td width="50%">

### ⚙️ Backend
```
Framework    →  NestJS
Language     →  TypeScript
Database     →  PostgreSQL + Prisma ORM
Cache        →  Redis
Auth         →  JWT + Passport.js
API Docs     →  Swagger / OpenAPI
```

</td>
</tr>
</table>

<br/>

---

## ◈ Core Features

### 🏨 Multivendor Architecture
- **Vendor Onboarding** — Hotel owners register, get verified, and go live
- **Isolated Dashboards** — Each vendor has their own private management panel
- **Central Admin Panel** — Superadmin oversees all vendors, bookings, and revenue

### 📅 Smart Booking Engine
- Real-time availability calendar
- Dynamic pricing (per season, event, or demand)
- Instant confirmation + automated email/SMS
- Booking modification & cancellation workflows

### 💳 Payment & Revenue
- Multi-currency support
- Automatic vendor commission splitting
- Withdrawal management for vendors
- Integrated payment gateways (Stripe, bKash, SSLCommerz)

### 📊 Analytics & Reports
- Revenue dashboards per vendor
- Occupancy rate tracking
- Guest demographics & behavioral analytics
- Export to CSV / PDF

### 🔐 Roles & Permissions
```
Super Admin → Full platform control
Vendor Admin → Manage their hotel(s)
Hotel Staff  → Limited operational access
Guest        → Browse, book, review
```

<br/>

---

## ◈ Project Structure

```
ealch.so/
│
├── 🖥️  frontend/                  ← Next.js Application
│   ├── app/
│   │   ├── (auth)/               ← Login, Register, Verify
│   │   ├── (dashboard)/          ← Admin & Vendor Panels
│   │   ├── (guest)/              ← Public Booking Interface
│   │   └── api/                  ← Next.js API Routes
│   ├── components/               ← Reusable UI Components
│   ├── hooks/                    ← Custom React Hooks
│   ├── lib/                      ← Utilities & Config
│   └── store/                    ← Zustand State Management
│
├── ⚙️  backend/                   ← NestJS Application
│   ├── src/
│   │   ├── auth/                 ← Authentication Module
│   │   ├── users/                ← User Management
│   │   ├── hotels/               ← Hotel CRUD & Management
│   │   ├── bookings/             ← Booking Engine
│   │   ├── payments/             ← Payment Processing
│   │   ├── vendors/              ← Vendor Management
│   │   ├── analytics/            ← Reports & Analytics
│   │   └── notifications/        ← Email / SMS / Push
│   ├── prisma/
│   │   └── schema.prisma         ← Database Schema
│   └── test/                     ← E2E & Unit Tests
│
├── 📦  docker-compose.yml
├── 📄  .env.example
└── 📖  README.md
```

<br/>

---

## ◈ Getting Started

### Prerequisites

```bash
node >= 20.x
npm >= 10.x
postgresql >= 15
redis >= 7
```

### 🚀 Installation

**1. Clone the Repository**
```bash
git clone https://github.com/your-org/ealch.so.git
cd ealch.so
```

**2. Setup Environment Variables**
```bash
# Root
cp .env.example .env

# Frontend
cd frontend && cp .env.example .env.local

# Backend
cd ../backend && cp .env.example .env
```

**3. Configure `.env`**
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/ealchso"

# JWT
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="7d"

# Redis
REDIS_URL="redis://localhost:6379"

# Payment
STRIPE_SECRET_KEY="sk_live_..."
BKASH_APP_KEY="your-bkash-key"

# Email
SMTP_HOST="smtp.gmail.com"
SMTP_USER="noreply@ealch.so"
SMTP_PASS="your-app-password"
```

**4. Install & Run**

```bash
# Install all dependencies
npm run install:all

# Run database migrations
cd backend && npx prisma migrate dev

# Seed initial data
npx prisma db seed

# Start development servers (both simultaneously)
cd .. && npm run dev
```

**5. Access the Application**
```
Frontend   →  http://localhost:3000
Backend    →  http://localhost:4000
API Docs   →  http://localhost:4000/api/docs
Admin      →  http://localhost:3000/admin
```

<br/>

---

## ◈ Docker Setup

```bash
# Build and start all services
docker-compose up --build

# Run in background
docker-compose up -d

# Stop all services
docker-compose down
```

```yaml
# Services spun up:
✓  frontend    (Next.js)    → port 3000
✓  backend     (NestJS)     → port 4000
✓  postgres    (DB)         → port 5432
✓  redis       (Cache)      → port 6379
✓  adminer     (DB UI)      → port 8080
```

<br/>

---

## ◈ API Overview

> Full documentation available at `/api/docs` (Swagger UI)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/auth/register` | Register new user/vendor |
| `POST` | `/auth/login` | Authenticate & get JWT |
| `GET` | `/hotels` | List all hotels (with filters) |
| `GET` | `/hotels/:id` | Get hotel details |
| `POST` | `/bookings` | Create a booking |
| `GET` | `/bookings/:id` | Get booking status |
| `POST` | `/payments/initiate` | Start payment flow |
| `GET` | `/vendor/dashboard` | Vendor analytics |
| `GET` | `/admin/overview` | Platform-wide stats |

<br/>

---

## ◈ Screenshots

```
┌─────────────────────────────────────────────────────┐
│  🌐 Landing Page    │  Stunning hotel discovery UI  │
│  📊 Vendor Panel    │  Revenue charts & room mgmt   │
│  👤 Guest Portal    │  Seamless booking experience  │
│  🔧 Admin Console   │  Full platform oversight      │
└─────────────────────────────────────────────────────┘
```

*(Screenshots coming soon — UI under active development)*

<br/>

---

## ◈ Roadmap

- [x] Core multivendor architecture
- [x] Hotel & room management
- [x] Booking engine
- [x] Payment integration (Stripe)
- [ ] bKash & SSLCommerz integration
- [ ] Mobile app (React Native)
- [ ] AI-powered pricing suggestions
- [ ] Review & rating system
- [ ] Multi-language support (EN, BN, AR)
- [ ] Loyalty points program
- [ ] Channel manager (OTA sync)

<br/>

---

## ◈ Contributing

We welcome contributions from the community! Here's how:

```bash
# 1. Fork the repository
# 2. Create your feature branch
git checkout -b feature/amazing-feature

# 3. Commit your changes
git commit -m "✨ Add: amazing feature"

# 4. Push to the branch
git push origin feature/amazing-feature

# 5. Open a Pull Request
```

**Commit Convention:**
```
✨ Add:      New feature
🐛 Fix:      Bug fix
♻️  Refactor: Code improvement
📝 Docs:     Documentation
🎨 Style:    UI/Styling
🔥 Remove:   Delete code/files
🔒 Security: Security fix
```

<br/>

---

## ◈ License

```
MIT License — Copyright © 2025 ealch.so

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software — do whatever you want with it, just don't
hold us liable. 🤝
```

<br/>

---

<div align="center">

**Built with obsession. Deployed with pride.**

```
  ███████╗ █████╗ ██╗      ██████╗██╗  ██╗    ███████╗ ██████╗ 
  ██╔════╝██╔══██╗██║     ██╔════╝██║  ██║    ██╔════╝██╔═══██╗
  █████╗  ███████║██║     ██║     ███████║    ███████╗██║   ██║
  ██╔══╝  ██╔══██║██║     ██║     ██╔══██║    ╚════██║██║   ██║
  ███████╗██║  ██║███████╗╚██████╗██║  ██║    ███████║╚██████╔╝
  ╚══════╝╚═╝  ╚═╝╚══════╝ ╚═════╝╚═╝  ╚═╝    ╚══════╝ ╚═════╝
```

🌐 **[ealch.so](https://ealch.so)** · 📧 **hello@ealch.so** · 🐦 **@ealchso**

<br/>

*⭐ Star this repo if ealch.so made your life easier!*

</div>
