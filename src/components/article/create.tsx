import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { createArticle, getArticleById, updateArticle } from "./action";
import ImageUploader from "@/components/upload/ImageUploader";
import { ArticleFormValues } from "./type";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { Combobox, ComboboxItem } from "./combobox";

const formSchema = z.object({
  title: z.string().min(1, "العنوان مطلوب"),
  description: z.string().min(1, "الوصف مطلوب"),
  image: z.string().min(1, "الصورة مطلوبة"),
  body: z.string().min(1, "المحتوى مطلوب"),
  author: z.string().min(1, "الكاتب مطلوب"),
});

const authorItems: ComboboxItem[] = [
  { value: "المقداد الهجان", label: "المقداد الهجان" },
  { value: "هشام احمد", label: "هشام احمد" },
  { value: "ابو بكر جيكوني", label: "ابو بكر جيكوني" },
  { value: "قاسم الظافر", label: "قاسم الظافر" },
  { value: "الفاضل فرح", label: "الفاضل فرح" },
  { value: "يوسف مورو", label: "يوسف مورو" },
];

interface CreateArticleProps {
  onClose: () => void;
  onArticleCreated?: (newArticle: any) => void;
  onArticleUpdated?: (updatedArticle: any) => void;
  editArticleId?: string;
}

