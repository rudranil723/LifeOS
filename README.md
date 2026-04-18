<div align="center">

<h1>🧠 LifeOS — AI-Powered Life Operating System</h1>

<p><strong>Your personal intelligent operating system for goals, tasks, learning, and daily planning.</strong></p>

<p>
  <a href="https://life-os-g5ap.vercel.app/" target="_blank">
    <img src="https://img.shields.io/badge/🚀 Live Demo-life--os--g5ap.vercel.app-6366f1?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Demo" />
  </a>
  &nbsp;
  <img src="https://img.shields.io/badge/Next.js-16.2.2-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  &nbsp;
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react" alt="React" />
  &nbsp;
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript" />
  &nbsp;
  <img src="https://img.shields.io/badge/Prisma-7-2D3748?style=for-the-badge&logo=prisma" alt="Prisma" />
</p>

<p>
  <img src="https://img.shields.io/badge/Deployed on-Vercel-black?style=flat-square&logo=vercel" alt="Vercel" />
  <img src="https://img.shields.io/badge/Database-Supabase PostgreSQL-3ECF8E?style=flat-square&logo=supabase" alt="Supabase" />
  <img src="https://img.shields.io/badge/Auth-Clerk-6C47FF?style=flat-square&logo=clerk" alt="Clerk" />
  <img src="https://img.shields.io/badge/AI-OpenRouter-FF6B35?style=flat-square" alt="OpenRouter" />
</p>

</div>

---

## 🌐 Live Project

