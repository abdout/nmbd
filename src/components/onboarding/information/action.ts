"use server";

import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { InformationSchema } from "./validation";

export type ActionState = {
  success: boolean;
  error: boolean;
  message?: string;
};

// Create
export async function createInformation(state: ActionState, data: InformationSchema) {
  try {
    const user = await currentUser();
    if (!user?.id) return { success: false, error: true };

    await db.user.update({
      where: { id: user.id },
      data: {
        ...data,
        birthMonth: data.birthMonth ? parseInt(data.birthMonth) : null,
        birthYear: data.birthYear ? parseInt(data.birthYear) : null,
        yearOfCompletion: data.yearOfCompletion ? parseInt(data.yearOfCompletion) : null,
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
        educationLevel: true,
        institution: true,
        yearOfCompletion: true,
        currentOccupation: true,
        employmentSector: true,
        workplaceAddress: true,
        maritalStatus: true,
        gender: true,
        religion: true,
        nationalityId: true,
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
  console.log("updateInformation called with data:", data);
  
  // Safety check - if data is null or undefined, return error
  if (!data) {
    console.error("updateInformation received null/undefined data");
    return { success: false, error: true, message: "No data provided" };
  }
  
  try {
    const user = await currentUser();
    if (!user?.id) return { success: false, error: true };

    // Create a clean data object with all fields from the schema
    const cleanData = {
      name: data.name || null,
      fullname: data.fullname || null,
      description: data.description || null,
      bio: data.bio || null,
      birthMonth: data.birthMonth ? parseInt(data.birthMonth) : null,
      birthYear: data.birthYear ? parseInt(data.birthYear) : null,
      birthCountry: data.birthCountry || null,
      birthState: data.birthState || null,
      birthLocality: data.birthLocality || null,
      currentLocality: data.currentLocality || null,
      currentCountry: data.currentCountry || null,
      currentState: data.currentState || null,
      currentAdminUnit: data.currentAdminUnit || null,
      currentNeighborhood: data.currentNeighborhood || null,
      originalLocality: data.originalLocality || null,
      originalCountry: data.originalCountry || null,
      educationLevel: data.educationLevel || null,
      institution: data.institution || null,
      yearOfCompletion: data.yearOfCompletion ? parseInt(data.yearOfCompletion) : null,
      currentOccupation: data.currentOccupation || null,
      employmentSector: data.employmentSector || null,
      workplaceAddress: data.workplaceAddress || null,
      maritalStatus: data.maritalStatus || null,
      gender: data.gender || null,
      religion: data.religion || null,
      nationalityId: data.nationalityId || null,
    };

    console.log("Clean data for update:", cleanData);

    await db.user.update({
      where: { id: user.id },
      data: cleanData
    });

    revalidatePath("/lab");
    return { success: true, error: false };
  } catch (error) {
    console.error("Error in updateInformation:", error);
    return { success: false, error: true, message: String(error) };
  }
}

// Delete
export async function deleteInformation(state: ActionState) {
  try {
    const user = await currentUser();
    if (!user?.id) return { success: false, error: true };

    await db.user.update({
      where: { id: user.id },
      data: {
        name: null,
        fullname: null,
        description: null,
        bio: null,
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
        educationLevel: null,
        institution: null,
        yearOfCompletion: null,
        currentOccupation: null,
        employmentSector: null,
        workplaceAddress: null,
        maritalStatus: null,
        gender: null,
        religion: null,
        nationalityId: null,
      }
    });

    revalidatePath("/lab");
    return { success: true, error: false };
  } catch (error) {
    console.error(error);
    return { success: false, error: true };
  }
} 