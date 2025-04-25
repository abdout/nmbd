/* eslint-disable */
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";

// This is a simpler approach to allow for deployment
export async function POST(request: Request) {
  try {
    const user = await currentUser();
    
    // Extract userId from the URL path
    const path = request.url.split('/');
    const userId = path[path.length - 2]; // Get second-to-last segment of the URL
    
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