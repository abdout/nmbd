'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { currentUser } from '@/lib/auth';
import type { EducationSchema } from './validation';
import { educationSchema } from './validation';

// Action result type
interface ActionResult {
  success: boolean;
  error?: string;
}

export async function submitEducation(data: EducationSchema): Promise<ActionResult> {
  try {
    const user = await currentUser();
    if (!user?.id) {
      return { 
        success: false, 
        error: 'User not found or not authenticated' 
      };
    }

    // Validate form data
    const validatedData = educationSchema.safeParse(data);
    if (!validatedData.success) {
      console.error('Validation error:', validatedData.error);
      return { success: false, error: 'البيانات المدخلة غير صحيحة' };
    }

    // Convert string values to numbers where needed
    const processedData = {
      ...validatedData.data,
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

export async function getEducation() {
  try {
    const user = await currentUser();
    if (!user?.id) return null;

    const userData = await db.user.findUnique({
      where: { id: user.id },
      select: {
        educationLevel: true,
        studentYear: true,
        studentInstitution: true,
        studentFaculty: true,
        diplomaInstitution: true,
        diplomaMajor: true,
        diplomaCompletionYear: true,
        bachelorInstitution: true,
        bachelorMajor: true,
        bachelorCompletionYear: true,
        masterInstitution: true,
        masterMajor: true,
        masterCompletionYear: true,
        phdInstitution: true,
        phdMajor: true,
        phdCompletionYear: true,
        professorInstitution: true,
        professorMajor: true,
        professorCompletionYear: true,
      }
    });

    return userData;
  } catch (error) {
    console.error('Error getting education data:', error);
    return null;
  }
} 