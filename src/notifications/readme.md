# Notification System Design

This document describes the architecture and usage of the notification system for the application, designed for scalability and extensibility.

## Goals
- **Internal notifications:** Show in-app notifications (e.g. for onboarding review events) and update the sidebar notification icon.
- **External notifications:** Support sending notifications via channels like WhatsApp, email, etc.
- **Event-driven:** Use an event-based approach so new notification types and channels can be added easily.
- **Centralized logic:** All notification-related code lives in `src/notifications`.

---

## Folder Structure

```
src/notifications/
  readme.md                # This file
  types.ts                 # Notification types, interfaces, enums
  events.ts                # Event emitters/listeners for notification triggers
  service.ts               # Core notification logic (send, fetch, mark as read, etc.)
  channels/
    in-app.ts              # In-app notification channel
    whatsapp.ts            # WhatsApp notification channel
    ...                    # (future) email.ts, sms.ts, etc.
  components/
    NotificationList.tsx   # UI for notification list in-app
    NotificationIcon.tsx   # Sidebar icon with badge/indicator
```

---

## How It Works

1. **Triggering an Event:**
   - When a user completes onboarding (or any other event), an event is emitted (e.g. `onboarding:submitted`).
2. **Notification Service:**
   - Listens for events and creates notification objects.
   - Sends notifications to the appropriate channels (in-app, WhatsApp, etc.).
3. **In-App Notifications:**
   - Stored in the database and fetched for display in the UI (e.g. notification list, sidebar icon).
4. **External Channels:**
   - The service can send notifications via WhatsApp, email, etc., using pluggable channel modules.
5. **Sidebar Indicator:**
   - The sidebar icon component checks for unread notifications and displays a badge if there are new ones.

---

## Example: Onboarding Review Notification
- When a new member submits their onboarding process and reaches the review step:
  - Emit an event: `onboarding:submitted` with user info.
  - The notification service creates an in-app notification for admins/reviewers.
  - The sidebar icon shows a badge for new notifications.
  - Optionally, a WhatsApp message is sent to the reviewer group.

---

## Adding New Notification Types/Channels
- **To add a new notification type:**
  - Define a new event in `events.ts` and handle it in `service.ts`.
- **To add a new channel:**
  - Create a new file in `channels/` (e.g. `email.ts`) implementing the channel interface.
  - Register the channel in `service.ts`.

---

## Best Practices
- Use TypeScript types/enums for notification payloads and channels.
- Keep channel logic isolated for easy maintenance.
- Use async/await for all notification sending logic.
- Make notification fetching efficient (pagination, unread filter, etc.).
- Use a single source of truth for notification state (e.g. database or in-memory store).

---

## Next Steps
1. Define notification types and interfaces (`types.ts`).
2. Implement event emitters/listeners (`events.ts`).
3. Build the core notification service (`service.ts`).
4. Implement in-app and WhatsApp channels.
5. Build UI components for notification list and sidebar icon. 