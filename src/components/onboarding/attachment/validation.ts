import { z } from "zod";

export const attachmentSchema = z.object({
  id: z.string().optional(),
  image: z.string().nullable(),
  cv: z.string().nullable(),
  portfolio: z.string().nullable(),
  additionalFile: z.string().nullable(),
});

export type AttachmentSchema = z.infer<typeof attachmentSchema>; 