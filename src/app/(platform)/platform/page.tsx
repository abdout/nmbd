'use client';
import React from 'react';
import { Icon } from "@iconify/react";
// import { useRouter } from 'next/navigation';

export default function Page() {

  // const router = useRouter();
  // useEffect(() => {
  //   if (window.location.hash === '#_=_') {
  //       router.replace('/platform'); 
  //   }

  return (
    <div className='pt-14 relative'>
      <h1 className="font-heading font-bold text-3xl leading-normal sm:text-2xl md:text-3xl">
        مرحبا بيك
      </h1>
      <p className='text-[16px] text-muted-foreground'>في منصة الحركة الوطنية للبناء والتنمية</p>

      <p className='w-full md:w-4/5 pt-8'>لن يصيب المجد كف واحد - إيماناً بسحر العمل الجماعي، نسعى من خلال هذه المنصة إلى أتمتة أعمال الحركة  وامتلاك ادوات تنسيق وتعاون افضل. ساهم في خلق تجربة جديدة من الكفاءة والتنظيم.</p>

      <div className='flex flex-col md:flex-row justify-between items-center mt-8'>
        <div>
          <p className='mb-4'>استكشف الروابط أدناه للدليل المستخدم ومركز المساعدة:</p>
          <div className='flex gap-8 items-center'>
            <Icon icon={"ph:book-fill"} height="70" className="opacity-70 hover:opacity-100 transition-opacity duration-200" />
            <Icon icon={"ant-design:customer-service-filled"} height="70" className="opacity-70 hover:opacity-100 transition-opacity duration-200" />
          </div>
        </div>
      </div>
    </div>
  );
}