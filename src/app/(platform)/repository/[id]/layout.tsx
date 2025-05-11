import { Metadata } from "next"

import { Announcement } from "@/components/announcement"
import {
  PageActions,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header"
import { RepositoryNav } from "@/components/platform/repository/repository-nav"
import { Button } from "@/components/ui/button"


import Link from "next/link"
import { getRepository } from '@/components/platform/repository/action';

export const metadata: Metadata = {
  title: "Repository",
  description: "Repository details page",
  openGraph: {
    images: [
      {
        url: `/og?title=${encodeURIComponent(
          " امانة المجتمع"
        )}&description=${encodeURIComponent("غنى هاتيك القرى غنى المدائن لحن حب واخاء وتعاون ")}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: [
      {
        url: `/og?title=${encodeURIComponent(
          " امانة المجتمع"
        )}&description=${encodeURIComponent("غنى هاتيك القرى غنى المدائن لحن حب واخاء وتعاون ")}`,
      },
    ],
  },
}

export default async function RepositoryLayout({
  children,
  params,
}: {
  children: React.ReactNode,
  params: { id: string }
}) {
  // Fetch repository data from DB
  const { repository } = await getRepository(params.id);

  return (
    <>
      <PageHeader>
        <Announcement />
        <PageHeaderHeading>{repository?.title || "Repository"}</PageHeaderHeading>
        <PageHeaderDescription>{repository?.desc || "No description available."}</PageHeaderDescription>
        <PageActions>
          <Button asChild size="sm">
            <a href="#vibes">تابع المستودع</a>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href="/docs/vibes">افتح مشكلة</Link>
          </Button>
        </PageActions>
      </PageHeader>
      <div id="templates" className="border-grid scroll-mt-24 border-b">
        <div className="container-wrapper">
          <div className="container flex items-center py-4">
            <RepositoryNav />
          </div>
        </div>
      </div>
      <div className="container-wrapper flex-1 my-10 px-4">{children}</div>
    </>
  )
}
