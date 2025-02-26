import { Suspense } from 'react';
import { headers } from 'next/headers';
import Education from './education-form';
import { db } from '@/lib/db';


async function getUser() {
  const headersList = await headers();
  const userId = headersList.get('x-user-id');
  
  if (!userId) {
    throw new Error('User not authenticated');
  }

  const user = await db.user.findUnique({
    where: {
      id: userId
    }
  });

  if (!user) {
    throw new Error('User not found');
  }

  return user;
}

export default async function EducationPage() {
  const user = await getUser();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Education user={user} />
    </Suspense>
  );
}