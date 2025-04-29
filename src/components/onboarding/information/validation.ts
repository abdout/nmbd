import { z } from "zod";

export const informationSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  fullname: z.string()
    .min(8, { message: "  اكتب الاسم كامل بالعربي" })
    .regex(/^[\u0600-\u06FF\s]+$/, { 
      message: "الاسم الكامل يجب أن يحتوي على حروف عربية وفراغات فقط" 
    }),
  // description: z.string().optional(),
  bio: z.string().optional(),
  birthMonth: z.union([z.string(), z.number()])
    .refine(val => !!val, { message: " حدد شهر الميلاد" })
    .transform(val => val.toString()),
  birthYear: z.union([z.string(), z.number()])
    .transform(val => val.toString()),
  birthCountry: z.string().min(1, { message: "حدد دولة الميلاد" }),
  birthState: z.string().min(1, { message: "حدد ولاية الميلاد" }),
  birthLocality: z.string().min(1, { message: "حدد محلية الميلاد" }),
  
  currentLocality: z.string().min(1, { message: "حدد المحلية الحالية" }),
  currentCountry: z.string().min(1, { message: "حدد الدولة الحالية" }),
  currentState: z.string().min(1, { message: "حدد الولاية الحالية" }),
  currentAdminUnit: z.string().optional(),
  currentNeighborhood: z.string().optional(),

  originalLocality: z.string().optional(),
  originalCountry: z.string().optional(),
});

export type InformationSchema = z.infer<typeof informationSchema>; 