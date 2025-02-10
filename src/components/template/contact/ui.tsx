'use client'
import React from 'react'

import Excute from './excute'
// import Office from './office'
import NewsLetter from './newsletter'
import Social from './social'
import Head from '@/components/atom/head'
import MapSection from './map'

const Contact = () => {
  return (
    <>
    <Head title="الاتصال" description="حبابك عشرة" />
    <div className=' flex flex-col space-y-8 md:px-20'>
        
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