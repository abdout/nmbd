import type { Metadata } from "next";
import Footer from "@/components/template/footer/footer"
import TaxonomyHeader from "@/components/template/header-taxonomy/taxonomy-header"

export const metadata: Metadata = {
  title: "الحركة الوطنية للبناء والتنمية",
  description: "حركة إصلاح اجتماعي وسياسي شامل",
};

interface AppLayoutProps {
  children: React.ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div data-wrapper="" className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-48 border-grid flex flex-1 flex-col">
      <TaxonomyHeader />
      <main className="flex flex-1 flex-col">{children}</main>
      <Footer />
    </div>
  )
}