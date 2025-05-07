import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Issue } from "@/components/atom/icon"

export function Announcement() {
  return (
    <Link
      href="/docs/monorepo"
      className="group mb-2 inline-flex items-center px-0.5 text-sm font-medium"
    >
      <span className="flex items-center gap-1 underline-offset-4 group-hover:underline">
        
          <Issue className="w-[14px] h-[14px] text-foreground"/>
        
        العقود الذكية 
      </span>
      <ArrowLeft className="mr-1 h-[14px] w-[14px]" />
    </Link>
  )
}
