// import { getUserById } from "@/components/auth/data/user";
// import { auth } from "@/auth";
// import { notFound } from "next/navigation";
// import Link from "next/link";
// import { buttonVariants } from "@/components/ui/button";
// import { cn } from "@/lib/utils";
// import Image from "next/image";
// import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
// import { Icon } from '@iconify/react';

// export default async function UserProfile({
//   params
// }: {
//   params: { id: string }
// }) {
//   // Get the profile user by ID
//   const profileUser = await getUserById(params.id);
  
//   if (!profileUser) {
//     notFound();
//   }
  
//   // Get the current authenticated user
//   const session = await auth();
//   const isOwnProfile = session?.user?.id === params.id;

//   return (
//     <div className="container mx-auto py-8">
//       <div className="flex flex-col md:flex-row gap-8">
//         {/* Profile header section */}
//         <div className="md:w-1/3">
//           <div className="bg-background rounded-lg shadow-sm p-6 border">
//             <div className="flex flex-col items-center">
//               <Image
//                 src={profileUser.image || "/placeholder-avatar.jpg"}
//                 alt={profileUser.name || "User profile"}
//                 width={150}
//                 height={150}
//                 className="rounded-full object-cover border-4 border-muted"
//               />
//               <h1 className="mt-4 text-2xl font-bold">
//                 {profileUser.name}
//               </h1>
//               <p className="text-muted-foreground">
//                 {profileUser.email}
//               </p>

//               {/* Social Media Links */}
//               <div className="flex gap-4 mt-4">
//                 {profileUser.facebook && (
//                   <a href={profileUser.facebook} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
//                     <Icon icon="bi:facebook" width={20} height={20} />
//                   </a>
//                 )}
//                 {profileUser.twitter && (
//                   <a href={profileUser.twitter} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
//                     <Icon icon="akar-icons:twitter-fill" width={20} height={20} />
//                   </a>
//                 )}
//                 {profileUser.linkedin && (
//                   <a href={profileUser.linkedin} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
//                     <Icon icon="akar-icons:linkedin-fill" width={20} height={20} />
//                   </a>
//                 )}
//               </div>
              
//               {/* Edit Profile Button (only visible to profile owner) */}
//               {isOwnProfile && (
//                 <Link 
//                   href="/onboarding"
//                   className={cn(
//                     buttonVariants({ variant: "outline", size: "sm" }),
//                     "mt-6 w-full"
//                   )}
//                 >
//                   تعديل
//                 </Link>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Profile Content */}
//         <div className="md:w-2/3">
//           <Tabs defaultValue="about" className="w-full">
//             <TabsList className="grid w-full grid-cols-4">
//               <TabsTrigger value="about">نبذة</TabsTrigger>
//               <TabsTrigger value="education">التعليم</TabsTrigger>
//               <TabsTrigger value="skills">المهارات</TabsTrigger>
//               <TabsTrigger value="activities">النشاطات</TabsTrigger>
//             </TabsList>
            
//             <TabsContent value="about" className="p-4 bg-background rounded-lg shadow-sm border mt-2">
//               <h2 className="text-xl font-bold mb-4">نبذة شخصية</h2>
//               <p className="text-muted-foreground">
//                 {profileUser.bio || "لا توجد معلومات متاحة"}
//               </p>
              
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
//                 <div>
//                   <h3 className="font-semibold mb-2">المعلومات الشخصية</h3>
//                   <ul className="space-y-2">
//                     <li>
//                       <span className="text-muted-foreground">الدولة: </span>
//                       <span>{profileUser.currentCountry || "غير محدد"}</span>
//                     </li>
//                     <li>
//                       <span className="text-muted-foreground">المحلية: </span>
//                       <span>{profileUser.currentLocality || "غير محدد"}</span>
//                     </li>
//                     <li>
//                       <span className="text-muted-foreground">الحي: </span>
//                       <span>{profileUser.currentNeighborhood || "غير محدد"}</span>
//                     </li>
//                   </ul>
//                 </div>
//                 <div>
//                   <h3 className="font-semibold mb-2">معلومات الاتصال</h3>
//                   <ul className="space-y-2">
//                     <li>
//                       <span className="text-muted-foreground">البريد الإلكتروني: </span>
//                       <span>{profileUser.email || "غير محدد"}</span>
//                     </li>
//                     <li>
//                       <span className="text-muted-foreground">واتساب: </span>
//                       <span>{profileUser.whatsapp || "غير محدد"}</span>
//                     </li>
//                   </ul>
//                 </div>
//               </div>
//             </TabsContent>
            
