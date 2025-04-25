'use client';
import React from 'react'
import Image from 'next/image';
import Link from 'next/link';
import Head from '@/components/atom/site-heading';

const Community = () => {
  return (
    <div className=''>
      
      
      <div className='flex flex-col w-[80%] mx-auto justify-start'>
        
      <Head title="المجتمع" description="عند هاتيك القرى عند المدائن" align='start'/>
      <p className='pb-4'>
      أحب فكرة أنه هناك أشياء صغيرة تجمعنا، لحظات كونية نتشاركها بطريقة منفصلة. هل مر عليك يوم أربعاء وقضيت اليوم كله معتقدًا أنه يوم الخميس، ثم تكتشف في اليوم التالي أنك على حق مجدداً! أو كنت جالسًا في قطار وهناك قطار آخر بجانبك، وواحد منهما بدأ بالتحرك، لكنك لا تستطيع تحديد أي القطارين يتحرك؟ ماذا عن عندما تصعد السلم وتظن أن هناك درجة واحدة إضافية، وتلوح برجلك كالابله؟
      </p>
      <p>
      جورج كارلين - أشياء تجمعنا
      </p>
      <div className='flex gap-14 items-center pt-10'>
        <Link href='/community/club'>
        <div className='flex flex-col items-center justify-center gap-1 reveal-less'>
          <div className='h-[65px] flex items-center justify-center'>
            <Image src="/community/club.png" alt="نادي" width={65} height={65} />
          </div>
          <p className='text-muted-foreground'>نادي</p>
        </div>
        </Link>
        <Link href='/community/tool'>
        <div className='flex flex-col items-center justify-center gap-1 reveal-less'>
          <div className='h-[65px] flex items-center justify-center'>
            <Image src="/community/tool.png" alt="اداءة" width={55} height={55} />
          </div>
          <p className='text-muted-foreground'>اداءة</p>
        </div>
        </Link>
        <Link href='/community/project'>
        <div className='flex flex-col items-center justify-center gap-1 reveal-less'>
          <div className='h-[65px] flex items-center justify-center'>
            <Image src="/community/project.png" alt="مشروع" width={58} height={58} />
          </div>
          <p className='text-muted-foreground'>مشروع</p>
        </div>
        </Link>
        <Link href='/community/add'>
        <div className='flex flex-col items-center justify-center gap-1 reveal-less'>
          <div className='h-[65px] flex items-center justify-center'>
            <Image src="/community/plugin.png" alt="اضافة" width={55} height={55} />
          </div>
          <p className='text-muted-foreground'>اضافة</p>
        </div>
        </Link>
      </div>
      </div>

    </div>
  )
}

export default Community