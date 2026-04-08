# LifeOS

LifeOS is an AI-powered personal operating system built with Next.js, Clerk, Prisma, PostgreSQL, and a chat-first interface.

The current version combines:
- a **three-panel desktop layout**
- **authentication with Clerk**
- a **PostgreSQL + Prisma data model** for goals, tasks, memories, reminders, chat history, and study sessions
- an **AI chat endpoint** that uses user context from the database
- a dark, portfolio-style UI with Tailwind and Framer Motion

## Current state

This repository is no longer just a starter template. At the moment, the app includes:

- a homepage composed of **Sidebar + Chat Window + Dashboard Panel**
- Clerk-based sign-in protection on the main page
- a working `/api/chat` route
- Prisma models for the core LifeOS entities
- chat persistence for user and assistant messages
- contextual prompting using:
  - active goals
  - unfinished tasks
  - stored memories

The AI chat route currently calls **OpenRouter** directly and sends a system prompt enriched with database context.

## Implemented features

### 1. Authentication
- Clerk is integrated in the root layout
- unauthenticated users are shown a sign-in screen
- authenticated users are allowed into the main LifeOS interface

### 2. Main UI
The current UI is organized into three sections:

#### Sidebar
- LifeOS branding
- overview navigation
- placeholder active goals
- placeholder daily tasks
- settings button

#### Chat Window
- user and assistant message bubbles
- loading state
- auto-scroll to latest message
- input box with send action
- error rendering inside the assistant bubble when the API call fails

#### Dashboard Panel
- mock insight cards
- productivity/focus card
- streak card
- study-hours mini chart
- task completion progress bar

## AI chat flow

When a user sends a message:

1. the frontend sends the current message list to `/api/chat`
2. the API route checks authentication
3. the route ensures the Clerk user exists in the local database
4. the route fetches:
   - in-progress goals
   - incomplete tasks
   - stored memories
5. the route builds a focused system prompt using that context
6. the route sends the conversation to OpenRouter
7. the assistant reply is saved in the database
8. the plain-text response is returned to the chat UI

## Database models

The Prisma schema currently includes:

- `User`
- `Goal`
- `Task`
- `Memory`
- `ChatMessage`
- `DailyPlan`
- `StudySession`
- `Reminder`

This gives the project a solid base for future features like:
- AI smart planning
- habit and study tracking
- memory-aware responses
- reminders and proactive nudges
- analytics dashboards

## Tech stack

- **Framework:** Next.js 16
- **Language:** TypeScript
- **UI:** React 19, Tailwind CSS 4, Framer Motion
- **Icons:** Lucide React
- **Auth:** Clerk
- **Database:** PostgreSQL
- **ORM:** Prisma
- **AI:** OpenRouter API
- **Package manager:** npm

## Project structure

```text
LifeOS/
├── prisma/
│   └── schema.prisma
├── public/
├── short_plan/
├── src/
│   ├── app/
│   │   ├── api/chat/route.ts
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   └── layout/
│   │       ├── chat-window.tsx
│   │       ├── dashboard-panel.tsx
│   │       └── sidebar.tsx
│   └── lib/
│       └── db.ts
├── package.json
└── README.md
```

## Environment variables

Create a `.env` or `.env.local` file and configure the following values:

```env
DATABASE_URL=
OPENROUTER_API_KEY=

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
```

Depending on your Clerk setup, you may also need additional Clerk variables.

## Getting started

### 1. Clone the repo
```bash
git clone https://github.com/rudranil723/LifeOS.git
cd LifeOS
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set environment variables
Create `.env.local` and add your keys.

### 4. Generate Prisma client
```bash
npx prisma generate
```

### 5. Push the schema to your database
```bash
npx prisma db push
```

### 6. Run the app
```bash
npm run dev
```

Open `http://localhost:3000`.

## Available scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## What is working now

- app boots successfully
- Clerk auth is integrated
- database client is configured
- chat requests are processed through `/api/chat`
- AI replies are returned in the UI
- user and assistant messages are stored
- goals, tasks, and memories are injected into the prompt context

## What is still in progress

This repository is in an early but functional stage. A few parts are still scaffolded or partially implemented:

- sidebar goals/tasks are currently static UI
- dashboard analytics are mock data
- no full CRUD UI yet for goals, tasks, or memories
- no dedicated daily planner UI yet
- no reminder scheduler yet
- no proactive AI nudges yet
- no true multi-view navigation yet
- the chat route currently returns plain text rather than token-by-token streaming
- the README had not yet been updated to reflect the real project state

## Suggested next milestones

### Phase 1: Productize the current foundation
- add proper `.env.example`
- add database migration workflow docs
- add loading and empty states across panels
- improve API error messages shown to users

### Phase 2: Make core entities visible
- build CRUD UI for goals
- build CRUD UI for tasks
- build memory management UI
- connect sidebar data to the database

### Phase 3: Improve AI behavior
- persist and replay recent chat history from the database
- support streaming responses properly
- add tool-like actions for planning and task creation
- add model/provider configuration

### Phase 4: Build the LifeOS promise
- AI smart planner
- learning coach workflows
- reminder engine
- analytics from real stored activity

## Notes for recruiters/portfolio viewers

LifeOS is being built as a personal AI operating system rather than just a chatbot. The project already demonstrates:

- full-stack Next.js architecture
- auth + DB + AI integration
- context-aware prompting
- scalable schema design for future product expansion
- a polished dark UI direction suitable for a portfolio project

## License

No license has been added yet. If you plan to make this public for collaboration, add a license file.
