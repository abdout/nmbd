import * as z from "zod";
import { UserRole } from "@prisma/client";

export const SettingsSchema = z.object({
  name: z.optional(z.string()),
  isTwoFactorEnabled: z.optional(z.boolean()),
  role: z.enum([UserRole.ADMIN, UserRole.USER]),
  email: z.optional(z.string().email()),
  password: z.optional(z.string().min(6)),
  newPassword: z.optional(z.string().min(6)),
})
  .refine((data) => {
    if (data.password && !data.newPassword) {
      return false;
    }

    return true;
  }, {
    message: "كلمة المرور الجديدة مطلوبة!",
    path: ["newPassword"]
  })
  .refine((data) => {
    if (data.newPassword && !data.password) {
      return false;
    }

    return true;
  }, {
    message: "كلمة المرور مطلوبة!",
    path: ["password"]
  })

export const NewPasswordSchema = z.object({
  password: z.string().min(6, {
    message: "يجب أن تتكون كلمة المرور من 6 أحرف على الأقل",
  }),
});

export const ResetSchema = z.object({
  email: z.string().email({
    message: "البريد الإلكتروني مطلوب",
  }),
});

export const LoginSchema = z.object({
  email: z.string().email({
    message: "البريد الإلكتروني مطلوب",
  }),
  password: z.string().min(1, {
    message: "كلمة المرور مطلوبة",
  }),
  code: z.optional(z.string()),
});

export const RegisterSchema = z.object({
  email: z.string().email({
    message: "البريد الإلكتروني مطلوب",
  }),
  password: z.string().min(6, {
    message: "يجب أن تتكون كلمة المرور من 6 أحرف على الأقل",
  }),
  name: z.string().min(1, {
    message: "الاسم مطلوب",
  }),
});
