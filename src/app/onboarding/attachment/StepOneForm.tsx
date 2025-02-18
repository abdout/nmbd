'use client';
import React, { useState } from "react";
import { User } from "@prisma/client";
import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";
import { useRouter } from "next/navigation";
import { updateProfile } from "@/components/onboarding/actions";
// import UpdateButton from "@/components/onboarding/update-button";

const Update = ({ user }: { user: User }) => {
  // const [cover, setCover] = useState<string>(user?.cover || "");
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
    // const city = (formData.get("city") as string) || "";
    // const school = (formData.get("school") as string) || "";
    // const work = (formData.get("work") as string) || "";
    // const website = (formData.get("website") as string) || "";

    try {
      const response = await updateProfile({
        name,
        description,
        // city,
        // school,
        // work,
        // website,
        // cover,
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

  return (
    <form onSubmit={handleSubmit} className="p-6  flex flex-col gap-4">
      
      <CldUploadWidget
        uploadPreset="social"
        onSuccess={(result: any, { widget }: { widget: any }) => {
          if (result.info && result.info.secure_url) {
            setImage(result.info.secure_url);
          }
          widget.close();
        }}
      >
        {({ open }) => (
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
      {/* <CldUploadWidget
        uploadPreset="social"
        onSuccess={(result: any, { widget }: { widget: any }) => {
          if (result.info && result.info.secure_url) {
            setCover(result.info.secure_url);
          }
          widget.close();
        }}
      >
        {({ open }) => (
          <div className="flex flex-col gap-4 my-4" onClick={() => open()}>
            <label>Cover Picture</label>
            <div className="flex items-center gap-2 cursor-pointer">
              <Image
                src={cover || "/noCover.png"}
                alt="Cover Picture"
                width={48}
                height={32}
                className="w-12 h-8 rounded-md object-cover"
              />
              <span className="text-xs underline text-gray-600">Change</span>
            </div>
          </div>
        )}
      </CldUploadWidget> */}

      {/* <UpdateButton /> */}
      {success && <span className="text-green-500">Profile has been updated!</span>}
      {error && <span className="text-red-500">Something went wrong!</span>}
    </form>
  );
};

export default Update;
