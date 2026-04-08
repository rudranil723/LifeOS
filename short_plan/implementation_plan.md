# Phase 4a: AI Smart Planner

With the conversational AI completely hooked up, we'll build the first core feature: the **AI Smart Planner**. This feature will take the user's unstructured tasks/goals and auto-generate an optimized schedule for the day.

## User Review Required

Does this structural approach for the Smart Planner make sense to you? Would you like the daily schedule to be displayed in the Dashboard Panel, or as a message in the Chat Window?

## Proposed Changes

### 1. Structured AI Generation
#### [NEW] `src/lib/actions/planner.ts`
- Create a `generateDailyPlan` Server Action.
- Use the Vercel AI SDK's `generateObject` hook combined with Gemini to strictly output a JSON array of schedule blocks: `{ timeRange: "09:00 - 10:30", taskTitle: "Deep Work", type: "STUDY" }`.
- Persist the generated JSON into the `DailyPlan` postgres table via Prisma.

### 2. Frontend Planner Trigger
#### [MODIFY] `src/components/layout/chat-window.tsx`
- The "Plan my day" quick-action button in the Chat Window will now actually trigger the `generateDailyPlan` server action.

### 3. Displaying the Schedule
#### [MODIFY] `src/components/layout/dashboard-panel.tsx`
- Remove the static "Mock Graph".
- Retrieve today's `DailyPlan` from the database.
- Render a timeline UI on the right-hand panel showing the user exactly what to do and when.

## Open Questions
1. **Time Blocking:** Should the AI planner completely fill out an 8-hour workday, or just allocate blocks specifically for the active tasks and leave the rest as "Free Time"?

## Verification Plan
### Manual Verification
- We will click "Plan my day".
- Verify the server correctly calls Gemini for JSON generation.
- Verify the right-side dashboard instantly updates to show the chronological schedule without reloading.
