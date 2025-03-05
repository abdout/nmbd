import NextAuth from "next-auth"
import { UserRole, User } from "@prisma/client"
import { PrismaAdapter } from "@auth/prisma-adapter"
import type { DefaultSession } from "next-auth"
import { db } from "@/lib/db"
import { getUserById } from "@/components/auth/data/user"
import { getTwoFactorConfirmationByUserId } from "@/components/auth/data/two-factor-confirmation"
import { getAccountByUserId } from "@/components/auth/data/account"
import authConfig from "./auth.config"

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string
      role: UserRole
      isTwoFactorEnabled: boolean
      isOAuth: boolean
    } & DefaultSession["user"]
  }
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  debug: process.env.NODE_ENV === "development",
  pages: {
    signIn: "/login",
    error: "/error",
  },
  events: {
    async linkAccount({ user }) {
      console.log("[Auth] Link Account Event:", {
        userId: user.id,
        timestamp: new Date().toISOString()
      });
      
      if (user.id) {
        await db.user.update({
          where: { id: user.id },
          data: { 
            emailVerified: new Date(),
            updatedAt: new Date()
          }
        });
        console.log("[Auth] User updated after link:", user.id);
      }
    },
    async signIn(message) {
      console.log("[Auth] Sign In Event:", {
        user: message.user.email,
        provider: message.account?.provider,
        timestamp: new Date().toISOString()
      });
    },
    async session(message) {
      console.log("[Auth] Session Event:", {
        userId: message.session.user?.id,
        expires: message.session.expires,
        timestamp: new Date().toISOString()
      });
    }
  },
  callbacks: {
    async signIn({ user, account }) {
      console.log("[Auth] Sign In Callback:", {
        userId: user.id,
        email: user.email,
        provider: account?.provider,
        timestamp: new Date().toISOString()
      });

      if (!user.id) {
        console.log("[Auth] Sign in failed - No user ID");
        return false;
      }
      
      // Always allow OAuth providers
      if (account?.provider !== "credentials") {
        console.log("[Auth] OAuth login - Approved");
        return true;
      }

      const existingUser = await getUserById(user.id);
      console.log("[Auth] Existing user check:", {
        found: !!existingUser,
        emailVerified: existingUser?.emailVerified
      });

      if (!existingUser?.emailVerified) return false;

      if (existingUser.isTwoFactorEnabled) {
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);
        if (!twoFactorConfirmation) return false;
        await db.twoFactorConfirmation.delete({
          where: { id: twoFactorConfirmation.id }
        });
      }

      // Initialize all user fields
      await db.user.update({
        where: { id: user.id },
        data: {
          emailVerified: new Date(),
          onboardingStatus: "PENDING",
          onboardingStep: 1,
          
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
          partyName: null,
          partyStartDate: null,
          partyEndDate: null,
          
          unionMember: false,
          unionName: null,
          unionStartDate: null,
          unionEndDate: null,
          
          ngoMember: false,
          ngoName: null,
          ngoActivity: null,
          
          clubMember: false,
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
          donationDate: null,
          oathAcknowledged: false
        } as Partial<Omit<User, "id" | "createdAt" | "updatedAt">>
      });
      return true;
    },
    async session({ token, session }) {
      console.log("[Auth] Session Callback:", {
        tokenId: token.sub,
        sessionUser: session.user?.email,
        timestamp: new Date().toISOString()
      });

      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role as UserRole;
      }

      if (session.user) {
        session.user.isTwoFactorEnabled = !!token.isTwoFactorEnabled;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.isOAuth = !!token.isOAuth;
      }

      console.log("[Auth] Updated session:", {
        userId: session.user?.id,
        isOAuth: session.user?.isOAuth
      });

      return session;
    },
    async jwt({ token, user, account }) {
      console.log("[Auth] JWT Callback:", {
        tokenSub: token.sub,
        userId: user?.id,
        provider: account?.provider,
        timestamp: new Date().toISOString()
      });

      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);
      if (!existingUser) {
        console.log("[Auth] JWT - User not found:", token.sub);
        return token;
      }

      const existingAccount = await getAccountByUserId(existingUser.id);
      
      token.isOAuth = !!existingAccount;
      token.name = existingUser.name;
      token.email = existingUser.email;
      token.role = existingUser.role;
      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;

      console.log("[Auth] JWT token updated:", {
        isOAuth: token.isOAuth,
        role: token.role
      });

      return token;
    }
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
})