'use client';
import React from 'react';
import { columns } from '@/components/platform/issue/coloum';
import { useTask } from '@/components/platform/issue/context';
import { Content } from '@/components/platform/issue/content';

const Task = () => {
  const { tasks } = useTask();
  return (
    <div>
      <Content columns={columns} data={tasks} />

    </div>
  );
};

export default Task;