const CreateArticle: React.FC<CreateArticleProps> = ({ 
  onClose, 
  onArticleCreated,
  onArticleUpdated,
  editArticleId 
}) => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(!!editArticleId);
  const isEditMode = !!editArticleId;

  const toggleStep = () => setStep(step === 1 ? 2 : 1);

  const form = useForm<ArticleFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      image: "",
      body: "",
      author: "",
    },
  });

  // Load article data if in edit mode
  useEffect(() => {
    const loadArticle = async () => {
      if (editArticleId) {
        try {
          // Use the getArticleById server action instead of getArticleBySlug
          const article = await getArticleById(editArticleId);
          
          if (article) {
            form.reset({
              title: article.title,
              description: article.description,
              image: article.image,
              body: article.body,
              author: article.author,
            });
            setUploadedImage(article.image);
          }
        } catch (error) {
          console.error("Failed to load article for editing:", error);
          setError("Failed to load article data");
        } finally {
          setIsLoading(false);
        }
      }
    };

    if (editArticleId) {
      loadArticle();
    }
  }, [editArticleId, form]);

  // Helper to generate a slug from title
  const generateSlug = (title: string) => {
    // Convert to lowercase, replace spaces with hyphens, remove non-alphanumeric characters
    const baseSlug = title
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .trim();
    
    // Add timestamp to ensure uniqueness
    const timestamp = Date.now().toString().slice(-6);
    return `${baseSlug}-${timestamp}`;
  };

  // Handle image upload completion
  const handleImageUpload = (imageData: { url: string }) => {
    setUploadedImage(imageData.url);
    form.setValue("image", imageData.url);
  };

  // Function to simulate automatic upload when file is selected
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // Get the file input from ImageUploader
      const fileInput = document.querySelector('.custom-uploader input[type="file"]') as HTMLInputElement;
      if (fileInput) {
        // Pass the file to the ImageUploader input
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(e.target.files[0]);
        fileInput.files = dataTransfer.files;
        
        // Trigger change event on the actual input
        const changeEvent = new Event('change', { bubbles: true });
        fileInput.dispatchEvent(changeEvent);
        
        // Find and click the upload button after a short delay
        setTimeout(() => {
          const uploadButton = document.querySelector('.custom-uploader button:last-child') as HTMLButtonElement;
          if (uploadButton) {
            uploadButton.click();
          }
        }, 100);
      }
      
      // Clear this input's value so the same file can be selected again
      e.target.value = '';
    }
  };

  const handleSubmit = async (data: ArticleFormValues) => {
    setIsSubmitting(true);
    setError(null);
    try {
      // Auto-generate slug
      const slug = generateSlug(data.title);
      
      let result;
      if (isEditMode && editArticleId) {
        // Update existing article
        result = await updateArticle(editArticleId, { ...data, slug });
      } else {
        // Create new article
        result = await createArticle({ ...data, slug });
      }
      
      if (result.status === "error") {
        setError(result.message || "حدث خطأ غير معروف");
        setIsSubmitting(false);
        return;
      }
      
      form.reset();
      setUploadedImage(null);
      
      // If callback exists, call it with the article data
      if (!isEditMode && onArticleCreated && result.data) {
        onArticleCreated(result.data);
      } else if (isEditMode && onArticleUpdated && result.data) {
        onArticleUpdated(result.data);
      }
      
      router.refresh();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ غير معروف");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading article data...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="absolute top-4 right-16 z-50">
        <Button
          type="button"
          size="icon"
          variant="outline"
          className="rounded-full"
          onClick={toggleStep}
        >
          <Icon icon={step === 1 ? "ic:sharp-arrow-forward" : "ic:sharp-arrow-back"} width={25} />
        </Button>
      </div>
      
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="w-full max-w-md md:max-w-2xl flex flex-col justify-center items-center gap-6 mt-10 relative h-full"
        >
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              {error}
            </div>
          )}
          
          {step === 1 && (
            <div className="flex flex-col md:flex-row md:gap-8 w-full">
              {/* Left column: Title and Description */}
              <div className="flex flex-col gap-6 w-full md:w-2/3">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input className="w-full" placeholder="العنوان" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea className="h-20 md:h-24 w-full" placeholder="الوصف" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Right column: Author and Image */}
              <div className="flex flex-col gap-6 w-full md:w-1/3 mt-6 md:mt-0">
                <FormField
                  control={form.control}
                  name="author"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Combobox
                          items={authorItems}
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="اختر الكاتب"
                          dir="rtl"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="w-full">
                  <div className="border border-input rounded-md overflow-hidden bg-background relative h-40">
                    <ImageUploader 
                      onUploadComplete={handleImageUpload}
                      className="custom-uploader"
                    />
                    <input
                      type="file"
                      id="article-image-upload"
                      className="absolute opacity-0 inset-0 w-full h-full cursor-pointer z-10"
                      accept="image/*"
                      onChange={handleFileSelect}
                    />
                    
                    {/* Custom overlay with Arabic text - only show when no image is selected */}
                    {!uploadedImage && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-sm text-gray-600 text-center">اضغط او اسحب وافلت</p>
                      </div>
                    )}
                    
                    {/* Show uploaded image inside the box */}
                    {uploadedImage && (
                      <div className="absolute inset-0 z-5 flex items-center justify-center bg-white">
                        <img 
                          src={uploadedImage} 
                          alt="صورة المقال" 
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                    )}
                  </div>
                  
                  <style jsx global>{`
                    .custom-uploader > div {
                      border: none !important;
                      border-radius: 0 !important;
                      padding: 0.5rem !important;
                      height: 100% !important;
                    }
                    .custom-uploader label {
                      display: none !important;
                    }
                    .custom-uploader > div {
                      cursor: pointer;
                    }
                    /* Hide the original text and elements when no preview */
                    .custom-uploader p, 
                    .custom-uploader svg {
                      display: none !important;
                    }
                    /* Make the uploader div transparent when no preview */
                    .custom-uploader > div > div:empty {
                      min-height: 100% !important;
                      opacity: 0;
                    }
                    /* Hide the preview image from the uploader component */
                    .custom-uploader img {
                      display: none !important;
                    }
                    /* Hide the buttons */
                    .custom-uploader button {
                      display: none !important;
                    }
                    /* Hide the action buttons container */
                    .custom-uploader > div > div:last-child {
                      display: none !important;
                    }
                  `}</style>
                  
                  <FormField
                    control={form.control}
                    name="image"
                    render={() => (
                      <FormItem>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          )}
          
          {step === 2 && (
            <div className="flex flex-col gap-6 w-full">
              <FormField
                control={form.control}
                name="body"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea className="h-60 w-full" placeholder="محتوى المقال" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button
                type="submit"
                className="mt-6 h-12 font-medium text-sm w-72 mx-auto"
                disabled={isSubmitting}
              >
                {isSubmitting ? 
                  (isEditMode ? "...جاري التحديث" : "...جاري الإنشاء") : 
                  (isEditMode ? "تحديث المقال" : "إنشاء مقال")}
              </Button>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
};

export default CreateArticle; 