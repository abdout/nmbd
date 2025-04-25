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
        <div className='absolute top-10 left-4 space-y-6 gap-2 p-4'>
            <Tranding />
            <FollowFriend />
            <FollowActivity />
        </div>
    )
}

export default ForYou