"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Article, ArticleFormValues } from "./type";
import ArticleForm from "./form";
import { useModal } from "@/components/atom/modal/context";
import Modal from "@/components/atom/modal/modal";
import CreateArticle from "./create";

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
      <DialogContent 
        style={{ width: "100vw", maxWidth: "100vw", direction: "rtl" }} 
        className="h-[100vh] max-h-[100vh] overflow-y-auto p-0 rounded-none border-0 rtl"
        dir="rtl"
      >
        <DialogHeader className="rtl text-right" dir="rtl">
          <DialogTitle className="text-right" dir="rtl">
            {mode === "create" ? "إضافة مقال جديد" : "تعديل المقال"}
          </DialogTitle>
        </DialogHeader>
        <div className="flex justify-center">
          <div className="w-1/2 p-4">
            <ArticleForm
              mode={mode}
              defaultValues={defaultValues}
              articleId={article?.id}
              onSuccess={handleSuccess}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function CreateArticleButton() {
  const { modal, openModal, closeModal } = useModal();
  return (
    <>
      <Button variant='outline' onClick={() => openModal(null)}>
        إضافة مقال
      </Button>
      {modal.open && (
        <Modal content={<CreateArticle onClose={closeModal} />} />
      )}
    </>
  );
}
