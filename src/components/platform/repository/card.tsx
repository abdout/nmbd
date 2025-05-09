import React from 'react';
import { Icon } from '@iconify/react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';

interface Repository {
  id: string;
  title: string;
  desc: string;
  club: string;
  status: string;
  readme: string;
  roadmap: string;
  contributor: string;
  material: string;
  chat: string;
  issues: any[];
}

interface RepositoryCardProps {
  repository: Repository;
}

// Define a function to get the color based on status
const getStatusColor = (status: string): string => {
  switch (status) {
    case 'محايد':
    case 'pending':
      return 'bg-neutral-400';
    case 'جاري':
    case 'in_progress':
      return 'bg-yellow-400';
    case 'تم':
    case 'done':
      return 'bg-green-500';
    case 'متوقف':
    default:
      return 'bg-red-400';
  }
};

// Function to convert status to Arabic
const getArabicStatus = (status: string): string => {
  switch (status) {
    case 'pending':
      return 'محايد';
    case 'in_progress':
      return 'جاري';
    case 'done':
      return 'تم';
    default:
      return 'متوقف';
  }
};

const RepositoryCard: React.FC<RepositoryCardProps> = ({ repository }) => {
  return (
    <Card className='border hover:border-primary w-full h-52 reveal rounded-md'>
      <CardHeader>
        <strong className="font-semibold">{repository.title}</strong>
        <p className="line-clamp-2 overflow-hidden text-ellipsis">
          {repository.desc}
        </p>
      </CardHeader>
      <CardContent>
       
        <div className="flex gap-2 items-center my-1">
          <Icon icon="material-symbols-light:bookmark-sharp" width={25} />
          <p>{repository.club}</p>
        </div>
      </CardContent>
      <CardFooter className="flex gap-4 items-center mr-[3.5px] -mt-6">
        <div className={`rounded-full w-[18px] h-[18px] ${getStatusColor(repository.status)}`} />
        <p>{getArabicStatus(repository.status)}</p>
      </CardFooter>
    </Card>
  );
};

export default RepositoryCard;
