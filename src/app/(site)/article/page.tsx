import React from 'react';
import Head from '@/components/atom/site-heading';
import { ArticleHoverEffect } from '@/components/atom/card-article';
import { articles } from '@/components/template/article/constant';

export const metadata = {
  title: 'All Articles | Public Party',
  description: 'Browse all articles published by Public Party',
};

export default function AllArticlesPage() {
  return (
    <div className="container mx-auto  px-4">
      <Head 
        title="المقالات" 
        description="" 
        align="start"
      />
      
      <div className="max-w-5xl mx-auto  -mt-14">
        <ArticleHoverEffect items={articles} />
      </div>
    </div>
  );
} 