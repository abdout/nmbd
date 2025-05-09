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
src/components/notifications/
  readme.md                # This file
  type.ts                  # Notification types, interfaces, enums
  event.ts                 # Event emitters/listeners for notification triggers (future)
  action.ts                # Core notification logic (send, fetch, mark as read, etc.)
  whatsapp.ts              # WhatsApp notification channel
  NotificationList.tsx     # UI for notification list in-app
  NotificationIcon.tsx     # Sidebar icon with badge/indicator
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

## First Step Implementation: Onboarding Completion Notifications

### Overview
This section outlines the implementation of notifications for when new users complete their onboarding process. The system will:
1. Send in-app notifications to administrators/reviewers
2. Send WhatsApp notifications to a designated WhatsApp number
3. Update the notification badge in the sidebar

### Implementation Status

✅ The following components have been implemented:

1. **Database Schema:**
   - Added `Notification` model to store in-app notifications
   - Updated `User` model with relation to notifications
   
2. **Notification Core:**
   - Created type definitions in `type.ts`
   - Implemented notification actions in `action.ts`
   - Added WhatsApp handler in `whatsapp.ts`
   
3. **UI Components:**
   - Created notification icon with badge in `NotificationIcon.tsx`
   - Built notification list in `NotificationList.tsx`
   - Updated sidebar to use the notification icon
   - Enhanced notifications page
   
4. **Integration with Onboarding:**
   - Modified `completeOnboarding()` in `src/components/onboarding/review/action.ts` to:
     - Keep the existing email notification via `notifyNewApplication()`
     - Add new in-app notifications and WhatsApp notifications via `notifyOnboardingSubmission()`

### Required Files and Changes

#### 1. Database Schema (`prisma/schema.prisma`)
Added Notification model to store in-app notifications:

```prisma
model Notification {
  id          String    @id @default(auto()) @map("_id") @db.ObjectId
  title       String
  content     String
  userId      String?   @db.ObjectId  // Optional: the user this notification is for
  type        String    // "ONBOARDING_SUBMITTED", "APPLICATION_APPROVED", etc.
  isRead      Boolean   @default(false)
  metadata    Json?     // Additional data related to notification
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  user        User?     @relation(fields: [userId], references: [id], onDelete: SetNull)
  
  @@index([userId])
  @@index([isRead])
}
```

Updated the User model to include the relationship:

```prisma
model User {
  // ... existing fields
  
  // Add this relation
  notifications       Notification[]
}
```

#### 2. Notification Type Definitions (`src/components/notifications/type.ts`)

```typescript
export enum NotificationType {
  ONBOARDING_SUBMITTED = 'ONBOARDING_SUBMITTED',
  APPLICATION_APPROVED = 'APPLICATION_APPROVED',
  APPLICATION_REJECTED = 'APPLICATION_REJECTED',
  // Add more notification types as needed
}

export interface NotificationPayload {
  title: string;
  content: string;
  recipientId?: string; // For admin notifications, this might be null
  type: NotificationType;
  metadata?: Record<string, any>;
}

export interface Notification extends NotificationPayload {
  id: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

#### 3. Notification Actions (`src/components/notifications/action.ts`)

```typescript
'use server';

import { db } from '@/lib/db';
import { NotificationType, NotificationPayload } from './type';
import { currentUser } from '@/lib/auth';
import { sendWhatsAppNotification } from './whatsapp';

/**
 * Create a new in-app notification
 */
export async function createNotification(data: NotificationPayload) {
  return db.notification.create({
    data: {
      title: data.title,
      content: data.content,
      userId: data.recipientId,
      type: data.type,
      metadata: data.metadata || {},
    },
  });
}

/**
 * Create an onboarding submission notification for admins
 */
export async function notifyOnboardingSubmission(
  applicantName: string,
  applicantId: string,
  applicantEmail?: string | null,
  applicantPhone?: string | null,
  applicantWhatsapp?: string | null,
) {
  try {
    // 1. Get admin users to notify
    const admins = await db.user.findMany({
      where: {
        OR: [
          { role: 'ADMIN' },
          { role: 'MEMBERSHIP' },
        ],
      },
      select: {
        id: true,
      },
    });
    
    // 2. Create in-app notifications for each admin
    for (const admin of admins) {
      await createNotification({
        title: 'طلب عضوية جديد',
        content: `قام ${applicantName} بتقديم طلب عضوية جديد وهو بانتظار المراجعة`,
        recipientId: admin.id,
        type: NotificationType.ONBOARDING_SUBMITTED,
        metadata: {
          applicantId,
          applicantName,
          applicantEmail,
          applicantPhone,
          applicantWhatsapp,
        },
      });
    }
    
    // 3. Send WhatsApp notification if configured
    if (process.env.WHATSAPP_NOTIFICATIONS_ENABLED === "true" && 
        process.env.MEMBERSHIP_SECRETARY_WHATSAPP) {
      await sendWhatsAppNotification({
        to: process.env.MEMBERSHIP_SECRETARY_WHATSAPP,
        message: `طلب عضوية جديد: ${applicantName}. يرجى مراجعة الطلب في لوحة التحكم.`,
      });
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error sending onboarding submission notification:', error);
    return { success: false, error };
  }
}

/**
 * Get unread notifications count for the current user
 */
export async function getUnreadNotificationsCount() {
  try {
    const user = await currentUser();
    if (!user?.id) return 0;
    
    return db.notification.count({
      where: {
        userId: user.id,
        isRead: false,
      },
    });
  } catch (error) {
    console.error('Error fetching unread notifications count:', error);
    return 0;
  }
}

/**
 * Get notifications for the current user
 */
export async function getUserNotifications(limit = 10, offset = 0) {
  try {
    const user = await currentUser();
    if (!user?.id) return [];
    
    return db.notification.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      skip: offset,
    });
  } catch (error) {
    console.error('Error fetching user notifications:', error);
    return [];
  }
}

