'use client';
import { Input } from '@/components/ui/input';
import React, { useState } from 'react';
import { Icon } from "@iconify/react";
import ProjectCards from '@/components/community/project/project-cards';
import { projects } from '@/components/community/project/constant'; // Adjust the import path accordingly
import Link from 'next/link';

const Landing = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProjects = projects.filter(project => 
    project.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="py-7">
      <p className="font-light text-lg flex items-center justify-center">
        Read the&nbsp;
        <Link href="/community/project/paradigm" className='text-black font-normal underline'>
        paradigm</Link>&nbsp;behind community projects.
      </p>
      <div className="flex flex-col gap-6 items-center justify-center p-8">
        <div className="relative w-72">
          <Input 
            placeholder="Browse projects" 
            type="search" 
            className="w-full pl-4 pr-10" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Icon icon="mynaui:search" width={10} className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
        </div>
      </div>
      <div className="px-8">
        <ProjectCards projects={filteredProjects} />
      </div>
    </div>
  );
};

export default Landing;
