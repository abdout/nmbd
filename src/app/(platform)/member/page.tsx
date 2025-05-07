'use client';
import React from 'react';

import { columns } from '@/components/template/table/coloum';
import { useMember } from '@/components/platform/member/context';
import { Content } from '@/components/platform/member/content';


const Member = () => {

  const { members } = useMember();

  return (
    <div>
      <Content columns={columns} data={members} />
      
    </div>
  );
};

export default Member;