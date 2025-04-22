import React from "react";
import { Timeline } from "./timeline";
import Head from "@/components/atom/site-heading";
import OptimizedImage from "@/components/image/optimum-image";


export function TimelineDemo() {
  const data = [
    {
      title: "2024",
      content: (
        <div dir="rtl">
          <p className=" text-xs md:text-sm font-normal mb-8">
          المشاركة في إجماع قوى الحراك الوطني والتواصل مع الفاعلين في المجتمع.
          <br />
          تفعيل ورقة &quot;الاقتصاد التشاركي&quot; ببدأ نشاط اقتصادي تشاركي لدعمها بمثال من الواقع العملي.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <OptimizedImage
              src="/timeline/a.jpg"
              alt="startup template"
              width={500}
              height={500}
              loading="lazy"
              sizes="(max-width: 768px) 50vw, 33vw"
              className="rounded-tr-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
              convertPath={false}
            />
            <OptimizedImage
              src="/timeline/b.jpg"
              alt="startup template"
              width={500}
              height={500}
              loading="lazy"
              sizes="(max-width: 768px) 50vw, 33vw"
              className="rounded-tl-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
              convertPath={false}
            />
            <OptimizedImage
              src="/timeline/c.jpg"
              alt="startup template"
              width={500}
              height={500}
              loading="lazy"
              sizes="(max-width: 768px) 50vw, 33vw"
              className="rounded-br-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
              convertPath={false}
            />
            <OptimizedImage
              src="/timeline/d.jpg"
              alt="startup template"
              width={500}
              height={500}
              loading="lazy"
              sizes="(max-width: 768px) 50vw, 33vw"
              className="rounded-bl-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
              convertPath={false}
            />

          </div>
        </div>
      ),
    },
    {
      title: "2023",
      content: (
        <div dir="rtl">
          <p className=" text-xs md:text-sm font-normal mb-8">
          إنتاج أوراق وبرامج خاصة بالحركة لتطوير الرؤية والاستراتيجية.
          <br />
          إقامة دار &quot;الحركة الوطنية&quot; بالعمارات كمقر للنشاط السياسي والفكري.
          <br />
          العمل الثقافي من خلال لقاءات، وإنتاج فيديوهات ومقالات توعوية.
          <br />
          إطلاق مبادرة &quot;حكماء السودان&quot; للممارسة سياسية راشدة.
          </p>
          
          <div className="grid grid-cols-2 gap-4">
            <OptimizedImage
              src="/timeline/e.jpg"
              alt="hero template"
              width={500}
              height={500}
              loading="lazy"
              sizes="(max-width: 768px) 50vw, 33vw"
              className="rounded-tr-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
              convertPath={false}
            />

            <OptimizedImage
              src="/timeline/f.jpg"
              alt="feature template"
              width={500}
              height={500}
              loading="lazy"
              sizes="(max-width: 768px) 50vw, 33vw"
              className="rounded-tl-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
              convertPath={false}
            />

            <OptimizedImage
              src="/timeline/a.jpg"
              alt="bento template"
              width={500}
              height={500}
              loading="lazy"
              sizes="(max-width: 768px) 50vw, 33vw"
              className="rounded-br-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
              convertPath={false}
            />

            <OptimizedImage
              src="/timeline/b.jpg"
              alt="cards template"
              width={500}
              height={500}
              loading="lazy"
              sizes="(max-width: 768px) 50vw, 33vw"
              className="rounded-bl-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
              convertPath={false}
            />

          </div>
        </div>
      ),
    },
    {
      title: "2022",
      content: (
        <div dir="rtl">
          <p className=" text-xs md:text-sm font-normal mb-4">
          تأسيس &quot;الحركة الوطنية للبناء والتنمية&quot;
          <br />
          توسيع النشاط الطلابي والمجتمعي، والتحدث إلى قادة العمل المجتمعي.
          <br />
          إنتاج محتوى فكري لإحياء أصول الدين ومختلف قضايا الشأن السوداني.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <OptimizedImage
              src="/timeline/c.jpg"
              alt="hero template"
              width={500}
              height={500}
              loading="lazy"
              sizes="(max-width: 768px) 50vw, 33vw"
              className="rounded-tr-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
              convertPath={false}
            />

            <OptimizedImage
              src="/timeline/d.jpg"
              alt="feature template"
              width={500}
              height={500}
              loading="lazy"
              sizes="(max-width: 768px) 50vw, 33vw"
              className="rounded-tl-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
              convertPath={false}
            />

            <OptimizedImage
              src="/timeline/k.jpg"
              alt="bento template"
              width={500}
              height={500}
              loading="lazy"
              sizes="(max-width: 768px) 50vw, 33vw"
              className="rounded-br-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
              convertPath={false}
            />

            <OptimizedImage
              src="/timeline/e.jpg"
              alt="cards template"
              width={500}
              height={500}
              loading="lazy"
              sizes="(max-width: 768px) 50vw, 33vw"
              className="rounded-bl-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
              convertPath={false}
            />

          </div>
        </div>
      ),
    },
  ];
  return (
    <div className="w-full">
        <div className="-mb-4 md:-mb-20">
        <Head title="الطريق" description="لا تصدّق سوى أثر القافلة" />

        </div>
      <Timeline data={data} />
    </div>
  );
}

