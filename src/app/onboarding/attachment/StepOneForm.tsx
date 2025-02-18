'use client';
import React, { useState } from "react";
import { User } from "@prisma/client";
import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";
import { useRouter } from "next/navigation";
import { updateProfile } from "@/components/onboarding/actions";

interface CloudinaryResult {
  info: {
    secure_url: string;
  };
}

interface CloudinaryWidget {
  close: () => void;
}

interface UploadWidgetProps {
  open: () => void;
}

const Update = ({ user }: { user: User }) => {
  const [image, setImage] = useState<string>(user?.image || "");
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccess(false);
    setError(false);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const description = (formData.get("description") as string) || "";

    try {
      const response = await updateProfile({
        name,
        description,
        image,
      });
      
      if (response.success) {
        setSuccess(true);
        router.refresh();
      } else {
        setError(true);
      }
    } catch (err) {
      console.error(err);
      setError(true);
    }
  };

  const handleUploadSuccess = (result: CloudinaryResult, widget: CloudinaryWidget) => {
    if (result.info && result.info.secure_url) {
      setImage(result.info.secure_url);
    }
    widget.close();
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
      <CldUploadWidget
        // uploadPreset="social"
        // onSuccess={(result: CloudinaryResult, { widget }: { widget: CloudinaryWidget }) => 
        //   handleUploadSuccess(result, widget)
        // }
      >
        {({ open }: UploadWidgetProps) => (
          <div className="flex flex-col gap-4 my-4" onClick={() => open()}>
            <div className="flex items-center gap-2 cursor-pointer">
              <Image
                src={image || "/noAvatar.png"}
                alt="Profile Picture"
                width={48}
                height={32}
                className="w-12 h-8 rounded-md object-cover"
              />
              <span className="text-xs underline text-gray-600">Change</span>
            </div>
          </div>
        )}
      </CldUploadWidget>

      {success && <span className="text-green-500">Profile has been updated!</span>}
      {error && <span className="text-red-500">Something went wrong!</span>}
    </form>
  );
};

export default Update;