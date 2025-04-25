'use client';
import { Button } from '@/components/ui/button';
import React from 'react'
import { Icon } from "@iconify/react";
import { Separator } from '@/components/ui/separator';

const FollowActivity = () => {
    const suggestions = [
        {
            type: 'project',
            name: 'الاقتصاد التشاركي',
            handle: 'SharingEconomy@',
            icon: 'ic:baseline-folder',
            color: '#FFCB05' // Yellow color
        },
        {
            type: 'task',
            name: 'العقود الذكية',
            handle: 'SmartContracts@', 
            icon: 'codicon:issues',
            color: '#4CAF50' // Green color
        }
    ];

    return (
        <div className='px-6 py-4 bg-gray-50 w-[250px] justify-end rounded-sm'>
            <div className='h-[20px] text-[16px] font-semibold flex'>
                لك
            </div>
            <Separator className='w-[250px] -mx-6  my-2'/>
            
            {suggestions.map((item, index) => (
                <div key={index} className='h-[60px] flex items-center justify-between mb-2'>
                    <div className='flex flex-row items-center gap-4'>
                        <div className="w-[40px] h-[40px] flex items-center justify-center ">
                            <Icon icon={item.icon} height="40" color={item.color} />
                        </div>
                        <div className='flex flex-col'>
                            <p className='text-sm font-bold'>{item.name}</p>
                            <p className='text-sm text-[#5B7083] font-medium'>{item.handle}</p>
                        </div>
                    </div>
                </div>
            ))}
            <Separator className='w-[250px] -mx-6  my-1'/>
            <div className='flex h-[25px] text-sm text-[#0077B5] font-medium py-4 px-2'>
                المزيد
            </div>
        </div>
    )
}

export default FollowActivity