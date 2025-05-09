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
  event.ts                 # Event emitters/listeners for notification triggers
  action.ts                # Core notification logic (send, fetch, mark as read, etc.)
  in-app.ts                # In-app notification channel
  whatsapp.ts              # WhatsApp notification channel
  ...                      # (future) email.ts, sms.ts, etc.
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

### Required Files and Changes

#### 1. Database Schema (`prisma/schema.prisma`)
Add a Notification model to store in-app notifications:

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

Update the User model to include the relationship:

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

#### 5. Update Onboarding Review Action (`src/components/onboarding/review/action.ts`)
Integrate with the notification system in the `completeOnboarding` function:

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
      where: {
        id: user.id,
      },
      data: {
        onboardingStatus: "COMPLETED",
        applicationStatus: "PENDING",
      },
    });
    
    // Send notifications to admins
    await notifyOnboardingSubmission(
      user.name || 'New Applicant',
      user.id,
      user.email,
      user.phone,
      user.whatsapp
    );
    
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

#### 6. Create Notification Icon Component (`src/components/notifications/NotificationIcon.tsx`)

```tsx
'use client';

import { useState, useEffect } from 'react';
import { getUnreadNotificationsCount } from './action';

export function NotificationIcon({ className }: { className?: string }) {
  const [unreadCount, setUnreadCount] = useState(0);
  
  useEffect(() => {
    const fetchUnreadCount = async () => {
      const count = await getUnreadNotificationsCount();
      setUnreadCount(count);
    };
    
    fetchUnreadCount();
    
    // Set up polling or websocket connection for live updates
    const interval = setInterval(fetchUnreadCount, 60000); // Poll every minute
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="relative">
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="24" 
        height="24" 
        viewBox="0 0 24 24"
        className={className}
      >
        <path 
          fill="currentColor" 
          d="M21.53 14.47L20 13v-3a8 8 0 0 0-7-7.94V1h-2v1.06A8 8 0 0 0 4 9v3L2.47 13.47A1 1 0 0 0 2 14v2a1 1 0 0 0 1 1h5v1a4 4 0 0 0 8 0v-1h5a1 1 0 0 0 1-1v-2a1 1 0 0 0-.47-.53ZM14 18a2 2 0 0 1-4 0v-1h4Zm6-3H4v-.59l1.53-1.53A1 1 0 0 0 6 12v-3a6 6 0 0 1 12 0v3a1 1 0 0 0 .47.88L20 14.41Z"
        />
      </svg>
      
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </div>
  );
}
```

#### 7. Update Sidebar Component to Use NotificationIcon (`src/components/platform/sidebar.tsx`)

```tsx
// Import the NotificationIcon component
import { NotificationIcon } from '@/components/notifications/NotificationIcon';

// Replace the existing NotificationIcon with our custom component
// Inside the sidebarItems array:
{
  href: '/dashboard/notifications',
  icon: <NotificationIcon className="h-[18px] w-[18px]" />,
  label: 'الاشعارات'
},
```

#### 8. Create the Notification List Component (`src/components/notifications/NotificationList.tsx`)

```tsx
'use client';

import { useState, useEffect } from 'react';
import { getUserNotifications, markNotificationAsRead } from './action';
import { Notification } from './type';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';

export function NotificationList() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      const data = await getUserNotifications(20, 0);
      setNotifications(data);
      setLoading(false);
    };
    
    fetchNotifications();
  }, []);
  
  const handleMarkAsRead = async (id: string) => {
    await markNotificationAsRead(id);
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => 
        notification.id === id 
          ? { ...notification, isRead: true } 
          : notification
      )
    );
  };
  
  if (loading) {
    return <div className="p-4 text-center">جارٍ التحميل...</div>;
  }
  
  if (notifications.length === 0) {
    return <div className="p-4 text-center">لا توجد إشعارات</div>;
  }
  
  return (
    <div className="divide-y">
      {notifications.map(notification => (
        <div 
          key={notification.id}
          className={`p-4 hover:bg-muted transition-colors cursor-pointer ${
            !notification.isRead ? 'bg-muted/50' : ''
          }`}
          onClick={() => handleMarkAsRead(notification.id)}
        >
          <div className="flex justify-between items-start">
            <h3 className="font-medium text-sm">{notification.title}</h3>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(notification.createdAt), { 
                addSuffix: true,
                locale: ar 
              })}
            </span>
          </div>
          <p className="text-sm mt-1 text-muted-foreground">{notification.content}</p>
        </div>
      ))}
    </div>
  );
}
```

#### 9. Create Notifications Page (`src/app/(platform)/dashboard/notifications/page.tsx`)

```tsx
import { NotificationList } from '@/components/notifications/NotificationList';

export default function NotificationsPage() {
  return (
    <div className="container py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">الإشعارات</h1>
        <p className="text-muted-foreground">عرض جميع الإشعارات الخاصة بك</p>
      </div>
      
      <div className="bg-card border rounded-lg shadow-sm">
        <NotificationList />
      </div>
    </div>
  );
}
```

#### 10. Environment Variables (`.env`)
Add the following environment variables:

```
# WhatsApp notification settings
WHATSAPP_NOTIFICATIONS_ENABLED=true
MEMBERSHIP_SECRETARY_WHATSAPP=+1234567890  # Replace with actual WhatsApp number
```

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
1. Define notification types and interfaces (`type.ts`).
2. Implement event emitters/listeners (`event.ts`).
3. Build the core notification service (`action.ts`).
4. Implement in-app and WhatsApp channels.
5. Build UI components for notification list and sidebar icon. 