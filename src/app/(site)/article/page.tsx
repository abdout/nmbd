import React from 'react';
import Head from '@/components/atom/site-heading';
import { ArticleGrid } from '@/components/article/content';
import { getAllArticles } from '@/components/article/action';
import { articles as staticArticles } from '@/components/template/article/constant';

export const metadata = {
  title: 'All Articles | Public Party',
  description: 'Browse all articles published by Public Party',
};

export default async function AllArticlesPage() {
  // Fetch articles from database
  const dbArticles = await getAllArticles();
  
  // If there are no DB articles, fall back to static articles for demo purposes
  // In production, you would remove this fallback
  const articles = dbArticles.length > 0 
    ? dbArticles 
    : staticArticles.map((article, index) => ({
        id: `static-${index + 1}`,
        title: article.title,
        slug: `article-${index + 1}`,
        description: article.description,
        image: article.image,
        body: "This is the full article content that will be displayed on the article page.",
        author: article.author,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

  return (
    <div className="container mx-auto px-4">
      <Head 
        title="المقالات" 
        description="" 
        align="start"
      />
      
      <div className="max-w-5xl mx-auto -mt-14">
        <ArticleGrid articles={articles} />
      </div>
    </div>
  );
} 