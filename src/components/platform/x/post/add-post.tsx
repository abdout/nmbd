"use client";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { useState, useEffect } from "react";
import AddPostButton from "./post-button";
import { useSession } from "next-auth/react";
import { addPost } from "../actions";

const AddPost = () => {
  console.log("debug posting: AddPost component rendered");
  const { data: session, status } = useSession();
  const user = session?.user;

  const [img, setImg] = useState<any>(null);

  useEffect(() => {
    if (user) {
      console.log("debug posting: User authenticated:", user.id);
      console.log("debug posting: User image:", user.image);
    } else {
      console.log("debug posting: No user session available");
    }
  }, [user]);

  if (status === "loading") {
    console.log("debug posting: Session loading...");
    return "Loading...";
  }

  if (!user) {
    console.log("debug posting: User not authenticated, showing sign-in message");
    return "Please sign in to add a post.";
  }

  // The form action handler function
  async function formAction(formData: FormData) {
    console.log("debug posting: Form submitted");
    console.log("debug posting: Post description:", formData.get("desc"));
    console.log("debug posting: Image data:", img);
    console.log("debug posting: Image URL to send:", img?.secure_url || "");
    
    // Call the server action but don't return its result
    await addPost(formData, img?.secure_url || "");
  }

  return (
    <div className="px-4 -mt-12 flex gap-4 justify-between text-sm">
      {/* AVATAR */}
      <Image
        src={user.image || "/x/noAvatar.png"}
        alt="User Avatar"
        width={48}
        height={48}
        className="w-12 h-12 object-cover rounded-full"
        loading="lazy"
        sizes="48px"
      />
      {/* POST */}
      <div className="flex-1">
        {/* TEXT INPUT */}
        <form
          action={formAction}
          className="flex gap-4"
        >
          <textarea
            placeholder="اها قول!"
            className="flex-1 p-2 text-[16px] bg-background focus:outline-none resize-none"
            name="desc"
            onChange={(e) => console.log("debug posting: Text input changed, length:", e.target.value.length)}
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
        <div className="flex items-center gap-5 mr-2 mt-4 flex-wrap ">
          <CldUploadWidget
            uploadPreset="social"
            onSuccess={(result, { widget }) => {
              console.log("debug posting: Upload Success, full result:", result);
              if (result.info) {
                const info = result.info as any;
                console.log("debug posting: Upload image URL:", info.secure_url);
                setImg(info);
                console.log("debug posting: Image state after setting:", info);
              }
              widget.close();
            }}
            onError={(error) => {
              console.error("debug posting: Upload Error:", error);
            }}
          >
            {({ open }) => {
              return (
                <div
                  className="flex items-center gap-2 cursor-pointer reveal "
                  onClick={() => {
                    console.log("debug posting: Opening image upload widget");
                    open();
                  }}
                >
                  <Image
                    src="/x/image.png"
                    alt="Add Image"
                    width={25}
                    height={25}
                    loading="lazy"
                    sizes="25px"
                  />

                </div>
              );
            }}
          </CldUploadWidget>
          <div className="flex items-center gap-2 cursor-pointer reveal">
            <Image 
              src="/x/gif.png" 
              alt="Add Video" 
              width={27} 
              height={27} 
              loading="lazy"
              sizes="27px"
            />

          </div>
          <div className="flex items-center gap-2 cursor-pointer reveal">
            <Image 
              src="/x/poll.png" 
              alt="Create Poll" 
              width={30} 
              height={30} 
              loading="lazy"
              sizes="30px"
            />

          </div>
          <div className="flex items-center gap-2 cursor-pointer reveal">
            <Image 
              src="/x/happiness.png" 
              alt="Add Event" 
              width={23} 
              height={23} 
              loading="lazy"
              sizes="23px"
            />

          </div>
          
        </div>
      </div>
    </div>
  );
};

export default AddPost;