//             <TabsContent value="education" className="p-4 bg-background rounded-lg shadow-sm border mt-2">
//               <h2 className="text-xl font-bold mb-4">المعلومات التعليمية</h2>
              
//               {(profileUser.educationLevel || profileUser.institution) ? (
//                 <div className="space-y-4">
//                   <div className="p-4 border rounded-md">
//                     <h3 className="font-semibold">{profileUser.educationLevel || "التعليم"}</h3>
//                     <p className="text-muted-foreground">{profileUser.institution || ""}</p>
//                     <p className="text-sm text-muted-foreground">{profileUser.major || ""}</p>
//                     <p className="text-sm text-muted-foreground">
//                       {profileUser.yearOfCompletion ? `سنة التخرج: ${profileUser.yearOfCompletion}` : ""}
//                     </p>
//                   </div>
//                 </div>
//               ) : (
//                 <p className="text-muted-foreground">لا توجد معلومات تعليمية متاحة</p>
//               )}
//             </TabsContent>
            
//             <TabsContent value="skills" className="p-4 bg-background rounded-lg shadow-sm border mt-2">
//               <h2 className="text-xl font-bold mb-4">المهارات</h2>
              
//               {(profileUser.skills && profileUser.skills.length > 0) ? (
//                 <div className="flex flex-wrap gap-2">
//                   {(profileUser.skills as string[]).map((skill, index) => (
//                     <span key={index} className="bg-muted px-3 py-1 rounded-full text-sm">
//                       {skill}
//                     </span>
//                   ))}
//                 </div>
//               ) : (
//                 <p className="text-muted-foreground">لا توجد مهارات متاحة</p>
//               )}
              
//               <h2 className="text-xl font-bold mt-6 mb-4">الاهتمامات</h2>
              
//               {(profileUser.interests && profileUser.interests.length > 0) ? (
//                 <div className="flex flex-wrap gap-2">
//                   {(profileUser.interests as string[]).map((interest, index) => (
//                     <span key={index} className="bg-muted px-3 py-1 rounded-full text-sm">
//                       {interest}
//                     </span>
//                   ))}
//                 </div>
//               ) : (
//                 <p className="text-muted-foreground">لا توجد اهتمامات متاحة</p>
//               )}
//             </TabsContent>
            
//             <TabsContent value="activities" className="p-4 bg-background rounded-lg shadow-sm border mt-2">
//               <h2 className="text-xl font-bold mb-4">النشاطات</h2>
              
//               <div className="space-y-6">
//                 {profileUser.partyMember && (
//                   <div className="border-b pb-4">
//                     <h3 className="font-semibold">نشاط سياسي</h3>
//                     <p>{profileUser.partyName || ""}</p>
//                   </div>
//                 )}
                
//                 {profileUser.unionMember && (
//                   <div className="border-b pb-4">
//                     <h3 className="font-semibold">نشاط نقابي</h3>
//                     <p>{profileUser.unionName || ""}</p>
//                   </div>
//                 )}
                
//                 {profileUser.ngoMember && (
//                   <div className="border-b pb-4">
//                     <h3 className="font-semibold">نشاط اجتماعي</h3>
//                     <p>{profileUser.ngoName || ""}</p>
//                     <p>{profileUser.ngoActivity || ""}</p>
//                   </div>
//                 )}
                
//                 {profileUser.clubMember && (
//                   <div className="pb-4">
//                     <h3 className="font-semibold">نشاط شبابي</h3>
//                     <p>{profileUser.clubName || ""}</p>
//                     <p>{profileUser.clubType || ""}</p>
//                   </div>
//                 )}
                
//                 {!profileUser.partyMember && !profileUser.unionMember && 
//                  !profileUser.ngoMember && !profileUser.clubMember && (
//                   <p className="text-muted-foreground">لا توجد نشاطات متاحة</p>
//                 )}
//               </div>
//             </TabsContent>
//           </Tabs>
//         </div>
//       </div>
//     </div>
//   );
// } 

import React from 'react'

const page = () => {
  return (
    <div>page</div>
  )
}

export default page