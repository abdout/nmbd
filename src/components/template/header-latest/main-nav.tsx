"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { siteConfig } from "./site"
import { cn } from "@/lib/utils"
import { Icons } from "./icons"

export function MainNav() {
  const pathname = usePathname()

  return (
    <div className="ml-4 hidden md:flex">
      <Link href="/" className="ml-4 flex items-center gap-1 lg:ml-6">
      <svg
          width="40"
          height="18"
          viewBox="0 0 48 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="mt-0.5"
        >
          <circle cx="24" cy="9" r="9" fill="#FACC15" /> {/* yellow-400 */}
          <line x1="8" y1="9" x2="40" y2="9" stroke="#FACC15" strokeWidth="2" />
        </svg>
        <span className="hidden font-bold lg:inline-block">
          {siteConfig.name}
        </span>
      </Link>
      <nav className="flex items-center gap-5 text-[15px] xl:gap-6">
        <Link
          href="/member"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname === "/member"
              ? "text-foreground"
              : "text-foreground/80"
          )}
        >
          فريق
        </Link>
        <Link
          href="/repository"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname?.startsWith("/repository")
              ? "text-foreground"
              : "text-foreground/80"
          )}
        >
          مستودع
        </Link>
        <Link
          href="/issue"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname?.startsWith("/issue")
              ? "text-foreground"
              : "text-foreground/80"
          )}
        >
          مشكلة
        </Link>
        <Link
          href="/wikipaper"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname?.startsWith("/wikipaper")
              ? "text-foreground"
              : "text-foreground/80"
          )}
        >
          ورقة
        </Link>
        <Link
          href="/club"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname?.startsWith("/club")
              ? "text-foreground"
              : "text-foreground/80"
          )}
        >
          امانة
        </Link>
        <Link
          href="/finance"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname?.startsWith("/finance")
              ? "text-foreground"
              : "text-foreground/80"
          )}
        >
          مال
        </Link>
      </nav>
    </div>
  )
}