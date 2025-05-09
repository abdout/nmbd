import SiteHeading from '@/components/atom/site-heading'
import React from 'react'
import { featuredVideos } from './constant'
import HoverEffect from '@/components/template/video/card-video'




const FeaturedVideos = () => {
  return (
    <div className='mt-6 md:mt-20'>
      <SiteHeading title="الوثائقيات" description="ما يضر الجهل به" />
      <div className="mt-2 mb-10">
        <HoverEffect items={featuredVideos()} />
      </div>
    </div>
  )
}

export default FeaturedVideos