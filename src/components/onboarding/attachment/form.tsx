"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { attachmentSchema, AttachmentSchema } from "./validation";
import { createAttachment, updateAttachment } from "./action";
import { useActionState } from "react";
import { useEffect } from "react";
import { toast } from "sonner";
import { useRouter, usePathname } from "next/navigation";
import { ATTACHMENT_FIELDS } from "./constant";
import { useTransition } from "react";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { useFormContext } from '@/components/onboarding/form-context';
import { getNextRoute } from '../utils';
import type { CloudinaryUploadWidgetResults } from "next-cloudinary";
import { getImagePath } from "@/lib/utils";
import { ErrorToast, SuccessToast } from "@/components/atom/toast";
import { useRef } from "react";

// Helper function to convert PDF URL to preview URL
const getPdfPreviewUrl = (url: string) => {
  if (!url.includes('cloudinary.com')) return url;
  
  // Extract the base URL and file path
  const baseUrl = url.substring(0, url.indexOf('/upload/') + 8);
  const filePath = url.substring(url.indexOf('/upload/') + 8);
  
  // Generate preview URL with transformation
  return `${baseUrl}q_auto,f_jpg,pg_1/${filePath}`;
};

const uploadToCloudinary = async (file: File, fieldType: string): Promise<string> => {
  const url = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/${fieldType === 'raw' ? 'raw' : 'image'}/upload`;
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "social");
  const res = await fetch(url, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw new Error("Upload failed");
  const data = await res.json();
  return data.secure_url;
};

const AttachmentForm = ({
  type,
  data,
}: {
  type: "create" | "update";
  data?: AttachmentSchema;
}) => {
  // Get form context separately
  const { formRef, setCurrentFormId } = useFormContext();

  const {
    setValue,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<AttachmentSchema>({
    resolver: zodResolver(attachmentSchema),
    defaultValues: data,
  });

  const formValues = watch();
  const [isPending, startTransition] = useTransition();
  const [state, formAction] = useActionState(
    type === "create" ? createAttachment : updateAttachment,
    {
      success: false,
      error: false,
    }
  );

  const router = useRouter();
  const pathname = usePathname();

  const onSubmitSuccess = () => {
    SuccessToast();
    router.push(getNextRoute(pathname));
  };

  const onSubmit = handleSubmit((data) => {
    // Save form data to localStorage for step navigation tracking
    localStorage.setItem('attachmentFormData', JSON.stringify(data));

    startTransition(() => {
      formAction(data);
    });
  }, (validationErrors) => {
    // Show toast for validation errors instead of inline errors
    if (validationErrors.image) {
      ErrorToast(validationErrors.image.message || "الصورة الشخصية مطلوبة");
    }
    return false;
  });

  useEffect(() => {
    setCurrentFormId('attachment');
  }, [setCurrentFormId]);

  useEffect(() => {
    if (state.success) {
      onSubmitSuccess();
    } else if (state.error) {
      ErrorToast("حدث خطأ ما!");
    }
  }, [state, onSubmitSuccess]);

  // For each field, keep a ref to its file input
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  return (
    <form 
      ref={formRef} 
      onSubmit={onSubmit}
    >
      {/* <h1 className="text-xl font-semibold">
        {type === "create" ? "Upload Files" : "Update Files"}
      </h1> */}

      <div className="grid grid-cols-1 md:grid-cols-2 md:gap-10 gap-10">
        {ATTACHMENT_FIELDS.map(({ name, label, type: fieldType }, index) => {
          const isFirst = index === 0;
          return (
            <div
              key={name}
              onClick={() => fileInputRefs.current[name]?.click()}
              className={`relative flex items-center justify-center h-40 cursor-pointer overflow-hidden border border-neutral-500 hover:bg-neutral-50 hover:border-primary ${isFirst ? 'rounded-full w-40' : 'w-40'}`}
              style={{ position: 'relative' }}
            >
              <input
                type="file"
                accept={fieldType === 'image' ? 'image/*' : fieldType === 'raw' ? '.pdf,.doc,.docx,.txt,.rtf' : '*'}
                style={{ display: 'none' }}
                ref={el => { fileInputRefs.current[name] = el; }}
                onClick={e => e.stopPropagation()}
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  try {
                    const url = await uploadToCloudinary(file, fieldType);
                    setValue(name, url);
                  } catch (err) {
                    ErrorToast("فشل رفع الملف. حاول مرة أخرى.");
                    console.error('Cloudinary upload error:', err);
                  }
                }}
              />
              {formValues[name] ? (
                fieldType === 'image' ? (
                  <>
                    <Image
                      src={formValues[name] && formValues[name].startsWith('http') ? formValues[name] : getImagePath('/placeholder-profile.png')}
                      alt={label}
                      width={160}
                      height={160}
                      className={`absolute inset-0 w-full h-full object-cover ${isFirst ? 'rounded-full' : ''}`}
                      loading="lazy"
                      sizes="160px"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = getImagePath('/placeholder-profile.png');
                        console.error('Image failed to load:', formValues[name]);
                      }}
                    />
                    <div className="absolute bottom-0 w-full bg-black bg-opacity-50 text-white text-xs text-center py-1">
                      صورة شخصية
                    </div>
                  </>
                ) : (
                  <>
                    {formValues[name] && formValues[name].includes('cloudinary.com') ? (
                      <div className="relative w-full h-full">
                        <Image
                          src={getPdfPreviewUrl(formValues[name])}
                          alt={label}
                          width={160}
                          height={160}
                          className="absolute inset-0 w-full h-full object-cover"
                          loading="lazy"
                          sizes="160px"
                        />
                        <div className="absolute bottom-0 w-full bg-black bg-opacity-50 text-white text-xs text-center py-1">
                          {label}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center text-gray-700 text-sm">
                        <span>File Uploaded</span>
                        <br />
                        <span className="text-xs">(Click to change)</span>
                      </div>
                    )}
                  </>
                )
              ) : (
                <span className="text-center text-gray-700 text-sm z-10 flex flex-col items-center">
                  {label.split(' ').map((word, index) => (
                    <span key={index}>{word}</span>
                  ))}
                </span>
              )}
            </div>
          );
        })}
      </div>

      <button
        id="submit-attachment"
        type="submit"
        disabled={isPending}
        className="hidden w-full bg-neutral-900 text-white p-2 rounded-md hover:bg-neutral-800 disabled:bg-neutral-400"
      >
        {isPending ? "Saving..." : type === "create" ? "Upload" : "Update"}
      </button>
    </form>
  );
};

export default AttachmentForm; 