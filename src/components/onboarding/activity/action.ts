"use server";

import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { onboardingRoutes } from "../types";
import { ActivitySchema } from "./validation";

export async function submitActivityForm(formData: FormData) {
  try {
    const user = await currentUser();
    if (!user?.id) {
      return { success: false, nextUrl: onboardingRoutes.ACTIVITY };
    }

    await db.user.update({
      where: { id: user.id },
      data: {
        partyMember: formData.get('partyMember') === 'true',
        partyName: formData.get('partyName') as string,
        partyStartDate: formData.get('partyStartDate') ? new Date(formData.get('partyStartDate') as string) : null,
        partyEndDate: formData.get('partyEndDate') ? new Date(formData.get('partyEndDate') as string) : null,
        
        unionMember: formData.get('unionMember') === 'true',
        unionName: formData.get('unionName') as string,
        unionStartDate: formData.get('unionStartDate') ? new Date(formData.get('unionStartDate') as string) : null,
        unionEndDate: formData.get('unionEndDate') ? new Date(formData.get('unionEndDate') as string) : null,
        
        ngoMember: formData.get('ngoMember') === 'true',
        ngoName: formData.get('ngoName') as string,
        ngoActivity: formData.get('ngoActivity') as string,
        
        clubMember: formData.get('clubMember') === 'true',
        clubName: formData.get('clubName') as string,
        clubType: formData.get('clubType') as string,
        
        onboardingStep: 3
      }
    });

    revalidatePath("/lab");
    return { success: true, nextUrl: onboardingRoutes.NEXT_STEP };
  } catch (error) {
    console.error("Activity update error:", error);
    return { success: false, nextUrl: onboardingRoutes.ACTIVITY };
  }
} 