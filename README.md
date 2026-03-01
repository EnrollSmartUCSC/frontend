# Enroll Smart — Frontend

> Next.js 15 web application for UCSC course enrollment management.

The frontend provides a unified dashboard where students can search courses, plan their full degree schedule with drag-and-drop, track watchlisted classes, and receive seat-availability notifications — all backed by the Enroll Smart Flask API.

---

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Project Structure](#project-structure)
- [Pages & Features](#pages--features)
- [State Management](#state-management)
- [Authentication](#authentication)
- [Environment Variables](#environment-variables)
- [Local Setup](#local-setup)
- [Testing](#testing)

---

## Architecture Overview

```
┌──────────────────────────────────────────────────────────────────┐
│                      AWS Amplify (Hosting)                       │
│                                                                  │
│  Next.js 15 App (App Router)                                     │
│                                                                  │
│  /           → Landing Page (Login / Signup)                     │
│  /dashboard  → Protected layout with sidebar nav                 │
│    /tab-1    → Course Search                                     │
│    /tab-2    → Degree Planner (Drag & Drop)                      │
│    /tab-3    → Watchlist & Tracking                              │
└──────────────────┬───────────────────────────────────────────────┘
                   │ REST (fetch + Firebase JWT)
┌──────────────────▼───────────────────────────────────────────────┐
│              Enroll Smart Flask Backend (AWS EC2)                 │
│  Firebase Auth ←→ User verification                              │
│  PostgreSQL RDS ←→ Planner, Pins, Watchlists                     │
│  UCSC PISA API ←→ Live class data                                │
│  RateMyProfessors ←→ Instructor ratings                          │
└──────────────────────────────────────────────────────────────────┘
```

All `/dashboard` routes are protected by `next-auth` middleware. Firebase handles authentication client-side; the backend verifies Firebase ID tokens on every authenticated API call.

---

## Project Structure

```
.
├── src/
│   ├── app/
│   │   ├── page.tsx                  # Landing page (Login/Signup toggle)
│   │   ├── layout.tsx                # Root layout (Geist font, metadata)
│   │   ├── globals.css               # Tailwind + CSS variable theme
│   │   ├── utils/
│   │   │   └── firebase.ts           # Firebase app & auth initialization
│   │   ├── login/
│   │   │   ├── login.tsx             # Email/password & Google login form
│   │   │   └── login.module.css      # Scoped CSS for auth forms
│   │   ├── signup/
│   │   │   └── signup.tsx            # Email/password & Google signup form
│   │   └── dashboard/
│   │       ├── layout.tsx            # Sidebar nav + Firebase auth guard
│   │       ├── page.tsx              # Redirects → /dashboard/tab-1
│   │       ├── tab-1/                # Course Search
│   │       │   ├── page.tsx          # Main page (orchestrates state)
│   │       │   ├── components/
│   │       │   │   ├── SearchPanel.tsx        # Course search input + results list
│   │       │   │   ├── PinnedCoursesPanel.tsx # Pinned course sidebar
│   │       │   │   ├── CourseDetails.tsx      # Course info, sections, RMP ratings
│   │       │   │   └── CourseTable.tsx        # Sections table (time, location, instructor)
│   │       │   ├── hooks/
│   │       │   │   ├── useCourses.tsx         # Fetch full course list
│   │       │   │   ├── useCourseSearch.tsx    # Client-side search/filter
│   │       │   │   ├── useCourseDetails.tsx   # Fetch live sections by quarter
│   │       │   │   ├── useCourseInfo.tsx      # Fetch catalog info + RMP ratings
│   │       │   │   ├── usePinnedCourses.tsx   # Pin/unpin CRUD
│   │       │   │   └── useWatchlist.tsx       # Watchlist CRUD
│   │       │   └── utils/
│   │       │       └── formatting.tsx         # String normalization helpers
│   │       ├── tab-2/                # Degree Planner
│   │       │   ├── page.tsx          # DndContext wrapper + drag state
│   │       │   ├── layout.tsx
│   │       │   └── components/
│   │       │       ├── CourseList.tsx          # Draggable course sidebar
│   │       │       ├── DraggableCourseItem.tsx # dnd-kit draggable card
│   │       │       ├── MultiYearPlanner.tsx    # 5-year × 4-season table
│   │       │       └── quarter.tsx             # Droppable quarter cell
│   │       └── tab-3/                # Watchlist & Tracking
│   │           ├── page.tsx          # Watchlist page with tracking toggle
│   │           ├── useWatchlist.ts   # Tracking API calls (start/stop, quarter)
│   │           └── components/
│   │               ├── classCard.tsx      # Per-course card with enrollment stats
│   │               ├── QuarterControl.tsx # Quarter selector + tracking toggle
│   │               └── noClasses.tsx      # Empty state UI
│   ├── components/
│   │   └── ui/                       # shadcn/ui components
│   │       ├── badge.tsx
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── scroll-area.tsx
│   │       ├── select.tsx
│   │       ├── switch.tsx
│   │       └── tabs.tsx
│   ├── context/
│   │   └── ScheduleContext.tsx       # Planner API calls (add/remove/fetch)
│   ├── data/
│   │   └── mockCourses.ts            # Local mock data for development
│   ├── lib/
│   │   └── utils.ts                  # cn() helper (clsx + tailwind-merge)
│   └── types/
│       └── api.ts                    # Shared TypeScript interfaces
├── middleware.ts                     # next-auth route protection for /dashboard
├── tests/
│   ├── build.test.tsx                # Vitest integration tests
│   ├── mockApi.ts                    # MSW request handlers (mock backend)
│   ├── testData.ts                   # Test fixture data
│   └── setup.ts                      # dotenv config for test environment
├── public/
│   └── LandingPage.svg               # Background SVG for the landing page
├── components.json                   # shadcn/ui config
├── vitest.config.mts
├── next.config.ts
└── package.json
```

---

## Pages & Features

### Landing Page (`/`)

A split-screen layout with the Enroll Smart branding on the left and a login/signup form on the right. Users can toggle between login and signup without a page reload. Both forms support Google OAuth (via Firebase popup) and email/password auth.

### Course Search (`/dashboard/tab-1`)

The page is divided into three panels rendered side-by-side:

**Pinned Courses Panel** — Shows the authenticated user's pinned courses fetched from the backend. Clicking a pinned course selects it and loads its details.

**Search Panel** — Lists all CSE courses (fetched from `/api/v1/courses`) and filters them client-side as the user types. Matching is done across subject, catalog number, and title, including without spaces (e.g. `cse101` matches `CSE 101`).

**Course Details Panel** — When a course is selected, displays the catalog description, prerequisites, and credits (scraped from the UCSC catalog), followed by a live sections table for the current quarter showing meeting days, times, location, and instructors. Below the table, RateMyProfessors ratings are fetched per instructor and displayed as circular progress gauges. The panel also has Pin/Unpin and Add/Remove Watchlist buttons that persist to the backend.

### Degree Planner (`/dashboard/tab-2`)

Built with `@dnd-kit/core`. The left sidebar lists all courses (pinned courses separated at the top), and the right side is a scrollable 5-year × 4-season table (Winter/Spring/Summer/Fall for 2024–2028). Courses are dragged from the sidebar and dropped into any quarter cell. Drop targets highlight green on hover. Each placed course shows a delete button to remove it from the planner. All add/remove operations are persisted via the backend planner API.

### Watchlist & Tracking (`/dashboard/tab-3`)

Displays all courses on the user's watchlist as cards, enriched with live class data (enrollment count, capacity, waitlist size, instructor, credits, and open/waitlist/closed status). A quarter selector and tracking toggle at the top control which quarter is being tracked and whether background notifications are enabled. When tracking is on, the backend polls UCSC every 15 minutes and sends alerts by email or SMS when seat counts change.

---

## State Management

There is no global state library. State is managed through a combination of:

- **React `useState` / `useEffect`** in page components for local UI state (selected course, search query, loaded data).
- **`ScheduleContext`** (`src/context/ScheduleContext.tsx`) — provides `addCourse`, `removeCourse`, and `fetchSchedule` functions to the Degree Planner subtree. It wraps the `/api/v1/planner` API calls and is provided by the `DashboardLayout`.
- **Custom async hooks** in `tab-1/hooks/` that wrap fetch calls and return typed data. These are plain async functions (not React hooks in most cases), called inside `useEffect` blocks.

---

## Authentication

Authentication is handled by **Firebase Auth** on the client side. The app supports two sign-in methods: Google OAuth (popup) and email/password. The `firebase.ts` utility initializes the Firebase app once using `getApps()` to avoid duplicate initialization in Next.js.

After sign-in, the Firebase `auth` object is used throughout the app to call `auth.currentUser.getIdToken()` and attach the resulting JWT as an `Authorization: Bearer <token>` header on every backend API request.

`middleware.ts` uses `next-auth` to protect all routes under `/dashboard`. If a user is not authenticated, they are redirected to `/` (the landing page). The dashboard layout additionally checks `auth.currentUser` on mount and redirects to `/` if the Firebase session has expired.

---

## Environment Variables

Create a `.env.local` file in the project root:

```bash
# Next.js / next-auth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<base64-secret>

# Google OAuth (for next-auth)
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>

# Firebase (client-side)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=

# Backend
NEXT_PUBLIC_BACKEND_URL=http://localhost
NEXT_PUBLIC_BACKEND_PORT=:8002
```

To generate a `NEXTAUTH_SECRET` on PowerShell:
```powershell
$bytes = [byte[]]::new(32)
[System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
[Convert]::ToBase64String($bytes)
```

You also need to create an OAuth 2.0 Client in the Google Cloud Console with:
- **Authorized redirect URIs:** `http://localhost:3000/api/auth/callback/google`
- **Authorized JavaScript origins:** `http://localhost:3000`

---

## Local Setup

```bash
# 1. Clone the repo
git clone https://github.com/EnrollSmartUCSC/frontend.git
cd frontend

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env.local   # then fill in values

# 4. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Testing

Tests are written with **Vitest** and **React Testing Library**. API calls are intercepted using **MSW (Mock Service Worker)**, which intercepts `fetch` at the network level and returns mock responses defined in `tests/mockApi.ts`. Firebase auth is fully mocked with `vi.mock('firebase/auth', ...)`.

```bash
# Run all tests
npm test

# Run with coverage report
npm test -- --coverage
```

Coverage output is written to `tests/coverage/`.

### What's tested

The test suite in `tests/build.test.tsx` covers:

- **Landing page** renders without error.
- **Google sign-in and sign-up** — verifies router redirects to `/dashboard`.
- **Email/password signup** — checks the success alert is shown.
- **Tab 1 (Course Search)** — course list rendering, course selection displaying details/credits/prerequisites/instructor, pin/unpin toggling, watchlist add/remove, and empty-state handling.
- **Tab 2 (Planner)** — component renders without error.
- **Tab 3 (Watchlist)** — component renders without error.
- **Dashboard layout** — all sidebar nav items render with all three tabs mounted.

### Mock API

`tests/mockApi.ts` provides stateful in-memory MSW handlers for all backend endpoints (courses, classData, courseInfo, pin/unpin, watchlist, planner, trackingStatus, track). State (pinned courses, watchlist, planner) resets between tests via `beforeEach`.
