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
    setUploadedImage(imageData.url);
    form.setValue("image", imageData.url);
  };

  // Handle form submission
  const onSubmit = async (data: ArticleFormValues) => {
    setIsSubmitting(true);
    setError(null);

    try {
      let result;

      if (mode === "create") {
        result = await createArticle(data);
      } else if (mode === "edit" && articleId) {
        result = await updateArticle(articleId, data);
      } else {
        throw new Error("Invalid form mode or missing article ID");
      }

      if (result.status === "error") {
        setError(result.message || "An error occurred");
      } else {
        router.refresh();
        if (onSuccess) onSuccess();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 text-red-500 rounded-md">{error}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              {...form.register("title")}
              onChange={handleTitleChange}
              placeholder="Article Title"
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
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...form.register("description")}
              placeholder="Short description of the article"
              rows={3}
            />
            {form.formState.errors.description && (
              <p className="text-red-500 text-sm mt-1">
                {form.formState.errors.description.message}
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
