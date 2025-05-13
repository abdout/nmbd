'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { NotificationIcon } from '@/components/notifications/NotificationIcon';
import { useCurrentRole } from '@/components/auth/hooks/use-current-role';

// Custom SVG icons as React components
const HomeIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24"
    className={className}
  >
    <g fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="5" y="11" width="14" height="8" rx="1" />
      <path d="M3 11L12 4L21 11" />
    </g>
  </svg>
);

const MessageIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24"
    className={className}
  >
    <g fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect width="16" height="12" x="4" y="6" rx="2"/>
      <path d="m4 9l7.106 3.553a2 2 0 0 0 1.788 0L20 9"/>
    </g>
  </svg>
);

const UserIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24"
    className={className}
  >
    <g fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinejoin="round" d="M4 18a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z"/>
      <circle cx="12" cy="7" r="3"/>
    </g>
  </svg>
);

const MembershipIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 512 512" className={className}>
  <path fill="currentColor" stroke="currentColor" strokeWidth="10" d="M255 471L91.7 387V41h328.6v346zm-147.3-93.74L255 453l149.3-75.76V57H107.7zm146.43-65.76l98.27-49.89v-49.9l-98.14 49.82l-94.66-48.69v50zm.13 32.66l-94.66-48.69v50l94.54 48.62l98.27-49.89v-49.9z"/>
</svg>
);

const SettingsIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24"
    className={className}
  >
    <path
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87c.074.04.147.083.22.127c.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 0 1 0 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 0 1 0-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124c.072-.044.146-.087.22-.128c.332-.183.582-.495.644-.869l.214-1.281z"
    />
    <path
      fill="none"
      stroke="currentColor" 
      strokeWidth="1.5" 
      d="M15 12a3 3 0 1 1-6 0a3 3 0 0 1 6 0z"
    />
  </svg>
);

interface SidebarItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

const SidebarItem = ({ href, icon, label, active }: SidebarItemProps) => {
  return (
    <Link href={href}>
      <div
        className={cn(
          'flex items-center gap-2 p-2 rounded-md transition-colors w-32',
          active 
            ? 'text-foreground hover:bg-muted' 
            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
        )}
      >
        {icon}
        <span className="text-sm font-medium">{label}</span>
      </div>
    </Link>
  );
};

export function DashboardSidebar() {
  const pathname = usePathname();
  const userRole = useCurrentRole();
  
  const sidebarItems = [
    {
      href: '/dashboard',
      icon: <HomeIcon className="h-5 w-5" />,
      label: 'الرئيسية'
    },
    {
      href: '/dashboard/messages',
      icon: <MessageIcon className="h-5 w-5" />,
      label: 'الرسائل'
    },
    {
      href: '/dashboard/notifications',
      icon: <NotificationIcon className="h-[18px] w-[18px]" />,
      label: 'الاشعارات'
    },
    {
      href: '/dashboard/profile',
      icon: <UserIcon className="h-5 w-5" />,
      label: 'الملف'
    },
    ...(userRole === "ADMIN" ? [{
      href: '/dashboard/membership',
      icon: <MembershipIcon className="h-5 w-5" />,
      label: 'العضوية'
    }] : []),
    {
      href: '/dashboard/settings',
      icon: <SettingsIcon className="h-[18px] w-[18px]" />,
      label: 'الضبط'
    }
  ];

  return (
    <aside className="pl-4 h-full w-auto bg-background flex-col items-start hidden md:block">
      <div className="sticky top-8 flex flex-col gap-1 items-start w-full">
        {sidebarItems.map((item) => (
          <SidebarItem
            key={item.href}
            href={item.href}
            icon={item.icon}
            label={item.label}
            active={
              item.href === '/dashboard' 
                ? pathname === '/dashboard' 
                : pathname.startsWith(item.href)
            }
          />
        ))}
      </div>
    </aside>
  );
}

export default DashboardSidebar; 