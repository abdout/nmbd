"use server";

import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { onboardingRoutes } from "../types";
import { ActivitySchema } from "./validation";

export async function submitActivityForm(formData: ActivitySchema) {
  try {
    const user = await currentUser();
    if (!user?.id) {
      return { success: false, nextUrl: onboardingRoutes.ACTIVITY };
    }

    console.log("Received form data:", formData);

    const data = {
      partyMember: formData.partyMember,
      partyName: formData.partyMember ? formData.partyName : null,
      partyStartDate: formData.partyMember && formData.partyStartDate 
        ? new Date(formData.partyStartDate)
        : null,
      partyEndDate: formData.partyMember && formData.partyEndDate
        ? new Date(formData.partyEndDate)
        : null,
      
      unionMember: formData.unionMember,
      unionName: formData.unionMember ? formData.unionName : null,
      unionStartDate: formData.unionMember && formData.unionStartDate
        ? new Date(formData.unionStartDate)
        : null,
      unionEndDate: formData.unionMember && formData.unionEndDate
        ? new Date(formData.unionEndDate)
        : null,
      
      ngoMember: formData.ngoMember,
      ngoName: formData.ngoMember ? formData.ngoName : null,
      ngoActivity: formData.ngoMember ? formData.ngoActivity : null,
      
      clubMember: formData.clubMember,
      clubName: formData.clubMember ? formData.clubName : null,
      clubType: formData.clubMember ? formData.clubType : null,
      
      voluntaryMember: formData.voluntaryMember,
      voluntaryName: formData.voluntaryMember ? formData.voluntaryName : null,
      voluntaryRole: formData.voluntaryMember ? formData.voluntaryRole : null,
      voluntaryStartDate: formData.voluntaryMember && formData.voluntaryStartDate
        ? new Date(formData.voluntaryStartDate)
        : null,
      voluntaryEndDate: formData.voluntaryMember && formData.voluntaryEndDate
        ? new Date(formData.voluntaryEndDate)
        : null,
      
      onboardingStep: 3
    };

    console.log("Data to update:", data);

    await db.user.update({
      where: { id: user.id },
      data
    });

    revalidatePath("/onboarding");
    return { success: true, nextUrl: onboardingRoutes.REVIEW };
  } catch (error) {
    console.error("Activity update error:", error);
    return { success: false, nextUrl: onboardingRoutes.ACTIVITY };
  }
} 