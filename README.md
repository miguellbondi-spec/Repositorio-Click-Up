# ZacxOrg

SaaS platform for operational, commercial and administrative management of companies.

## Stack
- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS, TanStack Query, Zustand
- **Backend**: NestJS, TypeScript, Prisma ORM
- **Database**: PostgreSQL 16
- **Cache/Queue**: Redis, BullMQ
- **Auth**: JWT + Refresh Token + RBAC

## Quick Start
```bash
cp .env.example .env
npm install
npm run db:generate
npm run db:push
npm run db:seed
npm run dev
```

## Access
- Web: http://localhost:3000
- API: http://localhost:3001
- Docs: http://localhost:3001/api/docs

## Demo Credentials
- admin@zacxorg.com / Admin@123456
- gestor@empresa-demo.com / Gestor@123
