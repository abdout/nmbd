import { z } from "zod";

// Validation schema for article form with slug being optional
export const ArticleSchema = z.object({
  title: z.string().min(5, {
    message: "Title must be at least 5 characters long"
  }),
  slug: z.string().optional(),
  description: z.string().min(20, {
    message: "Description must be at least 20 characters long"
  }),
  image: z.string({
    required_error: "Article image is required"
  }),
  body: z.string().min(50, {
    message: "Article body must be at least 50 characters long"
  }),
  author: z.string({
    required_error: "Author is required"
  }),
});