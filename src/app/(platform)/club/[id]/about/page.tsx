import AboutSection from '@/components/platform/club/about'
import Excute from '@/components/platform/club/excute'
import React from 'react'

const page = () => {
  return (
    <div className='flex flex-col gap-6'>
      <AboutSection />
      <Excute />
    </div>
  )
}

export default page