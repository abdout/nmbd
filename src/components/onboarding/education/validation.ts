import { z } from "zod";

export const educationSchema = z.object({
  id: z.string().optional(),
  
  // Education fields
  educationLevel: z.string().optional(),
  
  // Student fields
  studentInstitution: z.string().optional(),
  studentFaculty: z.string().optional(),
  studentProgram: z.string().optional(),
  studentYear: z.string().optional(),
  studentGraduationYear: z.string().optional(),
  
  // Diploma fields
  diplomaInstitution: z.string().optional(),
  diplomaMajor: z.string().optional(),
  diplomaCompletionYear: z.string().optional(),
  
  // Bachelor's fields
  bachelorInstitution: z.string().optional(),
  bachelorMajor: z.string().optional(),
  bachelorCompletionYear: z.string().optional(),
  
  // Master's fields
  masterInstitution: z.string().optional(),
  masterMajor: z.string().optional(),
  masterCompletionYear: z.string().optional(),
  
  // PhD fields
  phdInstitution: z.string().optional(),
  phdMajor: z.string().optional(),
  phdCompletionYear: z.string().optional(),
  
  // Professor fields
  professorInstitution: z.string().optional(),
  professorMajor: z.string().optional(),
  professorCompletionYear: z.string().optional(),
  academicRank: z.string().optional(),
  
  // Occupation fields
  employmentSector: z.string().optional(),
  companyName: z.string().optional(),
  workplaceAddress: z.string().optional(),
});

export type EducationSchema = z.infer<typeof educationSchema>; 