import Head from '@/components/atom/head'
import React from 'react'
import { LampDesktop } from './lamp-desktop'

import { LampMobile } from './lamp-mobile'

const Event = () => {
  return (
    <div>
        <Head title="الأحداث" description='القادمة'/>
        <div className='hidden md:block'>
          <LampDesktop />
        </div>
        <div className='block md:hidden'>
          <LampMobile />
        </div>
    </div>
  )
}

export default Event