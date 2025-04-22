import Head from '@/components/atom/site-heading'
import React from 'react'
import { featuredVideos } from './constant'
import HoverEffect from '@/components/atom/card-video'



const FeaturedVideos = () => {
  return (
    <div className='mt-6 md:mt-20'>
      <Head title="الوثائقيات" description="ما يضر الجهل به" />
      <div className="max-w-5xl mx-auto md:px-8 -mt-10">
        <HoverEffect items={featuredVideos()} />
      </div>
    </div>
  )
}

export default FeaturedVideos