'use server';

import { db } from '@/lib/db';
import { currentUser } from '@/lib/auth';

export type UserReviewData = {
  // Personal info
  name?: string;
  fullname?: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  birthDate?: Date;
  birthCountry?: string;
  birthState?: string;
  birthLocality?: string;
  birthAdminUnit?: string;
  birthNeighborhood?: string;
  birthMonth?: number;
  birthYear?: number;
  description?: string;
  bio?: string;
  
  // Skills and Interests
  skills?: string[];
  interests?: string[];
  
  // Social Media
  twitter?: string;
  facebook?: string;
  linkedin?: string;
  telegram?: string;
  instagram?: string;
  tiktok?: string;
  
  // Current location
  currentCountry?: string;
  currentState?: string;
  currentLocality?: string;
  currentAdminUnit?: string;
  currentNeighborhood?: string;
  
  // Original location
  originalCountry?: string;
  originalState?: string;
  originalLocality?: string;
  originalAdminUnit?: string;
  originalNeighborhood?: string;
  
  // Personal details
  nationalityId?: string;
  maritalStatus?: string;
  gender?: string;
  religion?: string;
  
  // Education & Work
  educationLevel?: string;
  institution?: string;
  yearOfCompletion?: number;
  major?: string;
  studentYear?: number;
  
  // Education details
  bachelorInstitution?: string;
  bachelorMajor?: string;
  bachelorCompletionYear?: number;
  masterInstitution?: string;
  masterMajor?: string;
  masterCompletionYear?: number;
  phdInstitution?: string;
  phdMajor?: string;
  phdCompletionYear?: number;
  
  // Work information
  currentOccupation?: string;
  employmentSector?: string;
  workplaceAddress?: string;
  companyName?: string;
  
  // Student Details
  studentInstitution?: string;
  studentFaculty?: string;
  
  // Activities and memberships
  partyMember?: boolean;
  partyName?: string;
  partyStartDate?: Date;
  partyEndDate?: Date;
  unionMember?: boolean;
  unionName?: string;
  unionStartDate?: Date;
  unionEndDate?: Date;
  ngoMember?: boolean;
  ngoName?: string;
  ngoActivity?: string;
  clubMember?: boolean;
  clubName?: string;
  clubType?: string;
  
  // Emergency Contacts
  emergencyName1?: string;
  emergencyRelation1?: string;
  emergencyPhone1?: string;
  emergencyName2?: string;
  emergencyRelation2?: string;
  emergencyPhone2?: string;
  
  // Other
  referralSource?: string;
  acquaintanceName?: string;
  donationAmount?: number;
  donationDate?: Date;
  oathAcknowledged?: boolean;
  
  // Files and attachments
  image?: string;
  cv?: string;
  portfolio?: string;
  additionalFile?: string;
  
  // System fields
  id?: string;
  role?: string;
  onboardingStatus?: string;
  onboardingStep?: number;
  createdAt?: Date;
  updatedAt?: Date;
  applicationStatus?: string;
};

/**
 * Server action to fetch user data for lab review
 */
export async function fetchUserForLabReview(userId: string): Promise<{ error: string | null, data: UserReviewData | null }> {
  try {
    const currentUserData = await currentUser();
    if (!currentUserData?.id) {
      return { error: "Unauthorized", data: null };
    }
    
    // Verify if current user has permission to view this user's data
    const userRole = currentUserData.role;
    if (userRole !== "ADMIN" && userRole !== "MEMBERSHIP") {
      return { error: "You don't have permission to view this data", data: null };
    }
    
    // Fetch the user data
    const userData = await db.user.findUnique({
      where: {
        id: userId,
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
        applicationStatus: true,
        
        // Personal info
        contribute: true,
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
        
        // Location info
        currentCountry: true,
        currentState: true,
        currentLocality: true,
        currentAdminUnit: true,
        currentNeighborhood: true,
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
        
        // Additional education details
        bachelorInstitution: true,
        bachelorMajor: true,
        bachelorCompletionYear: true,
        masterInstitution: true,
        masterMajor: true,
        masterCompletionYear: true,
        phdInstitution: true,
        phdMajor: true,
        phdCompletionYear: true,
        
        // Work information
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
        cover: true,
        
        // Skills and Interests
        skills: true,
        interests: true,
      },
    });
    
    if (!userData) {
      return { error: "User not found", data: null };
    }
    
    // Convert null values to undefined to match the UserReviewData type
    const cleanedData: UserReviewData = Object.fromEntries(
      Object.entries(userData).map(([key, value]) => [key, value === null ? undefined : value])
    ) as UserReviewData;
    
    return { error: null, data: cleanedData };
  } catch (error) {
    console.error("Error fetching user data for lab review:", error);
    return { error: "Error fetching user data", data: null };
  }
}

/**
 * Server action to approve a user application
 */
export async function approveUserApplication(userId: string): Promise<{ success: boolean, error?: string }> {
  try {
    const currentUserData = await currentUser();
    if (!currentUserData?.id) {
      return { success: false, error: "Unauthorized" };
    }
    
    // Verify if current user has permission to approve applications
    const userRole = currentUserData.role;
    if (userRole !== "ADMIN" && userRole !== "MEMBERSHIP") {
      return { success: false, error: "You don't have permission to approve applications" };
    }
    
    // Update application status
    await db.user.update({
      where: { id: userId },
      data: { 
        applicationStatus: "APPROVED",
        // Additional membership fields could be updated here if needed
      }
    });
    
    // Additional logic like notifications could be added here
    
    return { success: true };
  } catch (error) {
    console.error("Error approving user application:", error);
    return { success: false, error: "Failed to approve application" };
  }
}

/**
 * Server action to reject a user application
 */
export async function rejectUserApplication(userId: string): Promise<{ success: boolean, error?: string }> {
  try {
    const currentUserData = await currentUser();
    if (!currentUserData?.id) {
      return { success: false, error: "Unauthorized" };
    }
    
    // Verify if current user has permission to reject applications
    const userRole = currentUserData.role;
    if (userRole !== "ADMIN" && userRole !== "MEMBERSHIP") {
      return { success: false, error: "You don't have permission to reject applications" };
    }
    
    // Update application status
    await db.user.update({
      where: { id: userId },
      data: { applicationStatus: "REJECTED" }
    });
    
    return { success: true };
  } catch (error) {
    console.error("Error rejecting user application:", error);
    return { success: false, error: "Failed to reject application" };
  }
}