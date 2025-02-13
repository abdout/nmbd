'use client';
import React from 'react';
import { columns } from '@/components/platform/task/coloum';
import { useTask } from '@/components/platform/task/context';
import { Content } from '@/components/platform/task/content';

const Task = () => {
  const { tasks } = useTask();
  return (
    <div>
      <Content columns={columns} data={tasks} />

    </div>
  );
};

export default Task;