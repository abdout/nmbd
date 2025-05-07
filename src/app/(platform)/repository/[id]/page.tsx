'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getRepository } from '@/components/platform/repository/action';
import Loading from '@/components/atom/loading';

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
  createdAt: Date;
  updatedAt: Date;
}

interface RepositoryResponse {
  repository?: Repository;
  error?: string;
}

const RepositoryDetail = () => {
  const params = useParams();
  const repositoryId = params.id as string;
  const [repository, setRepository] = useState<Repository | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRepository = async () => {
      try {
        setLoading(true);
        const response = await getRepository(repositoryId) as RepositoryResponse;
        if (response.error) {
          setError(response.error);
        } else if (response.repository) {
          setRepository(response.repository);
        }
      } catch (err) {
        setError('Failed to load repository');
        console.error('Error fetching repository:', err);
      } finally {
        setLoading(false);
      }
    };

    if (repositoryId) {
      fetchRepository();
    }
  }, [repositoryId]);

  if (loading) {
    return <Loading />;
  }

  if (error || !repository) {
    return (
      <div className="container px-8 py-28 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-red-500">{error || 'لم يتم العثور على المستودع'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container px-8 py-28 min-h-screen">
      <h1 className="text-4xl font-bold mb-8">{repository.title}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="md:col-span-2">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">الوصف</h2>
            <p className="text-lg">{repository.desc}</p>
          </div>
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">الأمانة</h2>
            <p className="text-lg">{repository.club}</p>
          </div>
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">الحالة</h2>
            <p className="text-lg">{repository.status}</p>
          </div>
        </div>
        <div>
          <div className="bg-gray-100 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">إحصائيات</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">عدد المشاكل</h3>
                <p className="text-3xl font-bold">{repository.issues?.length || 0}</p>
              </div>
              <div>
                <h3 className="text-lg font-medium">المساهمون</h3>
                <p className="text-lg">{repository.contributor || 'لا يوجد'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RepositoryDetail;