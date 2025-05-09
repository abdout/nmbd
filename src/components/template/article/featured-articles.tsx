import Head from '@/components/atom/site-heading'
import React from 'react'
import { featuredArticles } from './constant'
import { ArticleHoverEffect } from '@/components/atom/card-article'




const FeaturedArticles = () => {
  return (
    <div className=''>
      <Head title="المقالات" description="مدونة الحركة" />

      <div className="-mt-10">
        <ArticleHoverEffect items={featuredArticles()} />
      </div>
    </div>

  )
}

export default FeaturedArticles