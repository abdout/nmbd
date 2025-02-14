import { onboardingRoutes } from '@/components/add/types';
import { redirect } from 'next/navigation';
import React from 'react';

export default function AddPage() {
  redirect(onboardingRoutes.TERMS);
}
