import React from 'react';
import Head from '@/components/atom/site-heading';
import HoverEffect from '@/components/atom/card-video';
import { videos } from '@/components/template/video/constant';

export const metadata = {
  title: 'All Videos | Public Party',
  description: 'Browse all videos published by Public Party',
};

export default function AllVideosPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <Head 
        title="الوثائقيات" 
        description="" 
        align="start"
      />
      
      <div className="max-w-5xl mx-auto md:px-8 -mt-5">
        <HoverEffect items={videos} />
      </div>
    </div>
  );
}