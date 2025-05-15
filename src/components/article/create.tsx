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
import { toast } from "sonner";

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
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);

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
    mode: "onChange"
  });

  // Get form state for validation
  const { formState } = form;
  const { isValid, errors } = formState;

  // Check if first step fields are valid
  const isFirstStepValid = !errors.title && !errors.description && !errors.author && !errors.image;

  // Check if all fields are valid
  const isFormValid = isValid && !isImageUploading;

  // Handle proceeding to next step with validation
  const handleNextStep = () => {
    // Trigger validation for first step fields
    form.trigger(['title', 'description', 'author', 'image']).then((isValid) => {
      if (isValid) {
        setStep(2);
      } else {
        // Collect all error messages
        const errorMessages = [];
        if (errors.author) errorMessages.push("الكاتب");
        if (errors.title) errorMessages.push("العنوان");
        if (errors.description) errorMessages.push("الوصف");
        if (errors.image) errorMessages.push("الصورة");
        
        // Create a combined message
        let message = "";
        if (errorMessages.length > 0) {
          message = `${errorMessages.join(" و ")} مطلوبين`;
          
          // Display toast with the error message
          toast.error(message, {
            position: "bottom-right",
            duration: 3000
          });
        }
      }
    });
  };

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
    setImageError(null);
    setUploadedImage(imageData.url);
    form.setValue("image", imageData.url);
    setIsImageUploading(false);
  };

  // Handle image upload error
  const handleImageError = (errorMessage: string) => {
    setImageError(errorMessage);
    setIsImageUploading(false);
    // Keep the temporary preview but mark it as failed
  };

  // Function to handle file selection and auto-upload
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageError(null);
      // Create a temporary preview URL for immediate display
      const tempPreviewUrl = URL.createObjectURL(e.target.files[0]);
      setUploadedImage(tempPreviewUrl);
      setIsImageUploading(true);
      
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
          } else {
            // If button isn't found, handle the error
            setImageError("فشل تحميل الصورة - الرجاء المحاولة مرة أخرى");
            setIsImageUploading(false);
          }
        }, 100);
      } else {
        setImageError("فشل العثور على منطقة التحميل - الرجاء تحديث الصفحة");
        setIsImageUploading(false);
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

  // Handle submitting the form with validation
  const handleFormSubmit = async (data: ArticleFormValues) => {
    // Check for image uploading
    if (isImageUploading) {
      toast.error("الرجاء الانتظار حتى يتم رفع الصورة", {
        position: "bottom-right",
        duration: 3000
      });
      return;
    }
    
    // Check for validation errors before submitting
    if (!isFormValid) {
      // Collect all error messages
      const errorMessages = [];
      if (errors.author) errorMessages.push("الكاتب");
      if (errors.title) errorMessages.push("العنوان");
      if (errors.description) errorMessages.push("الوصف");
      if (errors.image) errorMessages.push("الصورة");
      if (errors.body) errorMessages.push("المحتوى");
      
      // Create a combined message
      let message = "";
      if (errorMessages.length > 0) {
        message = `${errorMessages.join(" و ")} مطلوبين`;
        
        // Display toast with the error message
        toast.error(message, {
          position: "bottom-right",
          duration: 3000
        });
      }
      return;
    }
    
    // Proceed with form submission
    await handleSubmit(data);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading article data...</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="transform -translate-y-8">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleFormSubmit)}
            className="w-[85%] px-6 md:px-0 min-w-[340px] md:min-w-[500px] lg:min-w-[600px] flex flex-col justify-center items-center gap-6 relative mx-auto"
          >
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                {error}
              </div>
            )}
            
            {step === 1 && (
              <div className="flex flex-col md:flex-row md:gap-8 w-full">
                {/* Left column: Title, Author and Description */}
                <div className="flex flex-col gap-5 w-full md:w-3/5">
                  <FormField
                    control={form.control}
                    name="author"
                    render={({ field }) => (
                      <FormItem className="w-[57.5%]">
                        <FormControl>
                          <Combobox
                            items={authorItems}
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="اختر الكاتب"
                            dir="rtl"
                          />
                        </FormControl>
                        <FormMessage className="hidden" />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input className="w-full" placeholder="العنوان" {...field} />
                        </FormControl>
                        <FormMessage className="hidden" />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea 
                            className="h-16 md:h-20 w-full" 
                            placeholder="الوصف" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage className="hidden" />
                      </FormItem>
                    )}
                  />
                </div>
                
                {/* Right column: Image */}
                <div className="flex flex-col gap-6 w-full md:w-2/5 mt-6 md:mt-0">
                  <div className="w-full h-full">
                    <div className="border border-input rounded-md overflow-hidden bg-background relative h-full min-h-[150px]">
                      <ImageUploader 
                        onUploadComplete={handleImageUpload}
                        onError={handleImageError}
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
                          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" className="text-gray-400 mb-2">
                            <path fill="currentColor" d="M5.616 20q-.691 0-1.153-.462T4 18.384V5.616q0-.691.463-1.153T5.616 4h12.769q.69 0 1.153.463T20 5.616v12.769q0 .69-.462 1.153T18.384 20zm0-1h12.769q.23 0 .423-.192t.192-.424V5.616q0-.231-.192-.424T18.384 5H5.616q-.231 0-.424.192T5 5.616v12.769q0 .23.192.423t.423.192M5 19V5zm3.308-2.5h7.538q.243 0 .354-.217t-.03-.43l-2.02-2.712q-.13-.162-.323-.162q-.192 0-.323.162l-2.292 2.898l-1.427-1.725q-.131-.143-.314-.143q-.182 0-.313.162l-1.154 1.52q-.162.213-.05.43t.354.217" />
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
                            className="w-full h-full object-cover"
                          />
                          
                          {/* Loading overlay */}
                          {isImageUploading && (
                            <div className="absolute inset-0 bg-background/90 flex items-center justify-center">
                              <div className="flex flex-col items-center">
                                <div className="w-6 h-6 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin"></div>
                              </div>
                            </div>
                          )}
                          
                          {/* Error overlay */}
                          {imageError && (
                            <div className="absolute inset-0 bg-red-500/40 flex items-center justify-center">
                              <div className="bg-white p-3 rounded-md text-center max-w-[90%]">
                                <p className="text-red-600 text-sm">{imageError}</p>
                                <button 
                                  type="button"
                                  onClick={() => setImageError(null)}
                                  className="mt-2 text-xs bg-gray-100 px-2 py-1 rounded"
                                >
                                  إغلاق
                                </button>
                              </div>
                            </div>
                          )}
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
                      /* Hide the preview image from the uploader component - we will show our own preview */
                      .custom-uploader img {
                        display: none !important;
                      }
                      /* Hide the buttons from view but keep them in the DOM for functionality */
                      .custom-uploader button {
                        opacity: 0 !important;
                        position: absolute !important;
                        pointer-events: auto !important;
                      }
                      /* Auto-upload styling */
                      .custom-uploader > div > div:last-child {
                        height: 0 !important;
                        overflow: hidden !important;
                        pointer-events: auto !important;
                        position: absolute !important;
                        opacity: 0 !important;
                      }
                    `}</style>
                    
                    <FormField
                      control={form.control}
                      name="image"
                      render={() => (
                        <FormItem>
                          <FormMessage className="hidden" />
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
                        <Textarea 
                          className="h-60 w-full" 
                          placeholder="المحتوى" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage className="hidden" />
                    </FormItem>
                  )}
                />
              </div>
            )}
            
            {/* Navigation and submit buttons */}
            <div className="flex justify-between w-full mt-4">
              {step === 1 ? (
                <div className="flex gap-3">
                  <Button
                    type="submit"
                    className="h-9 font-medium"
                    disabled={isSubmitting || !isFormValid}
                  >
                    {isSubmitting ? 
                      (isEditMode ? "...جاري التحديث" : "...جاري الإنشاء") : 
                      (isEditMode ? "تحديث المقال" : "إنشاء مقال")}
                  </Button>
                  <Button
                    type="button"
                    onClick={handleNextStep}
                    className="h-9 font-medium"
                    variant="outline"
                  >
                    التالي
                  </Button>
                </div>
              ) : (
                <div className="flex gap-3">
                  <Button
                    type="submit"
                    className="h-9 font-medium"
                    disabled={isSubmitting || !isFormValid}
                  >
                    {isSubmitting ? 
                      (isEditMode ? "...جاري التحديث" : "...جاري الإنشاء") : 
                      (isEditMode ? "تحديث المقال" : "إنشاء مقال")}
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setStep(1)}
                    className="h-9 font-medium"
                    variant="outline"
                  >
                    السابق
                  </Button>
                </div>
              )}
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CreateArticle; 