import type { Metadata } from "next";
import FinanceSidebar from "@/components/finance/sidebar";

export const metadata: Metadata = {
  title: "مال",
  description: "اقتصاد الحركة",
};

export default function FinanceLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-1">
      <FinanceSidebar />
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}


     
      
