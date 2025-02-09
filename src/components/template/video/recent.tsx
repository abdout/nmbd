'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getRecentVideos } from './constant';
import Head from "@/components/atom/head";

const RecentVideos = () => {
  const videos = getRecentVideos(3);

  return (
    <div  className="px-24">
      <Head title="الوثائقيات" description="ما يضر الجهل به" />
      <div className="flex flex-col md:flex-row gap-8 pt-6 overflow-hidden">
        {videos.map((video) => (
          <Link href={`/video/${video.id}`} key={video.id}>
            <div className="flex flex-col w-full md:w-auto">
              <Image
                src={video.thumbnail}
                alt={video.title}
                width={500}
                height={350}
                className="object-cover max-w-full block"
              />

              <strong className="md:text-lg md:leading-7 mt-2 block w-56 truncate">
                {video.title}
              </strong>

              <p className='text-[12px] md:text-[14px] font-light'>
                {video.author}
                <span className="text-sm md:text-3xl items-center" style={{ position: 'relative', top: '0.15em' }}> · </span>
                {video.date}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RecentVideos;
