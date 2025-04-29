'use server';

import { revalidatePath } from 'next/cache';
import { updateInformation } from '@/components/onboarding/information/action';
import type { EducationSchema } from './validation';

export async function submitEducation(data: EducationSchema) {
  try {
    // We'll reuse the existing updateInformation function since it already handles all fields
    const result = await updateInformation(data);
    
    // Revalidate both the education and activity pages
    revalidatePath('/onboarding/education');
    revalidatePath('/onboarding/activity');
    
    return { success: true, data: result };
  } catch (error) {
    console.error('Error submitting education data:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
} 