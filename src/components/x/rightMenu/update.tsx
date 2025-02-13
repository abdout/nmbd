'use client';
import React, { useState } from "react";
import { User } from "@prisma/client";
import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";
import { useRouter } from "next/navigation";
import UpdateButton from "./UpdateButton";
import { updateProfile } from "@/components/x/actions";

const Update = ({ user }: { user: User }) => {
  const [cover, setCover] = useState<string>(user.cover || "");
  const [image, setImage] = useState<string>(user.image || "");
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
    const city = (formData.get("city") as string) || "";
    const school = (formData.get("school") as string) || "";
    const work = (formData.get("work") as string) || "";
    const website = (formData.get("website") as string) || "";

    try {
      const response = await updateProfile({
        name,
        description,
        city,
        school,
        work,
        website,
        cover,
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
    <form onSubmit={handleSubmit} className="p-6 bg-white rounded-lg shadow-md flex flex-col gap-4">
      <h5>Update Profile</h5>
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
            <label>Profile Picture</label>
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
      <CldUploadWidget
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
      </CldUploadWidget>

      <div className="flex flex-col gap-4">
        <label htmlFor="name" className="text-xs text-gray-500">First Name</label>
        <input
          type="text"
          defaultValue={user.name || ""}
          placeholder="John"
          className="ring-1 ring-gray-300 p-[13px] rounded-md text-sm"
          name="name"
        />
      </div>

      <div className="flex flex-col gap-4">
        <label htmlFor="description" className="text-xs text-gray-500">Description</label>
        <input
          type="text"
          defaultValue={user.description || ""}
          placeholder="Life is beautiful..."
          className="ring-1 ring-gray-300 p-[13px] rounded-md text-sm"
          name="description"
        />
      </div>

      <UpdateButton />
      {success && <span className="text-green-500">Profile has been updated!</span>}
      {error && <span className="text-red-500">Something went wrong!</span>}
    </form>
  );
};

export default Update;
