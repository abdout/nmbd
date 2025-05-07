# Notification System Design

This document describes the architecture and usage of the notification system for the application, designed for scalability and extensibility.

## Goals
- **Internal notifications:** Show in-app notifications (e.g. for onboarding review events) and update the sidebar notification icon.
- **External notifications:** Support sending notifications via channels like WhatsApp, email, etc.
- **Event-driven:** Use an event-based approach so new notification types and channels can be added easily.
- **Centralized logic:** All notification-related code lives in `src/components/notifications`.

---

## Folder Structure

```
src/components/notifications/
  readme.md                # This file
  type.ts                  # Notification types, interfaces, enums
  events.ts                # Event emitters/listeners for notification triggers
  action.ts                # Core notification logic (send, fetch, mark as read, etc.)
  in-app.ts                # In-app notification channel logic
  whatsapp.ts              # WhatsApp notification channel logic
  ...                      # (future) email.ts, sms.ts, etc.
  NotificationList.tsx     # UI for notification list in-app
  NotificationIcon.tsx     # Sidebar icon with badge/indicator
```

---

## How It Works

1. **Triggering an Event:**
   - When a user completes onboarding (or any other event), an event is emitted (e.g. `onboarding:submitted`).
2. **Notification Action:**
   - Listens for events and creates notification objects.
   - Sends notifications to the appropriate channels (in-app, WhatsApp, etc.).
3. **In-App Notifications:**
   - Stored in the database and fetched for display in the UI (e.g. notification list, sidebar icon).
4. **External Channels:**
   - The action logic can send notifications via WhatsApp, email, etc., using pluggable channel modules (each as a file in the notifications root).
5. **Sidebar Indicator:**
   - The sidebar icon component checks for unread notifications and displays a badge if there are new ones.

---

## Example: Onboarding Review Notification
- When a new member submits their onboarding process and reaches the review step:
  - Emit an event: `onboarding:submitted` with user info.
  - The notification action creates an in-app notification for admins/reviewers.
  - The sidebar icon shows a badge for new notifications.
  - Optionally, a WhatsApp message is sent to the reviewer group.

---

## Adding New Notification Types/Channels
- **To add a new notification type:**
  - Define a new event in `events.ts` and handle it in `action.ts`.
- **To add a new channel:**
  - Create a new file in `src/components/notifications/` (e.g. `email.ts`) implementing the channel interface.
  - Register the channel in `action.ts`.

---

## Core Files
- `type.ts`: TypeScript types, interfaces, and enums for notifications
- `events.ts`: Event emitters/listeners for notification triggers
- `action.ts`: Core notification logic (send, fetch, mark as read, etc.)
- `in-app.ts`, `whatsapp.ts`, ...: Channel logic for each notification channel
- `NotificationList.tsx`: UI for notification list in-app
- `NotificationIcon.tsx`: Sidebar icon with badge/indicator

---

## Best Practices
- Use TypeScript types/enums for notification payloads and channels.
- Keep channel logic isolated for easy maintenance.
- Use async/await for all notification sending logic.
- Make notification fetching efficient (pagination, unread filter, etc.).
- Use a single source of truth for notification state (e.g. database or in-memory store).

---

## Next Steps
1. Define notification types and interfaces (`type.ts`).
2. Implement event emitters/listeners (`events.ts`).
3. Build the core notification action logic (`action.ts`).
4. Implement in-app and WhatsApp channels as separate files.
5. Build UI components for notification list and sidebar icon. 