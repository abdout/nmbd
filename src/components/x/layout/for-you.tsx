'use client';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import React from 'react'
import FollowFriend from './friend';
import FollowActivity from './activity';
import Tranding from './tranding';

const ForYou = () => {
    return (
        <div className='flex flex-col gap-2 p-4'>
            <Tranding />
            <FollowFriend />
            <FollowActivity />
        </div>
    )
}

export default ForYou