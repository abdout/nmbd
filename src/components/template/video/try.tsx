import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Play } from 'lucide-react';

interface VideoCardProps {
  title: string;
  subtitle: string;
  date: string;
  thumbnail: string;
  youtubeId: string;
  series: string;
}

interface VideoGridProps {
  videos: VideoCardProps[];
}

const VideoCard: React.FC<VideoCardProps> = ({ 
  title, 
  subtitle, 
  date, 
  thumbnail, 
  youtubeId, 
  series 
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="group cursor-pointer overflow-hidden transition-all hover:shadow-lg">
          <div className="relative">
            <img
              src={thumbnail}
              alt={title}
              className="h-48 w-full object-cover transition-transform duration-200 group-hover:scale-105"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
              <Play className="h-12 w-12 text-white" />
            </div>
          </div>
          <CardContent className="p-4">
            <div className="mb-2 text-sm text-gray-500">{series}</div>
            <h3 className="mb-1 text-lg font-semibold">{title}</h3>
            <p className="mb-2 text-sm text-gray-600">{subtitle}</p>
            <div className="text-xs text-gray-400">{date}</div>
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px]">
        <div className="aspect-video w-full">
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${youtubeId}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="rounded-lg"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

const VideoGrid: React.FC<VideoGridProps> = ({ videos = [] }) => {
  if (!videos || videos.length === 0) {
    return <div>No videos available</div>;
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {videos.map((video, index) => (
        <VideoCard key={index} {...video} />
      ))}
    </div>
  );
};

export default VideoGrid;
export type { VideoCardProps, VideoGridProps };