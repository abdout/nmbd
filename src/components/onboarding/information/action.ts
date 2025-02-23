"use server";

import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { InformationSchema } from "./validation";

export type ActionState = {
  success: boolean;
  error: boolean;
};

// Create
export async function createInformation(state: ActionState, data: InformationSchema) {
  try {
    const user = await currentUser();
    if (!user?.id) return { success: false, error: true };

    await db.user.update({
      where: { id: user.id },
      data: {
        name: data.name,
        fullname: data.fullname,
        description: data.description || '',
        bio: data.bio || '',
        birthMonth: data.birthMonth,
        birthYear: data.birthYear,
        currentLocality: data.currentLocality || '',
        currentCountry: data.currentCountry || '',
        currentState: data.currentState || '',
        currentAdminUnit: data.currentAdminUnit || '',
        currentNeighborhood: data.currentNeighborhood || '',
        originalLocality: data.originalLocality || '',
        originalCountry: data.originalCountry || '',
        educationLevel: data.educationLevel || '',
        institution: data.institution || '',
        yearOfCompletion: data.yearOfCompletion || 0,
        currentOccupation: data.currentOccupation || '',
        employmentSector: data.employmentSector || '',
        workplaceAddress: data.workplaceAddress || '',
        maritalStatus: data.maritalStatus || '',
        gender: data.gender || '',
        religion: data.religion || '',
        nationalityId: data.nationalityId || '',
        onboardingStep: 1
      }
    });

    revalidatePath("/lab");
    return { success: true, error: false };
  } catch (error) {
    console.error(error);
    return { success: false, error: true };
  }
}

// Read
export async function getInformation() {
  try {
    const user = await currentUser();
    if (!user?.id) return null;

    const userData = await db.user.findUnique({
      where: { id: user.id },
      select: {
        name: true,
        fullname: true,
        description: true,
        bio: true,
        birthMonth: true,
        birthYear: true,

        currentLocality: true,
        currentCountry: true,
        currentState: true,
        currentAdminUnit: true,
        currentNeighborhood: true,

        originalLocality: true,
        originalCountry: true,
        educationLevel: true,
        institution: true,
        yearOfCompletion: true,
        currentOccupation: true,
        employmentSector: true,
        workplaceAddress: true,

        
      }
    });

    return userData;
  } catch (error) {
    console.error(error);
    return null;
  }
}

// Update
export async function updateInformation(state: ActionState, data: InformationSchema) {
  try {
    const user = await currentUser();
    if (!user?.id) return { success: false, error: true };

    await db.user.update({
      where: { id: user.id },
      data: {
        name: data.name,
        fullname: data.fullname,
        description: data.description || '',
        bio: data.bio || '',
        birthMonth: data.birthMonth,
        birthYear: data.birthYear,
        currentLocality: data.currentLocality || '',
        currentCountry: data.currentCountry || '',
        currentState: data.currentState || '',
        currentAdminUnit: data.currentAdminUnit || '',
        currentNeighborhood: data.currentNeighborhood || '',
        originalLocality: data.originalLocality || '',
        originalCountry: data.originalCountry || '',
        educationLevel: data.educationLevel || '',
        institution: data.institution || '',
        yearOfCompletion: data.yearOfCompletion || 0,
        currentOccupation: data.currentOccupation || '',
        employmentSector: data.employmentSector || '',
        workplaceAddress: data.workplaceAddress || '',
        maritalStatus: data.maritalStatus || '',
        gender: data.gender || '',
        religion: data.religion || '',
        nationalityId: data.nationalityId || '',
        onboardingStep: 1
      }
    });

    revalidatePath("/lab");
    return { success: true, error: false };
  } catch (error) {
    console.error(error);
    return { success: false, error: true };
  }
} 