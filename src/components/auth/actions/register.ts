"use server";

import * as z from "zod";
import crypto from "node:crypto";
import { db } from "@/lib/db";
import { sendVerificationEmail } from "@/lib/mail";
import { generateVerificationToken } from "@/lib/tokens";
import { RegisterSchema } from "../schemas";
import { getUserByEmail } from "../data/user";

export type RegisterResponse = {
  success?: string;
  error?: string;
};

export const register = async (
  values: z.infer<typeof RegisterSchema>
): Promise<RegisterResponse> => {
  try {
    const validatedFields = RegisterSchema.safeParse(values);
    if (!validatedFields.success) {
      console.error("[Auth] Registration validation failed:", validatedFields.error);
      return { error: "Invalid fields!" };
    }

    const { email, password, name } = validatedFields.data;
    
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      console.log("[Auth] Registration attempted with existing email:", email);
      return { error: "Email already in use!" };
    }

    const salt = crypto.randomBytes(16).toString("hex");
    const hashedPassword = crypto.pbkdf2Sync(
      password,
      salt,
      1000,
      64,
      "sha512"
    ).toString("hex");

    // Combine salt and hashed password
    const passwordWithSalt = `${salt}:${hashedPassword}`;

    const user = await db.user.create({
      data: {
        name,
        email,
        password: passwordWithSalt,  // Store combined salt and password
        role: "USER",
        isTwoFactorEnabled: false,
        emailVerified: null,
        onboardingStatus: "PENDING",
        onboardingStep: 1,
        
        // Initialize empty arrays for skills and interests
        skills: [],
        interests: [],
      },
    });

    console.log("[Auth] New user created:", { userId: user.id, email });

    const verificationToken = await generateVerificationToken(email);
    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token,
    );

    return { success: "Confirmation email sent!" };
  } catch (error) {
    console.error("[Auth] Registration error:", error);
    return { error: "Something went wrong!" };
  }
};