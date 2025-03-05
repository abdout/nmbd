"use server";

import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { ActivitySchema } from "./validation";

export type ActionState = {
  success: boolean;
  error: boolean;
  message?: string;
};

// Process and submit the activity form data with fields that exist in the schema
export async function submitActivityForm(prevState: ActionState, formData: ActivitySchema): Promise<ActionState> {
  try {
    console.log("Starting activity form submission");
    
    // Test database connection first
    try {
      console.log("Testing database connection...");
      const count = await db.user.count();
      console.log("Database connection successful, user count:", count);
    } catch (dbConnError: any) {
      console.error("Database connection error:", dbConnError?.message);
      return { 
        success: false, 
        error: true, 
        message: "Database connection error: " + (dbConnError?.message || "Unknown error") 
      };
    }
    
    // Basic validation
    if (!formData) {
      console.error("Form data is missing");
      return { success: false, error: true, message: "Form data is missing" };
    }
    
    // Log the form data for debugging
    console.log("Processing form data:", JSON.stringify(formData, null, 2));
    
    // Get current user (required for any update)
    const user = await currentUser();
    
    if (!user?.id) {
      console.error("User not authenticated");
      return { success: false, error: true, message: "User not authenticated" };
    }
    
    console.log("User found:", user.id);
    
    try {
      // First, test with a single field update to check for schema compatibility
      try {
        console.log("Testing schema compatibility with minimal update...");
        await db.user.update({
          where: { id: user.id },
          data: { 
            skills: Array.isArray(formData.skills) ? formData.skills : [] 
          },
          select: { id: true }
        });
        console.log("Minimal update test successful");
      } catch (schemaError: any) {
        console.error("Schema compatibility test failed:", schemaError?.message);
        return { 
          success: false, 
          error: true, 
          message: "Database schema mismatch: " + (schemaError?.message || "Unknown schema error") 
        };
      }

      // Only include fields that exist in the database schema
      // From the schema: partyMember, partyName, partyStartDate, partyEndDate
      // unionMember, unionName, unionStartDate, unionEndDate
      // ngoMember, ngoName, ngoActivity
      // clubMember, clubName, clubType
      // skills, interests
      const userData: {
        partyMember: boolean;
        partyName: string | null;
        partyStartDate: Date | null;
        partyEndDate: Date | null;
        unionMember: boolean;
        unionName: string | null;
        unionStartDate: Date | null;
        unionEndDate: Date | null;
        ngoMember: boolean;
        ngoName: string | null;
        ngoActivity: string | null;
        clubMember: boolean;
        clubName: string | null;
        clubType: string | null;
        skills: string[];
        interests: string[];
        onboardingStep: number;
        description?: string; // Make description optional
      } = {
        // Party information
        partyMember: Boolean(formData.partyMember),
        partyName: formData.partyName || null,
        partyStartDate: formData.partyStartDate ? new Date(formData.partyStartDate) : null,
        partyEndDate: formData.partyEndDate ? new Date(formData.partyEndDate) : null,
        
        // Union information
        unionMember: Boolean(formData.unionMember),
        unionName: formData.unionName || null,
        unionStartDate: formData.unionStartDate ? new Date(formData.unionStartDate) : null,
        unionEndDate: formData.unionEndDate ? new Date(formData.unionEndDate) : null,
        
        // NGO information
        ngoMember: Boolean(formData.ngoMember),
        ngoName: formData.ngoName || null,
        ngoActivity: formData.ngoActivity || null,
        
        // Club information
        clubMember: Boolean(formData.clubMember),
        clubName: formData.clubName || null,
        clubType: formData.clubType || null,
        
        // Skills and interests
        skills: Array.isArray(formData.skills) ? formData.skills : [],
        interests: Array.isArray(formData.interests) ? formData.interests : [],
        
        // Update onboarding step
        onboardingStep: 3
      };
      
      // Store voluntaryMember data in description since it's not in schema
      if (formData.voluntaryMember) {
        userData.description = `Voluntary member: ${formData.voluntaryName || 'Yes'}, Role: ${formData.voluntaryRole || 'N/A'}, Dates: ${formData.voluntaryStartDate || 'N/A'} to ${formData.voluntaryEndDate || 'N/A'}`;
      }
      
      console.log("Updating user with schema-compatible data");
      
      // Perform the database update with only valid fields
      const result = await db.user.update({
        where: { id: user.id },
        data: userData,
        select: { id: true }
      });
      
      console.log("Update successful:", result.id);
      revalidatePath("/onboarding");
      return { success: true, error: false };
    } catch (dbError: any) {
      // Detailed error logging
      console.error("Database error:", dbError?.message || "Unknown database error");
      if (dbError?.code) console.error("Error code:", dbError.code);
      if (dbError?.meta) console.error("Error metadata:", dbError.meta);
      
      // Try to identify the problematic field from the error message
      let errorMessage = dbError?.message || "Database error occurred";
      
      // Check for "Unknown argument" error pattern
      const unknownArgMatch = errorMessage.match(/Unknown argument `([^`]+)`/);
      if (unknownArgMatch && unknownArgMatch[1]) {
        const fieldName = unknownArgMatch[1];
        console.error(`Field not in schema: ${fieldName}`);
        errorMessage = `Field "${fieldName}" is not in the database schema`;
      }
      
      return { 
        success: false, 
        error: true, 
        message: errorMessage
      };
    }
  } catch (error: any) {
    console.error("Unexpected error:", error?.message || "Unknown error");
    return { 
      success: false, 
      error: true, 
      message: error?.message || "Unexpected error occurred" 
    };
  }
} 