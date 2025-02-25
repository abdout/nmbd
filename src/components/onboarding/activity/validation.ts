import { z } from "zod";

export const activitySchema = z.object({
  partyMember: z.boolean().default(false),
  partyName: z.string().optional(),
  partyStartDate: z.string().optional(),
  partyEndDate: z.string().optional(),
  
  unionMember: z.boolean().default(false),
  unionName: z.string().optional(),
  unionStartDate: z.string().optional(),
  unionEndDate: z.string().optional(),
  
  ngoMember: z.boolean().default(false),
  ngoName: z.string().optional(),
  ngoActivity: z.string().optional(),
  
  clubMember: z.boolean().default(false),
  clubName: z.string().optional(),
  clubType: z.string().optional(),
});

export type ActivitySchema = z.infer<typeof activitySchema>; 