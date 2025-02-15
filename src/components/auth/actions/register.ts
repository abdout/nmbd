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
    // Validate input
    const validatedFields = RegisterSchema.safeParse(values);
    if (!validatedFields.success) {
      console.error("[Auth] Registration validation failed:", validatedFields.error);
      return { error: "Invalid fields!" };
    }

    const { email, password, name } = validatedFields.data;
    
    // Check existing user
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      console.log("[Auth] Registration attempted with existing email:", email);
      return { error: "Email already in use!" };
    }

    // Generate password hash
    const salt = crypto.randomBytes(16).toString("hex");
    const hashedPassword = crypto.pbkdf2Sync(
      password,
      salt,
      1000,
      64,
      "sha512"
    ).toString("hex");

    // Create user
    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        salt,
        role: "USER",
        isTwoFactorEnabled: false,
        emailVerified: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    console.log("[Auth] New user created:", { userId: user.id, email });

    // Generate and send verification token
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