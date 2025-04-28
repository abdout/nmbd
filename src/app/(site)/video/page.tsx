'use client';

import React, { useState, useEffect } from 'react';
import Head from '@/components/atom/site-heading';
import HoverEffect from '@/components/atom/card-video';
import { videos } from '@/components/template/video/constant';
import { VideoItem } from '@/components/template/video/type';
import Link from 'next/link';
import { YoutubeIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Local loading component
const VideosLoading = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center">
        <div className="w-8 h-8 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin"></div>
      </div>
    </div>
  );
};

export default function AllVideosPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [videoItems, setVideoItems] = useState<VideoItem[]>([]);
  
  useEffect(() => {
    const loadVideos = async () => {
      setIsLoading(true);
      
      // Simulate a network request
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setVideoItems(videos);
      setIsLoading(false);
    };
    
    loadVideos();
  }, []);

  if (isLoading) {
    return <VideosLoading />;
  }

  return (
    <div className="container mx-auto px-4">
      <Head 
        title="الوثائقيات" 
        description="" 
        align="start"
      />
      
      <div className="max-w-5xl mx-auto md:px-8 -mt-5">
        <HoverEffect items={videos} />
        
        <div className="flex flex-col items-center justify-center gap-4 mt-12 mb-10">
          <p className="text-center text-black dark:text-white text-base">
            لمزيد من الفيديوهات، تفضل بزيارة قناتنا على يوتيوب
          </p>
          <Link 
            href="https://www.youtube.com/channel/YOURCHANNEL" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <Button 
              variant="outline" 
              className="flex items-center gap-2 px-5 py-2 border-red-600 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 transition-colors"
            >
              <YoutubeIcon className="h-5 w-5 text-red-600" />
              <span>قناة اليوتيوب</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}