"use client"

import * as React from "react"
import Link from "next/link"
import { useSelectedLayoutSegment, usePathname } from "next/navigation"

import { MainNavItem } from "./type"
import { siteConfig } from "./constant"
import { cn } from "@/lib/utils"
import { Icons } from "./icons"
import { MobileNav } from "./mobile-nav"

interface MainNavProps {
  items?: MainNavItem[]
  children?: React.ReactNode
}

export function MainNav({ items, children }: MainNavProps) {
  const segment = useSelectedLayoutSegment()
  const pathname = usePathname()
  const [showMobileMenu, setShowMobileMenu] = React.useState<boolean>(false)

  // Close mobile menu when pathname changes
  React.useEffect(() => {
    setShowMobileMenu(false)
  }, [pathname])

  return (
    <div className="flex gap-6 md:gap-10 antialiased font-sans">
      <Link href="/" className="hidden items-center space-x-2 md:flex">
        {/* <Icons.logo /> */}
        <div className="w-[18px] h-[18px] bg-yellow-400 rounded-full flex items-center justify-center ml-2"/>
        <span className="hidden font-bold text-[16px] sm:inline-block">
          {siteConfig.name}
        </span>
      </Link>
      {items?.length ? (
        <nav className="hidden gap-8 antialiased font-sans md:flex ">
          {items?.map((item, index) => (
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
          <div className="ml-2"><Icons.close /></div> : <div className="w-6 h-6 bg-yellow-400 rounded-full ml-2"/>}
        <span className="font-bold text-lg">القائمة</span>
      </button>
      {showMobileMenu && items && (
        <MobileNav items={items}>{children}</MobileNav>
      )}
    </div>
  )
}