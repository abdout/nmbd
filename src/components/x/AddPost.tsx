"use client";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { useState, useEffect } from "react";
import AddPostButton from "./AddPostButton";
import { addPost } from "./actions";
import { useSession } from "next-auth/react";


const AddPost = () => {
  const { data: session, status } = useSession();
  const user = session?.user;

  const [img, setImg] = useState<any>();

  useEffect(() => {
    if (user) {
      console.log("User image:", user.image);
    }
  }, [user]);

  if (status === "loading") {
    return "Loading...";
  }

  if (!user) {
    return "Please sign in to add a post.";
  }

  return (
    <div className="p-4 flex gap-4 justify-between text-sm">
      {/* AVATAR */}
      <Image
        src={user.image || "/x/noAvatar.png"}
        alt="User Avatar"
        width={48}
        height={48}
        className="w-12 h-12 object-cover rounded-full"
      />
      {/* POST */}
      <div className="flex-1">
        {/* TEXT INPUT */}
        <form
          action={(formData) => addPost(formData, img?.secure_url || "")}
          className="flex gap-4"
        >
          <textarea
            placeholder="بتفكر وين؟"
            className="flex-1 p-2 text-[16px] bg-background focus:outline-none resize-none"
            name="desc"
          ></textarea>

          <div className="">
            {/* <Image
              src="/emoji.png"
              alt="Emoji Icon"
              width={20}
              height={20}
              className="w-5 h-5 cursor-pointer reveal self-end"
            /> */}
            <AddPostButton />
          </div>
        </form>
        {/* POST OPTIONS */}
        <div className="flex items-center gap-8 mt-4 flex-wrap ">
          <CldUploadWidget
            uploadPreset="social"
            onSuccess={(result, { widget }) => {
              console.log("Upload Success:", result.info);
              setImg(result.info);
              console.log("img state:", img);
              widget.close();
            }}
          >
            {({ open }) => {
              return (
                <div
                  className="flex items-center gap-2 cursor-pointer reveal "
                  onClick={() => open()}
                >
                  <Image
                    src="/x/image.png"
                    alt="Add Image"
                    width={25}
                    height={25}
                  />

                </div>
              );
            }}
          </CldUploadWidget>
          <div className="flex items-center gap-2 cursor-pointer reveal">
            <Image src="/x/gif.png" alt="Add Video" width={27} height={27} />

          </div>
          <div className="flex items-center gap-2 cursor-pointer reveal">
            <Image src="/x/poll.png" alt="Create Poll" width={30} height={30} />

          </div>
          <div className="flex items-center gap-2 cursor-pointer reveal">
            <Image src="/x/happiness.png" alt="Add Event" width={23} height={23} />

          </div>
          
        </div>
      </div>
    </div>
  );
};

export default AddPost;
