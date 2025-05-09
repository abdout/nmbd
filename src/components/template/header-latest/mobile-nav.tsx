"use client"

import * as React from "react"
import Link, { LinkProps } from "next/link"
import { usePathname, useRouter } from "next/navigation"
import dynamic from 'next/dynamic'

import { docsConfig } from "./docs"
import { cn } from "@/lib/utils"
import { useMetaColor } from "./use-meta-color"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer"

// Dynamically import sidebar components to avoid SSR issues
const DashboardSidebar = dynamic(() => import('@/components/platform/sidebar'), {
  ssr: false,
})

const FinanceSidebar = dynamic(() => import('@/components/finance/sidebar'), {
  ssr: false,
})

// Custom styles for mobile sidebar
const mobileSidebarStyles = `
  .mobile-sidebar-wrapper aside {
    width: 100% !important;
    padding: 0 !important;
    display: block !important;
  }
  
  .mobile-sidebar-wrapper aside > div {
    position: static !important;
    top: 0 !important;
  }
`;

export function MobileNav() {
  const [open, setOpen] = React.useState(false)
  const { setMetaColor, metaColor } = useMetaColor()
  const pathname = usePathname()

  // Determine which sidebar to show based on the current route
  const getSidebarComponent = () => {
    if (pathname.startsWith("/dashboard")) {
      return <DashboardSidebar />
    } else if (pathname.startsWith("/finance")) {
      return <FinanceSidebar />
    } else {
      return null
    }
  }

  const sidebarComponent = getSidebarComponent()

  const onOpenChange = React.useCallback(
    (open: boolean) => {
      setOpen(open)
      setMetaColor(open ? "#09090b" : metaColor)
    },
    [setMetaColor, metaColor]
  )

  return (
    <>
      <style jsx global>{mobileSidebarStyles}</style>
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerTrigger asChild>
          <Button
            variant="ghost"
            className="h-8 w-full gap-4 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="!size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 9h16.5m-16.5 6.75h16.5"
              />
            </svg>
            <span className="sr-only">تبديل القائمة</span>
            <span className="flex h-8 flex-1 items-center justify-between rounded-md border bg-muted/50 px-2 text-sm font-normal text-muted-foreground shadow-none">
              ابحث عن ...
            </span>
          </Button>
        </DrawerTrigger>
        <DrawerContent className="max-h-[80svh] p-0">
          <div className="grid grid-cols-2 gap-4 overflow-auto p-6">
            {/* Left column - Main Navigation */}
            <div className="flex flex-col space-y-3">
              {docsConfig.mainNav?.map(
                (item) =>
                  item.href && (
                    <MobileLink
                      key={item.href}
                      href={item.href}
                      onOpenChange={setOpen}
                    >
                      {item.title}
                    </MobileLink>
                  )
              )}
            </div>
            
            {/* Right column - Context-specific Sidebar */}
            <div className="flex flex-col space-y-2">
              {sidebarComponent && (
                <div className="mobile-sidebar-wrapper">
                  {sidebarComponent}
                </div>
              )}
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  )
}

interface MobileLinkProps extends LinkProps {
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
  className?: string
}

function MobileLink({
  href,
  onOpenChange,
  className,
  children,
  ...props
}: MobileLinkProps) {
  const router = useRouter()
  return (
    <Link
      href={href}
      onClick={() => {
        router.push(href.toString())
        onOpenChange?.(false)
      }}
      className={cn("text-[1.15rem]", className)}
      {...props}
    >
      {children}
    </Link>
  )
}