/**
 * Mark notification as read
 */
export async function markNotificationAsRead(notificationId: string) {
  try {
    const user = await currentUser();
    if (!user?.id) return { success: false, error: 'Unauthorized' };
    
    await db.notification.update({
      where: {
        id: notificationId,
        userId: user.id,
      },
      data: {
        isRead: true,
      },
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return { success: false, error };
  }
}
```

#### 4. WhatsApp Notification Handler (`src/components/notifications/whatsapp.ts`)

```typescript
'use server';

type WhatsAppPayload = {
  to: string;
  message: string;
};

/**
 * Send WhatsApp notification
 * Implementation will depend on your WhatsApp provider
 */
export async function sendWhatsAppNotification({ to, message }: WhatsAppPayload) {
  // Skip sending in development mode
  if (process.env.NODE_ENV === "development") {
    console.log("📱 WHATSAPP NOTIFICATION (DEV MODE - NOT ACTUALLY SENT)");
    console.log(`To: ${to}`);
    console.log(`Message: ${message}`);
    return { success: true };
  }
  
  try {
    // Replace with your actual WhatsApp API implementation
    // Example with Twilio:
    // const twilioClient = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    // await twilioClient.messages.create({
    //   body: message,
    //   from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
    //   to: `whatsapp:${to}`
    // });
    
    // For now, we'll just log the attempt
    console.log(`WhatsApp notification would be sent to ${to}`);
    return { success: true };
  } catch (error) {
    console.error('Error sending WhatsApp notification:', error);
    return { success: false, error };
  }
}
```

#### 5. Updated Onboarding Review Action (`src/components/onboarding/review/action.ts`)
Integrated with the notification system in the `completeOnboarding` function:

```typescript
import { notifyOnboardingSubmission } from '@/components/notifications/action';

// Inside the completeOnboarding function where it marks the onboarding as completed
export async function completeOnboarding(): Promise<{ success: boolean, error: string | null }> {
  try {
    const user = await currentUser();
    if (!user?.id) {
      return { success: false, error: "Unauthorized" };
    }
    
    // Update the user's onboarding status
    await db.user.update({
      where: { id: user.id },
      data: {
        onboardingStatus: "COMPLETED",
        applicationStatus: "PENDING",
      },
    });
    
    // Get user details for notification
    const userData = await db.user.findUnique({
      where: { id: user.id },
      select: {
        id: true, 
        name: true,
        email: true,
        phone: true,
        whatsapp: true
      }
    });
    
    if (userData) {
      // 1. Send traditional email notification (legacy system)
      // ... existing email notification code ...
      
      // 2. Send in-app and WhatsApp notifications using the new system
      await notifyOnboardingSubmission(
        userData.name || 'New Applicant',
        userData.id,
        userData.email,
        userData.phone,
        userData.whatsapp
      );
    }
    
    return { success: true, error: null };
  } catch (error) {
    console.error("Error completing onboarding:", error);
    return {
      success: false,
      error: "Failed to complete onboarding. Please try again."
    };
  }
}
```

### Configuration and Setup

1. **Environment Variables**
   Add to your `.env` file:
   ```
   # WhatsApp notification settings
   WHATSAPP_NOTIFICATIONS_ENABLED=true
   MEMBERSHIP_SECRETARY_WHATSAPP=+1234567890  # Replace with actual WhatsApp number
   ```

2. **Database Migration**
   After adding the Notification model to the schema:
   ```
   npx prisma db push
   ```

## Next Steps

1. **Testing and Verification:**
   - Test the onboarding completion flow to ensure notifications are created
   - Verify the notification badge appears in sidebar with the correct count
   - Check that the notifications page displays the notifications

2. **Future Enhancements:**
   - Implement event emitters/listeners for a more decoupled architecture
   - Add more notification types (e.g., application approved/rejected)
   - Create real-time notification updates using WebSockets
   - Add filtering options in the notification list

## Best Practices
- Use TypeScript types/enums for notification payloads and channels.
- Keep channel logic isolated for easy maintenance.
- Use async/await for all notification sending logic.
- Make notification fetching efficient (pagination, unread filter, etc.).
- Use a single source of truth for notification state (e.g. database or in-memory store). 