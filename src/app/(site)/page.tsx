import FeaturedArticles from "@/components/template/article/featured-articles";
import Contact from "@/components/template/contact/ui";
import { CarouselDemo } from "@/components/template/display/example";
import Event from "@/components/template/event/event";
import Hero from "@/components/template/hero/hero";
import { AnimatedTestimonialsDemo } from "@/components/template/testimonial/example";
import { TimelineDemo } from "@/components/template/timeline/example";
import FeaturedVideos from "@/components/template/video/featured-video";
import Script from 'next/script';

// Define metadata for this specific page
export const metadata = {
  title: "الحركة الوطنية للبناء والتنمية | الصفحة الرئيسية",
  description: "الموقع الرسمي للحركة الوطنية للبناء والتنمية - حركة إصلاح اجتماعي وسياسي شامل تسعى للتنمية المستدامة في السودان",
  keywords: "الحركة الوطنية للبناء والتنمية, الحركة الوطنية, البناء والتنمية, السودان, إصلاح, تنمية, مشاريع",
}

export default function Home() {
  return (
    <div className="">
      {/* JSON-LD structured data for better search indexing */}
      <Script
        id="organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "الحركة الوطنية للبناء والتنمية",
            "alternateName": "NMBD",
            "url": "https://nmbd.org",
            "logo": "https://nmbd.org/logo.png",
            "description": "حركة إصلاح اجتماعي وسياسي شامل تسعى للتنمية المستدامة والبناء الوطني في السودان",
            "sameAs": [
              "https://facebook.com/NMBD",
              "https://twitter.com/NMBD"
            ],
            "location": {
              "@type": "Place",
              "name": "السودان"
            },
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": "https://nmbd.org"
            }
          })
        }}
      />
      
      {/* SEO-focused content that's hidden visually but accessible to search engines */}
      <div className="sr-only">
        <h1>الحركة الوطنية للبناء والتنمية</h1>
        <p>الموقع الرسمي للحركة الوطنية للبناء والتنمية - حركة إصلاح اجتماعي وسياسي تسعى لبناء السودان وتطويره</p>
        <p>الحركة الوطنية للبناء والتنمية هي حركة وطنية سودانية تهدف إلى النهوض بالمجتمع السوداني من خلال برامج التنمية المستدامة والإصلاح السياسي والاجتماعي</p>
        <p>نحن نسعى لتحقيق التنمية الشاملة في جميع مناطق السودان، مع التركيز على المشاريع التنموية والبنية التحتية والتعليم والصحة</p>
        <p>تأسست الحركة الوطنية للبناء والتنمية لخدمة المواطن السوداني وتحقيق تطلعاته في حياة كريمة</p>
      </div>
      
      <Hero />
      <div className="py-6 -mt-24 md:-mt-32">
        <AnimatedTestimonialsDemo />
        <FeaturedVideos />
        <FeaturedArticles />
        <CarouselDemo />
        <Event />
        <TimelineDemo />
        <Contact />
      </div>
    </div>
  );
}
