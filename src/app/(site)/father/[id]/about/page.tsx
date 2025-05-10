import AboutSection from '@/components/site/father/about'
import Excute from '@/components/site/father/excute'
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