> **[https://life-os-g5ap.vercel.app/](https://life-os-g5ap.vercel.app/)**

LifeOS is live and fully deployed. Sign up with your email or a social account to get started instantly — no setup required.

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Database Schema](#-database-schema)
- [AI Capabilities](#-ai-capabilities)
- [Pages & Routes](#-pages--routes)
- [Getting Started (Local Development)](#-getting-started-local-development)
- [Environment Variables](#-environment-variables)
- [Project Structure](#-project-structure)
- [Deployment](#-deployment)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)

---

## 🧬 Overview

**LifeOS** is a full-stack, AI-driven personal productivity system designed to act as your intelligent life operating system. It combines goal management, task tracking, daily AI scheduling, a personal learning coach, and deep analytics — all in one unified, context-aware interface.

Unlike traditional productivity apps, LifeOS has persistent memory of your goals, tasks, and preferences. Its embedded AI understands your context and can plan your day, coach your learning, analyze your mood engagement, and surface actionable insights — all through a conversational interface.

---

## ✨ Key Features

### 🤖 AI Chat Assistant
- Context-aware conversational AI that knows your active goals, pending tasks, and personal preferences
- Persistent memory across sessions — the AI remembers your patterns and adapts
- Natural language daily planning: simply say *"plan my day"* to generate a structured time-blocked schedule
- Powered by OpenRouter's free-tier LLMs with smart prompt engineering

### 📅 AI Daily Planner
- Automatically generates a time-blocked daily schedule based on your goals and deadlines
- Schedules are persisted to the database and accessible from `/dashboard/planner`
- Handles existing plan updates (upsert behavior) — always shows today's most current plan

### 🎯 Goal Tracking
- Create and manage multiple life goals with optional deadlines
- Goals are linked to tasks for granular progress tracking
- Status management: `IN_PROGRESS`, `COMPLETED`, `ARCHIVED`

### ✅ Task Management
- Kanban-style task workflow: `TODO → DOING → DONE`
- Tasks can be linked to parent goals for structure and accountability
- Due date support with deadline-aware AI scheduling integration

### 📚 AI Learning Coach
- Create custom learning paths across any domain (tech, science, arts, etc.)
- AI auto-generates 4–6 core concepts and mastery drills for each path via OpenRouter
- Mastery log tracking with individual concept scores (0–100)
- Session-based progress: each practice session increments mastery scores
- Coaching insights: AI analyzes chat history, completed tasks, and learning path data to generate personalized observation + learning edge + drill recommendations

### 📊 Analytics Dashboard
- **Focus Score** (0–100): A weighted composite of task completion rate (40%), learning path progress (30%), AI engagement (15%), and streak bonus (15%)
- **Task Completion Rate**: Total vs. completed tasks with day-by-day breakdown
- **GitHub-style Activity Heatmap**: 365-day task completion history with color-coded intensity levels
- **Mood/Engagement Index**: AI-analyzed sentiment from recent chat messages, scored and labeled (stressed / neutral / focused)
- **Learning Path Velocity**: Week-over-week mastery score trends per learning path

### 🔐 Authentication
- Clerk-powered authentication with email, Google, and other social providers
- Automatic user provisioning in the database on first sign-in
- All data is scoped per user with Clerk User ID mapping

### 🧠 Persistent Memory System
- User memories stored in the `Memory` model (preferences, behaviors, facts, goals)
- Injected into every AI chat prompt for personalized, context-aware responses
- Categories: `PREFERENCE`, `FACT`, `BEHAVIOR`, `GOAL`

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router) |
| **Language** | TypeScript 5 |
| **UI** | React 19, Tailwind CSS 4, Framer Motion |
| **Components** | Lucide React, Recharts, shadcn/ui (components.json) |
| **Authentication** | [Clerk](https://clerk.com/) |
| **Database ORM** | [Prisma 7](https://www.prisma.io/) with `@prisma/adapter-pg` |
| **Database** | PostgreSQL via [Supabase](https://supabase.com/) |
| **AI / LLMs** | [OpenRouter API](https://openrouter.ai/) (free-tier models) |
| **AI SDK** | Vercel AI SDK (`ai`, `@ai-sdk/google`, `@ai-sdk/anthropic`, `@ai-sdk/openai`) |
| **Deployment** | [Vercel](https://vercel.com/) |
| **Fonts** | Geist Sans, Geist Mono (next/font/google) |

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        VERCEL (Edge)                        │
│                                                             │
│  ┌──────────────┐   ┌──────────────┐   ┌────────────────┐  │
│  │  Next.js App │   │  API Routes  │   │ Server Actions │  │
│  │  (RSC + CSR) │   │  /api/chat   │   │ analytics.ts   │  │
│  │              │   │  /api/goals  │   │ coach.ts       │  │
│  │  Dashboard   │   │  /api/tasks  │   │ goals.ts       │  │
│  │  Analytics   │   │  /api/planner│   │ tasks.ts       │  │
│  │  Coach       │   │              │   │                │  │
│  └──────┬───────┘   └──────┬───────┘   └───────┬────────┘  │
│         │                  │                    │           │
└─────────┼──────────────────┼────────────────────┼───────────┘
          │                  │                    │
          ▼                  ▼                    ▼
   ┌─────────────┐   ┌──────────────┐   ┌──────────────────┐
   │    Clerk    │   │  OpenRouter  │   │   Supabase PG    │
   │    Auth     │   │  AI/LLMs     │   │   (Prisma 7)     │
   │             │   │  (free tier) │   │                  │
   │ User Mgmt   │   │ Chat, Plans, │   │ Users, Goals,    │
   │ JWT Tokens  │   │ Coaching,    │   │ Tasks, Memories, │
   │             │   │ Mood Index   │   │ LearningPaths,   │
   └─────────────┘   └──────────────┘   │ CoachingInsights │
                                        └──────────────────┘
```

### Data Flow
1. User authenticates via **Clerk** → JWT propagated to all requests
2. **Server Actions** (Next.js) handle CRUD operations via **Prisma** → **Supabase PostgreSQL**
3. AI features call **OpenRouter API** with user context (goals, tasks, memories) injected into system prompts
4. Analytics are computed server-side by aggregating Prisma query results with weighted scoring algorithms
5. All user data is cascade-deleted on user removal for clean data hygiene

---

## 🗄 Database Schema

LifeOS uses a PostgreSQL database managed by Prisma 7 with the following models:

```prisma
User            # Maps to Clerk User ID; root of all data
├── Goal        # Life goals with deadlines and status
│   └── Task    # Tasks linked to goals (optional)
├── Task        # Standalone tasks (can exist without a goal)
├── Memory      # Persistent AI memory (preferences, facts, behaviors)
├── ChatMessage # Full conversation history per user
├── DailyPlan   # AI-generated daily schedules (upserted per day)
├── StudySession # Raw study session logs (topic + duration)
├── Reminder    # Scheduled reminders with fire-at timestamps
├── LearningPath # Named learning tracks per user
│   └── MasteryLog # Per-concept mastery scores (0-100)
└── CoachingInsight # Latest AI coaching analysis (1 per user, upserted)
```

All models cascade-delete on user removal. The `DailyPlan` model has a unique constraint on `(userId, date)` ensuring one plan per day.

---

## 🤖 AI Capabilities

### Chat System (`/api/chat`)
The chat route dynamically builds a system prompt from:
- User's active `IN_PROGRESS` goals
- Pending tasks (not `DONE`)
- All user `Memory` records (preferences, facts)

It intelligently detects planning requests using keyword matching and routes them to the `generateDailyPlan` function instead of a standard chat response.

### Daily Plan Generation
Triggered by phrases like:
- *"plan my day"*, *"generate my schedule"*, *"what should I do"*, *"organize my day"*

The planner fetches goals + tasks + memories, builds a structured prompt, calls OpenRouter, parses the JSON block schedule response, and upserts it to `DailyPlan` for the current day.

### Learning Coach (`/coach`)
- **`analyzeLearningState`**: Sends last 20 chat messages + completed tasks + learning paths to the AI, receives structured `{ observation, learningEdge, drill }` JSON, and persists it as a `CoachingInsight`
- **`createLearningPath`**: Sends title + category to OpenRouter, which returns a JSON array of 4–6 core concepts; mastery logs at score 0 are seeded automatically
- **`startLearningSession`**: Increments all mastery scores by +5, recalculates `overallProgress` as average of all concept scores

### Analytics Engine (`/analytics`)
- **Focus Score**: Weighted formula across 4 dimensions
- **Activity Heatmap**: 365-day lookback with 5-level intensity (0–4)
- **Mood Index**: AI sentiment analysis of last 20 chat messages, cached against `CoachingInsight` timestamp (6-hour TTL)

---

## 📄 Pages & Routes

| Route | Description |
|---|---|
| `/` | Landing / home page with sign-in prompt |
| `/dashboard` | Main dashboard with AI chat, goals overview, and sidebar navigation |
| `/dashboard/planner` | AI-generated daily time-block schedule viewer |
| `/analytics` | Full analytics dashboard (focus score, heatmap, mood index, metrics) |
| `/coach` | AI Learning Coach — paths, mastery logs, insights, velocity chart |
| `/api/chat` | `POST` — AI chat endpoint with planning detection |
| `/api/goals` | Goals CRUD API |
| `/api/tasks` | Tasks CRUD API |
| `/api/planner` | Planner generation API |
| `/api/analytics` | Analytics data API |

---

## 🚀 Getting Started (Local Development)

### Prerequisites
- Node.js 18+ and npm
- A [Clerk](https://clerk.com/) account (free)
- A [Supabase](https://supabase.com/) project with a PostgreSQL database (free tier)
- An [OpenRouter](https://openrouter.ai/) API key (free tier available)

### 1. Clone the Repository

```bash
git clone https://github.com/rudranil723/LifeOS.git
cd LifeOS
```

### 2. Install Dependencies

```bash
npm install
```

> **Note:** `prisma generate` runs automatically via the `postinstall` script.

### 3. Set Up Environment Variables

Copy the example file and fill in your credentials:

```bash
cp .env.example .env.local
```

See the [Environment Variables](#-environment-variables) section for the full list.

### 4. Run Database Migrations

```bash
npx prisma migrate deploy
```

Or for local development (creates migration files):

```bash
npx prisma migrate dev
```

### 5. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Environment Variables

Create a `.env.local` file in the project root with the following variables:

```env
# ─── Clerk Authentication ───────────────────────────────────
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Clerk redirect URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# ─── Database (Supabase PostgreSQL) ─────────────────────────
# Use the "Transaction" connection string from Supabase dashboard
DATABASE_URL=postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true

# ─── AI (OpenRouter) ────────────────────────────────────────
OPENROUTER_API_KEY=sk-or-v1-...
```

> **Important:** Use the **Transaction pooler** connection string from Supabase (port 6543) with `?pgbouncer=true` for compatibility with serverless Vercel functions.

---

## 📁 Project Structure

```
life-os/
├── prisma/
│   ├── schema.prisma          # Database schema (11 models)
│   └── migrations/            # SQL migration history
│
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Root layout (ClerkProvider, fonts)
│   │   ├── page.tsx           # Landing page
│   │   ├── globals.css        # Global styles
│   │   ├── dashboard/
│   │   │   ├── layout.tsx     # Dashboard layout (sidebar + panel)
│   │   │   ├── layout-client.tsx
│   │   │   └── planner/       # Daily planner page
│   │   ├── analytics/         # Analytics dashboard page
│   │   ├── coach/             # AI Learning Coach page
│   │   └── api/
│   │       ├── chat/          # AI chat endpoint
│   │       ├── goals/         # Goals CRUD
│   │       ├── tasks/         # Tasks CRUD
│   │       ├── planner/       # Plan generation
│   │       └── analytics/     # Analytics data
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── sidebar.tsx        # Main navigation sidebar
│   │   │   ├── dashboard-panel.tsx # Goals/tasks panel
│   │   │   └── chat-window.tsx    # AI chat interface
│   │   ├── analytics/             # Analytics chart components
│   │   ├── coach/                 # Coach UI components
│   │   ├── ui/                    # Shared base UI components
│   │   └── home-content.tsx       # Landing page content
│   │
│   ├── lib/
│   │   ├── db.ts                  # Prisma client singleton
│   │   ├── utils.ts               # Shared utilities
│   │   ├── sidebar-context.tsx    # Sidebar open/close context
│   │   └── actions/
│   │       ├── analytics.ts       # Analytics server actions
│   │       ├── coach.ts           # Coach server actions
│   │       ├── goals.ts           # Goals server actions
│   │       └── tasks.ts           # Tasks server actions
│   │
│   ├── hooks/                     # React custom hooks
│   └── types/                     # Shared TypeScript types
│
├── next.config.ts
├── tailwind.config.ts
├── prisma.config.ts
├── tsconfig.json
└── package.json
```

---

## 🌍 Deployment

LifeOS is deployed on **Vercel** with a **Supabase PostgreSQL** database.

### Deploy Your Own

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/rudranil723/LifeOS)

**Steps:**
1. Fork this repository
2. Connect your fork to Vercel
3. Add all [environment variables](#-environment-variables) in the Vercel project settings
4. Vercel will auto-run `npm install` (which triggers `prisma generate` via `postinstall`)
5. Run `npx prisma migrate deploy` against your production database once

### CI/CD
- Every push to `main` triggers an automatic Vercel deployment
- Prisma Client is regenerated on every deploy via the `postinstall` hook
- Environment variables are managed entirely in Vercel's dashboard

---

## 🗺 Roadmap

- [ ] **Real-time reminders** — Push/email notifications for scheduled reminders via `Reminder` model
- [ ] **Streak system UI** — Visual streak counter on the dashboard
- [ ] **AI memory editor** — Let users view and manually manage their `Memory` records
- [ ] **Multi-LLM support** — Provider selection (Gemini, Claude, GPT-4o) via AI SDK vendor abstraction
- [ ] **Mobile PWA** — Progressive Web App support for on-the-go access
- [ ] **Collaboration** — Shared goals and accountability buddy features
- [ ] **Export / Reports** — Weekly PDF/email productivity reports

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'feat: add your feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

Please ensure your code passes linting (`npm run lint`) before submitting.

---

## 📜 License

This project is private and proprietary. All rights reserved.

---

<div align="center">

**Built with ❤️ using Next.js, Prisma, Clerk, and OpenRouter**

[🚀 Try LifeOS Live](https://life-os-g5ap.vercel.app/)

</div>
