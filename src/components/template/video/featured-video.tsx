import Head from '@/components/atom/head'
import React from 'react'
import { featuredVideos } from './constant'
import HoverEffect from '@/components/atom/card-video'



const FeaturedVideos = () => {
  return (
    <div className='mt-20'>
      <Head title="الوثائقيات" description="ما يضر الجهل به" />
      <div className="max-w-5xl mx-auto px-8 -mt-10">
        <HoverEffect items={featuredVideos()} />
      </div>
    </div>
  )
}

export default FeaturedVideos