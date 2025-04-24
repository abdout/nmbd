"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArticleSchema } from "./validation";
import { ArticleFormValues } from "./type";
import { createArticle, updateArticle } from "./action";
import ImageUploader from "@/components/upload/ImageUploader";
import { ImageData } from "./type";

interface ArticleFormProps {
  mode: "create" | "edit";
  defaultValues?: Partial<ArticleFormValues>;
  articleId?: string;
  onSuccess?: () => void;
}

export default function ArticleForm({
  mode,
  defaultValues = {},
  articleId,
  onSuccess,
}: ArticleFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(
    defaultValues.image || null
  );

  console.log("[ArticleForm] Initial uploadedImage:", uploadedImage);
  console.log("[ArticleForm] Initial defaultValues:", defaultValues);

  const form = useForm<ArticleFormValues>({
    resolver: zodResolver(ArticleSchema),
    defaultValues: defaultValues as ArticleFormValues,
  });

  // Helper to generate a slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  // Update slug when title changes
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    form.setValue("title", title);
    
    // Only auto-generate slug if it's empty or hasn't been manually edited
    if (!form.getValues("slug") || form.getValues("slug") === generateSlug(form.getValues("title"))) {
      form.setValue("slug", generateSlug(title));
    }
  };

  // Handle image upload completion
  const handleImageUpload = (imageData: ImageData) => {
    console.log("[ArticleForm] Image upload complete. Image data:", imageData);
    console.log("[ArticleForm] Setting image URL:", imageData.url);
    setUploadedImage(imageData.url);
    form.setValue("image", imageData.url);
    console.log("[ArticleForm] Form values after image upload:", form.getValues());
  };

  // Handle form submission
  const handleSubmit = async (values: ArticleFormValues) => {
    console.log("[ArticleForm] Form submission started with values:", values);
    console.log("[ArticleForm] Current uploaded image URL:", uploadedImage);

    try {
      setIsSubmitting(true);
      setError(null);
      
      if (!uploadedImage) {
        console.error("[ArticleForm] No image provided for article");
        setError("Please upload an image for the article");
        setIsSubmitting(false);
        return;
      }

      console.log("[ArticleForm] Submitting with image URL:", values.image);
      
      let result;
      if (mode === "create") {
        result = await createArticle(values);
      } else if (articleId) {
        result = await updateArticle(articleId, values);
      } else {
        throw new Error("Invalid form mode or missing article ID");
      }

      console.log("[ArticleForm] Server action result:", result);
      
      if (result.status === "error") {
        console.error("[ArticleForm] Error from server action:", result.message);
        setError(result.message || "An unknown error occurred");
        setIsSubmitting(false);
        return;
      }

      console.log("[ArticleForm] Submission successful");
      
      // Refresh articles and close dialog
      router.refresh();
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("[ArticleForm] Exception during form submission:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              {...form.register("title")}
              onChange={handleTitleChange}
              placeholder="Article title"
            />
            {form.formState.errors.title && (
              <p className="text-red-500 text-sm mt-1">
                {form.formState.errors.title.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              {...form.register("slug")}
              placeholder="article-slug"
            />
            {form.formState.errors.slug && (
              <p className="text-red-500 text-sm mt-1">
                {form.formState.errors.slug.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...form.register("description")}
              placeholder="Brief description of the article"
              rows={3}
            />
            {form.formState.errors.description && (
              <p className="text-red-500 text-sm mt-1">
                {form.formState.errors.description.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="author">Author</Label>
            <Input
              id="author"
              {...form.register("author")}
              placeholder="Author name"
            />
            {form.formState.errors.author && (
              <p className="text-red-500 text-sm mt-1">
                {form.formState.errors.author.message}
              </p>
            )}
          </div>

          <div>
            <Label>Featured Image</Label>
            <ImageUploader
              onUploadComplete={handleImageUpload}
              onError={(err) => setError(err)}
            />
            <input
              type="hidden"
              {...form.register("image")}
              value={uploadedImage || ""}
            />
            {uploadedImage && (
              <div className="mt-2">
                <img
                  src={uploadedImage}
                  alt="Article image preview"
                  className="w-full max-h-48 object-cover rounded-md"
                  onLoad={() => console.log("[ArticleForm] Preview image loaded successfully:", uploadedImage)}
                  onError={(e) => console.error("[ArticleForm] Preview image failed to load:", uploadedImage, e)}
                />
              </div>
            )}
            {form.formState.errors.image && (
              <p className="text-red-500 text-sm mt-1">
                {form.formState.errors.image.message}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="body">Article Body</Label>
            <Textarea
              id="body"
              {...form.register("body")}
              placeholder="Full article content"
              rows={20}
              className="h-[400px] resize-none"
            />
            {form.formState.errors.body && (
              <p className="text-red-500 text-sm mt-1">
                {form.formState.errors.body.message}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Processing..."
            : mode === "create"
            ? "Create Article"
            : "Update Article"}
        </Button>
      </div>
    </form>
  );
}
