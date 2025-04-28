"use server";

import { db } from "@/lib/db";
import { ArticleSchema } from "./validation";
import { ArticleFormValues, ActionState } from "./type";
import { revalidatePath } from "next/cache";

/**
 * Create a new article
 */
export async function createArticle(
  data: ArticleFormValues
): Promise<ActionState> {
  console.log("[createArticle] Starting article creation with data:", {
    title: data.title,
    slug: data.slug,
    image: data.image,
    hasImage: !!data.image
  });
  
  try {
    // Validate the data
    const validatedData = ArticleSchema.parse(data);
    console.log("[createArticle] Data validation successful");
    
    // Check if article with same slug already exists
    const existingArticle = await db.article.findUnique({
      where: { slug: validatedData.slug },
    });

    if (existingArticle) {
      console.error("[createArticle] Slug already exists:", validatedData.slug);
      return {
        status: "error",
        message: "An article with this slug already exists",
      };
    }

    // Verify image URL is valid
    if (!validatedData.image) {
      console.error("[createArticle] No image provided");
      return {
        status: "error",
        message: "An image is required for the article",
      };
    }

    console.log("[createArticle] Image URL check:", {
      imageUrl: validatedData.image,
      isValid: Boolean(validatedData.image && validatedData.image.trim() !== "")
    });
    
    // Create the article
    console.log("[createArticle] Creating article in database");
    const article = await db.article.create({
      data: {
        ...validatedData,
        slug: validatedData.slug || validatedData.title.toLowerCase().replace(/\s+/g, '-'),
      },
    });
    
    console.log("[createArticle] Article created successfully:", {
      id: article.id,
      slug: article.slug,
      image: article.image
    });

    // Revalidate the articles page
    revalidatePath("/article");

    return {
      status: "success",
      message: "Article created successfully",
      data: article
    };
  } catch (error) {
    console.error("[createArticle] Failed to create article:", error);
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Failed to create article",
    };
  }
}

/**
 * Get an article by ID
 */
export async function getArticleById(id: string) {
  try {
    return await db.article.findUnique({
      where: { id },
    });
  } catch (error) {
    console.error("Failed to get article by ID:", error);
    return null;
  }
}

/**
 * Get an article by slug
 */
export async function getArticleBySlug(slug: string) {
  try {
    return await db.article.findUnique({
      where: { slug },
    });
  } catch (error) {
    console.error("Failed to get article:", error);
    return null;
  }
}

/**
 * Get all articles
 */
export async function getAllArticles() {
  try {
    return await db.article.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Failed to get articles:", error);
    return [];
  }
}

/**
 * Update an existing article
 */
export async function updateArticle(
  id: string, 
  data: ArticleFormValues
): Promise<ActionState> {
  try {
    // Validate the data
    const validatedData = ArticleSchema.parse(data);
    
    // Check if updated slug already exists on a different article
    if (validatedData.slug) {
      const existingArticle = await db.article.findUnique({
        where: { slug: validatedData.slug },
      });

      if (existingArticle && existingArticle.id !== id) {
        return {
          status: "error",
          message: "An article with this slug already exists",
        };
      }
    }

    // Update the article
    const updatedArticle = await db.article.update({
      where: { id },
      data: validatedData,
    });

    // Revalidate the articles page and the specific article page
    revalidatePath("/article");
    revalidatePath(`/article/${data.slug}`);

    return {
      status: "success",
      message: "Article updated successfully",
      data: updatedArticle
    };
  } catch (error) {
    console.error("Failed to update article:", error);
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Failed to update article",
    };
  }
}

/**
 * Delete an article
 */
export async function deleteArticle(id: string): Promise<ActionState> {
  try {
    // Get the article to know its slug for path revalidation
    const article = await db.article.findUnique({
      where: { id },
    });

    if (!article) {
      return {
        status: "error",
        message: "Article not found",
      };
    }

    // Delete the article
    await db.article.delete({
      where: { id },
    });

    // Revalidate the articles page and the specific article page
    revalidatePath("/article");
    revalidatePath(`/article/${article.slug}`);

    return {
      status: "success",
      message: "Article deleted successfully",
    };
  } catch (error) {
    console.error("Failed to delete article:", error);
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Failed to delete article",
    };
  }
}
