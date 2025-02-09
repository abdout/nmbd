'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { videos,  } from '@/components/template/video/constant';

const OneVideo = () => {
  const pathname = usePathname();
  const id = pathname.split('/').pop();
  
  const video = videos.find(v => v.link === id);
  
  if (!video) return null;
  


  return (
    <div className="flex flex-col pt-2 md:pt-6 md:pr-20">
      <h2 className="text-lg md:text-2xl truncate md:w-3/5">
        {video.title}
      </h2>
      <p className="truncate w-3/5">{video.description}</p>
      <div className="flex items-center gap-2 md:gap-3 py-2 md:py-6">
        <div className="flex flex-col pl-4">
          <p className="md:font-bold text-sm">{video.author}</p>
          <p className='text-sm'>{video.date}</p>
        </div>
      </div>
      <hr className="border-t border-gray-500 mb-5 md:w-[43.7rem]" />
      <div className="w-full md:w-[700px] h-[200px] md:h-[355px] relative">
        <iframe
          src={`https://www.youtube.com/embed/${video.link}`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute top-0 left-0 w-full h-full"
        ></iframe>
      </div>
      
    </div>
  );
};

export default OneVideo;