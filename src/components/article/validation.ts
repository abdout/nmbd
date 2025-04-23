import { z } from "zod";

// Validation schema for article form
export const ArticleSchema = z.object({
  title: z.string().min(5, {
    message: "Title must be at least 5 characters long",
  }),
  slug: z.string().min(3, {
    message: "Slug must be at least 3 characters long",
  }).regex(/^[a-z0-9-]+$/, {
    message: "Slug can only contain lowercase letters, numbers, and hyphens",
  }),
  description: z.string().min(20, {
    message: "Description must be at least 20 characters long",
  }),
  image: z.string({
    required_error: "Article image is required",
  }),
  body: z.string().min(50, {
    message: "Article body must be at least 50 characters long",
  }),
  author: z.string({
    required_error: "Author is required",
  }),
}); 