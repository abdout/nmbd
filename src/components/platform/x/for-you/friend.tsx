'use client';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import React from 'react'

const FollowFriend = () => {
    return (
        <div className='px-6 py-4 bg-gray-50 w-[250px] justify-end rounded-sm'>
            <div className='h-[30px] text-[16px] font-semibold flex  '>
         تود متابعة
            </div>
            <Separator className='w-[250px] -mx-6  my-2'/>
            <div className='h-[60px] flex items-center justify-between -mt-2 '>
                <div className='flex flex-row items-center gap-4'>
                    <Avatar>
                        <AvatarImage className="w-[40px] h-[40px] rounded-full" src="/x/نورين.jpg" alt="@shadcn" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div className='flex flex-col'>
                        <p className='text-sm font-bold'> نورين</p>
                        <p className='text-sm text-[#5B7083] font-medium'>norain@</p>
                    </div>
                </div>
                <Button variant="outline" className="w-[60px] bg-gray-100 h-[28px] rounded-[16px] border-[1.2px] border-[#0077B5] text-sm font-medium text-[#0077B5]">
                    تابع
                </Button>
            </div>
            <Separator className='border-black border-1 w-[250px] -mx-6 my-2'/>
            <div className='h-[60px] flex items-center justify-between '>
                <div className='flex flex-row items-center gap-4'>
                    <Avatar>
                        <AvatarImage className="w-[40px] h-[40px] rounded-full" src="/x/المقداد.png" alt="@shadcn" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div className='flex flex-col'>
                        <p className='text-sm font-bold'> المقداد</p>
                        <p className='text-sm text-[#5B7083] font-medium'>alhajan@</p>
                    </div>
                </div>
                <Button variant="outline" className="w-[60px] bg-gray-100 h-[28px] rounded-[16px] border-[1.2px] border-[#0077B5] text-sm font-medium text-[#0077B5]">
                    تابع
                </Button>
            </div>
            <Separator className='border-black border-1 w-[250px] -mx-6 mb-1 mt-1'/>
            <div className='flex h-[25px] text-sm text-[#0077B5] font-medium py-4 px-2'>
                المزيد
            </div>
        </div>
    )
}

export default FollowFriend