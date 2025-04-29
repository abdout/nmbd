'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { currentUser } from '@/lib/auth';
import type { EducationSchema } from './validation';

export async function submitEducation(data: EducationSchema) {
  try {
    const user = await currentUser();
    if (!user?.id) {
      return { 
        success: false, 
        error: 'User not found or not authenticated' 
      };
    }

    // Convert string values to numbers where needed
    const processedData = {
      ...data,
      studentYear: data.studentYear ? parseInt(data.studentYear) : null,
      studentGraduationYear: data.studentGraduationYear ? parseInt(data.studentGraduationYear) : null,
      diplomaCompletionYear: data.diplomaCompletionYear ? parseInt(data.diplomaCompletionYear) : null,
      bachelorCompletionYear: data.bachelorCompletionYear ? parseInt(data.bachelorCompletionYear) : null,
      masterCompletionYear: data.masterCompletionYear ? parseInt(data.masterCompletionYear) : null,
      phdCompletionYear: data.phdCompletionYear ? parseInt(data.phdCompletionYear) : null,
      professorCompletionYear: data.professorCompletionYear ? parseInt(data.professorCompletionYear) : null,
    };

    // Update education data
    await db.user.update({
      where: { id: user.id },
      data: {
        ...processedData,
        onboardingStep: 4 // Update the onboarding step
      }
    });
    
    // Revalidate both the education and activity pages
    revalidatePath('/onboarding/education');
    revalidatePath('/onboarding/activity');
    
    return { success: true };
  } catch (error) {
    console.error('Error submitting education data:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
} 