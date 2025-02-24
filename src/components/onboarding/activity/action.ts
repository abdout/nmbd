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

    const data = {
      partyMember: formData.get('partyMember') === 'true',
      partyName: formData.get('partyMember') === 'true' ? formData.get('partyName') as string : null,
      partyStartDate: formData.get('partyMember') === 'true' && formData.get('partyStartDate') 
        ? new Date(formData.get('partyStartDate') as string) 
        : null,
      partyEndDate: formData.get('partyMember') === 'true' && formData.get('partyEndDate')
        ? new Date(formData.get('partyEndDate') as string)
        : null,
      
      unionMember: formData.get('unionMember') === 'true',
      unionName: formData.get('unionMember') === 'true' ? formData.get('unionName') as string : null,
      unionStartDate: formData.get('unionMember') === 'true' && formData.get('unionStartDate')
        ? new Date(formData.get('unionStartDate') as string)
        : null,
      unionEndDate: formData.get('unionMember') === 'true' && formData.get('unionEndDate')
        ? new Date(formData.get('unionEndDate') as string)
        : null,
      
      ngoMember: formData.get('ngoMember') === 'true',
      ngoName: formData.get('ngoMember') === 'true' ? formData.get('ngoName') as string : null,
      ngoActivity: formData.get('ngoMember') === 'true' ? formData.get('ngoActivity') as string : null,
      
      clubMember: formData.get('clubMember') === 'true',
      clubName: formData.get('clubMember') === 'true' ? formData.get('clubName') as string : null,
      clubType: formData.get('clubMember') === 'true' ? formData.get('clubType') as string : null,
      
      onboardingStep: 3
    };

    await db.user.update({
      where: { id: user.id },
      data
    });

    revalidatePath("/lab");
    return { success: true, nextUrl: onboardingRoutes.NEXT_STEP };
  } catch (error) {
    console.error("Activity update error:", error);
    return { success: false, nextUrl: onboardingRoutes.ACTIVITY };
  }
} 