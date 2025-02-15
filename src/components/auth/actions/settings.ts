"use server";

import * as z from "zod";
import crypto from "node:crypto";
import { AuthError } from "next-auth";
import { currentUser } from "@/lib/auth";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";
import { SettingsSchema } from "../schemas";
import { getUserByEmail, getUserById } from "../data/user";
import { db } from "@/lib/db";
import { auth, signIn, signOut } from "../../../auth";
import { revalidatePath } from "next/cache";

export const settings = async (
  values: z.infer<typeof SettingsSchema>
) => {
  const session = await auth();
  
  if (!session?.user) {
    return { error: "Unauthorized" }
  }

  const user = await currentUser();

  if (!user) {
    return { error: "Unauthorized" }
  }

  const dbUser = await getUserById(user.id);

  if (!dbUser) {
    return { error: "Unauthorized" }
  }

  if (user.isOAuth) {
    values.email = undefined;
    values.password = undefined;
    values.newPassword = undefined;
    values.isTwoFactorEnabled = undefined;
  }

  if (values.email && values.email !== user.email) {
    const existingUser = await getUserByEmail(values.email);

    if (existingUser && existingUser.id !== user.id) {
      return { error: "Email already in use!" }
    }

    const verificationToken = await generateVerificationToken(
      values.email
    );
    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token,
    );

    return { success: "Verification email sent!" };
  }

  if (values.password && values.newPassword && dbUser.password) {
    // Split the stored password to get salt and hash
    const [storedSalt, storedHash] = dbUser.password.split(":");
    
    // Hash the provided password with stored salt
    const hashResult = crypto.pbkdf2Sync(
      values.password,
      storedSalt,
      1000,
      64,
      "sha512"
    ).toString("hex");

    const passwordsMatch = hashResult === storedHash;

    if (!passwordsMatch) {
      return { error: "Incorrect password!" };
    }

    // Generate new salt and hash for new password
    const newSalt = crypto.randomBytes(16).toString("hex");
    const newHash = crypto.pbkdf2Sync(
      values.newPassword,
      newSalt,
      1000,
      64,
      "sha512"
    ).toString("hex");

    // Combine new salt and hash
    values.password = `${newSalt}:${newHash}`;
    values.newPassword = undefined;
  }

  const updatedUser = await db.user.update({
    where: { id: dbUser.id },
    data: {
      ...values,
    }
  });

  // Force a session update by signing out and back in
  try {
    await signOut({ redirect: false });
    await signIn("credentials", {
      email: updatedUser.email,
      password: values.password,
      redirect: false,
    });
    
    // Revalidate the path to update UI
    revalidatePath("/");
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Failed to update session" }
    }
    throw error;
  }

  return { success: "Settings Updated!" }
}