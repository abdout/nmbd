'use client';
// import Footer from "@/components/template/footer/footer"
import "../globals.css";
import { PlatformHeader } from "@/components/template/header-latest/platform-header"
import { MemberProvider } from "@/components/platform/member/context";
import { UploadProvider } from "@/components/upload/context";

import { usePathname } from 'next/navigation';
// import { auth } from "@/auth";
// import { redirect } from "next/navigation";

interface AppLayoutProps {
  children: React.ReactNode
}

// const session = await auth();
  
//   // If not authenticated, redirect to login
//   if (!session) {
//     redirect('/login?callbackUrl=/dashboard');
//   }

export default function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();
  const isEditRoute = pathname?.includes('/edit');

  if (isEditRoute) {
    return children;
  }

  return (
    <div data-wrapper="" className="border-grid flex flex-1 flex-col">
      <PlatformHeader />
      <main className="flex flex-1 flex-col pt-8">
       
          
            <UploadProvider>
              <MemberProvider>
                {children}
              </MemberProvider>
            </UploadProvider>
         
        
      </main>
      {/* <Footer /> */}
    </div>
  )
}