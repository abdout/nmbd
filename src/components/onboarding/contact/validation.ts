import { z } from "zod";

export const contactSchema = z.object({
  id: z.string().optional(),
  phone: z.string().nullable().or(z.string().min(10, "رقم الهاتف يجب أن يكون 10 أرقام على الأقل")),
  whatsapp: z.string().nullable(),
  twitter: z.string().nullable(),
  facebook: z.string().nullable(),
  linkedin: z.string().nullable(),
  telegram: z.string().nullable(),
  instagram: z.string().nullable(),
  tiktok: z.string().nullable()
});

export type ContactSchema = z.infer<typeof contactSchema>;