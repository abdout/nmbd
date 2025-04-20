'use client';
import React, { useState, useEffect } from 'react';
import { Icon } from "@iconify/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog";
import ForYou from '@/components/platform/x/for-you';
import Tranding from '@/components/platform/x/for-you/tranding';
import FollowFriend from '@/components/platform/x/for-you/friend';
import FollowActivity from '@/components/platform/x/for-you/activity';
import AddPost from '@/components/platform/x/post/add-post';
import ClientFeed from '@/components/platform/x/feed/client-feed';
// import { useRouter } from 'next/navigation';
import { useSession } from "next-auth/react";

export default function Page() {
  const [isDialogOpen, setIsDialogOpen] = useState(true);
  const { data: session } = useSession();
  const userId = session?.user?.id;
  
  useEffect(() => {
    console.log("Platform page - current user session:", session?.user?.id);
  }, [session]);

  // const router = useRouter();
  // useEffect(() => {
  //   if (window.location.hash === '#_=_') {
  //       router.replace('/platform'); 
  //   }

  return (
    <div className="flex h-full text-center">
      <div className='flex  gap-2 p-4'>
      <div className='flex flex-col gap-6 p-4'>
        <AddPost />
        <div>
          {/* Debug info */}
          <div className="text-xs text-gray-400 mb-2 text-left">User ID: {userId || "Not logged in"}</div>
          <ClientFeed userId={userId} />
        </div>
      </div>
      <div className='flex justify-end gap-2 p-4'>
        <ForYou />
      </div>
      </div>
     
     
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[80%] md:max-w-[60%] pr-20" onInteractOutside={() => setIsDialogOpen(false)}>
          <DialogHeader>
            <h1 className="font-heading font-bold text-start text-3xl leading-normal sm:text-2xl md:text-3xl">
              مرحبا بيك
            </h1>
          </DialogHeader>
          
          <div className='relative -mt-2 '>
            <p className='text-[16px] text-muted-foreground'>في منصة الحركة الوطنية للبناء والتنمية</p>

            <p className='w-full md:w-4/5 pt-4'>لن يصيب المجد كف واحد - إيماناً بسحر العمل الجماعي، نسعى من خلال هذه المنصة إلى أتمتة أعمال الحركة  وامتلاك ادوات تنسيق وتعاون افضل. ساهم في خلق تجربة جديدة من الكفاءة والتنظيم.</p>

            <div className='flex flex-col md:flex-row justify-between items-center mt-8'>
              <div>
                <p className='-mt-2 mb-4 text-sm'>استكشف الروابط أدناه للدليل المستخدم ومركز المساعدة👇</p>
                <div className='flex gap-8 items-center'>
                  <Icon icon={"ph:book-fill"} height="60" className="opacity-80 hover:opacity-100 transition-opacity duration-200" />
                  <Icon icon={"ant-design:customer-service-filled"} height="60" className="opacity-80 hover:opacity-100 transition-opacity duration-200" />
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}