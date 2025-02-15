import { getUserByEmail } from "@/components/auth/data/user";
import { LoginSchema } from "@/components/auth/schemas";
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";

export default {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      },
      async profile(profile, tokens) {
        console.log("[OAuth] Profile received:", {
          email: profile.email,
          sub: profile.sub,
          verified: profile.email_verified,
          timestamp: new Date().toISOString()
        });
        
        if (!profile.email_verified) {
          console.log("[Auth Config] Google email not verified:", profile.email);
          throw new Error("Email not verified");
        }
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          emailVerified: profile.email_verified
        };
      }
    }),
    Github({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    Credentials({
      async authorize(credentials) {
        console.log("[Auth Config] Credentials Attempt:", { 
          email: credentials?.email 
        });
        const validatedFields = LoginSchema.safeParse(credentials);
        if (validatedFields.success) {
          const { email, password } = validatedFields.data;
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