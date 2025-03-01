import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
  title: 'All Videos | Public Party',
  description: 'Browse all videos published by Public Party',
};

export default function AllVideosPage() {
  // This would typically come from an API or database
  const videos = [
    { id: '1', title: 'Featured Video 1', thumbnail: '/placeholder.jpg', duration: '12:34', description: 'Description for video 1' },
    { id: '2', title: 'Featured Video 2', thumbnail: '/placeholder.jpg', duration: '8:27', description: 'Description for video 2' },
    { id: '3', title: 'Featured Video 3', thumbnail: '/placeholder.jpg', duration: '15:01', description: 'Description for video 3' },
    { id: '4', title: 'Featured Video 4', thumbnail: '/placeholder.jpg', duration: '5:48', description: 'Description for video 4' },
  ];

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">All Videos</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <div key={video.id} className="rounded-lg overflow-hidden hover:shadow-lg transition">
            <Link href={`/video/${video.id}`}>
              <div className="relative">
                {/* Replace with actual thumbnail images */}
                <div className="bg-gray-300 w-full h-48 flex items-center justify-center">
                  <span className="text-gray-600">Video Thumbnail</span>
                </div>
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-sm px-2 py-1 rounded">
                  {video.duration}
                </div>
              </div>
              <div className="p-4 border border-t-0">
                <h2 className="text-xl font-semibold mb-2">{video.title}</h2>
                <p className="text-gray-600">{video.description}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
} 