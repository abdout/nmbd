import RepositoryContent from "@/components/platform/repository/content";
import Loading from '@/components/atom/loading';
import { Suspense } from 'react';

const Project = () => {
  return (
    <Suspense fallback={<Loading />}>
      <div className="">
        <RepositoryContent />
      </div>
    </Suspense>
  );
};

export default Project;
