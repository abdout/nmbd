import { cn } from '@/lib/utils'
import Link from 'next/link'
import React from 'react'
import { buttonVariants } from '@/components/ui/button'

const DesktopHero = () => {
  return (
    
    <div className="h-screen flex flex-col items-center justify-center space-y-6">
      <div className="flex flex-col items-center gap-6 text-center">
        <Link
          href='/community'
          className="rounded-2xl bg-muted px-4 py-1.5  text-sm font-medium -mt-20 md:-mt-20"
          target="_blank"
        >
          المجتمع أولاً
        </Link>
        <h1 className="font-heading text-4xl w-72 md:w-auto leading-normal md:text-7xl">
          الحركة الوطنية للبناء والتنمية
        </h1>
        <p className="max-w-[55rem] leading-normal text-muted-foreground sm:text-lg md:px-4 px-2 sm:leading-8">
          هي حركة إصلاح اجتماعي وسياسي شامل، تقيم رؤاها وتستقي قيمها من هدي الدين
          وكريم شيم السودانيين، وتقوم على إرث المسلمين في السودان خاصة، وإرث شعب السودان
          عامة، وتجربة الأمة المسلمة والأحرار في العالم،
        </p>
        <div className="flex gap-4">
          <Link
            href="/onboarding/terms"
            className={cn(buttonVariants({ size: "lg" }), "text-white px-4 md:px-7") }

          >
            يديك معانا
          </Link>
          <Link
            href='/#testimonials'
            className={cn(buttonVariants({ variant: "outline", size: "lg" }), "px-4 md:px-7")}
          >
            اعرف أكثر
          </Link>
        </div>
      </div>

    </div>
  )
}

const MobileHero = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <div className="flex flex-col items-center gap-4 text-center">
        <Link
          href='/community'
          className="rounded-2xl bg-muted px-4 py-1.5 text-sm font-medium -mt-28"
          // target="_blank"
        >
          المجتمع أولاً
        </Link>
        <h1 className="font-heading text-4xl leading-tight">
          الحركة الوطنية<br /> للبنـاء والتنميـة
        </h1>
        <p className="leading-normal text-muted-foreground px-4">
          هي حركة إصلاح اجتماعي وسياسي شامل،
          <br />
          تقيم رؤاها وتستقي قيمها من هدي الدين
          وكريم شيم السودانيين، وتقوم على إرث المسلمين في السودان خاصة، وإرث شعب السودان
          عامة، وتجربة الأمة المسلمة والأحرار في العالم،
        </p>
        <div className="flex gap-4 mt-6">
          <Link
            href="/onboarding/terms"
            className={cn(buttonVariants({ size: "lg" }), "text-white px-4 md:px-7") }

          >
            يديك معانا
          </Link>
          <Link
            href='/#testimonials'
            className={cn(buttonVariants({ variant: "outline", size: "lg" }), "px-4 md:px-7")}
          >
            اعرف أكثر
          </Link>
        </div>
      </div>

    </div>
  )
}

export default function Hero() {
  return (
    <>
    <div className="hidden md:block">
      <DesktopHero />
    </div>
    <div className="md:hidden">
      <MobileHero />
    </div>
    </>
  )
}

