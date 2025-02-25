import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";

export async function POST(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const user = await currentUser();
    
    if (!user?.id || user.id !== params.userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    
    const body = await req.json();
    
    const updatedUser = await db.user.update({
      where: {
        id: params.userId,
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