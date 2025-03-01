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
    <div className="container mx-auto py-10 px-4">
      <Link 
        href="/video"
        className={cn(
          buttonVariants({ variant: "ghost", size: "sm" }),
          "mb-6"
        )}
      >
        → الرجوع
      </Link>
      
      <article className="max-w-3xl mx-auto">
        <header className="mb-8 text-right">
          <h1 className="text-3xl font-bold mb-2">{video.title}</h1>
          <div className="flex items-center text-sm text-gray-600 gap-2">
            <span>{video.author}</span>
            <span className="mx-1">•</span>
            <span>{video.date}</span>
          </div>
        </header>
        
        <div className="aspect-w-16 aspect-h-9 mb-8">
          <iframe
            src={`https://www.youtube.com/embed/${video.link}`}
            title={video.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-[400px] rounded-lg"
          ></iframe>
        </div>
        
        <div className="bg-gray-100 p-6 rounded-lg mb-6 rtl">
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