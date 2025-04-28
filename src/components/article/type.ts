import { z } from "zod";
import { ArticleSchema } from "./validation";

// Base article type derived from Zod schema
export type ArticleFormValues = z.infer<typeof ArticleSchema>;

// Type for article with database fields
export interface Article {
  id: string;
  title: string;
  slug: string;
  description: string;
  image: string;
  body: string;
  author: string;
  createdAt: Date;
  updatedAt: Date;
}

// Context menu action types
export type ArticleAction = "edit" | "delete";

// Server action status
export type ActionState = {
  status: "idle" | "loading" | "success" | "error";
  message?: string;
  data?: Article;
};

// Image data returned from image upload
export interface ImageData {
  id: string;
  url: string;
  fileId: string;
  fileName: string;
  thumbnailUrl?: string;
  size?: number;
  width?: number;
  height?: number;
  format?: string;
}

// Type for Arabic month names
export type ArabicMonths = {
  [key: number]: string;
};
