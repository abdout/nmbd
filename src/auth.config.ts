import { getUserByEmail } from "@/components/auth/data/user";
import { LoginSchema } from "@/components/auth/schemas";
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import Facebook from "next-auth/providers/facebook";

// Define a proper type for the user profile
interface UserProfile {
  id: string;
  name: string;
  email: string;
  image: string;
  emailVerified: Date;
  onboardingStatus: string;
  onboardingStep: number;
  role: string;
  isTwoFactorEnabled: boolean;
  oathAcknowledged: boolean;
  
  // Basic info
  fullname: string | null;
  description: string | null;
  bio: string | null;
  cv: string | null;
  portfolio: string | null;
  additionalFile: string | null;
  
  // Contact
  phone: string | null;
  whatsapp: string | null;
  twitter: string | null;
  facebook: string | null;
  linkedin: string | null;
  telegram: string | null;
  instagram: string | null;
  tiktok: string | null;
  
  // Birth details
  birthDate: Date | null;
  birthCountry: string | null;
  birthState: string | null;
  birthLocality: string | null;
  birthAdminUnit: string | null;
  birthNeighborhood: string | null;
  birthMonth: string | null;
  birthYear: string | null;
  
  // Current location
  currentCountry: string | null;
  currentState: string | null;
  currentLocality: string | null;
  currentAdminUnit: string | null;
  currentNeighborhood: string | null;
  
  // Original location
  originalCountry: string | null;
  originalState: string | null;
  originalLocality: string | null;
  originalAdminUnit: string | null;
  originalNeighborhood: string | null;
  
  // Personal details
  nationalityId: string | null;
  maritalStatus: string | null;
  gender: string | null;
  religion: string | null;
  
  // Education & work
  educationLevel: string | null;
  institution: string | null;
  yearOfCompletion: string | null;
  major: string | null;
  studentYear: string | null;
  
  // Bachelor's info
  bachelorInstitution: string | null;
  bachelorMajor: string | null;
  bachelorCompletionYear: string | null;
  
  // Master's info
  masterInstitution: string | null;
  masterMajor: string | null;
  masterCompletionYear: string | null;
  
  // PhD info
  phdInstitution: string | null;
  phdMajor: string | null;
  phdCompletionYear: string | null;
  
  // Professor info
  professorInstitution: string | null;
  professorMajor: string | null;
  professorCompletionYear: string | null;
  
  // Occupation
  currentOccupation: string | null;
  employmentSector: string | null;
  workplaceAddress: string | null;
  companyName: string | null;
  
  // Student details
  studentInstitution: string | null;
  studentFaculty: string | null;
  
  // Activities
  partyMember: boolean;
  unionMember: boolean;
  ngoMember: boolean;
  clubMember: boolean;
  partyName: string | null;
  partyStartDate: Date | null;
  partyEndDate: Date | null;
  unionName: string | null;
  unionStartDate: Date | null;
  unionEndDate: Date | null;
  ngoName: string | null;
  ngoActivity: string | null;
  clubName: string | null;
  clubType: string | null;
  
  // Skills and Interests
  skills: string[];
  interests: string[];
  
  // Emergency contacts
  emergencyName1: string | null;
  emergencyRelation1: string | null;
  emergencyPhone1: string | null;
  emergencyName2: string | null;
  emergencyRelation2: string | null;
  emergencyPhone2: string | null;
  
  // Other
  referralSource: string | null;
  acquaintanceName: string | null;
  donationAmount: string | null;
  donationDate: Date | null;
}

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
          
          // Skills and Interests
          skills: [],
          interests: [],
          
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
        } as UserProfile // Use proper type instead of any
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
          
          // Skills and Interests
          skills: [],
          interests: [],
          
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
        } as UserProfile // Use proper type instead of any
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