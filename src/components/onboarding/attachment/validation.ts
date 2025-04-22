import { z } from "zod";

export const attachmentSchema = z.object({
  id: z.string().optional(),
  image: z.string().optional(),
  cv: z.string().optional(),
  portfolio: z.string().optional(),
  additionalFile: z.string().optional(),
});

export type AttachmentSchema = z.infer<typeof attachmentSchema>; 