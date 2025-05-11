import { Metadata } from "next"

import { Announcement } from "@/components/announcement"
import {
  PageActions,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { ClubNav } from "@/components/platform/club/club-nav"

import Link from "next/link"
import { club as clubList } from '@/components/template/club/constant';

// Define the generateMetadata function with exact Next.js signature
export async function generateMetadata(
  { params }: { params: { id: string } }
): Promise<Metadata> {
  // Find the club by id for dynamic metadata
  const clubData = clubList.find(c => c.id === params.id);
  const title = `أمانة ${clubData ? clubData.label : 'غير معروف'}`;
  const description = 'غنى هاتيك القرى غنى المدائن لحن حب واخاء وتعاون ';

  return {
    title: title,
    description: description,
    openGraph: {
      images: [
        {
          url: `/og?title=${encodeURIComponent(
            title
          )}&description=${encodeURIComponent(description)}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      images: [
        {
          url: `/og?title=${encodeURIComponent(
            title
          )}&description=${encodeURIComponent(description)}`,
        },
      ],
    },
  }
}

// Define the layout with the proper parameter structure
export default async function ClubLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  // Find the club by id
  const clubData = clubList.find(c => c.id === params.id);
  const title = `أمانة ${clubData ? clubData.label : 'غير معروف'}`;
  const description = 'غنى هاتيك القرى غنى المدائن لحن حب واخاء وتعاون ';

  return (
    <>
      <PageHeader>
        <Announcement />
        <PageHeaderHeading>{title}</PageHeaderHeading>
        <PageHeaderDescription>{description}</PageHeaderDescription>
        <PageActions>
          <Button asChild size="sm">
            <a href="#vibes">تصفح المشكلات</a>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href="/docs/vibes">افتح مشكلة</Link>
          </Button>
        </PageActions>
      </PageHeader>
      <div id="templates" className="border-grid scroll-mt-24 border-b">
        <div className="container-wrapper">
          <div className="container flex items-center py-4">
            <ClubNav />
          </div>
        </div>
      </div>
      <div className="container-wrapper flex-1 my-10 px-4">{children}</div>
    </>
  )
}
