"use server";

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { currentUser } from '@/lib/auth';
import type { InformationSchema } from './validation';
import { informationSchema } from './validation';

// Action result type
interface ActionResult {
  success: boolean;
  error?: string;
}

/**
 * Create new information record
 */
export async function createInformation(
  formData: InformationSchema | FormData
): Promise<ActionResult> {
  try {
    console.log('Server: createInformation called with formData:', 
      formData instanceof FormData ? 'FormData object' : formData);
      
    // Authenticate user
    const user = await currentUser();
    if (!user?.id) {
      console.error('User not found or not authenticated');
      return { success: false, error: 'User not found or not authenticated' };
    }

    // Handle either FormData or direct object
    let processedData: InformationSchema;
    
    if (formData instanceof FormData) {
      // If it's FormData, extract the values
      const formObject: Record<string, string | File> = {};
      formData.forEach((value, key) => {
        formObject[key] = value;
      });
      processedData = formObject as InformationSchema;
    } else {
      // If it's already an object
      processedData = formData;
    }

    // Validate form data
    const validatedData = informationSchema.safeParse(processedData);
    if (!validatedData.success) {
      console.error('Validation error:', validatedData.error);
      return { success: false, error: 'البيانات المدخلة غير صحيحة' };
    }

    // Convert string values to numbers where needed
    const data = {
      ...validatedData.data,
      birthMonth: validatedData.data.birthMonth ? parseInt(validatedData.data.birthMonth) : null,
      birthYear: validatedData.data.birthYear ? parseInt(validatedData.data.birthYear) : null,
    };

    // Create information record
    await db.user.update({
      where: { id: user.id },
      data: {
        ...data,
        onboardingStep: 3 // Move to education step after completing information
      }
    });

    // Revalidate paths
    revalidatePath('/onboarding/information');
    revalidatePath('/onboarding/education');

    return { success: true };
  } catch (error) {
    console.error('Error creating information:', error);
    return { success: false, error: 'حدث خطأ أثناء حفظ البيانات' };
  }
}

/**
 * Get user information
 */
export async function getInformation() {
  try {
    const user = await currentUser();
    if (!user?.id) return null;

    const userData = await db.user.findUnique({
      where: { id: user.id },
      select: {
        fullname: true,
        description: true,
        birthCountry: true,
        birthState: true,
        birthLocality: true,
        birthMonth: true,
        birthYear: true,
        currentLocality: true,
        currentCountry: true,
        currentState: true,
        currentAdminUnit: true,
        currentNeighborhood: true,
        originalLocality: true,
        originalCountry: true,
        currentOccupation: true,
        employmentSector: true,
        workplaceAddress: true,
        companyName: true,
      }
    });

    return userData;
  } catch (error) {
    console.error('Error getting information:', error);
    return null;
  }
}

/**
 * Update existing information record
 */
export async function updateInformation(
  formData: InformationSchema | FormData
): Promise<ActionResult> {
  try {
    console.log('Server: updateInformation called with formData:', 
      formData instanceof FormData ? 'FormData object' : formData);
    
    // Authenticate user
    const user = await currentUser();
    if (!user?.id) {
      console.error('User not found or not authenticated');
      return { success: false, error: 'User not found or not authenticated' };
    }

    // Handle either FormData or direct object
    let processedData: InformationSchema;
    
    if (formData instanceof FormData) {
      // If it's FormData, extract the values
      const formObject: Record<string, string | File> = {};
      formData.forEach((value, key) => {
        formObject[key] = value;
      });
      processedData = formObject as InformationSchema;
    } else {
      // If it's already an object
      processedData = formData;
    }

    // Validate form data
    const validatedData = informationSchema.safeParse(processedData);
    if (!validatedData.success) {
      console.error('Validation error:', validatedData.error);
      return { success: false, error: 'البيانات المدخلة غير صحيحة' };
    }

    // Convert string values to numbers where needed
    const data = {
      ...validatedData.data,
      birthMonth: validatedData.data.birthMonth ? parseInt(validatedData.data.birthMonth) : null,
      birthYear: validatedData.data.birthYear ? parseInt(validatedData.data.birthYear) : null,
    };

    // Update information
    await db.user.update({
      where: { id: user.id },
      data: data
    });

    // Revalidate paths
    revalidatePath('/onboarding/information');
    revalidatePath('/dashboard');

    return { success: true };
  } catch (error) {
    console.error('Error updating information:', error);
    return { success: false, error: 'حدث خطأ أثناء تحديث البيانات' };
  }
}

/**
 * Delete information record
 */
export async function deleteInformation(): Promise<ActionResult> {
  try {
    const user = await currentUser();
    if (!user?.id) {
      return { success: false, error: 'User not found or not authenticated' };
    }

    // Delete information by setting all fields to null
    await db.user.update({
      where: { id: user.id },
      data: {
        fullname: null,
        description: null,
        birthCountry: null,
        birthState: null,
        birthLocality: null,
        birthMonth: null,
        birthYear: null,
        currentLocality: null,
        currentCountry: null,
        currentState: null,
        currentAdminUnit: null,
        currentNeighborhood: null,
        originalLocality: null,
        originalCountry: null,
        currentOccupation: null,
        employmentSector: null,
        workplaceAddress: null,
        companyName: null,
      }
    });

    // Revalidate paths
    revalidatePath('/onboarding/information');
    revalidatePath('/dashboard');

    return { success: true };
  } catch (error) {
    console.error('Error deleting information:', error);
    return { success: false, error: 'حدث خطأ أثناء حذف البيانات' };
  }
} 