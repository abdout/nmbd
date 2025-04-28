'use client';

import React from 'react';
import Head from '@/components/atom/site-heading';
import { getAllArticles, deleteArticle } from '@/components/article/action';
import { articles as staticArticles } from '@/components/template/article/constant';
import ArticleHoverEffect from '@/components/atom/card-article';
import { CreateArticleButton } from '@/components/article/dialog';
import { Article } from '@/components/article/type';
import { useRouter } from 'next/navigation';
import { useModal } from '@/components/atom/modal/context';
import Modal from '@/components/atom/modal/modal';
import CreateArticle from '@/components/article/create';
import { toast } from "sonner";
import { Button } from '@/components/ui/button';

export default function AllArticlesPage() {
  const router = useRouter();
  const { modal, openModal, closeModal } = useModal();
  const [articles, setArticles] = React.useState<Article[]>([]);
  const [editingArticleId, setEditingArticleId] = React.useState<string | null>(null);
  
  React.useEffect(() => {
    const fetchArticles = async () => {
      // Fetch articles from database
      const dbArticles = await getAllArticles();
      
      // If there are no DB articles, fall back to static articles for demo purposes
      // In production, you would remove this fallback
      const articlesData = dbArticles.length > 0 
        ? dbArticles 
        : staticArticles.map((article, index) => ({
            id: `static-${index + 1}`,
            title: article.title,
            slug: `article-${index + 1}`,
            description: article.description,
            image: article.image,
            body: "This is the full article content that will be displayed on the article page.",
            author: article.author,
            createdAt: new Date(),
            updatedAt: new Date(),
          }));
          
      setArticles(articlesData);
    };
    
    fetchArticles();
  }, []);

  // Transform articles to match ArticleHoverEffect expected format
  const formattedArticles = articles.map((article: Article) => ({
    id: article.id,
    title: article.title,
    description: article.description,
    link: `/article/${article.slug}`,
    image: article.image,
    date: new Date(article.createdAt).toLocaleDateString(),
    author: article.author,
  }));
  
  const handleEdit = (id: string) => {
    setEditingArticleId(id);
    openModal(null);
  };
  
  const handleDelete = async (id: string) => {
    toast(
      "هل تريد حذف هذا المقال؟",
      {
        action: {
          label: "حذف",
          onClick: async () => {
            try {
              await deleteArticle(id);
              // Remove article from local state
              setArticles(articles.filter(article => article.id !== id));
              toast.success("تم حذف المقال بنجاح", {
                position: "bottom-right",
                style: { backgroundColor: 'rgb(239, 68, 68)', color: 'white' }
              });
            } catch (error) {
              console.error('Error deleting article:', error);
              toast.error("حدث خطأ أثناء حذف المقال", {
                position: "bottom-right"
              });
            }
          },
        },
        cancel: {
          label: "إلغاء",
          onClick: () => {
            // Do nothing on cancel
          },
        },
        duration: 10000, // Give the user 10 seconds to decide
        position: "bottom-right",
        style: { 
          backgroundColor: 'rgb(239, 68, 68)', 
          color: 'white',
          width: '280px', // Reduce toast width
          maxWidth: '280px'
        },
        classNames: {
          actionButton: "!bg-white !text-red-500 font-bold hover:!bg-gray-100",
          cancelButton: "bg-transparent text-white border border-white hover:bg-red-600"
        }
      }
    );
  };
  
  const handleShare = (item: any) => {
    // Implement share functionality
    if (navigator.share) {
      navigator.share({
        title: item.title,
        text: item.description,
        url: window.location.origin + item.link,
      }).catch((error) => console.log('Error sharing', error));
    } else {
      // Fallback
      navigator.clipboard.writeText(window.location.origin + item.link);
      toast.success("تم نسخ الرابط إلى الحافظة", {
        position: "bottom-right",
      });
    }
  };
  
  const editingArticle = editingArticleId ? articles.find(article => article.id === editingArticleId) : null;

  // Handle newly created article
  const handleArticleCreated = (newArticle: Article) => {
    setArticles(prevArticles => [newArticle, ...prevArticles]);
  };

  // Handle updated article
  const handleArticleUpdated = (updatedArticle: Article) => {
    setArticles(prevArticles => 
      prevArticles.map(article => 
        article.id === updatedArticle.id ? updatedArticle : article
      )
    );
  };

  return (
    <div className="container mx-auto px-4">
      <Head 
        title="المقالات" 
        description="" 
        align="start"
      />
      
      <div className="max-w-5xl mx-auto -mt-14">
        <div className="flex justify-between items-center my-6">
          <Button variant='outline' onClick={() => {
            setEditingArticleId(null);
            openModal(null);
          }}>
            إضافة مقال
          </Button>
        </div>
        
        <ArticleHoverEffect 
          items={formattedArticles} 
          onEdit={handleEdit}
          onDelete={handleDelete}
          onShare={handleShare}
        />
        
        {formattedArticles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              No articles found. Create your first article by clicking the button above.
            </p>
          </div>
        )}
      </div>
      
      {modal.open && (
        <Modal content={
          editingArticleId ? (
            <CreateArticle 
              onClose={() => {
                closeModal();
                setEditingArticleId(null);
              }} 
              editArticleId={editingArticleId}
              onArticleUpdated={handleArticleUpdated}
            />
          ) : (
            <CreateArticle 
              onClose={() => {
                closeModal();
                setEditingArticleId(null);
              }} 
              onArticleCreated={handleArticleCreated} 
            />
          )
        } />
      )}
    </div>
  );
} 