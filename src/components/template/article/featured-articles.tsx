import Head from '@/components/atom/head'
import React from 'react'
import { featuredArticles } from './constant'
import { ArticleHoverEffect } from '@/components/atom/card-article'




const FeaturedArticles = () => {
  return (
    <div className=''>
      <Head title="المقالات" description="مدونة الحركة" />

      <div className="max-w-5xl mx-auto md:px-8 -mt-10">
        <ArticleHoverEffect items={featuredArticles()} />
      </div>
    </div>

  )
}

export default FeaturedArticles