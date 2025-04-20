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

// Helper function to convert PDF URL to preview URL
const getPdfPreviewUrl = (url: string) => {
  if (!url.includes('cloudinary.com')) return url;
  
  // Extract the base URL and file path
  const baseUrl = url.substring(0, url.indexOf('/upload/') + 8);
  const filePath = url.substring(url.indexOf('/upload/') + 8);
  
  // Generate preview URL with transformation
  return `${baseUrl}q_auto,f_jpg,pg_1/${filePath}`;
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
    toast.success(`تم ${type === "create" ? "رفع" : "تحديث"} الملفات بنجاح!`);
    router.push(getNextRoute(pathname));
  };

  const onSubmit = handleSubmit((data) => {
    // Save form data to localStorage for step navigation tracking
    localStorage.setItem('attachmentFormData', JSON.stringify(data));

    startTransition(() => {
      formAction(data);
    });
  });

  useEffect(() => {
    setCurrentFormId('attachment');
  }, [setCurrentFormId]);

  useEffect(() => {
    if (state.success) {
      onSubmitSuccess();
    } else if (state.error) {
      toast.error("حدث خطأ ما!");
    }
  }, [state, onSubmitSuccess]);

  return (
    <form 
      ref={formRef} 
      onSubmit={onSubmit}
    >
      {/* <h1 className="text-xl font-semibold">
        {type === "create" ? "Upload Files" : "Update Files"}
      </h1> */}

      <div className="grid grid-cols-2 md:grid-cols-4 md:gap-6 gap-8">
        {ATTACHMENT_FIELDS.map(({ name, label, type: fieldType }) => (
          <CldUploadWidget
            key={name}
            uploadPreset="social"
            options={{
              resourceType: "auto",
              folder: fieldType === 'raw' ? 'pdfs' : 'images'
            }}
            onSuccess={(result: CloudinaryUploadWidgetResults, { widget }) => {
              if (result.info && typeof result.info === 'object' && 'secure_url' in result.info) {
                setValue(name, result.info.secure_url as string);
              }
              widget.close();
            }}
          >
            {({ open }: { open: () => void }) => (
              <div
                onClick={() => open()}
                className="relative flex items-center justify-center w-24 h-24 cursor-pointer overflow-hidden border border-neutral-500 rounded-lg hover:bg-neutral-100"
              >
                {formValues[name] ? (
                  // Only the profile picture (صورة شخصية) should be treated as an image
                  fieldType === 'image' ? (
                    <>
                      <Image
                        src={formValues[name] && formValues[name].startsWith('http') ? formValues[name] : getImagePath('/placeholder-profile.png')}
                        alt={label}
                        width={96}
                        height={96}
                        className="absolute inset-0 w-full h-full object-cover"
                        unoptimized
                        onError={(e) => {
                          // Handle image loading errors
                          const target = e.target as HTMLImageElement;
                          target.src = getImagePath('/placeholder-profile.png'); // Fallback to a placeholder
                          console.error('Image failed to load:', formValues[name]);
                        }}
                      />
                      <div className="absolute bottom-0 w-full bg-black bg-opacity-50 text-white text-xs text-center py-1">
                        صورة شخصية
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Display PDF preview for all PDF fields */}
                      {formValues[name] && formValues[name].includes('cloudinary.com') ? (
                        <div className="relative w-full h-full">
                          <Image
                            src={getPdfPreviewUrl(formValues[name])}
                            alt={label}
                            width={96}
                            height={96}
                            className="absolute inset-0 w-full h-full object-cover"
                            unoptimized
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
            )}
          </CldUploadWidget>
        ))}
      </div>

      {state.error && (
        <span className="text-red-500">Something went wrong!</span>
      )}

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