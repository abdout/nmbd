'use client';
import React from 'react';
import { DashboardSidebar } from "@/components/platform/sidebar";
import { usePathname } from 'next/navigation';

export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isEditRoute = pathname?.includes('/edit');
  const isMembershipIdRoute = /^\/dashboard\/membership\/[^/]+$/.test(pathname || "");

  if (isEditRoute || isMembershipIdRoute) {
    return children;
  }

  return (
    <div className="flex h-screen ">
      <DashboardSidebar />
      <div className="flex-1 py-2 ">
        {children}
      </div>
    </div>
  );
} 