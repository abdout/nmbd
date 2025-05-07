import ProjectContent from "@/components/platform/repository/content";
import Loading from '@/components/atom/loading';
import { Suspense } from 'react';

const Project = () => {
  return (
    <Suspense fallback={<Loading />}>
      <div className="grid grid-cols-4 gap-4">
        <ProjectContent />
      </div>
    </Suspense>
  );
};

export default Project;
