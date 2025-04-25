"use client"

import * as React from "react"
import Link from "next/link"
import { useSelectedLayoutSegment } from "next/navigation"

import { MainNavItem } from "./type"
import { siteConfig } from "./constant"
import { cn } from "@/lib/utils"
import { Icons } from "./icons"
import { MobileNav } from "./mobile-nav"
import { useCurrentUser } from "@/components/auth/use-current-user"

interface MainNavProps {
  items?: MainNavItem[]
  children?: React.ReactNode
}

export function MainNav({ items, children }: MainNavProps) {
  const segment = useSelectedLayoutSegment()
  const [showMobileMenu, setShowMobileMenu] = React.useState<boolean>(false)
  const user = useCurrentUser()
  
  // Filter items based on user role
  const filteredItems = items?.filter(item => {
    // If the item doesn't have roleRequired, show it to everyone
    if (!item.roleRequired) return true
    
    // If user is not logged in or has no role, don't show role-restricted items
    if (!user || !user.role) return false
    
    // Check if user role is in the required roles list
    return item.roleRequired.includes(user.role)
  })

  return (
    <div className="flex gap-6 md:gap-10 antialiased font-sans">
      <Link href="/dashboard" className="hidden items-center space-x-2 md:flex">
        {/* <Icons.logo /> */}
        <svg
          width="48"
          height="18"
          viewBox="0 0 48 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="ml-2"
        >
          <circle cx="24" cy="9" r="9" fill="#FACC15" /> {/* yellow-400 */}
          <line x1="8" y1="9" x2="40" y2="9" stroke="#FACC15" strokeWidth="2" />
        </svg>
        {/* <div className="w-[18px] h-[18px] bg-yellow-400 rounded-full flex items-center justify-center ml-2"/> */}
        <span className="hidden font-bold text-[16px] sm:inline-block">
          {siteConfig.name}
        </span>




      </Link>
      {filteredItems?.length ? (
        <nav className="hidden gap-8 antialiased font-sans md:flex ">
          {filteredItems?.map((item, index) => (
            <Link
              key={index}
              href={item.disabled ? "#" : item.href}
              className={cn(
                "flex items-center text-lg font-bold transition-colors hover:text-foreground/80 sm:text-[15px]",
                item.href.startsWith(`/${segment}`)
                  ? "text-foreground"
                  : "text-foreground/60",
                item.disabled && "cursor-not-allowed opacity-80"
              )}
            >
              {item.title}
            </Link>
          ))}
        </nav>
      ) : null}
      <button
        className="flex items-center space-x-2 md:hidden"
        onClick={() => setShowMobileMenu(!showMobileMenu)}
      >
        {showMobileMenu ?
          <div className="ml-2"><Icons.close /></div> : <div className="w-6 h-6 bg-yellow-400 rounded-full ml-2" />}
        <span className="font-bold text-lg">القائمة</span>
      </button>
      {showMobileMenu && filteredItems && (
        <MobileNav items={filteredItems}>{children}</MobileNav>
      )}

    </div>
  )
}