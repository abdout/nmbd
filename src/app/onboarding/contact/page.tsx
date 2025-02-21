import { Suspense } from 'react';
import { headers } from 'next/headers';
import Contact from './contact-form';
import { db } from '@/lib/db';
import { mockUser } from '@/components/onboarding/constant';


// async function getUser() {
//   const headersList = await headers();
//   const userId = headersList.get('x-user-id');
  
//   if (!userId) {
//     throw new Error('User not authenticated');
//   }

//   const user = await db.user.findUnique({
//     where: {
//       id: userId
//     }
//   });

//   if (!user) {
//     throw new Error('User not found');
//   }

//   return user;
// }

export default async function ContactPage() {
  // const user = await getUser();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Contact user={mockUser} />
    </Suspense>
  );
}