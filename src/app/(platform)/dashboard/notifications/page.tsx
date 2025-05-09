'use client';

import React from 'react';
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