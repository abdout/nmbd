import { z } from "zod";

export const informationSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  fullname: z.string().optional(),
  description: z.string().optional(),
  bio: z.string().optional(),
  birthMonth: z.string().optional(),
  birthYear: z.string().optional(),
  birthCountry: z.string().optional(),
  birthState: z.string().optional(),
  birthLocality: z.string().optional(),
  
  currentLocality: z.string().optional(),
  currentCountry: z.string().optional(),
  currentState: z.string().optional(),
  currentAdminUnit: z.string().optional(),
  currentNeighborhood: z.string().optional(),

  originalLocality: z.string().optional(),
  originalCountry: z.string().optional(),
  educationLevel: z.string().optional(),
  institution: z.string().optional(),
  yearOfCompletion: z.string().optional(),
  currentOccupation: z.string().optional(),
  employmentSector: z.string().optional(),
  workplaceAddress: z.string().optional(),

  studentInstitution: z.string().optional(),
  studentFaculty: z.string().optional(),
  studentProgram: z.string().optional(),
  studentYear: z.number().optional(),

  maritalStatus: z.string().optional(),
  gender: z.string().optional(),
  religion: z.string().optional(),
  
  nationalityId: z.string().optional(),
});

export type InformationSchema = z.infer<typeof informationSchema>; 