import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Inter as FontSans } from "next/font/google";
import { ThemeProvider } from "@/components/providers";
import { ModalProvider } from "@/components/atom/modal/context";
import { SessionProvider } from "next-auth/react";
import { auth } from "../auth";



const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontHeading = localFont({
  src: "./fonts/Rubik-Black.ttf",
  variable: "--font-heading",
  preload: true,
  display: 'swap',
});

export const metadata: Metadata = {
  title: "الحركة الوطنية للبناء والتنمية",
  description: "حركة إصلاح اجتماعي وسياسي شامل",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  return (
    <SessionProvider session={session}>
    <html lang="ar" suppressHydrationWarning dir="rtl">
      <head>
        <link rel="preload" href="./fonts/Rubik-Black.ttf" as="font" crossOrigin="anonymous" />
      </head>
      <body
        className={cn(
          "min-h-screen bg-background antialiased overflow-x-hidden",
          fontSans.variable,
          fontHeading.variable,
          "font-sans"
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem={true}>
        <ModalProvider>
          <div className="container">
            {children}
          </div>
        </ModalProvider>
        </ThemeProvider>
      </body>
    </html>
    </SessionProvider>
  );
}