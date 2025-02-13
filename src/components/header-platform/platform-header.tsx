// import { buttonVariants } from '@/components/ui/button'
// import { cn } from '@/lib/utils'
// import Link from 'next/link'
import React from 'react'
import { MainNav } from './main-nav'
import { marketingConfig } from './constant'
import { ModeSwitcher } from './mode-switcher'
import { CommandMenu } from '../template/header-shadcn/command-menu'

const PlatformHeader = () => {
  return (
    <>
    <header className="container z-40 antialiased font-sans bg-background px-1 md:px-24">
      <div className="flex h-[4rem] items-center justify-between md:justify-center py-6 border-gray-200">
        <MainNav items={marketingConfig.mainNav} />


        <div className='flex items-center gap-2 md:pr-20'>
          {/* <nav>
            <Link
              href="/login"



              className={cn(
                buttonVariants({ variant: "secondary", size: "sm" }),
                "px-4"
              )}
            >
              الدخول



            </Link>
          </nav> */}
          <div className="w-full flex-1 md:w-auto md:flex-none">
              <CommandMenu />
            </div>
          <ModeSwitcher />

        </div>
      </div>
    </header>
    <hr className="hidden md:block  border-gray-200 pb-6" />
    </>   
  )
}


export default PlatformHeader