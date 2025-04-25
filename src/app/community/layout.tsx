import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "الحركة الوطنية للبناء والتنمية",
  description: "حركة إصلاح اجتماعي وسياسي شامل",
};

interface CommunityLayoutProps {
  children: React.ReactNode
}

export default function CommunityLayout({ children }: CommunityLayoutProps) {
  return (
    <div className=" px-2 md:px-8 lg:px-16 xl:px-32 2xl:px-48 border-grid flex flex-1 flex-col">
      <main className="flex flex-1 flex-col">{children}</main>
     
    </div>
  )
}