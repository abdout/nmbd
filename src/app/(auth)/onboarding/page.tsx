import { onboardingRoutes } from '@/components/add/types';
import { redirect } from 'next/navigation';


export default function AddPage() {
  redirect(onboardingRoutes.TERMS);
}
