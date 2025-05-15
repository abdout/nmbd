"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArticleSchema } from "./validation";
import { ArticleFormValues } from "./type";
import { createArticle, updateArticle } from "./action";
import ImageUploader from "@/components/upload/ImageUploader";
import { ImageData } from "./type";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger 
} from "@/components/ui/popover";
import { 
  Command,
  CommandGroup,
  CommandItem,
  CommandList 
} from "@/components/ui/command";
import { CheckIcon, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface ArticleFormProps {
  mode: "create" | "edit";
  defaultValues?: Partial<ArticleFormValues>;
  articleId?: string;
  onSuccess?: () => void;
}

// Sample authors array - you might want to fetch this from an API
const authors = [
  "المقداد الهجان",
  "هشام احمد",
  "ابو بكر جيكوني",
  "قاسم الظافر",
  "الفاضل فرح",
  "يوسف مورو",
  
];

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
  const [authorOpen, setAuthorOpen] = useState(false);
  const [textareaHeight, setTextareaHeight] = useState("150px");

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

  // Update slug internally when title changes, but don't show it in the form
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    form.setValue("title", title);
    form.setValue("slug", generateSlug(title));
  };

  // Handle textarea auto-expansion
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    form.setValue("body", e.target.value);
    
    // Auto-adjust height based on content
    e.target.style.height = "150px"; // Reset height
    const newHeight = Math.max(150, e.target.scrollHeight);
    e.target.style.height = `${newHeight}px`;
    setTextareaHeight(`${newHeight}px`);
  };

  // Handle image upload completion
  const handleImageUpload = (imageData: ImageData) => {
    console.log("[ArticleForm] Image upload complete. Image data:", imageData);
    console.log("[ArticleForm] Setting image URL:", imageData.url);
    setUploadedImage(imageData.url);
    form.setValue("image", imageData.url);
    console.log("[ArticleForm] Form values after image upload:", form.getValues());
  };

  // Handle author selection
  const handleAuthorSelect = (author: string) => {
    form.setValue("author", author);
    setAuthorOpen(false);
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
        setError("الرجاء تحميل صورة للمقال");
        setIsSubmitting(false);
        return;
      }

      // Auto-generate slug if not provided
      if (!values.slug) {
        values.slug = generateSlug(values.title || "article");
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
        setError(result.message || "حدث خطأ غير معروف");
        setIsSubmitting(false);
        return;
      }

      console.log("[ArticleForm] Submission successful");
      
      // Refresh articles and close dialog
      router.refresh();
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("[ArticleForm] Exception during form submission:", err);
      setError(err instanceof Error ? err.message : "حدث خطأ غير معروف");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form 
      onSubmit={form.handleSubmit(handleSubmit)} 
      className="space-y-8 text-right"
      dir="rtl"
      style={{ direction: "rtl" }}
    >
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      <div className="flex flex-col space-y-6">
        <div>
          <Input
            id="title"
            {...form.register("title")}
            onChange={handleTitleChange}
            placeholder="عنوان المقال"
            dir="rtl"
            className="text-right"
          />
          {form.formState.errors.title && (
            <p className="text-red-500 text-sm mt-1 text-right">
              {form.formState.errors.title.message}
            </p>
          )}
        </div>

        <div>
          <Textarea
            id="description"
            {...form.register("description")}
            placeholder="وصف موجز للمقال"
            rows={3}
            dir="rtl"
            className="text-right resize-none"
          />
          {form.formState.errors.description && (
            <p className="text-red-500 text-sm mt-1 text-right">
              {form.formState.errors.description.message}
            </p>
          )}
        </div>

        <div>
          <Popover open={authorOpen} onOpenChange={setAuthorOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={authorOpen}
                className="w-full justify-between text-right"
                dir="rtl"
              >
                {form.getValues("author") ? 
                  form.getValues("author") : 
                  <span className="text-muted-foreground">اختر كاتب</span>
                }
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <Command dir="rtl">
                <CommandList>
                  <CommandGroup>
                    {authors.map((author) => (
                      <CommandItem
                        key={author}
                        value={author}
                        onSelect={() => handleAuthorSelect(author)}
                        className="text-right"
                      >
                        <CheckIcon
                          className={cn(
                            "mr-2 h-4 w-4",
                            form.getValues("author") === author 
                              ? "opacity-100" 
                              : "opacity-0"
                          )}
                        />
                        {author}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          {form.formState.errors.author && (
            <p className="text-red-500 text-sm mt-1 text-right">
              {form.formState.errors.author.message}
            </p>
          )}
        </div>

        <div>
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
            <p className="text-red-500 text-sm mt-1 text-right">
              {form.formState.errors.image.message}
            </p>
          )}
        </div>

        <div>
          <Textarea
            id="body"
            {...form.register("body")}
            onChange={handleTextareaChange}
            placeholder="المحتوى الكامل للمقال"
            style={{ height: textareaHeight }}
            dir="rtl"
            className="text-right resize-none"
          />
          {form.formState.errors.body && (
            <p className="text-red-500 text-sm mt-1 text-right">
              {form.formState.errors.body.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-start gap-4">
        <Button type="submit" disabled={isSubmitting} className="bg-primary text-white">
          {isSubmitting
            ? "جاري المعالجة..."
            : mode === "create"
            ? "إنشاء المقال"
            : "تحديث المقال"}
        </Button>
      </div>
    </form>
  );
}
