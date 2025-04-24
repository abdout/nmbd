import { z } from "zod";

// Validation schema for article form with all fields optional
export const ArticleSchema = z.object({
  title: z.string().optional(),
  slug: z.string().optional(),
  description: z.string().optional(),
  image: z.string().optional(),
  body: z.string().optional(),
  author: z.string().optional(),
});