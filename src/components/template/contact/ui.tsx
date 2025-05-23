'use client'
import React from 'react'
// Remove unused imports
// import { useEffect, useState } from 'react'
// import dynamic from 'next/dynamic'

import Excute from './excute'
// import Office from './office'
import NewsLetter from './newsletter'
import Social from './social'
import Head from '@/components/atom/site-heading'
import MapSection from './map'

const Contact = () => {
  return (
    <>
    <Head title="الاتصال" description="حبابك عشرة" />
    <div className='flex flex-col space-y-8 px-2 md:px-20'>
        
        {/* <Office /> */}
        <MapSection />  
        <Excute />
        <NewsLetter />
        <Social />
        
    </div>
    </>
  )
}

export default Contact