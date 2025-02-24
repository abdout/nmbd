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
          // skills: [],
          // languageSkills: [],
          isTwoFactorEnabled: false,
          oathAcknowledged: false,
          phone: null,
          whatsapp: null,
          twitter: null,
          facebook: null,
          linkedin: null,
          telegram: null,
          instagram: null,
          tiktok: null,
          birthCountry: null,
          birthState: null,
          birthLocality: null,
          currentCountry: null,
          currentState: null,
          currentLocality: null,
          birthDate: null,
          nationalityId: null,
          maritalStatus: null,
          gender: null,
          religion: null,
          educationLevel: null,
          institution: null,
          yearOfCompletion: null,
          currentOccupation: null
        }
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
          // skills: [],
          // languageSkills: [],
          isTwoFactorEnabled: false,
          oathAcknowledged: false,
          phone: null,
          whatsapp: null,
          twitter: null,
          facebook: null,
          linkedin: null,
          telegram: null,
          instagram: null,
          tiktok: null,
          birthCountry: null,
          birthState: null,
          birthLocality: null,
          currentCountry: null,
          currentState: null,
          currentLocality: null,
          birthDate: null,
          nationalityId: null,
          maritalStatus: null,
          gender: null,
          religion: null,
          educationLevel: null,
          institution: null,
          yearOfCompletion: null,
          currentOccupation: null
        }
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