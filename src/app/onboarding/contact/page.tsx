'use client';
import { Suspense } from 'react';
import Contact from './contact-form';
import { mockUser } from '@/components/onboarding/constant';

export default async function ContactPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Contact user={mockUser} />
    </Suspense>
  );
}