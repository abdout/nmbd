import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Inter as FontSans } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { ModalProvider } from "@/components/atom/modal/context";
import { SessionProvider } from "next-auth/react";
import { auth } from "../auth";
import { ImageKitWrapper } from "@/components/image/image-kit";
import { Toaster } from "@/components/ui/sonner";



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
  description: "حركة إصلاح اجتماعي وسياسي شامل تسعى للتنمية المستدامة والبناء الوطني في السودان",
  keywords: "الحركة الوطنية للبناء والتنمية, الدين, السودان, حركة سياسية, السودان, المجتمع اولا, التنمية السودانية, بناء السودان",
  openGraph: {
    title: "الحركة الوطنية للبناء والتنمية",
    description: "حركة إصلاح اجتماعي وسياسي شامل تسعى للتنمية المستدامة والبناء الوطني في السودان",
    locale: "ar_SD",
    type: "website",
    siteName: "الحركة الوطنية للبناء والتنمية",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "الحركة الوطنية للبناء والتنمية - الموقع الرسمي",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "الحركة الوطنية للبناء والتنمية",
    description: "حركة إصلاح اجتماعي وسياسي شامل تسعى للتنمية المستدامة والبناء الوطني في السودان",
    images: ["/images/twitter-image.jpg"],
  },
  alternates: {
    canonical: "/",
  },
  verification: {
    google: "google-site-verification-code", // Add your verification code when you have it
  },
  authors: [{ name: "الحركة الوطنية للبناء والتنمية" }],
  creator: "الحركة الوطنية للبناء والتنمية",
  publisher: "الحركة الوطنية للبناء والتنمية",
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
          <ImageKitWrapper>
            <div className="container">
              {children}
            </div>
          </ImageKitWrapper>
          <Toaster position="bottom-right" expand={true} richColors />
        </ModalProvider>
        </ThemeProvider>
      </body>
    </html>
    </SessionProvider>
  );
}