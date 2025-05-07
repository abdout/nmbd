/* eslint-disable */
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";

// Simplified handler to allow for deployment
export async function GET(req: NextRequest) {
  try {
    const user = await currentUser();
    
    // Extract userId from the URL path
    const path = req.url.split('/');
    const userId = path[path.length - 1]; // Get last segment of the URL
    
    if (!user?.id || user.id !== userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    
    const userData = await db.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        image: true,
        fullname: true,
        createdAt: true,        
        onboardingStatus: true,
        onboardingStep: true,
        phone: true,
        whatsapp: true,
        telegram: true,
      },
    });
    
    return NextResponse.json(userData);
  } catch (error) {
    console.error("[GET_USER]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// Add DELETE handler for account deletion
export async function DELETE(req: NextRequest) {
  try {
    const user = await currentUser();
    // Extract userId from the URL path
    const path = req.url.split('/');
    const userId = path[path.length - 1];
    if (!user?.id || user.id !== userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    await db.user.delete({ where: { id: userId } });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[DELETE_USER]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 