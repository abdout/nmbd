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
        // System fields
        id: true,
        name: true,
        fullname: true,
        email: true,
        role: true,
        onboardingStatus: true,
        onboardingStep: true,
        createdAt: true,
        updatedAt: true,
        
        // Personal info
        description: true,
        bio: true,
        phone: true,
        whatsapp: true,
        
        // Social Media
        twitter: true,
        facebook: true,
        linkedin: true,
        telegram: true,
        instagram: true,
        tiktok: true,
        
        // Personal details
        nationalityId: true,
        maritalStatus: true,
        gender: true,
        religion: true,
        
        // Birthday
        birthDate: true,
        birthCountry: true,
        birthState: true,
        birthLocality: true,
        birthAdminUnit: true,
        birthNeighborhood: true,
        birthMonth: true,
        birthYear: true,
        
        // Current Location
        currentCountry: true,
        currentState: true,
        currentLocality: true,
        currentAdminUnit: true,
        currentNeighborhood: true,
        
        // Original Location
        originalCountry: true,
        originalState: true,
        originalLocality: true,
        originalAdminUnit: true,
        originalNeighborhood: true,
        
        // Education & Work
        educationLevel: true,
        institution: true,
        yearOfCompletion: true,
        major: true,
        studentYear: true,
        
        // Bachelor's information
        bachelorInstitution: true,
        bachelorMajor: true,
        bachelorCompletionYear: true,
        
        // Master's information
        masterInstitution: true,
        masterMajor: true,
        masterCompletionYear: true,
        
        // PhD information
        phdInstitution: true,
        phdMajor: true,
        phdCompletionYear: true,
        
        // Professor information
        professorInstitution: true,
        professorMajor: true,
        professorCompletionYear: true,
        
        // Current occupation
        currentOccupation: true,
        employmentSector: true,
        workplaceAddress: true,
        companyName: true,
        
        // Student Details
        studentInstitution: true,
        studentFaculty: true,
        
        // Activities
        partyMember: true,
        partyName: true,
        partyStartDate: true,
        partyEndDate: true,
        
        unionMember: true,
        unionName: true,
        unionStartDate: true,
        unionEndDate: true,
        
        ngoMember: true,
        ngoName: true,
        ngoActivity: true,
        
        clubMember: true,
        clubName: true,
        clubType: true,
        
        // Emergency Contacts
        emergencyName1: true,
        emergencyRelation1: true,
        emergencyPhone1: true,
        emergencyName2: true,
        emergencyRelation2: true,
        emergencyPhone2: true,
        
        // Other
        referralSource: true,
        acquaintanceName: true,
        donationAmount: true,
        donationDate: true,
        oathAcknowledged: true,
        
        // Files
        image: true,
        cv: true,
        portfolio: true,
        additionalFile: true,
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