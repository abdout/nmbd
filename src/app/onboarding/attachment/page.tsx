'use client';
import React, { useState, 
  // useEffect 
} from "react";
// import { User } from "@prisma/client";
import Image from "next/image";
import { CldUploadWidget, CloudinaryUploadWidgetResults } from "next-cloudinary";
// import { useRouter } from "next/navigation";
// import { updateProfile } from "@/components/onboarding/actions";
// import UpdateButton from "@/components/onboarding/update-button";
// import { useSession } from "next-auth/react";

interface FormData {
  image: string;
  cv: string;
  portfolio: string;
  additionalFile: string;
}

interface UploadWidgetProps {
  open: () => void;
}

const Attachment = () => {
  // const { data: session } = useSession();
  // const user = session?.user as User;
  const [formData] = useState<FormData>({
    image: "",
    cv: "",
    portfolio: "",
    additionalFile: ""
  });
  
  // const [success, setSuccess] = useState<boolean>(false);
  // const [error, setError] = useState<boolean>(false);
  // const [pending, setPending] = useState(false);
  // const router = useRouter();

  // useEffect(() => {
  //   if (user) {
  //     setFormData({
  //       image: user?.image || "",
  //       cv: user?.cv || "",
  //       additionalFile: user?.additionalFile || ""
  //     });
  //   }
  // }, [user]);

  // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   setSuccess(false);
  //   setError(false);
  //   setPending(true);

  //   try {
  //     const response = await updateProfile(formData);
  //     if (response.success) {
  //       setSuccess(true);
  //       router.refresh();
  //     } else {
  //       setError(true);
  //     }
  //   } catch (err) {
  //     console.error(err);
  //     setError(true);
  //   } finally {
  //     setPending(false);
  //   }
  // };

  // const updateField = (field: keyof FormData, value: string) => {
  //   setFormData(prev => ({
  //     ...prev,
  //     [field]: value
  //   }));
  // };

  const handleUploadSuccess = (
    field: keyof FormData,
    results: CloudinaryUploadWidgetResults,
    closeWidget: () => void
  ) => {
    // if (results.info && 'secure_url' in results.info) {
    //   if (field === 'cv' && 'format' in results.info) {
    //     if (results.info.format === 'pdf') {
    //       updateField(field, results.info.secure_url);
    //     }
    //   } else {
    //     updateField(field, results.info.secure_url);
    //   }
    // }
    closeWidget();
  };

  return (
    <form 
    // onSubmit={handleSubmit} 
    className="p-6 flex flex-col gap-4">
      <div className="flex flex-row gap-6">
        {/* Profile Picture Upload */}
        <CldUploadWidget
          uploadPreset="social"
          onSuccess={(results: CloudinaryUploadWidgetResults, { widget }) => 
            handleUploadSuccess('image', results, widget.close)
          }
        >
          {({ open }: UploadWidgetProps) => (
            <div 
              onClick={() => open()}
              className="relative flex items-center justify-center w-24 h-24 cursor-pointer overflow-hidden border border-neutral-500 rounded-lg hover:bg-neutral-100"
            >
              {formData.image ? (
                <Image
                  src={formData.image}
                  alt="Profile"
                  width={96}
                  height={96}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <span className="text-center text-gray-700 text-sm z-10 whitespace-pre-line">
                  صورة{'\n'}شخصية
                </span>
              )}
            </div>
          )}
        </CldUploadWidget>

        {/* CV Upload */}
        <CldUploadWidget
          uploadPreset="social"
          options={{ resourceType: "raw" }}
          onSuccess={(results: CloudinaryUploadWidgetResults, { widget }) => 
            handleUploadSuccess('cv', results, widget.close)
          }
        >
          {({ open }: UploadWidgetProps) => (
            <div 
              onClick={() => open()}
              className="relative flex items-center justify-center w-24 h-24 cursor-pointer overflow-hidden border border-neutral-500 rounded-lg hover:bg-neutral-100"
            >
              {formData.cv ? (
                <div className="text-center text-gray-700 text-sm">
                  <span>CV Uploaded</span>
                  <br />
                  <span className="text-xs">(Click to change)</span>
                </div>
              ) : (
                <span className="text-center text-gray-700 text-sm z-10 whitespace-pre-line">
                  سيرة{'\n'}ذاتية
                </span>
              )}
            </div>
          )}
        </CldUploadWidget>

        {/* portfolio Upload */}
        <CldUploadWidget
          uploadPreset="social"
          onSuccess={(result: any, { widget }: { widget: any }) => {
            if (result.info && result.info.secure_url) {
              // updateField('portfolio', result.info.secure_url);
            }
            widget.close();
          }}
        >
          {({ open }) => (
            <div 
              onClick={() => open()}
              className="relative flex items-center justify-center w-24 h-24 cursor-pointer overflow-hidden border border-neutral-500 rounded-lg hover:bg-neutral-100"
            >
              {formData.portfolio ? (
                <Image
                  src={formData.portfolio}
                  alt="Cover"
                  width={96}
                  height={96}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <span className="text-center text-gray-700 text-sm z-10 whitespace-pre-line">
                  معرض{'\n'}اعمال
                </span>
              )}
            </div>
          )}
        </CldUploadWidget>

        {/* Additional File Upload */}
        <CldUploadWidget
          uploadPreset="social"
          options={{ resourceType: "raw" }}
          onSuccess={(results: CloudinaryUploadWidgetResults, { widget }) => 
            handleUploadSuccess('additionalFile', results, widget.close)
          }
        >
          {({ open }: UploadWidgetProps) => (
            <div 
              onClick={() => open()}
              className="relative flex items-center justify-center w-24 h-24 cursor-pointer overflow-hidden border border-neutral-500 rounded-lg hover:bg-neutral-100"
            >
              {formData.additionalFile ? (
                <div className="text-center text-gray-700 text-sm">
                  <span>File Uploaded</span>
                  <br />
                  <span className="text-xs">(Click to change)</span>
                </div>
              ) : (
                <span className="text-center text-gray-700 text-sm z-10 whitespace-pre-line">
                  ملف{'\n'}اضافي
                </span>
              )}
            </div>
          )}
        </CldUploadWidget>
      </div>

      {/* <div className="mt-4">
        <UpdateButton pending={pending} />
        {success && (
          <p className="text-green-500 text-sm mt-2">
            Files updated successfully!
          </p>
        )}
        {error && (
          <p className="text-red-500 text-sm mt-2">
            Failed to update files. Please try again.
          </p>
        )}
      </div> */}
    </form>
  );
};

export default Attachment;