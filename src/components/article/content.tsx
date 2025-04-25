"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ArticleDialog, CreateArticleButton } from "./dialog";
import { deleteArticle } from "./action";
import { Article, ArticleAction } from "./type";
import { Loader2, Edit, Trash } from "lucide-react";
import OptimizedImage from "@/components/image/optimum-image";
import { isImageKitUrl } from "@/components/image/image-kit";

// Component for displaying a single article card with context menu
export function ArticleCard({ article }: { article: Article }) {
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  console.log("[ArticleCard] Rendering article card:", {
    id: article.id,
    title: article.title, 
    image: article.image
  });

  // Handle context menu actions
  const handleAction = (action: ArticleAction) => {
    if (action === "delete") {
      setShowDeleteDialog(true);
    }
  };

  // Handle article delete
  const handleDelete = async () => {
    console.log("[ArticleCard] Deleting article:", article.id);
    try {
      setIsDeleting(true);
      const result = await deleteArticle(article.id);
      
      if (result.status === "success") {
        console.log("[ArticleCard] Article deleted successfully");
        router.refresh();
      } else {
        console.error("[ArticleCard] Delete failed:", result.message);
      }
    } catch (error) {
      console.error("[ArticleCard] Delete error:", error);
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  // Handle click on article card
  const handleClick = () => {
    router.push(`/article/${article.slug}`);
  };

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger>
          <div
            className="rounded-lg overflow-hidden cursor-pointer transition-transform hover:scale-[1.01]"
            onClick={handleClick}
          >
            <div className="relative h-56 w-full">
              <OptimizedImage
                src={article.image}
                alt={article.title}
                fill
                className="object-cover"
                debug={false}
                convertPath={!isImageKitUrl(article.image)}
                onLoad={() => console.log("[ArticleCard] Article image loaded successfully:", article.image)}
                onError={(e: Error | unknown) => {
                  console.error("[ArticleCard] Article image failed to load:", article.image, e);
                  // Try direct loading as fallback
                  if (e && typeof e === 'object' && 'target' in e) {
                    const imgElement = e.target as HTMLImageElement;
                    if (imgElement && article.image) {
                      console.log("[ArticleCard] Attempting fallback direct image load");
                      // If it's not already an ImageKit URL, try using it directly
                      imgElement.src = article.image;
                    }
                  }
                }}
              />
            </div>
            <div className="p-4 bg-white dark:bg-neutral-800">
              <h3 className="font-semibold text-lg mb-1">{article.title}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                {article.author} • {new Date(article.createdAt).toLocaleDateString()}
              </p>
              <p className="mt-2 line-clamp-2">{article.description}</p>
            </div>
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ArticleDialog
            mode="edit"
            article={article}
            trigger={
              <ContextMenuItem>
                <Edit className="mr-2 h-4 w-4" /> Edit
              </ContextMenuItem>
            }
          />
          <ContextMenuItem onClick={() => handleAction("delete")}>
            <Trash className="mr-2 h-4 w-4" /> Delete
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      {/* Delete confirmation dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the article &quot;{article.title}&quot;. This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

// Grid component for displaying multiple articles
export function ArticleGrid({ articles }: { articles: Article[] }) {
  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">All Articles</h2>
        <CreateArticleButton />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
      
      {articles.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            No articles found. Create your first article by clicking the button above.
          </p>
        </div>
      )}
    </div>
  );
}
