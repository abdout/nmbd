import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

type Props = {
  params: {
    id: string;
  };
};

export async function generateMetadata({ params }: Props) {
  const video = await getVideo(params.id);
  
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

// Mock function to get video data - would be replaced with real API call
async function getVideo(id: string) {
  // Simulating database lookup
  const videos = {
    '1': { 
      id: '1', 
      title: 'Featured Video 1', 
      description: 'Full description for video 1', 
      embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      publishedAt: '2023-01-15',
      duration: '12:34'
    },
    '2': { 
      id: '2', 
      title: 'Featured Video 2', 
      description: 'Full description for video 2', 
      embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      publishedAt: '2023-02-20',
      duration: '8:27'
    },
    '3': { 
      id: '3', 
      title: 'Featured Video 3', 
      description: 'Full description for video 3', 
      embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      publishedAt: '2023-03-10',
      duration: '15:01'
    },
    '4': { 
      id: '4', 
      title: 'Featured Video 4', 
      description: 'Full description for video 4', 
      embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      publishedAt: '2023-04-05',
      duration: '5:48'
    },
  };
  
  return videos[id as keyof typeof videos];
}

export default async function VideoPage({ params }: Props) {
  const video = await getVideo(params.id);
  
  if (!video) {
    notFound();
  }
  
  return (
    <div className="container mx-auto py-10 px-4">
      <Link 
        href="/video" 
        className="text-blue-600 hover:underline mb-6 inline-block"
      >
        ← Back to All Videos
      </Link>
      
      <div className="max-w-3xl mx-auto">
        <div className="aspect-w-16 aspect-h-9 mb-6">
          <iframe
            src={video.embedUrl}
            className="w-full h-[400px] rounded-lg"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
        
        <h1 className="text-3xl font-bold mb-2">{video.title}</h1>
        
        <div className="flex items-center text-sm text-gray-600 mb-6">
          <span>Published: {video.publishedAt}</span>
          <span className="mx-2">•</span>
          <span>Duration: {video.duration}</span>
        </div>
        
        <div className="prose max-w-none">
          <p>{video.description}</p>
        </div>
      </div>
    </div>
  );
} 