import { z } from "zod";

export const activitySchema = z.object({
  partyMember: z.boolean().default(false),
  partyName: z.string().nullable(),
  partyStartDate: z.string().nullable(),
  partyEndDate: z.string().nullable(),
  
  unionMember: z.boolean().default(false),
  unionName: z.string().nullable(),
  unionStartDate: z.string().nullable(),
  unionEndDate: z.string().nullable(),
  
  ngoMember: z.boolean().default(false),
  ngoName: z.string().nullable(),
  ngoActivity: z.string().nullable(),
  
  clubMember: z.boolean().default(false),
  clubName: z.string().nullable(),
  clubType: z.string().nullable(),
});

export type ActivitySchema = z.infer<typeof activitySchema>; 