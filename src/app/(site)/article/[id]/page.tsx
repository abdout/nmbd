'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound, useParams } from 'next/navigation';
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { articles } from '@/components/template/article/constant';
import { ArticleItem } from '@/components/template/article/type';
import { Metadata } from 'next';

export async function generateMetadata({ params }) {
  const id = parseInt(params.id) - 1;
  
  if (id < 0 || id >= articles.length) {
    return {
      title: 'Article Not Found',
      description: 'The requested article could not be found',
    };
  }
  
  const article = articles[id];
  
  return {
    title: `${article.title} | Public Party`,
    description: article.description,
  };
}

export default function ArticlePage() {
  const params = useParams();
  const [article, setArticle] = useState<ArticleItem | null>(null);
  
  useEffect(() => {
    if (!params.id) return;
    
    const idString = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : '';
    const id = parseInt(idString) - 1;
    
    if (isNaN(id) || id < 0 || id >= articles.length) {
      notFound();
      return;
    }
    
    setArticle(articles[id]);
  }, [params.id]);
  
  if (!article) {
    return <div className="container mx-auto py-10 px-4">Loading...</div>;
  }
  
  return (
    <div className="container mx-auto md:py-10 py-4 md:px-4 px-0">
      <Link 
        href="/article"
        className={cn(
          buttonVariants({ variant: "ghost", size: "sm" }),
          "mb-6"
        )}
      >
        → الرجوع
      </Link>
      
      <article className="max-w-3xl ">
        <div className="relative md:h-80 h-48 w-full md:mb-8 mb-4 rounded-xl overflow-hidden">
          <Image
            src={article.image}
            alt={article.title}
            fill
            className="object-cover object-center"
            priority
          />
        </div>
        
        <header className="mb-8 text-right">
          <h1 className="md:text-3xl text-xl font-bold md:mb-2 mb-1">{article.title}</h1>
          <div className="flex items-center text-sm text-gray-600 gap-2">
            <span>{article.author}</span>
            <span className="mx-2">•</span>
            <span>{article.date}</span>
          </div>
        </header>
        
        <div className="bg-gray-100 dark:bg-neutral-900 md:p-6 p-4 rounded-lg md:mb-6 mb-4 rtl">
          <p className="text-lg leading-relaxed text-right">{article.description}</p>
        </div>
        
        <div className="prose max-w-none rtl">
          <p className="text-right">
            هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة، لقد تم توليد هذا النص من مولد النص العربى، حيث يمكنك أن تولد مثل هذا النص أو العديد من النصوص الأخرى إضافة إلى زيادة عدد الحروف التى يولدها التطبيق.
          </p>
          <p className="text-right">
            إذا كنت تحتاج إلى عدد أكبر من الفقرات يتيح لك مولد النص العربى زيادة عدد الفقرات كما تريد، النص لن يبدو مقسما ولا يحوي أخطاء لغوية، مولد النص العربى مفيد لمصممي المواقع على وجه الخصوص، حيث يحتاج العميل فى كثير من الأحيان أن يطلع على صورة حقيقية لتصميم الموقع.
          </p>
        </div>
      </article>
    </div>
  );
} 