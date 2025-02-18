'use client';
import React, { useState, useEffect } from "react";
import { User } from "@prisma/client";
import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";
import { useRouter } from "next/navigation";
import { updateProfile } from "@/components/onboarding/actions";
import UpdateButton from "@/components/onboarding/update-button";

const Attachment = ({ user }: { user: User }) => {
  const [formData, setFormData] = useState({
    // cover: user?.cover || "",
    image: user?.image || "",
    cv: user?.cv || "",
    additionalFile: user?.additionalFile || ""
  });
  
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [pending, setPending] = useState(false);
  const router = useRouter();

  // Update formData when user prop changes
  useEffect(() => {
    setFormData({
      // cover: user?.cover || "",
      image: user?.image || "",
      cv: user?.cv || "",
      additionalFile: user?.additionalFile || ""
    });
  }, [user]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccess(false);
    setError(false);
    setPending(true);

    try {
      const response = await updateProfile(formData);
      if (response.success) {
        setSuccess(true);
        router.refresh();
      } else {
        setError(true);
      }
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setPending(false);
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
      <div className="flex flex-row gap-6">
        {/* Profile Picture Upload */}
        <CldUploadWidget
          uploadPreset="social"
          onSuccess={(result: any, { widget }: { widget: any }) => {
            if (result.info && result.info.secure_url) {
              updateField('image', result.info.secure_url);
            }
            widget.close();
          }}
        >
          {({ open }) => (
            <div 
              onClick={() => open()}
              className="relative flex items-center justify-center w-24 h-24 cursor-pointer overflow-hidden border border-black reveal"
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

        {/* Cover Picture Upload */}
        <CldUploadWidget
          uploadPreset="social"
          onSuccess={(result: any, { widget }: { widget: any }) => {
            if (result.info && result.info.secure_url) {
              updateField('cover', result.info.secure_url);
            }
            widget.close();
          }}
        >
          {({ open }) => (
            <div 
              onClick={() => open()}
              className="relative flex items-center justify-center w-24 h-24 cursor-pointer overflow-hidden border border-black reveal"
            >
              {/* {formData.cover ? (
                <Image
                  src={formData.cover}
                  alt="Cover"
                  width={96}
                  height={96}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <span className="text-center text-gray-700 text-sm z-10 whitespace-pre-line">
                  صورة{'\n'}الغلاف
                </span>
              )} */}
            </div>
          )}
        </CldUploadWidget>

        {/* CV Upload */}
        <CldUploadWidget
          uploadPreset="social"
          options={{ resourceType: "raw" }}
          onSuccess={(result: any, { widget }: { widget: any }) => {
            if (result.info && result.info.secure_url && result.info.format === "pdf") {
              updateField('cv', result.info.secure_url);
            }
            widget.close();
          }}
        >
          {({ open }) => (
            <div 
              onClick={() => open()}
              className="relative flex items-center justify-center w-24 h-24 cursor-pointer overflow-hidden border border-black reveal"
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

        {/* Additional File Upload */}
        <CldUploadWidget
          uploadPreset="social"
          options={{ resourceType: "raw" }}
          onSuccess={(result: any, { widget }: { widget: any }) => {
            if (result.info && result.info.secure_url) {
              updateField('additionalFile', result.info.secure_url);
            }
            widget.close();
          }}
        >
          {({ open }) => (
            <div 
              onClick={() => open()}
              className="relative flex items-center justify-center w-24 h-24 cursor-pointer overflow-hidden border border-black reveal"
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

      <div className="mt-4">
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
      </div>
    </form>
  );
};

export default Attachment;