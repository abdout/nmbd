"use server";

import * as z from "zod";
import crypto from "node:crypto";
import { db } from "@/lib/db";
import { sendVerificationEmail } from "@/lib/mail";
import { generateVerificationToken } from "@/lib/tokens";
import { RegisterSchema } from "../schemas";
import { getUserByEmail } from "../data/user";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password, name } = validatedFields.data;
  
  const existingUser = await getUserByEmail(email);

  if (existingUser) {
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

  await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      salt: salt,
    },
  });

  const verificationToken = await generateVerificationToken(email);
  await sendVerificationEmail(
    verificationToken.email,
    verificationToken.token,
  );

  return { success: "Confirmation email sent!" };
};