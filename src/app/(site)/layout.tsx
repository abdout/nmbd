
import Footer from "@/components/template/footer/footer"
import TaxonomyHeader from "@/components/template/header-taxonomy/taxonomy-header"


interface AppLayoutProps {
  children: React.ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div data-wrapper="" className="border-grid flex flex-1 flex-col">
      <TaxonomyHeader />
      <main className="flex flex-1 flex-col">{children}</main>
      <Footer />
    </div>
  )
}