// 'use client';
// import React from 'react';
// import { usePathname } from "next/navigation";
//   import ProfileHeader from '@/components/x/profile/header';
// import ProfileBrief from '@/components/x/profile/bio';
// import EditButton from '@/components/platform/platform/edit-button';
// import ProfileFollow from '@/components/platform/platform/follow';
// import Tabbar from '@/components/x/profile/tabbar';
// import ProfileAvatar from '@/components/platform/platform/avater';

// const Profile: React.FC = () => {
//   const pathname = usePathname();
//   const id = pathname.split("/").pop();

//   return (
//     <div className="w-[550px] h-full border-x-[0.09px] mx-8">
//       <ProfileHeader />
//       <ProfileAvatar id={id as string} />
//       <ProfileBrief id={id as string} />
//       <div className='relative bottom-[11.3rem] right-[25rem]'>
//         <EditButton />
//       </div>
//       <ProfileFollow />
//       <Tabbar id={id as string} />
//     </div>
//   );
// };

// export default Profile;
import React from 'react'

const page = () => {
  return (
    <div>page</div>
  )
}

export default page