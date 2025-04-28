'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { articles as staticArticles } from '@/components/template/article/constant';
import { Article } from '@/components/article/type';
import OptimizedImage from '@/components/image/optimum-image';
import { getArticleBySlug } from '@/components/article/action';
import { ARABIC_MONTH_NAMES } from '@/components/article/constant';

export default function ArticlePage() {
  const params = useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Format date in Arabic style
  const formatDate = (dateInput: Date | string) => {
    const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
    const day = date.getDate();
    const month = ARABIC_MONTH_NAMES[date.getMonth() as keyof typeof ARABIC_MONTH_NAMES];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };
  
  useEffect(() => {
    const fetchArticle = async () => {
      if (!params.id) return;
      
      const idString = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : '';
      
      try {
        // First try to fetch from database by slug
        const dbArticle = await getArticleBySlug(idString);
        
        if (dbArticle) {
          setArticle(dbArticle);
        } else {
          // If no database article, try to use static article (for demo)
          const id = parseInt(idString) - 1;
          
          if (isNaN(id) || id < 0 || id >= staticArticles.length) {
            notFound();
            return;
          }
          
          // Map static article to Article type
          const staticArticle = staticArticles[id];
          setArticle({
            id: `static-${id + 1}`,
            title: staticArticle.title,
            slug: `article-${id + 1}`,
            description: staticArticle.description,
            image: staticArticle.image,
            body: "This is the full article content that will be displayed on the article page.",
            author: staticArticle.author,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }
      } catch (error) {
        console.error("Error fetching article:", error);
        notFound();
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchArticle();
  }, [params.id]);
  
  if (isLoading) {
    return <div className="container mx-auto py-10 px-4">Loading...</div>;
  }
  
  if (!article) {
    return notFound();
  }
  
  return (
    <div className="container mx-auto md:py-10 py-4 md:px-4 px-0">
      <div className="max-w-3xl mx-auto">
        <Link 
          href="/article"
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "mb-6"
          )}
        >
          → الرجوع
        </Link>
        
        <article>
          <div className="relative md:h-80 h-48 w-full md:mb-8 mb-4 rounded-xl overflow-hidden">
            <OptimizedImage
              src={article.image}
              alt={article.title}
              fill
              className="object-cover object-center"
              priority
              transformations={[
                { quality: 80 },
                { format: "auto" }
              ]}
              objectFit="cover"
              objectPosition="center"
            />
          </div>
          
          <header className="mb-8 text-right">
            <h1>{article.title}</h1>
            <div className="flex items-center text-sm text-gray-600 gap-2">
              <span>{article.author}</span>
              <span className="text-lg font-bold mx-1">•</span>
              <span>{formatDate(article.createdAt)}</span>
            </div>
          </header>
          
          <div className="bg-gray-100 dark:bg-neutral-900 md:p-6 p-4 rounded-lg md:mb-6 mb-4 rtl">
            <p className="text-right">{article.description}</p>
          </div>
          
          <div className="prose max-w-none rtl">
            <p className="text-right">
              {article.body}
            </p>
          </div>
        </article>
      </div>
    </div>
  );
} 