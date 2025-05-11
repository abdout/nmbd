'use client';
import React, { useEffect, useState, useCallback } from 'react';

import { columns } from '@/components/template/table/coloum';
import { Content } from '@/components/platform/member/content';
import { fetchAllMembers } from '@/components/platform/member/action';
import { member } from '@/components/platform/member/type';
import Loading from '@/components/atom/loading';

const Member = () => {
  const [members, setMembers] = useState<member[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Define a refresh function that can be called to reload members
  const refreshMembers = useCallback(async () => {
    try {
      setLoading(true);
      const result = await fetchAllMembers();
      
      if (result.error) {
        setError(result.error);
      } else {
        setMembers(result.data);
      }
    } catch (err) {
      setError('Failed to load members');
      console.error('Error fetching members:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load members using server action
  useEffect(() => {
    refreshMembers();
    
    // Set up periodic refresh every 5 minutes
    const intervalId = setInterval(() => {
      refreshMembers();
    }, 5 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, [refreshMembers]);

  if (loading && members.length === 0) {
    return <Loading />;
  }

  if (error) {
    return <div className="py-8 text-center text-red-500">خطأ: {error}</div>;
  }

  return (
    <div>
      <Content columns={columns} data={members} />
    </div>
  );
};

export default Member;