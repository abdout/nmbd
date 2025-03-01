import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { videos } from '@/components/template/video/constant';

type Props = {
  params: {
    id: string;
  };
};

export async function generateMetadata({ params }: Props) {
  const video = videos.find(v => v.link === params.id);
  
  if (!video) {
    return {
      title: 'Video Not Found',
      description: 'The requested video could not be found',
    };
  }
  
  return {
    title: `${video.title} | Public Party`,
    description: video.description,
  };
}

export default function VideoPage({ params }: Props) {
  const video = videos.find(v => v.link === params.id);
  
  if (!video) {
    notFound();
  }
  
  return (
    <div className="container mx-auto md:py-10 py-4 md:px-4 px-0">
      <Link 
        href="/video"
        className={cn(
          buttonVariants({ variant: "ghost", size: "sm" }),
          "mb-6"
        )}
      >
        → الرجوع
      </Link>
      
      <article className="max-w-3xl ">
        <header className="mb-8 text-right">
          <h1 className="md:text-3xl text-xl font-bold md:mb-2 mb-1">{video.title}</h1>
          <div className="flex items-center text-sm text-gray-600 gap-2">
            <span>{video.author}</span>
            <span className="mx-1">•</span>
            <span>{video.date}</span>
          </div>
        </header>
        
        <div className="md:aspect-w-16 md:aspect-h-9 md:mb-8 mb-4">
          <iframe
            src={`https://www.youtube.com/embed/${video.link}`}
            title={video.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full md:h-[400px] h-[260px] rounded-lg"
          ></iframe>
        </div>
        
        <div className="bg-gray-100 dark:bg-neutral-900 md:p-6 p-4 rounded-lg md:mb-6 mb-4 rtl">
          <p className="text-lg leading-relaxed text-right">{video.description}</p>
        </div>
        
        <div className="prose max-w-none rtl">
          <p className="text-right">
            هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة، لقد تم توليد هذا النص من مولد النص العربى، حيث يمكنك أن تولد مثل هذا النص أو العديد من النصوص الأخرى إضافة إلى زيادة عدد الحروف التى يولدها التطبيق.
          </p>
        </div>
      </article>
    </div>
  );
}