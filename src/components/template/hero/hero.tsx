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
          href={siteConfig.links.twitter}
          className="rounded-2xl bg-muted px-4 py-1.5  text-sm font-medium -mt-32 md:-mt-20"
          target="_blank"
        >
          المجتمع أولاً
        </Link>
        <h1 className="font-heading text-7xl">
          الحركة الوطنية للبناء والتنمية
        </h1>
        <p className="max-w-[53rem] leading-normal text-muted-foreground sm:text-lg sm:leading-8">
          هي حركة إصلاح اجتماعي وسياسي شامل، تقيم رؤاها وتستقي قيمها من هدي الدين
          وكريم شيم السودانيين، وتقوم على إرث المسلمين في السودان خاصة، وإرث شعب السودان
          عامة، وتجربة الأمة المسلمة والأحرار في العالم،
        </p>
        <div className="flex gap-4">
          <Link
            href="/login"
            className={cn(buttonVariants({ size: "lg" })) }

          >
            يديك معانا
          </Link>
          <Link
            href={siteConfig.links.github}
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