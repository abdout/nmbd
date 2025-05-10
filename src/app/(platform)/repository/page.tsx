import RepositoryContent from "@/components/platform/repository/content";
import Loading from '@/components/atom/loading';
import { Suspense } from 'react';

const Repository = () => {
  return (
    <Suspense fallback={<Loading />}>
      <div className="">
        <RepositoryContent />
      </div>
    </Suspense>
  );
};

export default Repository;
