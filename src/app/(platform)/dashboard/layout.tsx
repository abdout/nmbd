import React from 'react';
import Sidebar from "@/components/platform/sidebar";

export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen -mx-4">
      <Sidebar />
      <div className="flex-1 p-4">
        {children}
      </div>
    </div>
  );
} 