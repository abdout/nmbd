/* eslint-disable */
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";

export async function POST(
  request: Request,
) {
  try {
    const user = await currentUser();
    
    // Extract userId from the URL path
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const userId = pathParts[pathParts.indexOf('users') + 1];
    
    if (!user?.id || user.id !== userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    
    const body = await request.json();
    
    const updatedUser = await db.user.update({
      where: {
        id: userId,
      },
      data: {
        onboardingStatus: body.onboardingStatus || "COMPLETED",
        onboardingStep: 6, // Set to the last step
      },
    });
    
    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("[COMPLETE_ONBOARDING]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 