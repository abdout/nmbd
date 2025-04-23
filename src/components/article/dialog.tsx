"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Article, ArticleFormValues } from "./type";
import ArticleForm from "./form";

interface ArticleDialogProps {
  mode: "create" | "edit";
  trigger: React.ReactNode;
  article?: Article;
  onSuccess?: () => void;
}

export function ArticleDialog({
  mode,
  trigger,
  article,
  onSuccess,
}: ArticleDialogProps) {
  const [open, setOpen] = React.useState(false);

  // Handle form submission success
  const handleSuccess = () => {
    setOpen(false);
    if (onSuccess) onSuccess();
  };

  // Initialize form values
  const defaultValues: Partial<ArticleFormValues> = article
    ? {
        title: article.title,
        slug: article.slug,
        description: article.description,
        image: article.image,
        body: article.body,
        author: article.author,
      }
    : {
        author: "", // Default author value
      };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-[95vw] w-[1200px] h-[90vh] max-h-[900px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Create New Article" : "Edit Article"}
          </DialogTitle>
        </DialogHeader>
        <ArticleForm
          mode={mode}
          defaultValues={defaultValues}
          articleId={article?.id}
          onSuccess={handleSuccess}
        />
      </DialogContent>
    </Dialog>
  );
}

export function CreateArticleButton() {
  return (
    <ArticleDialog
      mode="create"
      trigger={
        <Button className="bg-primary text-white">
          Add New Article
        </Button>
      }
    />
  );
}
