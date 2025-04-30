'use client';
// import Footer from "@/components/template/footer/footer"
import "../globals.css";
import PlatformHeader from "@/components/header-platform/platform-header"
import { MemberProvider } from "@/components/platform/member/context";
import { UploadProvider } from "@/components/upload/context";
import { ProjectProvider } from "@/components/platform/project/context";
import { TaskProvider } from "@/components/platform/task/context";
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
    <div data-wrapper="" className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-48 border-grid flex flex-1 flex-col">
      <PlatformHeader />
      <main className="flex flex-1 flex-col pt-8">
        <ProjectProvider>
          <TaskProvider>
            <UploadProvider>
              <MemberProvider>
                {children}
              </MemberProvider>
            </UploadProvider>
          </TaskProvider>
        </ProjectProvider>
      </main>
      {/* <Footer /> */}
    </div>
  )
}