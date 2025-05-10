"use client"

import Link from "next/link"
import { usePathname, useParams } from "next/navigation"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

const navLinks = [
  { name: "حول", slug: "about" },
  { name: "طريق", slug: "roadmap" },
  { name: "مستودع", slug: "repository" },
  { name: "مشكلة", slug: "issue" },
  { name: "نقاش", slug: "discussion" },
  { name: "مالي", slug: "finance" },
  { name: "تقرير", slug: "report" },
]

export function ClubNav() {
  const pathname = usePathname()
  const params = useParams()
  const id = params?.id

  return (
    <div className="relative overflow-hidden">
      <ScrollArea className="max-w-none">
        <div dir="rtl" className="flex items-center">
          {navLinks.map((link) => (
            <ClubNavLink
              key={link.slug}
              name={link.name}
              href={id ? `/club/${id}/${link.slug}` : '#'}
              isActive={pathname === `/club/${id}/${link.slug}`}
            />
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="invisible" />
      </ScrollArea>
    </div>
  )
}

function ClubNavLink({
  name,
  href,
  isActive,
}: {
  name: string
  href: string
  isActive: boolean
}) {
  return (
    <Link
      href={href}
      className="flex h-6 shrink-0 items-center justify-center whitespace-nowrap rounded-full px-4 text-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground data-[active=true]:bg-muted data-[active=true]:text-foreground"
      data-active={isActive}
      aria-current={isActive ? "page" : undefined}
    >
      {name}
    </Link>
  )
}
