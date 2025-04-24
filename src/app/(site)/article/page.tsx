import React from 'react';
import Head from '@/components/atom/site-heading';
import { getAllArticles } from '@/components/article/action';
import { articles as staticArticles } from '@/components/template/article/constant';
import ArticleHoverEffect from '@/components/atom/card-article';
import { CreateArticleButton } from '@/components/article/dialog';
import { Article } from '@/components/article/type';

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

  // Transform articles to match ArticleHoverEffect expected format
  const formattedArticles = articles.map((article: Article) => ({
    title: article.title,
    description: article.description,
    link: `/article/${article.slug}`,
    image: article.image,
    date: new Date(article.createdAt).toLocaleDateString(),
    author: article.author,
  }));

  return (
    <div className="container mx-auto px-4">
      <Head 
        title="المقالات" 
        description="" 
        align="start"
      />
      
      <div className="max-w-5xl mx-auto -mt-14">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">جميع المقالات</h2>
          <CreateArticleButton />
        </div>
        
        <ArticleHoverEffect items={formattedArticles} />
        
        {formattedArticles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              No articles found. Create your first article by clicking the button above.
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 