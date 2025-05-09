'use client';

import {
  Settings,
  TrendingUp,
  Wallet,
  BarChart,
} from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const FinanceSidebar = () => {
  const pathname = usePathname();

  const sidebarItems = [
    {
      href: "/finance",
      icon: <BarChart className="h-4 w-4" />,
      label: "المالية"
    },
    {
      href: "/finance/wallet",
      icon: <Wallet className="h-4 w-4" />,
      label: "الميزانية"
    },
    {
      href: "/finance/investments",
      icon: <TrendingUp className="h-4 w-4" />,
      label: "التمويل"
    },
    {
      href: "/finance/settings",
      icon: <Settings className="h-4 w-4" />,
      label: "الإعدادات"
    }
  ];

  return (
    <aside className="w-full md:w-28 ml-20 hidden md:block">
      <h4 className="text-xl font-medium mb-3 hidden md:hidden">الشؤون المالية</h4>
      <nav>
        {sidebarItems.map((item) => (
          <Link key={item.href} href={item.href} passHref>
            <Button 
              variant="ghost" 
              className={cn(
                "w-full justify-start mb-2",
                pathname === item.href && "bg-muted"
              )}
            >
              <span className="">{item.icon}</span>
              {item.label}
            </Button>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default FinanceSidebar;
