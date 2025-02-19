import { siteConfig } from './constant'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import React from 'react'
import { buttonVariants } from '@/components/ui/button'

const Hero = () => {
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
        <p className="max-w-[53rem] leading-normal text-muted-foreground sm:text-lg px-4 md:px-0 sm:leading-8">
          هي حركة إصلاح اجتماعي وسياسي شامل، تقيم رؤاها وتستقي قيمها من هدي الدين
          وكريم شيم السودانيين، وتقوم على إرث المسلمين في السودان خاصة، وإرث شعب السودان
          عامة، وتجربة الأمة المسلمة والأحرار في العالم،
        </p>
        <div className="flex gap-4">
          <Link
            href="/onboarding"
            className={cn(buttonVariants({ size: "lg" }), "text-white") }

          >
            يديك معانا
          </Link>
          <Link
            href='/#'
            target="_blank"
            rel="noreferrer"
            className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
          >
            اعرف أكثر
          </Link>
        </div>
      </div>

    </div>
  )
}

export default Hero