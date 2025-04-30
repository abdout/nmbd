'use client';
import React from 'react';
import Sidebar from "@/components/platform/sidebar";
import { usePathname } from 'next/navigation';

export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isEditRoute = pathname?.includes('/edit');

  if (isEditRoute) {
    return children;
  }

  return (
    <div className="flex h-screen -mx-4">
      <Sidebar />
      <div className="flex-1 p-4">
        {children}
      </div>
    </div>
  );
} 