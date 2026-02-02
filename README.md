# TalabaHub

TalabaHub is a mock student discounts platform for Uzbekistan, built with React + Vite + TypeScript, Tailwind CSS, shadcn/ui, React Router, and Zustand. Everything runs locally with a mocked API, seeded data, and localStorage persistence.

## Setup

```bash
npm install
npm run dev
```

## Test accounts

- Verified student
  - Email: verified.student@uni.uz
  - Password: Talaba123!

- Unverified student
  - Email: student@uni.uz
  - Password: Talaba123!

- Admin
  - Email: admin@talabahub.uz
  - Password: Admin123!

## Features

- Public browsing with locked verified-only codes
- Student verification flow (submit -> pending -> admin approve/reject)
- Saved deals and search/filter/sort
- Admin CRUD for deals and verification approvals
- Responsive layout with mobile bottom nav
- Light/dark mode with persistence
- 3 languages: Uzbek (default), Russian, English

## Role behavior

- Guest: browse Home/Explore/Deal Details; codes for verified-only deals are locked
- Student (unverified): can access /app, submit verification, browse and save deals
- Student (verified): can reveal and copy codes for verified-only deals
- Admin: can manage deals and approve/reject verifications

## Mock data + storage

- Seed data is created on first load
- All data persists in `localStorage` under the `talabahub:*` keys
- Mock API calls simulate latency for realism
