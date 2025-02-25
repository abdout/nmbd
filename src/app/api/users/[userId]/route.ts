import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const user = await currentUser();
    
    if (!user?.id || user.id !== params.userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    
    const userData = await db.user.findUnique({
      where: {
        id: params.userId,
      },
      select: {
        id: true,
        fullname: true,
        email: true,
        phone: true,
        whatsapp: true,
        birthDate: true,
        birthCountry: true,
        birthState: true,
        birthLocality: true,
        
        // Current Location
        currentCountry: true,
        currentState: true,
        currentLocality: true,
        
        // Education & Work
        educationLevel: true,
        institution: true,
        yearOfCompletion: true,
        currentOccupation: true,
        
        // Activities
        partyMember: true,
        partyName: true,
        unionMember: true,
        unionName: true,
        ngoMember: true,
        ngoName: true,
        clubMember: true,
        clubName: true,
        
        // Files
        cv: true,
        portfolio: true,
      },
    });
    
    if (!userData) {
      return new NextResponse("User not found", { status: 404 });
    }
    
    return NextResponse.json(userData);
  } catch (error) {
    console.error("[USER_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 