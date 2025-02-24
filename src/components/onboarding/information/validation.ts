import { z } from "zod";

export const informationSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1).nullable().or(z.string()),
  fullname: z.string().min(1).nullable().or(z.string()),
  description: z.string().nullable().or(z.string()),
  bio: z.string().nullable().or(z.string()),
  birthMonth: z.string().nullable().or(z.string()),
  birthYear: z.string().nullable().or(z.string()),
  birthCountry: z.string().nullable().or(z.string()),
  birthState: z.string().nullable().or(z.string()),
  birthLocality: z.string().nullable().or(z.string()),
  
  currentLocality: z.string().nullable().or(z.string()),
  currentCountry: z.string().nullable().or(z.string()),
  currentState: z.string().nullable().or(z.string()),
  currentAdminUnit: z.string().nullable().or(z.string()),
  currentNeighborhood: z.string().nullable().or(z.string()),

  originalLocality: z.string().nullable().or(z.string()),
  originalCountry: z.string().nullable().or(z.string()),
  educationLevel: z.string().nullable().or(z.string()),
  institution: z.string().nullable().or(z.string()),
  yearOfCompletion: z.number().nullable().or(z.number()),
  currentOccupation: z.string().nullable().or(z.string()),
  employmentSector: z.string().nullable().or(z.string()),
  workplaceAddress: z.string().nullable().or(z.string()),

  studentInstitution: z.string().optional(),
  studentFaculty: z.string().optional(),
  studentProgram: z.string().optional(),
  studentYear: z.number().optional(),

  maritalStatus: z.string().nullable().or(z.string()),
  gender: z.string().nullable().or(z.string()),
  religion: z.string().nullable().or(z.string()),
  
  nationalityId: z.string().nullable().or(z.string()),
});

export type InformationSchema = z.infer<typeof informationSchema>; 