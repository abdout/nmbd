import { Metadata } from "next"

import { Announcement } from "@/components/announcement"
import {
  PageActions,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header"
import { TemplatesNav } from "@/components/template/templates-nav"
import { Button } from "@/components/ui/button"


import Link from "next/link"

const title = " امانة المجتمع"
const description =
  "غنى هاتيك القرى غنى المدائن لحن حب وأخاء وتعاون "
export const metadata: Metadata = {
  title,
  description,
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

export default function templatesLayout({
  children,
}: {
  children: React.ReactNode
}) {
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
            <TemplatesNav />
          </div>
        </div>
      </div>
      <div className="container-wrapper flex-1 my-10 px-4">{children}</div>
    </>
  )
}
