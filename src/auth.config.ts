import { getUserByEmail } from "@/components/auth/data/user";
import { LoginSchema } from "@/components/auth/schemas";
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import Facebook from "next-auth/providers/facebook";

export default {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          emailVerified: new Date(),
          // Initialize with default values
          onboardingStatus: "PENDING",
          onboardingStep: 1,
          role: "USER",
          isTwoFactorEnabled: false,
          oathAcknowledged: false,
          
          // Basic info
          fullname: null,
          description: null,
          bio: null,
          cv: null,
          portfolio: null,
          additionalFile: null,
          
          // Contact
          phone: null,
          whatsapp: null,
          twitter: null,
          facebook: null,
          linkedin: null,
          telegram: null,
          instagram: null,
          tiktok: null,
          
          // Birth details
          birthDate: null,
          birthCountry: null,
          birthState: null,
          birthLocality: null,
          birthAdminUnit: null,
          birthNeighborhood: null,
          birthMonth: null,
          birthYear: null,
          
          // Current location
          currentCountry: null,
          currentState: null,
          currentLocality: null,
          currentAdminUnit: null,
          currentNeighborhood: null,
          
          // Original location
          originalCountry: null,
          originalState: null,
          originalLocality: null,
          originalAdminUnit: null,
          originalNeighborhood: null,
          
          // Personal details
          nationalityId: null,
          maritalStatus: null,
          gender: null,
          religion: null,
          
          // Education & work
          educationLevel: null,
          institution: null,
          yearOfCompletion: null,
          major: null,
          studentYear: null,
          
          // Bachelor's info
          bachelorInstitution: null,
          bachelorMajor: null,
          bachelorCompletionYear: null,
          
          // Master's info
          masterInstitution: null,
          masterMajor: null,
          masterCompletionYear: null,
          
          // PhD info
          phdInstitution: null,
          phdMajor: null,
          phdCompletionYear: null,
          
          // Professor info
          professorInstitution: null,
          professorMajor: null,
          professorCompletionYear: null,
          
          // Occupation
          currentOccupation: null,
          employmentSector: null,
          workplaceAddress: null,
          companyName: null,
          
          // Student details
          studentInstitution: null,
          studentFaculty: null,
          
          // Activities
          partyMember: false,
          unionMember: false,
          ngoMember: false,
          clubMember: false,
          partyName: null,
          partyStartDate: null,
          partyEndDate: null,
          unionName: null,
          unionStartDate: null,
          unionEndDate: null,
          ngoName: null,
          ngoActivity: null,
          clubName: null,
          clubType: null,
          
          // Emergency contacts
          emergencyName1: null,
          emergencyRelation1: null,
          emergencyPhone1: null,
          emergencyName2: null,
          emergencyRelation2: null,
          emergencyPhone2: null,
          
          // Other
          referralSource: null,
          acquaintanceName: null,
          donationAmount: null,
          donationDate: null
        } as any // Type assertion to bypass TypeScript checks
      }
    }),
    Facebook({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      profile(profile) {
        return {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          image: profile.picture?.data?.url,
          emailVerified: new Date(),
          // Initialize with default values
          onboardingStatus: "PENDING",
          onboardingStep: 1,
          role: "USER",
          isTwoFactorEnabled: false,
          oathAcknowledged: false,
          
          // Basic info
          fullname: null,
          description: null,
          bio: null,
          cv: null,
          portfolio: null,
          additionalFile: null,
          
          // Contact
          phone: null,
          whatsapp: null,
          twitter: null,
          facebook: null,
          linkedin: null,
          telegram: null,
          instagram: null,
          tiktok: null,
          
          // Birth details
          birthDate: null,
          birthCountry: null,
          birthState: null,
          birthLocality: null,
          birthAdminUnit: null,
          birthNeighborhood: null,
          birthMonth: null,
          birthYear: null,
          
          // Current location
          currentCountry: null,
          currentState: null,
          currentLocality: null,
          currentAdminUnit: null,
          currentNeighborhood: null,
          
          // Original location
          originalCountry: null,
          originalState: null,
          originalLocality: null,
          originalAdminUnit: null,
          originalNeighborhood: null,
          
          // Personal details
          nationalityId: null,
          maritalStatus: null,
          gender: null,
          religion: null,
          
          // Education & work
          educationLevel: null,
          institution: null,
          yearOfCompletion: null,
          major: null,
          studentYear: null,
          
          // Bachelor's info
          bachelorInstitution: null,
          bachelorMajor: null,
          bachelorCompletionYear: null,
          
          // Master's info
          masterInstitution: null,
          masterMajor: null,
          masterCompletionYear: null,
          
          // PhD info
          phdInstitution: null,
          phdMajor: null,
          phdCompletionYear: null,
          
          // Professor info
          professorInstitution: null,
          professorMajor: null,
          professorCompletionYear: null,
          
          // Occupation
          currentOccupation: null,
          employmentSector: null,
          workplaceAddress: null,
          companyName: null,
          
          // Student details
          studentInstitution: null,
          studentFaculty: null,
          
          // Activities
          partyMember: false,
          unionMember: false,
          ngoMember: false,
          clubMember: false,
          partyName: null,
          partyStartDate: null,
          partyEndDate: null,
          unionName: null,
          unionStartDate: null,
          unionEndDate: null,
          ngoName: null,
          ngoActivity: null,
          clubName: null,
          clubType: null,
          
          // Emergency contacts
          emergencyName1: null,
          emergencyRelation1: null,
          emergencyPhone1: null,
          emergencyName2: null,
          emergencyRelation2: null,
          emergencyPhone2: null,
          
          // Other
          referralSource: null,
          acquaintanceName: null,
          donationAmount: null,
          donationDate: null
        } as any // Type assertion to bypass TypeScript checks
      }
    }),
    Credentials({
      async authorize(credentials) {
        console.log("[Auth Config] Credentials Attempt:", { 
          email: credentials?.email 
        });
        const validatedFields = LoginSchema.safeParse(credentials);
        if (validatedFields.success) {
          const { email } = validatedFields.data;
          const user = await getUserByEmail(email);
          if (!user || !user.password) {
            console.log("[Auth Config] User not found or no password:", {
              email: credentials?.email
            });
            return null;
          }
          return user;
        }
        console.log("[Auth Config] Invalid credentials:", {
          email: credentials?.email
        });
        return null;
      }
    })
  ],
} satisfies NextAuthConfig;