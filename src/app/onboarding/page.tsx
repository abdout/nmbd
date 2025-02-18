import { onboardingRoutes } from '@/components/onboarding/types';
import { redirect } from 'next/navigation';
import React from 'react';

export default function AddPage() {
  redirect(onboardingRoutes.TERMS);
}
